
import express from "express";
import UserSchema from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import transporter from "../service/nodeMailer.js";

const router = express.Router();

router.post("/register/user", async(req, res)=>{

    try {
        let {name, email,password} = req.body;

        let userExist = await UserSchema.findOne({email, isUserVerified:true});
        if(userExist){
            return res.status(400).json({message : "User Already Exist with this Email", success : false});
        }
        
        let verifyUser = await UserSchema.findOne({email, isUserVerified : false});

        let hashPassword = await bcrypt.hash(password,10);
        let otp = Math.floor(100000 + Math.random() * 900000);
        let otpExpiry = Date.now() + 2 * 60 * 1000; 

        let createUser;

        if(verifyUser)
        {
            verifyUser.otp= otp,
            verifyUser.otpExpiry= otpExpiry,  
            await verifyUser.save();          
        }else {
            createUser = await UserSchema.create({
                name,
                email,
                password : hashPassword,
                otp : otp,
                otpExpiry : otpExpiry,
                isUserVerified : false,
            });
        }

        let mailOptions = {
            from: "ramganta778@gmail.com",
            to: email,
            subject: "Verify Your Account",
            html: `
                <p>Here is your Account Verification Credentials</p>
                <p>Your OTP for verification is <strong> ${otp} </strong>. It will expire in 2 minutes.</p>
                <p>Regards,<br>Team Story Book </p>
            `,
        };

        let emailInfo = await transporter.sendMail(mailOptions);

        res.status(201).json({message :"User Added Successfully",data : createUser || verifyUser, success : true});

    } catch (error) {
        console.log("some issue in registering user", error);
        res.status(500).send("error " + error.message);
    }
});

router.post("/verify/otp", async(req, res)=>{

    try {
        let {email,otp} = req.body;

        let user = await UserSchema.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "User Not Found", success: false });
        }

        // if user is already verified
        if (user.isUserVerified) {
            return res.status(400).json({ message: "User Already Verified", success: false });
        }

        if(otp !== user.otp || user.otpExpiry < Date.now())
        {
            return res.status(400).json({ message: "Invalid OTP / OTP Expired", success: false });
        }

        user.otp = otp;
        user.isUserVerified = true;
        await user.save();

        res.status(200).json({message : "User Verified Successfully", success : true})

    } catch (error) {
        console.log("some issue in verifying otp", error);
        res.status(500).send("error " + error.message);
    }
})

router.post("/resend/otp",async(req, res)=>{

    try {
        let {email} = req.body;
        let user = await UserSchema.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "User Not Found", success: false });
        }

        // if user is already verified
        if (user.isUserVerified) {
            return res.status(400).json({ message: "User Already Verified", success: false });
        }

        let otp = Math.floor(100000 + Math.random() * 900000);
        let otpExpiry = Date.now() + 2 * 60 * 1000; 

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        let mailOptions = {
            from: "ramganta778@gmail.com",
            to: email,
            subject: "New OTP to Verify Your Account",
            html: `
                <p>Here is your Account Verification Credentials</p>
                <p>Your OTP for verification is <strong> ${otp} </strong>. It will expire in 2 minutes.</p>
                <p>Regards,<br>Team Story Book </p>
            `,
        };

        let emailInfo = await transporter.sendMail(mailOptions);

        res.status(200).json({message : "Otp Sent Successfully. Check Email", success : true});

    } catch (error) {
        console.log("some issue in resending otp", error);
        res.status(500).send("error " + error.message);
    }
});

router.post("/user/login", async(req, res)=>{

    try {
        let {username, email,password} = req.body;

        if(!validator.isEmail(email))
        {
            res.status(400).json({message : "Invalid Email", success : false});
            return;
        }

        if(!password || (password && password.trim()== "")){
            res.status(400).json({message: "Password Required"});
            return;
        }

        let user = await UserSchema.findOne({email :email, username :username});

        if(!user){
            res.status(400).json({message: "Invalid Credentials", success : false});
            return;
        }

        let matchPassword = await bcrypt.compare(password,user.password);

        if(!matchPassword){
            res.status(400).json({message: "Invalid Credentials", success : false});
            return;
        }

        let token = jwt.sign({id: user._id}, "secret-key",{expiresIn:"1h"});

        res.cookie("token", token);
        res.status(200).json({message : `Welcome ${user.name}`, success: true, token, user});

    } catch (error) {
        console.log("some error in logging in", error);
        res.status(500).send("error " + error.message);
    }
});

router.post("/user/logout", (req, res)=>{

    try {
        res.cookie("token","", {expires : new Date()}).json({message : "User Logout Success", success : true})
    } catch (error) {
        console.log("some error in logging out", error);
        res.status(500).send("error " + error.message);
    }
});

export default router;


