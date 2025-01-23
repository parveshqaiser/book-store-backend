

import express from "express";
import authentication from "../middleware/auth.js";
import BookSchema from "../model/bookSchema.js";
import OrderSchema from "../model/orderSchema..js";

const router = express.Router();

router.post("/order/book/", authentication,async(req,res)=>{

     try {
          let {name, email, number,address,totalPrice, orderedQuantity, products} = req.body;

          // console.log("********* ", req.body);

          let book;
          for(let item of products)
          {
              book= await BookSchema.findById({_id : item.productId});

               if(!book){
                    return  res.status(400).json({message: "Invalid Book ID", success : false});
               }

               if(book.quantity <orderedQuantity)
               {
                    return res.status(400).json({message: `Only ${book.quantity} Books are available`,success: false});
               }

               book.quantity -= item.quantity;
               book.quantity == 0 ? book.isAvailable = false : true,
               await book.save();
          }

          let placeOrder = await OrderSchema.create({
               name,
               email,
               number,
               totalPrice,
               orderedQuantity,
               address : {
                    doorNo : address.doorNo,
                    city : address.city,
                    state : address.state,
                    pinCode : address.pinCode,
               },
               product :products
          });

          // console.log("placeOrder ", placeOrder);

          if(!placeOrder){
               return res.status(400).json({message : "Failed To place Order", success : true});
          }

          res.status(200).json({message : "Order Placed Successfully", success : true});
               
     } catch (error) {
          console.log("some error in ordering book", error);
          res.status(500).json({ message: "Failed to create order" });
     }
});

router.get("/getTotalSales",authentication, async(req, res)=>{

     try {
          let query =[
               {
                 $group: {
                    _id: null,
                    totalSales : {
                         $sum:"$totalPrice",
                    },
                    totalQuantity : {
                         $sum : "$orderedQuantity"
                    }
                    }
               },
               {
                $project: {
                    _id:0,
                    totalSales:1,
                    totalQuantity:1
               }
               }];

               let getDetails = await OrderSchema.aggregate(query);

               console.log("getDetails ", getDetails);
               res.status(200).json({getDetails});

     } catch (error) {
          console.log("some error in getting total sales details", error);
          res.status(500).json({ message: "some error in getting sales details" });
     }
})


export default router;