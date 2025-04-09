import mongoose from "mongoose";

const orderModel = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    number : {
        type : Number,
        required : true,
    },
    orderedQuantity : {
        type : Number,
        required : true
    },
    totalPrice : {
        type : Number,
        required : true,
    },
    orderStatus: {
        type : String,
        enum : ["Pending", "Delivered"],
        default : "Pending",
    },
    address : {
        doorNo : {
            type : String,
            required : true,
        },
        city : {
            type : String,
            required : true,
        },
        state : {
            type : String,
            required : true,
        },
        pinCode: {
            type : Number,
            required : true,
        }
    },
    product : [{
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "books",
        },
        quantity : {
            type : Number,
            required : true
        },
        price : {
            type : Number,
            required : true,
        }
    }]
},{timestamps : true});


let OrderSchema = mongoose.model("orders", orderModel);
export default OrderSchema;