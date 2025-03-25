
import mongoose from "mongoose";

const bookModel = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    author : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        required : true,
    },
    publisher : {
        type : String,
        required : true,
    },
    language : {
        type : String,
        required : true,
    },
    quantity : {
        type : Number,
        required : true,
    },
    isAvailable : {
        type : Boolean,
        default : true,
    },
    pages : {
        type : Number,
        required : true,
    },
    newPrice : {
        type : Number,
        required : true,
    },
    oldPrice : {
        type : Number,
        required : true,
    },
    coverPic : {
        type : String,
        default : "https://static.wikia.nocookie.net/gijoe/images/b/bf/Default_book_cover.jpg/revision/latest?cb=20240508080922",
    }
}, {timestamps : true});

let BookSchema = mongoose.model("books", bookModel);

export default BookSchema;