import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle Like for Video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Video like removed"));
    }

    await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    res.status(201).json(new ApiResponse(201, null, "Video liked"));
});

// Toggle Like for Comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Comment like removed"));
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id
    });

    res.status(201).json(new ApiResponse(201, null, "Comment liked"));
});

// Toggle Like for Tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Tweet like removed"));
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    });

    res.status(201).json(new ApiResponse(201, null, "Tweet liked"));
});

// Get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.find({ 
        likedBy: req.user._id, 
        video: { $exists: true } 
    }).populate("video");

    res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
