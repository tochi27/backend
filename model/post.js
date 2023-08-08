const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String, minlength: 3, maxlength: 200,
        unique: true
    },
    content: {
        type: String
    },
    author: {
        type: String
    },
    dateCreated: {
        type: String, default: new Date()
    },
    dateUpdated: {
        type: String, default: new Date()
    }
});

const Posts = mongoose.model("posts", postSchema);
module.exports.Post = Posts