import mongoose from "mongoose"

const dbConnection= async()=>{
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
}   

export default dbConnection;