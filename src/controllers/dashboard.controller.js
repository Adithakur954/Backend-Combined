import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import ApiResponse  from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get Channel Stats
const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id; // assuming user is the channel owner

    // Total Videos
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Total Views
    const totalViewsAgg = await Video.aggregate([
        { $match: { owner: channelId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = totalViewsAgg.length > 0 ? totalViewsAgg[0].totalViews : 0;

    // Total Subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Total Likes (only for videos of this channel)
    const videoIds = await Video.find({ owner: channelId }).distinct("_id");
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalViews,
            totalSubscribers,
            totalLikes
        }, "Channel stats fetched successfully")
    );
});

// Get All Videos of a Channel
const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

    const videos = await Video.find({ owner: channelId })
        .sort({ createdAt: -1 })
        .populate("owner", "name avatar");

    res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    );
});

export {
    getChannelStats,
    getChannelVideos
};
