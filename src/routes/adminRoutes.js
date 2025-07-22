import express from "express";
import jwt from "jsonwebtoken";
import AdminSchema from "../model/adminSchema.js";

const router = express.Router();

router.post("/admin/login", async(req, res)=>{

    try {
        let {username, password} = req.body;

        if(!username || username.trim() == ""){
            res.status(400).json({message: "Admin Username Required"});
            return;
        }

        if(!password || (password && password.trim()== "")){
            res.status(400).json({message: "Admin Password Required"});
            return;
        }

        let admin = await AdminSchema.findOne({username});

        if(!admin){
            res.status(400).json({message: "Invalid Admin Credentials"});
            return;
        }

        let isPasswordMatched = admin.password == password;

        if(!isPasswordMatched){
            res.status(400).json({message: "Invalid Admin Credentials"});
            return;
        }

        let token = jwt.sign({id : admin._id}, "secret-key", {expiresIn:"2h"});

       let data = {
            username : admin.username,
            role : admin.role,
            token,
       };

        res.cookie("accessToken", token,{httpOnly:true,sameSite:"strict", maxAge: 60 * 60 * 2000});
        res.status(200).json({message : `Admin Login Success`, success: true, data});

    } catch (error) {
        console.log("some error in logging admin", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.post("/admin/logout", (req, res)=>{

    try {
        res.cookie("accessToken","", {expires : new Date()}).status(200).json({message : "Admin Logout Success", success : true})
    } catch (error) {
        console.log("some error in admin logging out", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

export default router;
