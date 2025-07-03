
import mongoose from "mongoose";

let paymentModel = new mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "users",
        required : true,
    },
    orderId : {
        type : String,
        required : true,
    },
    status : {
        type : String,
        required : true,
    },
    paymentId : {
        type : String,
    },
    amount : {
        type : Number,
        required : true,
    },
    currency : {
        type : String,
        required : true,
    },
    notes: {
        name : {
            type : String,
        },
        email : {
            type : String
        }
    },
    receipt:{
        type :String
    },

}, {timestamps: true});

let PaymentSchema =mongoose.model("payment", paymentModel);

export default PaymentSchema;