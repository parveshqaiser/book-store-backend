

import express from "express";
import authentication from "../middleware/auth.js";
import BookSchema from "../model/bookSchema.js";
import OrderSchema from "../model/orderSchema..js";
import UserSchema from "../model/userSchema.js";

const router = express.Router();

// for user
router.post("/order/book", authentication,async(req,res)=>{

    try {
		let {name, email, number,address,totalPrice, orderedQuantity, products} = req.body;

		let book;
		// below is to modify the qty in book schema
		for(let item of products)
		{
			book= await BookSchema.findById({_id : item.productId});

			if(!book){
				return  res.status(400).json({message: "Invalid Book ID", success : false});
			}

			if(book.quantity < orderedQuantity)
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

        if(!placeOrder){
            return res.status(400).json({message : "Failed To place Order", success : false});
        }

        res.status(200).json({message : "Order Placed Successfully", success : true , data : placeOrder});
               
    } catch (error) {
        console.log("some error in ordering book", error);
		res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.get("/admin/orders/pending", authentication, async(req, res)=>{

	try {
		let query = [
			{
				$match: {
					orderStatus: "Pending",
				}
			},
			{
				$lookup: {
					from: "books",
					localField: "product.productId",
					foreignField: "_id",
					as : "bookDetails",
					pipeline :[{
						$project : {
							title: 1,
							author: 1,
							publisher :1,
							language :1,
							"_id": 0
					}}],
				}
			},
		];

        let userOrders = await OrderSchema.aggregate(query);

        if(userOrders.length ==0)
        {
            return res.status(200).json({message : "No New Orders Found", success:false , data : []});
        }

        res.status(200).json({message : "Order Details Fetched", data :userOrders, success : true});
    }catch (error) {
        console.log("some error in fetching pending order", error);
        res.status(500).json({ message: "some error in fetching order details" });
	}
});

router.post("/admin/update/order/status/:id", authentication, async(req, res)=>{

    try {
		let {orderStatus} = req.body;
		let orderId = req.params.id;

		if(!["Delivered"].includes(orderStatus))
		{
			return res.status(400).json({message : "Invalid Status", success : false});
		}

		let orderDetails = await OrderSchema.findById({_id:orderId, orderStatus:"Pending"});
		if(!orderDetails){
			return res.status(400).json({message : "Order Details Doesn't Exist", success : false});
		}

		orderDetails.orderStatus= orderStatus;
		await orderDetails.save();

        res.status(200).json({message : "Order Status Changed to Delivered", success:true, orderDetails})
    } catch (error) {
        console.log("error in updating order status", error);
        res.status(500).json({ message: "error in updating order status" });
    }
});

router.get("/admin/orders/delivered", authentication, async(req, res)=>{

	try {
		let query = [
			{
				$match: {
					orderStatus: "Delivered",
				}
			},
			{
				$lookup: {
					from: "books",
					localField: "product.productId",
					foreignField: "_id",
					as : "bookDetails",
					pipeline :[{
						$project : {
							title: 1,
							author: 1,
							publisher :1,
							category :1,
							pages :1,
							language:1,
							coverPic:1,
							"_id": 0
					}}],
				}
			},
		];

        let deliverOrders = await OrderSchema.aggregate(query);

        if(deliverOrders.length ==0)
        {
            return res.status(200).json({message : "No New Orders Found", success:true , data : []});
        }

        res.status(200).json({message : "Delivered Orders Fetched", data :deliverOrders, success : true});
    }catch (error) {
        console.log("some error in fetching delivered order", error);
        res.status(500).json({ message: "ome error in fetching delivered order"});
	}
});

router.get("/user/orders/pending",authentication, async(req, res)=>{
	try {
		let id = req.id;

		let user = await UserSchema.findOne({_id:id});
		let query = [
			{
				$match: {
					email: user.email,
					orderStatus : "Pending",
				}
			},
			{
				$lookup: {
					from: "books",
					localField: "product.productId",
					foreignField: "_id",
					as : "bookDetails",
					pipeline :[{
						$project : {
							title: 1,
							author: 1,
							publisher :1,
							language :1,
							coverPic :1,
							"_id": 0
					}}],
				}
			},
		];

		let userOrders = await OrderSchema.aggregate(query);


		res.status(200).json({message :`${userOrders.length ==0}` ? "No Pending Orders" : "Orders Fetched",data :userOrders, success : true});
	} catch (error) {
		console.log("err ", error);
		res.status(500).json({ message: "Server Error", error: error.message, success: false });
	}
});

router.get("/user/orders/delivered",authentication, async(req, res)=>{
	try {
		let id = req.id;
		let user = await UserSchema.findOne({_id:id});

		let query = [
			{
				$match: {
					email: user.email,
					orderStatus : "Delivered",
				}
			},
			{
				$lookup: {
					from: "books",
					localField: "product.productId",
					foreignField: "_id",
					as : "bookDetails",
					pipeline :[{
						$project : {
							title: 1,
							author: 1,
							publisher :1,
							language :1,
							coverPic :1,
							"_id": 0
					}}],
				}
			},
		];

		let userOrders = await OrderSchema.aggregate(query);
		res.status(200).json({
			message: userOrders.length > 0 ? "Orders Fetched" : "No Data",
			data: userOrders,
			success: true,
		});
	} catch (error) {
		console.log("err ", error);
		res.status(500).json({ message: "Server Error", error: error.message, success: false });
	}
});

export default router;