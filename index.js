import express  from "express";
import cors from "cors";
import dbConnection from "./src/database/db.js";

import bookRoutes from "./src/routes/bookRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";

import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin :"",
    credentials : true,
}));

app.use("/", bookRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/", orderRoutes);

app.get("/", (req, res)=>{
    res.status(200).json({message : "Hello from book store"})
});

dbConnection().then(()=>{
    console.log("DB connected");

    app.listen(7070, ()=>{
        console.log("Server started at http://127.0.0.1:7070")
    })
}).catch((err)=>{
    console.log("Error connecting Database",err );
})

