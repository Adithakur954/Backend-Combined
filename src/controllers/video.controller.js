import mongoose, {isValidObjectId} from "mongoose"
import { Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import  ApiError from "../utils/ApiError.js"
import  ApiResponse from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import uploadOnCloudinary from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query , sortBy = "createdAt" , sortType = "desc" , userId } = req.query;

    const sortOrder = sortType === "asc"?1:-1;

    const sortstage = {
        $sort:{
            [sortBy]:sortOrder
        }
    }

    const pageNumber = Number(page);
const limitNumber = Number(limit);

//    const matchValue = await Video.aggreagte([
//     {
//         $match:{
//             isPublisherd:true
//         }
//     },
//     sortstage
//    ]) this is also true but we will write in professional way for readablity

const matchStage = {
    isPublished : true
}
 if(userId){
    matchStage.owner = userId
 }

 const pipeline = [
    {$match : matchStage},
    sortstage,
    {$skip : (pageNumber - 1) * limitNumber},
{$limit: limitNumber}
 ]

 const result = await Video.aggregate(pipeline)

 return res.status(200)
 .json(
    new ApiResponse(
        200, result, "Video are fetched successfully"
    )
 )

   
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
     if(!title){
        throw new ApiError(400, "Title is required")
     }

    const videoPath = req.files?.videoFile[0]?.path 
    const thumbnailPath = req.files?.thumbnail[0]?.path

    if(!videoPath || !thumbnailPath)
        {

        throw new ApiError(400, "No video found to upload")
    }

    const video = await uploadOnCloudinary(videoPath)
    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if(!video || !thumbnail){
        throw new ApiError(400, "Something went wrong while uploading video")
    }

    const result = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        owner: req.video?._id // assusming owner is authenicated
    })

    const uploadedVideo = await Video.findById(result._id)

    if(!uploadedVideo){
        throw new ApiError(400, "something went wrong")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200, uploadedVideo, "video has benn successfully uploaded"
        )
    )


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate("owner", "username email");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video found successfully")
    );
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const updateData = {};  //create an object and furhterm upldaying

    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const videoPath = req.files?.videoFile?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;

    if (videoPath) {
        const uploadedVideo = await uploadOnCloudinary(videoPath);
        if (!uploadedVideo) throw new ApiError(400, "Video upload failed");
        updateData.videoFile = uploadedVideo.url;
    }

    if (thumbnailPath) {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);
        if (!uploadedThumbnail) throw new ApiError(400, "Thumbnail upload failed");
        updateData.thumbnail = uploadedThumbnail.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, { new: true });

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
});
 //TODO: update video details like title, description, thumbnail ....... we can only get writeen data like id get from param



const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedVideo, "Video deleted successfully")
    );
});


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, `Video ${video.isPublished ? "published" : "unpublished"} successfully`)
    );
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
