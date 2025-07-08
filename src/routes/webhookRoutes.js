
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import PaymentSchema from "../model/paymentSchema.js";
import {validateWebhookSignature}  from 'razorpay/dist/utils/razorpay-utils';

const router = express.Router();

router.post("/new/webhook", bodyParser.raw({type: 'application/json'}), async (req, res) => {
    try {
        const receivedSignature = req.headers["X-Razorpay-Signature"];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET_KEY.trim();
        const payload = req.body.toString();

        console.log("**receivedSignature ",receivedSignature);
        console.log("webhookSecret ", webhookSecret);
        console.log("payload ", payload);
        
        // const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex");
        // console.log("expectedSignature     ", expectedSignature)

        // if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(receivedSignature))) {
        //     console.error("Invalid webhook signature");
        //     return res.status(400).json({message: "Invalid signature", success: false});
        // }

        let checkValidity = validateWebhookSignature(JSON.stringify(req.body), receivedSignature, webhookSecret);

        console.log("checkValidity   ", checkValidity);
        if(!checkValidity){
            console.error("Invalid webhook signature");
            return res.status(400).json({message: "Invalid signature", success: false});
        }

        const event = JSON.parse(payload);
        console.log("Webhook payload:", event);

        if (event.event === 'payment.captured') {
            const { status, order_id } = event.payload.payment.entity;
            console.log("Payment captured - Status:", status, "Order ID:", order_id);

            let paymentDetails = await PaymentSchema.findOne({_id: order_id});
            paymentDetails.status = status;
            await paymentDetails.save();
        }

        res.status(200).json({message: "Webhook processed", success: true});
        
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).json({ message: "Server error", error: error.message, success: false });
    }
});

export default router;