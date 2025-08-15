import express from "express";

import cookieParser from "cookie-parser";

import cors from "cors";

const app = express();

app.use(
  cors({
    //use is set middleware

    origin: process.env.cors_origin,
  }),
);

// data can be recive in many ways like urlencoded, json , document etc to handle this we set middleware using .use

app.use(express.json({ limit: "16Kb" })); // .use is middleware which ask what have to taken

app.use(express.urlencoded({ extended: true, limit: "16Kb" })); //extended is use to nesting url at advanced levels

app.use(express.static("public"));

app.use(cookieParser());

// import router here for seggregiation

import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declration

app.use("/api/v1/users", userRouter); // url is formed in way such like http:// localhost:8000/api/v1/users and next page locations
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

export { app };
