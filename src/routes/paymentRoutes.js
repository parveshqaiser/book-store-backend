
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

        console.log("going inside this web hook")
        let webhookSignature = req.headers["x-razorpay-signature"];

        let isWebHookValid =  validateWebhookSignature(
            req.body.toString('utf8'),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET_KEY
        );

        if(isWebHookValid == false){
            return res.status(400).json({message : "Web Hook Not valid ", success : false});
        }

       const payload = JSON.parse(req.body.toString('utf8'));  // manually parse the raw buffer

        console.log("*** payload ", payload);

        let { status, order_id } = payload.payload.payment.entity;

        console.log("******** ", status, order_id);

        let payDetails = await PaymentSchema.findOne({_id :order_id});

        console.log("****pay deta before  ", payDetails);

        payDetails.status = status;
        await payDetails.save();
        console.log("****pay deta  after ", payDetails);
        // if(req.body.paymnent == "captured"){}
        // if(req.body.paymnent == "failed") {}

        res.status(200).json({message : "Web Hook Received Successfully" , success : true});
    } catch (error) {
        console.log("web hook error ", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

export default router;