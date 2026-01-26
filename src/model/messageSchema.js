
import mongoose from "mongoose";

//  this model is for contact message that is present in contact page.

let queryModel = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    message : {
        type : String,
        required : true,
    }
}, {timestamps:true});

let messageSchema = mongoose.model("messages", queryModel);

export default messageSchema;
