
import express from "express";
import UserSchema from "../model/userSchema.js";
import bcrypt from "bcrypt";
import validator from "validator";
import authentication from "../middleware/auth.js";

const router = express.Router();

router.get("/user/details",authentication, async(req, res)=>{

    try {
        let id = req.id; // user id
        let findUser = await UserSchema.findById({_id : id}).select("-password");

        if(!findUser){
            return res.status(404).json({message : "User Data Not Found", success : false});
        }

        res.status(200).json({message : "User Data Fetched", data : findUser, success : true});
    } catch (error) {
        console.log("some error in logging out", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.patch("/update/profile", authentication, async(req, res)=>{
    try {
        let id = req.id;
        let {name,number} = req.body;

        let user = await UserSchema.findOne({_id:id});
        
        if (!user) {
            return res.status(404).json({ message: "User Not Found", success: false });
        }

        user.number = number;
        user.name = name;
        await user.save();

        res.status(200).json({message : "Profile Updated", success : true});

    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.post("/update/password", authentication, async(req, res)=>{

    try {
        let id = req.id;
        let {password, newPassword} =req.body;

        if(!password || (password && password.trim() == "")){
            return res.status(400).json({message : "Password Required" , success : false});
        }

        if(!newPassword || (newPassword && newPassword.trim() == "")){
            return res.status(400).json({message : "New Password Required" , success : false});
        }

        let user = await UserSchema.findOne({_id:id});

        if(!user)
        {
            return res.status(404).json({message : "Invalid User", success : false});
        }

        let isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched){
            return res.status(400).json({message : "Incorrect Password", success: false});
        }

        let hashPassword = await bcrypt.hash(newPassword,10);

        user.password = hashPassword;
        await user.save();

        res.status(200).json({message : "Password Updated", success: true});

    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.post("/add/address", authentication, async(req, res)=>{

    try {
        let id = req.id;
        let {area, doorNo, city, state,pinCode, district, addressType} = req.body;

        let user = await UserSchema.findOne({_id:id});

        if(!user){
            return res.status(404).json({message : "Invalid User", success : false});
        }
       
        user.address.push({area,doorNo, city,district,state,pinCode, addressType});

        await user.save();
        res.status(200).json({message : "New Address Added Successfully", success: true});

    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.put("/update/address/:index", authentication, async(req, res)=>{

    try {
        let id = req.id;
        let index = parseInt(req.params.index);

        let {area, doorNo, city, state,pinCode, district, addressType} = req.body;

        let user = await UserSchema.findOne({_id:id});

        if(!user){
            return res.status(404).json({message : "Invalid User", success : false});
        }

        if (index < 0 || index >= user.address.length) {
            return res.status(400).json({ message: "Invalid address index", success: false });
        }

        user.address = user.address.map((val,idx)=>{
            if(index == idx){
                return{
                    area,
                    addressType,
                    doorNo,
                    city, 
                    district,
                    state,
                    pinCode
                }
            }
            return val;
        });
        
        await user.save();

        res.status(200).json({message : "Address Updated Successfully", success: true});

    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.delete("/delete/address/:index", authentication, async(req, res)=>{

    try {
        let id = req.id;
        let delIndex = parseInt(req.params.index);

        let user = await UserSchema.findOne({_id:id});

        if(!user){
            return res.status(404).json({message : "Invalid User", success : false});
        }

        if (delIndex < 0 || delIndex >= user.address.length) {
            return res.status(400).json({ message: "Invalid address index", success: false });
        }

        user.address.splice(delIndex,1);
        await user.save();
        res.status(200).json({message : "Address Deleted Successfully", success: true});
    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
})

export default router;


