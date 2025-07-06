
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

router.post("/pay/webhook", async (req, res) => {
    try {
        console.log("Webhook called. Raw body (buffer):", req.body); // Debug: Log raw buffer

        const webhookSignature = req.headers["x-razorpay-signature"];
        console.log("Webhook signature:", webhookSignature); // Debug: Log signature

        const rawBody = req.body.toString('utf8');
        console.log("Raw body + ", rawBody); // Debug: Log string body
        console.log("re.body  ", req.body);

        const isWebHookValid = validateWebhookSignature(
            rawBody,
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET_KEY
        );
        console.log("Webhook validation result:", isWebHookValid); // Debug: Log validation

        if (!isWebHookValid) {
            return res.status(400).json({ message: "Invalid webhook signature", success: false });
        }

        const payload = JSON.parse(rawBody);
        console.log("Parsed payload:", payload); // Debug: Log full payload

        // Correct path: payload.payment.entity (not payload.payload.payment.entity)
        const { status, order_id } = payload.payment.entity;
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