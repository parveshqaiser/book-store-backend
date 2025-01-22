
import express from "express";
import UserSchema from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const router = express.Router();

router.post("/register/user", async(req, res)=>{

    try {
        let {name, username, email,number,password} = req.body;

        console.log("re******* ", req.body);

        let user = await UserSchema.findOne({email});
        if(user){
            return res.status(400).json({message : "User Already Exist", success : false});
        }

        let hasPassword = await bcrypt.hash(password,10);

        let createUser = await UserSchema.create({
            name,
            username,
            email,
            number,
            password :hasPassword,
        });

        res.status(201).json({message:"User Added Successfully", success: true});
    } catch (error) {
        console.log("some issue in registering user", error);
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
        res.cookie("token","", {expires : new Date()}).json({message : "Logout Success", success : true})
    } catch (error) {
        console.log("some error in logging out", error);
        res.status(500).send("error " + error.message);
    }
});

export default router;


