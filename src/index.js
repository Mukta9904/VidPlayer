// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express"

// const app = express();

// ;(async ()=>{
//    try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error)=>{
//         console.error(error);
//         throw error;
//     })
//    } catch (error) {
//     console.error(error);
//      throw error;
//    }
// })()
// require(dotenv).config({path: "./env"})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Server is running at port", process.env.PORT);
    })
})
.catch((err)=>{
  console.log("MongoDb Connection error : ", err);
})