import express from "express";
import jwt from "jsonwebtoken";
import AdminSchema from "../model/adminSchema.js";

const router = express.Router();

//  FOR ADMIN PURPOSE
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

        let isProduction = process.env.NODE_ENV === "production";
        console.log("isProduction ", isProduction);

        console.log("env value loaded ", process.env.NODE_ENV);

        let cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 60 * 60 * 2000
        }

        res.cookie("accessToken", token, cookieOptions)
        .status(200).json({
            message : `Admin Login Success`, 
            success: true, 
            data
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message, 
            success: false 
        });
    }
});

router.post("/admin/logout", (req, res)=>{

    try {
        res.status(200).cookie("accessToken","", 
            {expires : new Date()}
        ).json({
            message : "Admin Logout Success", 
            success : true
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message, 
            success: false 
        });
    }
});

export default router;
