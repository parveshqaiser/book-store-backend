
import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    area : {
        type : String,
    },
    doorNo : {
        type : String,
        required : true,
    },
    city : {
        type : String,
        required : true,
    },
    district : {
        type : String,
    },
    state : {
        type : String,
        required : true,
    },
    pinCode: {
        type : Number,
        required : true,
    }
},{_id:false});

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
    },
    address : [addressSchema]
},{timestamps:true});

const UserSchema = mongoose.model("users", userModel);

export default UserSchema;