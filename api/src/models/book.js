const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    text: String,
    username: String, // Имя пользователя кто оставил комментарий
}, { timestamps: true });

const bookSchema = new Schema({
    id: {
        type: "string",
        require: true
    },
    title: {
        type: "string",
        require: true
    },
    description: {
        type: "string"
    },
    authors: {
        type: "string"
    },
    favorite: {
        type: "string"
    },
    fileCover: {
        type: "string"
    },
    fileName: {
        type: "string"
    },
    comments: [commentSchema]
});

module.exports = model('Book', bookSchema);