import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import  {Subscription}  from "../models/subscription.model.js"
import  ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user._id;   // maano ki mai logged in hoon aur user id meri hai aur channel id uski hai jiski channel mai dekh raha hoon
    // TODO: toggle subscription
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "no such channel founde")
    }
    const channel = await Subscription.findById(channelId);

    if(!channel){
        throw new ApiError(401, "No channel detail found")

    }
    // toh yaha pe check karenge ki uske subscriber list mein meri userid hai ki nahi yah phir mere channel list mein uski channel id hai yah nahi 

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    })

    if(existingSubscription){
        // if exists then unsubscribe
        await Subscription.findByIdAndDelete(existingSubscription._id)
        return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully"))
    }else{
        const newUser = await Subscription.create({
            subscriber: userId,
            channel: channelId
        });

        return res.status(200).json(new ApiResponse(200,{}, "subscribed succesfully"))
    }

})

// controller to return subscriber list of a channel ..... isme dusre log dekh rahe hai aur channel mera id hai toh yah jiska channel dekh rahe hai usk
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(401, "invalid channel id")
    }

    const subscriberCount = await Subscription.find({channel: channelId}).populate("subscriber", "username email avatar").exec()
     // aise document khojo jisme channel is equal to current channelid hai

     return res.status(200).json(new ApiResponse(200, {count:subscriber.length, subscriber}))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Innvalid subscriber id ")
    }
    const result = await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(subscriberId) // mention that there is only simple string in id have to convert with mongoose
            }
        },{
            $lookup:{
                from: "ussers",
                localField: "channel",
                foreignField: "_id",
                as:"SubscribedChannel",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            username:1,
                            fullname: 1,
                            avatar:1

                        }
                    }
                ]
            }
        }
    ])

    return res.status(200).json( new ApiResponse(200, result, "Subscribed channel fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}