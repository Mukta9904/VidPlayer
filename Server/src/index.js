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
import { createClient } from "redis";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { Video } from "./models/video.model.js";
import fs from "fs";

dotenv.config({
    path: "./.env"
})
export const redisClient = createClient({
    socket: {
      host: "localhost", // Use localhost if Redis is on your machine
      port: 6379, // Default Redis port
    },
  });
  
  redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
  });
  
  try {
    await redisClient.connect();
    console.log("Connected to Redis!");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Server is running at port", process.env.PORT);
    })
})
.catch((err)=>{
  console.log("MongoDb Connection error : ", err);
})

async function saveVideoUrl(){
   while(true){
    const videoUrl = await redisClient.lPop("readyQueue");
    if(videoUrl){
        const { lessonId, status, videoPath } = JSON.parse(videoUrl);
        if(lessonId){
            try {
                const video = await Video.findOneAndUpdate(
                    { videoFile: lessonId },
                    {
                        $set: {
                            uploadStatus: status,
                            isPublished: status === "completed",
                        }
                    } ,{
                      new: true
                  }
                )
                console.log("Video updated", video);
                fs.unlinkSync(videoPath)
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        await new Promise((resolve)=>setTimeout(resolve, 10000));
    }
   }
}

saveVideoUrl().catch(err=>console.log(err));