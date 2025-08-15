import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        video:{
            type: Schema.Types.ObjectId,
            ref: "videoo",
        },
        comment:{
            type: Schema.Types.ObjectId,
            ref: "comment",
        },
        tweet:{
            type: Schema.Types.ObjectId,
            ref: "Tweet",
        },
        LikedBy:{
            type: Schema.Types.ObjectId,
            ref: "Usser",
        }
    },
    {
        timestamps: true
    }
)


export const Like = mongoose.model("Like", likeSchema)