const express = require("express");
const userRoutes = require('./routes/userRoutes');
const booksRoutes = require('./routes/booksRoutes');


const app = express()
//app.use(express.json())
app.use(express.urlencoded());
app.set("view engine", "ejs"); // Установите значение "ejs" в качестве шаблонизатора для express

app.use('/api/user', userRoutes); // Подключите роутер для пользователей
app.use('/api/books', booksRoutes); // Подключите роутер для книг

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log(`Server listens ${PORT} port`));