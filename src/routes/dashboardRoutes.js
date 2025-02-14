
import express from "express";
import authentication from "../middleware/auth.js";
import BookSchema from "../model/bookSchema.js";
import OrderSchema from "../model/orderSchema..js";
import UserSchema from "../model/userSchema.js";

const router = express.Router();

// users that have registered in the application
router.get("/allUsers",authentication, async(req, res)=>{

    try {
        let getAllUsers = await UserSchema.find();

        res.status(200).json({data : getAllUsers.length || 0 })
    } catch (error) {
        console.log("some error in getting total users", error);
        res.status(500).json({ message: "some error in getting total users" });
    }
});

router.get("/getTotalBooks", authentication, async(req, res)=>{

    try {
        let getAllBooks = await BookSchema.find();

        res.status(200).json({data : getAllBooks.length || 0 })
    } catch (error) {
        console.log("some error in getting all books", error);
        res.status(500).json({ message: "some error in getting total books"});
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

        res.status(200).json({data : totalQtySold || []})
    } catch (error) {
        console.log("some error in total sold qty", error);
        res.status(500).json({ message: "some error in getting total sold qty"});
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

            res.status(200).json({data : getSalesDetails});

    } catch (error) {
         console.log("some error in getting total sales details", error);
         res.status(500).json({ message: "some error in getting sales details" });
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
                totalSales: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                _id: 0,
                genre: "$_id",
                totalSales: 1
            }
        }];

        let categoryWiseSales = await OrderSchema.aggregate(query);

        res.status(200).json({data :categoryWiseSales || []})
        
    } catch (error) {
        console.log("some error in getting all category wise book sales", error);
        res.status(500).json({ message: "some error in getting all category wise book sales"});
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

        res.status(200).json({data : monthlySales || []})

    } catch (error) {
        console.log("some error in getting monthly sales", error);
        res.status(500).json({ message: "some error in getting monthly sales"});
    }
});


export default router;