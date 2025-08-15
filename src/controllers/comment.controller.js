import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Get all comments for a video (with pagination)
 */
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const comments = await Comment.find({ video: videoId })
        .populate("user", "name avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const totalComments = await Comment.countDocuments({ video: videoId });

    res.status(200).json(
        new ApiResponse(200, {
            comments,
            totalComments,
            currentPage: Number(page),
            totalPages: Math.ceil(totalComments / limit),
        }, "Comments fetched successfully")
    );
});

/**
 * Add a comment to a video
 */
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!text || text.trim() === "") {
        throw new ApiError(400, "Comment text is required");
    }

    const comment = await Comment.create({
        video: videoId,
        user: req.user._id,
        text: text.trim()
    });

    res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    );
});

/**
 * Update a comment
 */
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    if (!text || text.trim() === "") {
        throw new ApiError(400, "Updated comment text is required");
    }

    const comment = await Comment.findOneAndUpdate(
        { _id: commentId, user: req.user._id }, // only owner can update
        { text: text.trim() },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or not authorized");
    }

    res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
});

/**
 * Delete a comment
 */
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        user: req.user._id // Only owner can delete
    });

    if (!comment) {
        throw new ApiError(404, "Comment not found or not authorized");
    }

    res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    );
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};
