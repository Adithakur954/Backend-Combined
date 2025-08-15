import mongoose, { Schema } from "mongoose";


const playListSchema = new Schema (
    {

        name:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        video:[{   // video will be array
            type: Schema.Types.ObjectId,
            ref: "videoo",
        }],
        owner:{
            type: Schema.Types.ObjectId,
            ref: "Usser",
        },
    }, {
        timestamps: true
    }
)


export const Playlist = mongoose.model("playList", playListSchema)