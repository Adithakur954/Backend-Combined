import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body; // bhai dhyan de
    const {userId} = req.params;

    if(!content){
        throw new ApiError(401, "content is required for tweet")
    }
    if(!userId){
        throw new ApiError(401, "useris is required for tweet")
    }
    const userExisted = await Tweet.findbyId(userId)   // this findByID is only use for retreving the database not to create and change something


    if(!userExisted){
        throw new ApiError(400, "no usr found fot this to tweet")
    }

    const newTweet = await Tweet.create({   // written document aise bante hai
        content,
        owner: userId,
    })

    return res.status(200).
    json( new ApiResponse(
        200, newTweet, "tweet has been created"
    ))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId}= req.query
    if(!userId){
        throw new ApiError(400, "bad request no user is found ")
    }
    const result = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "tweeted", // abhi tak user mein tha tweet ke model mein deknh raha tha 
                pipeline:[
                    {
                        // ab mai tweet ke ander aa gaya hoon' toh ab mai tweet pe action or aggregation kar sakta hoon
                        $project:{
                            content: 1,
                            createdAt:1,
                            updatedAt:1
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200).json( new Apiresponse(200, result, "tweeted get succesfully"))

    // const tweetId = await User.findById(userId) // this is fetchinng user
    // if(!tweetId){
    //     throw new ApiError(400, " no tweet found for this user")
    // }
    // const page = parseInt(req.query.page) || 1
    // const limit = parseInt(req.query.limit) || 10;
    // const skip = (page-1)*limit;
    
    // const tweets = await Tweet.find({owner: userId}).sort({created:-1}).skip(skip).limit(limit) // this is the wayt o fetching tweet from userid

    // const totaltweets = await Tweet.countDocuments({owner: userId})

    //  return res.status(200).json(
    //     new ApiResponse(200, {
    //         totaltweets,
    //         page,
    //         tweets,
    //         totalPages: Math.ceil(totaltweets/limit)

    //     })
    //  )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweet} =  req.body

    const newTweet = await Tweet.findByIdAndUpdate(req.params.TweetId, {  //user is from auth middleware
        $set:{
            content:tweet
        }
    },{
        new:true
    })

    console.log(newTweet)

    return res.status(200).json(new ApiResponse(200, newTweet, "tweet has been updated"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {userId, tweetId} = req.params;

    if(!userId || !tweetId){
        throw new ApiError(400,"bad request userid and tweetid are required")
    }

    const tweet = await Tweet.findbyId(tweetId);

    if(!tweet){
        throw new ApiError(401, "no such tweet found")
    }

    if(tweet.owner.toString() !== userId)
    {
        throw new ApiError(401, "this tweet does not belong to you")
    }

    const result = await Tweet.findByIdAndDelete(tweetId)

    return res.status(200).json(
        new ApiResponse(200, {}, "tweet has been delete" )
    )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
