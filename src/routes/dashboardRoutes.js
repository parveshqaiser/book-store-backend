
import express from "express";
import authentication from "../middleware/auth.js";
import BookSchema from "../model/bookSchema.js";
import OrderSchema from "../model/orderSchema..js";
import UserSchema from "../model/userSchema.js";

const router = express.Router();

router.get("/allUsers",authentication, async(req, res)=>{

    try {
        let alUsers = await UserSchema.find().select("name email number");

        res.status(200).json({message : `${alUsers.length>0}`? "Users Found" : "No Users" , data : alUsers, success : true})
    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.get("/getTotalBooks", authentication, async(req, res)=>{

    try {
        let allBooks = await BookSchema.countDocuments();

        res.status(200).json({ message: allBooks > 0 ? "Books Found" : "No Books", data : allBooks,success : true})
    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.get("/getTotalQuantitySold", authentication, async(req, res)=>{

    try {
        let query = [
        {
            $match: {
                orderStatus : "Delivered"
            }
        },
        {
            $group: {
                _id: null,
                totalQtySold : {
                    $sum : "$orderedQuantity"
                }         
            }
        },
        {
            $project: {
                _id : 0,
                totalQtySold :1
            }
        }];

        let totalQtySold = await OrderSchema.aggregate(query);
    
        res.status(200).json({ message: "Details Fetched", data : totalQtySold,success : true})
    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
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

            let getSalesDetails = await OrderSchema.aggregate(query);

            res.status(200).json({data : getSalesDetails , message :`${getSalesDetails.length > 0}` ? "Data Fetched" : "No Data Found"});

    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.get("/sales/category/wise", authentication, async(req, res)=>{

    try {
        let query = [
        {
            $match: {
                orderStatus: "Delivered"
            }
        },
        {
            $unwind: "$product"
        },
        {
            $lookup: {
                from: "books",
                localField: "product.productId",
                foreignField: "_id",
                as: "bookDetails",
                pipeline: [{
                    $project: {
                        category: 1,
                        _id: 0
                    }
                }]
            }
        },
        {
            $unwind: "$bookDetails"
        },
        {
            $group: {
                _id: "$bookDetails.category",
                totalItem: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                _id: 0,
                genre: "$_id",
                totalItem: 1
            }
        }];

        let categoryWiseSales = await OrderSchema.aggregate(query);

        res.status(200).json({data : categoryWiseSales || [] ,message : "Data Fetched" , success : true})
        
    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});

router.get("/revenue/monthly/wise", authentication, async(req, res)=>{

    try {
        let query = [
        {
            $match: {
                createdAt : {
                    $gte : new Date("2025-01-01"),$lt: new Date( "2025-12-31")
                }
            }
        },
        {
            $group: {
            _id: {
                year: { 
                    $year: "$createdAt"
                },
                month: { 
                    $month: "$createdAt"
                } 
            },
                totalSales: { $sum: "$totalPrice" },
                totalOrders: { $sum: 1 }
            }
        },
        {
            $project: {
                _id : 0,
                yearDetails : "$_id",
                totalSales :1,
                totalOrders :1      
            }
        }];


        let monthlySales = await OrderSchema.aggregate(query);

        res.status(200).json({data : monthlySales , message : "Data Fetched", success : true});

    } catch (error) {
        console.log("err", error);
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
});


export default router;