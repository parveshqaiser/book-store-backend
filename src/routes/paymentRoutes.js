
import express from "express";
import instance from "../service/razorpay.js";
import authentication from "../middleware/auth.js";
import PaymentSchema from "../model/paymentSchema.js";
import crypto from "crypto";
const router = express.Router();

router.post("/create/paymnent",authentication,async(req, res)=>{

    try {
        let loogedinUser = req.id;
        let {name, email , amount} = req.body;

        let createOrder = await instance.orders.create({
            amount: amount * 100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            receipt: `#${crypto.randomBytes(10).toString('hex')}`,
            notes : {
                name : name,
                email : email,
            },
        });

        let orderSaved = await PaymentSchema.create({
            userId : loogedinUser,
            orderId : createOrder.id,
            status : createOrder.status,
            amount : createOrder.amount,
            currency : createOrder.currency,
            notes : createOrder.notes,
            receipt: createOrder.receipt
        });

        res.status(200).json({
            data : {...orderSaved.toJSON() , keyId : process.env.RAZORPAY_ID},
            success : true ,
            message : "Payment Created" 
        });

    } catch (error) {
        console.log("payment creation error ", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.post("/verify/payment", authentication, async(req, res)=>{
    try {
        let { razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;

        // console.log("*** 1 ", razorpay_payment_id );
        // console.log("*** 2 ", razorpay_order_id);
        // console.log("*** 3 ", razorpay_signature);
        
        let generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        // console.log("generatedSignature ", generatedSignature);

        if(generatedSignature !== razorpay_signature){          
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        let paymentDetails = await PaymentSchema.findOne({orderId: razorpay_order_id});

        paymentDetails.status = "captured";
        paymentDetails.paymentId = razorpay_payment_id;

        let postSave = await paymentDetails.save();

        if(postSave.status == "captured"){
            res.status(200).json({success: true,message: "Payment verified and order created"});
        }
        else {
            res.status(400).json({success: false,message: "Payment failed"});
        }
        
    } catch (error) {
        console.log("Verification error", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});


export default router;