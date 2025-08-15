import mongoose, {isValidObjectId} from "mongoose"
import  {Playlist }from "../models/playlist.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name){
        throw new ApiError(400, "name is required for playlist")
    }
    const result = await Playlist.create({
        title: name,
        description:description || " ",
        owner: req.user._id
    })

    return res.status(200).json(
        new ApiResponse(200, result, "playlist created successfully")
    )

    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "invalid request")
    }
    const playlistDetail = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from:"playlists",
                localField: "_id", // in user
                foreignField: "owner", // playlist model
                as:"UserPlaylist",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            title:1,
                            description:1,
                            video:1

                        }
                    }
                ]
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, playlistDetail, "fetched succesfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId){
        throw new ApiError(400, "invalid playlist id")
    }
    const result = await Playlist.aggregate([
    {
        $match: {
            _id: new mongoose.Types.ObjectId(playlistId)
        }
    },
    {
        $lookup: {
            from: "videoos",
            localField: "videos",
            foreignField: "_id",
            as: "videos"
        }
    },
    {
        $project: {
            name: 1,
            description: 1,
            videos: { title: 1, duration: 1 }, // only include these from videos
            createdBy: 1
        }
    }
]);

return res.status(200).json( new ApiResponse(200, result[0], "data fetch succesfully"))

    // const result = await playlist.findById(playlistId)
    // return res.status(200).json(new ApiResponse(200, result, "Playlsit fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!playlistId || !isValidObjectId(playlistId))
    {
        throw new ApiError(400, "invalid playlist id ")
    }
    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    const isVideoExist = await Video.find({_id:videoId})
    if(!isVideoExist){
        throw new ApiError(400, "no video exists")

    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,{
        $addToSet:{
            videos: videoId
        }
    },{
        new:true
    })

    return res.status(200).json( new ApiResponse(200,updatePlaylist, "Playlist has been updated"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!playlistId || isValidObjectId(playlistId) || isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist or video id")
    }

    const RemoveVideo = await Playlist.findByIdAndUpdate(playlistId, {   // can not use findbyidanddelete because it will delter whole file or playlist
        $pull:{
            videos: videoId
        }
    }, {
        new: true
    })
    if (!RemoveVideo) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(new ApiResponse(200, RemoveVideo, "Video has been deleted successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(401, "Invalid reqquest for playlist")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    return res.status(200).json( new ApiResponse(200, {} , "Playlist has been successfully deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    



    // ✅ Validate ObjectId
    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // ✅ Ensure at least one field is provided
    if (!name && !description) {
        throw new ApiError(400, "At least one field (name or description) is required to update");
    }

    // ✅ Update playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,{

            $set:{
                title: name,
                description
            }

        },
            
        { new: true, runValidators: true } // return updated doc & run schema validations
    );

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"));



})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
