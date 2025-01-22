

import express from "express";
import authentication from "../middleware/auth.js";
import BookSchema from "../model/bookSchema.js";
import OrderSchema from "../model/orderSchema..js";

const router = express.Router();

router.post("/order/book/:id", authentication,async(req,res)=>{

     try {
          let bookId = req.params.id;
          let {name, email, number,address,totalPrice, orderedQuantity,price} = req.body;

          // console.log("req ", req.body);

          let book = await BookSchema.findById({_id : bookId});

          if(!book){
               return  res.status(400).json({message: "Invalid Book ID", success : false});
          }

          if(book.quantity <orderedQuantity)
          {
               return res.status(400).json({message: `Only ${book.quantity} books are available`,success: false});
          }

          let placeOrder = await OrderSchema.create({
               name,
               email,
               number,
               totalPrice :totalPrice,
               orderedQuantity,
               price,
               address : {
                    doorNo : address.doorNo,
                    city : address.city,
                    state : address.state,
                    pinCode : address.pinCode,
               },
               productId : [bookId]
          });

          console.log("placeOrder ", placeOrder);

          if(!placeOrder){
               return res.status(400).json({message : "Failed To place Order", success : true});
          }

          book.quantity -= orderedQuantity;
          book.quantity == 0 ? book.isAvailable = false : true,
          await book.save();

          res.status(200).json({message : "Order Placed Successfully", success : false});
               
     } catch (error) {
          console.log("some error in ordering book", error);
          // res.status(500).send("error " + error.message);
          res.status(500).json({ message: "Failed to create order" });
     }
});

export default router;