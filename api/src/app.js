const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes');
const { router: booksRoutes } = require('./routes/booksRoutes');
const passport = require('passport');
const session = require('express-session');
const { socketConnection } = require('./routes/booksRoutes')
const http = require('http');
const socketIO = require('socket.io');

const app = express();
//socketConnection(app);
//app.use(express.json())



app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs"); // Установите значение "ejs" в качестве шаблонизатора для express

app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/user', userRoutes); // Подключите роутер для пользователей
app.use('/api/books', booksRoutes); // Подключите роутер для книг

const server = http.Server(app);

const UrlDB = process.env.URL_MONGO;
const PORT = process.env.PORT || 3000;


async function start(PORT, UrlDB) {
    try {
        await mongoose.connect(UrlDB);
        console.log('DB connected')
        server.listen(PORT, () =>
            console.log(`Server listens ${PORT} port`));

        socketConnection(server);
    } catch (err) {
        console.log(err)
    }
}


start(PORT, UrlDB);





