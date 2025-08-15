// require('dotenv').config({path: "./db"}) kyuki code mein consitency nahi hai
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

/*
this is basic approach to connect database

import express from "express";

const app = express();


// use of try and catch or promise because to handle error ans use async and await
(async () => {
    try {

      await mongoose.connect(`${process.env.mongodb_uri}/${DB_NAME}`) //connect database 

      app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)});
        
    } catch (error) {

        console.error("error connecting to MongoDB:", error);

        throw error;
        
    }
})()
    */
