# Запросы для MongoDB

## Запрос для вставки данных минимум о двух книгах в коллекцию books
```
db.books.insertMany([
  {
    title: "Книга 1",
    description: "Описание книги 1",
    authors: ["Автор 1", "Автор 2"]
  },
  {
    title: "Книга 2",
    description: "Описание книги 2",
    authors: ["Автор 3", "Автор 4"]
  }
]);
```

## Запрос для поиска полей документов коллекции books по полю title:
```
db.books.find({ title: "Книга 1" }); 
```

## Запрос для редактирования полей description и authors коллекции books по _id записи:
```
db.books.updateOne(
  { _id: ObjectId("ВАШ_ID_ЗАПИСИ") },
  {
    $set: {
      description: "Новое описание",
      authors: ["Новый Автор 1", "Новый Автор 2"]
    }
  }
);
```
