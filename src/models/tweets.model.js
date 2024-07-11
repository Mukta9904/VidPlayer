import mongoose, {Schema} from "mongoose";

const tweetsSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},{timestamps :true})

export default Tweets = mongoose.model("Tweets", tweetsSchema)