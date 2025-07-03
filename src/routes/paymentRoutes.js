
import express from "express";
import instance from "../service/razorpay.js";
import authentication from "../middleware/auth.js";
import PaymentSchema from "../model/paymentSchema.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import bodyParser from "body-parser";
const router = express.Router();

router.post("/create/paymnent",authentication,async(req, res)=>{

    try {

        let loogedinUser = req.id;
        let {name, email , amount} = req.body;

        let createOrder = await instance.orders.create({
            amount: amount * 100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
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

router.post("/pay/webhook", bodyParser.raw({ type: "*/*" }),async (req, res)=>{

    try {

        let webhookSignature = req.get("x-razorpay-signature");
        console.log("BODY TYPE:", typeof req.body);
        console.log("RAW BODY:", req.body);
        console.log("SIGNATURE:", webhookSignature);
        console.log("SECRET:", process.env.RAZORPAY_WEBHOOK_SECRET_KEY);

        let isWebHookValid =  await validateWebhookSignature(
            req.body,
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET_KEY
        );

        console.log("*************** ", isWebHookValid);

        if(isWebHookValid == false){
            return res.status(400).json({message : "Web Hook Not valid ", success : false});
        }

        let payload = JSON.parse(req.body);  // manually parse the raw buffer

        let { status, order_id } = payload.payload.payment.entity;

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