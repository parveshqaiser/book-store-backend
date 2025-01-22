
import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        index :true,
        trim : true
    },
    number : {
        type : Number,
        required : true,
    },
    password : {
        type : String,
        required : true,
    }
},{timestamps:true});

const UserSchema = mongoose.model("users", userModel);

export default UserSchema;