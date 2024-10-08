import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    watchHistory :[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
    }],
    username: {
       type: String,
       required: true,
       unique: true,
       trim: true,
       lowercase: true,
       index: true
    },
    email: {
       type: String,
       required: true,
       unique: true,
       trim: true,
       lowercase: true,
     },
     password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
     },
     fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
     },
     avatar: {
        type: String,   
        required: true,
     },
     coverImage: {
        type: String,
     },
     refreshToken:{
        type: String,
     }

    
}, {timestamps: true})

userSchema.pre("save", async function(next){             // encrypting the password using bcrypt 
   if(!this.isModified("password")) return next();      // don't modify the password when its not changed
   this.password = await bcrypt.hash(this.password, 10);     // hash(password, rounds/salt)
   next();
})
userSchema.methods.isCorrectPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = async function() {
    return jwt.sign(
        {
         _id: this._id,
         username: this.username,
         email: this.email,
         fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}
userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign(
        {
         _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
}

export const User = mongoose.model("User", userSchema);  