const express = require("express");
const router = express.Router();
const uploadBooks = require('../middleware/uploadBooks');
const { v4: uuid } = require('uuid');
const path = require('path');
const fs = require('fs');

class Books {
    constructor(
        title = "",
        description = "",
        authors = "",
        favorite = "",
        fileCover = "",
        fileName = "",
        id = uuid(),
    ) {
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.id = id
    }
}

const store = {
    books: [],
};

router.get('/', (req, res) => {
    const { books } = store
    res.render("book/index", {
        title: "Книги",
        books: books,
    });
});

router.post('/create',
    uploadBooks.single('fileBook'),
    (req, res) => {
        const { books } = store;
        const { title, description, authors, favorite, fileCover, fileName } = req.body;
        console.log(req.body);
        const newBooks = new Books(title, description, authors, favorite, fileCover, fileName);

        if (req.file) {
            console.log(req.file)
            newBooks.fileBook = req.file.path;
        }

        books.push(newBooks)

        res.status(201)
        res.redirect('/api/books')
    });

router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "Книги | создать книгу",
        book: {},
    });
});

router.get('/:id', (req, res) => {
    const { books } = store
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        res.render("book/view", {
            title: "Книга | просмотр",
            book: books[idx],
        });
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
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

router.post('/update/:id', (req, res) => {
    const { books } = store
    const { title, description, authors, favorite, fileCover, fileName } = req.body
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName
        }

        res.redirect(`/api/books/${id}`);
    } else {
        res.status(404)
        res.redirect('/404');
    }
});

router.get('/update/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    }

    res.render("book/update", {
        title: "Книга | изменить книгу",
        book: books[idx],
    });
});

router.delete('/:id', (req, res) => {
    const { books } = store
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        books.splice(idx, 1)
        res.json('ok')
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
});

module.exports = router;