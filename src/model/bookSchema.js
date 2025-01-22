
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
    bookCover : {
        type: String,
    },
    coverPic : {
        type : String,
        default : "https://npr.brightspotcdn.com/dims4/default/b4df395/2147483647/strip/true/crop/1031x773+0+0/resize/880x660!/quality/90/?url=https%3A%2F%2Fnpr.brightspotcdn.com%2Fdims3%2Fdefault%2Fstrip%2Ffalse%2Fcrop%2F1031x773%200%20579%2Fresize%2F1031x773%21%2F%3Furl%3Dhttp%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F1a%2F2b%2F354d81ae4ed7bcd341b4abf8d342%2Ftimid.jpg",
    }
}, {timestamps : true});

let BookSchema = mongoose.model("books", bookModel);

export default BookSchema;