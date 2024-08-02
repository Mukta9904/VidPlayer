import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
async function connectDB() {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`MongoDB connected successfully!! DB Host: ${connectionInstance.connection.host}`);
       const connection = mongoose.connection
       // for some reason it's not running
    //    connection.on('connected', () => console.log(`MongoDB Connected successfully`))
    //    connection.on('error',(err)=>{
    //        console.log('Connection to db was failed', err);
    //        process.exit()
    //    })
       
    } catch (error) {
        console.log("Mongodb connection fail", error);
        process.exit(1);
    }
}

export default connectDB;