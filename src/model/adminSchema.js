
import mongoose from "mongoose";

const adminModel = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    }
},{timestamps:true});

const AdminSchema = mongoose.model("admins", adminModel);

export default AdminSchema;