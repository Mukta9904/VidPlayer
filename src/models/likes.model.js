import mongoose, {Schema} from "mongoose";

const likesSchema = new Schema({
    comment:{
        type: Schema.Types.ObjectId,
        ref:"Comments",
    },
    video:{
        type: Schema.Types.ObjectId,
        ref:"Video",
    },
    tweet:{
        type: Schema.Types.ObjectId,
        ref:"Tweets",
    },
    likedBy:{ 
        type: Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps :true})

export default Likes = mongoose.model("Likes", likesSchema)