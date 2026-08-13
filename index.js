import express  from "express";
import cors from "cors";
import dbConnection from "./src/database/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import webHookRoutes from "./src/routes/webhookRoutes.js";

import dotenv from "dotenv";
import parser from "cookie-parser";

const app = express();
dotenv.config();
// app.use("/", webHookRoutes);
app.use(express.json());
app.use(parser());

// app.use(cors({
//     origin : ["http://localhost:5173","https://book-store-backend-tpz8.onrender.com"],
//     credentials : true,
// }));

app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174"],
    methods : ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use("/", authRoutes);
app.use("/", bookRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/", orderRoutes);
app.use("/", dashboardRoutes);
app.use("/", paymentRoutes);
app.use("/", messageRoutes);

app.get("/", (req, res)=>{
    res.status(200).json({message : "Hello from book store", success : true})
});

app.get("/test", (req, res)=>{
    res.status(200).json({message : "Hello from book store : just testing api routes", success : true})
});

dbConnection().then(()=>{
    console.log("DB connected");

    app.listen(7070,() => {
        console.log('Server is running on http://localhost:7070');
    });
}).catch((err)=>{
    console.log("Error connecting Database",err );
    process.exit(1);
});

