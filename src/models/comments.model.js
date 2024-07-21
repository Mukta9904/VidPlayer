import mongoose, {Schema} from "mongoose";

const commentsSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    video: {
         type: Schema.Types.ObjectId,
         ref: "Video"
    }
}, {timestamps :true})

export const Comments = mongoose.model("Comments", commentsSchema )