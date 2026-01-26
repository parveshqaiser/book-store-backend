
import express from "express";
import messageSchema from "../model/messageSchema.js";
import validator from "validator";
const router = express.Router();

router.post("/contact/message", async(req, res)=>{

    try {
        let {name,email, message} = req.body;

        name = typeof name === "string" ? name.trim() : "";
        message = typeof message === "string" ? message.trim() : "";
        // console.log(name, typeof name);

        if (!name) {
            return res.status(400).json({
                message: "Please enter your name",
                success: false
            });
        }

        if(!validator.isEmail(email)){
            res.status(400).json({message : "Invalid Email", success : false});
            return;
        }

         if (!message) {
            return res.status(400).json({
                message: "Please enter your Message",
                success: false
            });
        }

        let insertMessage = await messageSchema.create({
            name,email,message
        });


        return res.status(200).json({data : req.body, message : "Message Sent Successfully", success : true});

    } catch (error) {
        console.log("some error in ordering book", error);
		res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

export default router;