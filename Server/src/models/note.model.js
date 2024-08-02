import mongoose , {Schema} from "mongoose";

const noteSchema = new Schema({
       video:{
            type: Schema.Types.ObjectId,
            ref: "Video"
       },
       owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
       } ,
       content: {
        type: String,
        require: true
       }
})

export const Note = mongoose.model("Note" , noteSchema)