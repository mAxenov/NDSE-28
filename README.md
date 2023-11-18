#запросы для MongoDB

db.books.insertMany([
  {
    title: "Книга 1",
    description: "Описание книги 1",
    authors: ["Автор 1", "Автор 2"],
    favorite: "Книга 1"
  },
  {
    title: "Книга 2",
    description: "Описание книги 2",
    authors: ["Автор 3", "Автор 4"],
    favorite: "Книга 2"
  }
]);
