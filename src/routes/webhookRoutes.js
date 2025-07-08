
import express from "express";

import PaymentSchema from "../model/paymentSchema.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import bodyParser from "body-parser";
import crypto from "crypto";


const router = express.Router();

router.post("/pay/webhook", async (req, res) => {

    try {
        const receivedSignature = req.headers["x-razorpay-signature"];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET_KEY;
        const payload = JSON.stringify(req.body);

        let expectedSignature = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex");

        if (crypto.timingSafeEqual(Buffer.from(expectedSignature),Buffer.from(receivedSignature))) 
        {
            console.log("Webhook signature verified successfully");
            console.log("Recieved Signature: " + receivedSignature);
            console.log("Expected Signature: " + expectedSignature);
            let event = req.body;

            console.log("**** reqnody ", req.body)

            if (event.event === 'payment.captured')
            {
                const { status, order_id } = event.payload.payment.entity;
                console.log("status ************ " ,status);
                console.log("order_id ************ " ,order_id)
            }
            res.status(200).json({message: "Webhook verified", success: true});

        } else {
            console.error("Invalid webhook signature");
            console.log("Recieved Signature: " + receivedSignature);
            console.log("Expected Signature: " + expectedSignature);
            res.status(400).json({message: "Webhook failed to capture", success: false});
        }

        // res.status(200).json({ message: "Webhook processed", success: true });
    } catch (error) {
        console.error("Webhook error:", error); // Debug: Log full error
        res.status(500).json({ message: "Server error", error: error.message, success: false });
    }
});

export default router;