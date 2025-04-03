
import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    name : {
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
    role : {
        type : String,
        default : "user",
    },
    number : {
        type : Number,
        default : null,
    },
    isUserVerified : {
        type : Boolean,
        default : false,
    },
    otp : {
        type : Number,
    },
    otpExpiry : {
        type : String,
    },
    password : {
        type : String,
        required : true,
    }
},{timestamps:true});

const UserSchema = mongoose.model("users", userModel);

export default UserSchema;