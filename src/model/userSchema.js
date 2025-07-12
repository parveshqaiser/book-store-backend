
import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    area : {
        type : String,
    },
    addressType : {
        type : String,
        enum : ["Home", "Apartment", "Work", "Others"],
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
    accessToken : {
        type : String,
        default:null,
    },
    refreshToken : {
        type : String,
        default:null,
    },
    address : [addressSchema]
    
},{timestamps:true});

const UserSchema = mongoose.model("users", userModel);

export default UserSchema;