
import express from "express";
import instance from "../service/razorpay.js";
import authentication from "../middleware/auth.js";
import PaymentSchema from "../model/paymentSchema.js";
const router = express.Router();

import {validateWebhookSignature} from 'razorpay/dist/utils/razorpay-utils.js';


router.post("/create/paymnent",authentication,async(req, res)=>{

    try {

        let loogedinUser = req.id;
        let {name, email , amount} = req.body;

        let createOrder = await instance.orders.create({
            amount: amount * 100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "USD",
            receipt: "#recepit1",
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
        })

        // res.status(200).send(loogedinUser);

        res.status(200).json({
            data : {...orderSaved.toJSON() , keyId : process.env.RAZORPAY_ID},
            success : true ,
            message : "Order Placed" 
        });

    } catch (error) {
        console.log("order error", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.post("/pay/webhook",async (req, res)=>{

    try {

        let webhookSignature = req.get("x-razorpay-signature");

        let isWebHookValid =  await validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WWEBHOOK_SECRET_KEY
        );

        if(isWebHookValid == false){
            return res.status(400).json({message : "Web Hook Not valid ", success : false});
        }

        let {status, order_id} = req.body.payload.payment.entity;

        let payDetails = await PaymentSchema.findOne({_id :order_id});

        payDetails.status = status;
        await payDetails.save();

        // if(req.body.paymnent == "captured"){}

        // if(req.body.paymnent == "failed") {}

        res.status(200).json({message : "Web Hook Received Successfully" , success : true});
    } catch (error) {
        console.log("web hook error ", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
})

export default router;