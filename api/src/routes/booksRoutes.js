const express = require("express");
const router = express.Router();
const uploadBooks = require('../middleware/uploadBooks');
const Books = require('../models/book');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const http = require('http');
const socketIO = require('socket.io');

COUNTER_URL = process.env.COUNTER_URL;

// add this
router.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile('/app/node_modules/socket.io/client-dist/socket.io.js');
});

// Получение массива книг
router.get('/', async (req, res) => {
    try {
        const books = await Books.find({}, '-__v');
        //res.json(books);
        res.render("book/index", {
            title: "Книги",
            books
        });
    } catch (error) {
        res.status(500).json('Internal Server Error');
    }
});

// необходимо для ejs в старых заданиях 
router.get('/create', (req, res) => {
    console.log('я тут')
    res.render("book/create", {
        title: "Книги | создать книгу",
        book: {},
        action: '/api/books'
    });
});

// Получение книги по ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Books.findById(id, '-__v');
        //console.log(book)
        if (book) {
            // Отправка POST-запроса для увеличения счетчика
            try {
                await axios.post(`${COUNTER_URL}/counter/${id}/incr`);
            } catch (error) {
                // Обработка ошибки, если не удалось увеличить счетчик
                console.error('Error incrementing counter:', error.message);
            }

            // Получение значения счетчика из Redis
            try {
                const response = await axios.get(`${COUNTER_URL}/counter/${id}`);
                const counterValue = response.data.counterValue;

                // Отображение страницы с информацией о книге и значением счетчика
                res.render("book/view", {
                    title: "Книга | просмотр",
                    book, // Передаем значение счетчика в шаблон
                    counterValue
                });
                //res.json(book);
            } catch (error) {
                console.error('Error getting counter value:', error.message);
                // Обработка ошибки, если не удалось получить значение счетчика
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(404)
            res.json('404 | Cтраница не найдена')
        }
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
});

// Обновление книги по ID
router.post('/update/:id', async (req, res) => {
    try {

        const { title, description, authors, favorite, fileCover, fileName } = req.body;
        const { id } = req.params
        const book = await Books.findById(id, '-__v');
        if (book) {
            book.title = title;
            book.description = description;
            book.authors = authors;
            book.favorite = favorite;
            book.fileCover = fileCover;
            book.fileName = fileName;

            await book.save();

            //res.json(book);
            res.redirect(`/api/books/${id}`);
        } else {
            res.status(404)
            res.redirect('/404');
        }
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
});

// Добавление книги
router.post('/',
    uploadBooks.single('fileBook'),
    async (req, res) => {
        try {
            const { title, description, authors, favorite, fileCover, fileName } = req.body;

            const newBook = new Books({
                title,
                description,
                authors,
                favorite,
                fileCover,
                fileName
            });

            if (req.file) {
                newBook.fileBook = req.file.path;
            }

            const book = await newBook.save();

            res.status(201)
            // res.json(book);
            res.redirect('/api/books')
        } catch {
            res.status(500).json('Internal Server Error');
        }
    });

// Удаление книги по ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Books.findByIdAndDelete(id);

        if (book) {
            res.json('ok')
        } else {
            res.status(404).json('404 | страница не найдена')
        }

    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
});




router.get('/:id/download', (req, res) => {
    const { books } = store
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        const filePath = path.join(__dirname, '..', books[idx].fileBook);
        if (fs.existsSync(filePath)) {
            res.download(filePath, (err) => {
                if (err) {
                    res.status(500).json('Ошибка при скачивании файла');
                }
            });
        } else {
            res.status(404).json('Файл не найден на сервере');
        }

    } else {
        res.status(404)
        res.redirect('/404');
    }
});

router.get('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Books.findById(id, '-__v');

        if (book) {
            res.render("book/update", {
                title: "Книга | изменить книгу",
                book,
                action: `/api/books/update`,
            });
        } else {
            res.status(404)
            res.redirect('/404');
        }
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
});


const socketConnection = async (server) => {

    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('A user connected');
        const { roomId } = socket.handshake.query;
        socket.join(roomId);
        socket.on('addComment', async (data) => {
            try {
                const { id, text, username } = data;

                // Найти книгу по ID и добавить комментарий
                const book = await Books.findById(id);
                if (!book) {
                    throw new Error('Book not found');
                }

                book.comments.push({ username, text });
                await book.save();

                // Отправить обновленную книгу всем подписанным клиентам
                data.type = `room: ${roomId}`;
                socket.to(roomId).emit('commentAdded', data);
                socket.emit('commentAdded', data);
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}


module.exports = { router, socketConnection };
