
import express from "express";

import PaymentSchema from "../model/paymentSchema.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import bodyParser from "body-parser";
const router = express.Router();

router.post("/pay/webhook",express.raw({type : "application/json"}), async (req, res) => {
    try {

        const webhookSignature = req.headers["x-razorpay-signature"];
        console.log("Webhook signature:", webhookSignature); // Debug: Log signature

        const rawBody = req.body.toString('utf8');
        console.log("Raw body  ", rawBody); // Debug: Log string body
        console.log("re.body  ", req?.body?.payload?.payment?.entity);


        const isWebHookValid = validateWebhookSignature(
            rawBody,
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET_KEY
        );
        console.log("Webhook validation result:", isWebHookValid); // Debug: Log validation

        if (!isWebHookValid) {
            console.error("Invalid webhook signature");
            return res.status(400).json({ message: "Invalid webhook signature", success: false });
        }

        // Correct path: payload.payment.entity (not payload.payload.payment.entity)
        let payload = JSON.parse(rawBody);
        const { status, order_id } =payload.payload.payment.entity;
        console.log("Extracted status:", status, "order_id:", order_id); // Debug

        const payDetails = await PaymentSchema.findOne({ _id: order_id }).exec();
        console.log("Payment details before update:", payDetails); // Debug

        if (!payDetails) {
            return res.status(404).json({ message: "Payment not found", success: false });
        }

        payDetails.status = status;
        await payDetails.save();
        console.log("Payment details after update:", payDetails); // Debug

        res.status(200).json({ message: "Webhook processed", success: true });
    } catch (error) {
        console.error("Webhook error:", error); // Debug: Log full error
        res.status(500).json({ message: "Server error", error: error.message, success: false });
    }
});

export default router;