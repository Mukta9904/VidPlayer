import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { deleteFromCloudinary, uploadOnCludinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId)=> {
   try {
      const user = await User.findById(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken }

   } catch (error) {
      throw new ApiError(500, "Something went wrong while generating the access and refresh token");
   }
}

const registerUser = asyncHandler(async (req, res)=>{
  //taking the fields from the request body
  //validation - not empty
  //checking if the username or email is already exists or not 
  //get the files path , check for avatar
  //encrypt the password, initialize the watch history
  //upload the avatar and cover image into cloudinary and fetch the connection string
  //create a new user
  //check for user creation
  //remove password and refresh tiken field
  //return response
  const {fullName, email, username, password} = req.body
  if(
   [fullName, email, password, username].some((fields)=>
       fields.trim() === "" )
    ){
        throw new ApiError(400, "All the fields are required.");
    }
    if(!email.includes("@")) throw new ApiError(400, "Please enter a valid email");

    const existedUser = await User.findOne({$or:[{username},{email}]});
   if(existedUser){
        throw new ApiError(409, "User with username or email already exist.");
   }
   // console.log(req.files?.avatar);
   let avatarLocalPath;
   if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
      avatarLocalPath = req.files.avatar[0].path;
   }  // avatar[0] because it is an array of objects
   let coverImageLocalPath ;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImageLocalPath = req.files.coverImage[0].path;
   }
   
   if(!avatarLocalPath) throw new ApiError(400, "Avatar file is required");  
   
   const avatar = await uploadOnCludinary(avatarLocalPath);
   // console.log(avatar);
   const coverImage = await uploadOnCludinary(coverImageLocalPath);

   if(!avatar) throw new ApiError(400, "Avatar file is required");
   
   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
   })

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
  )
   
   if(!createdUser) throw new ApiError(500, "Something went wrong while creating the user");
     
   return res.status(201).json(
      new ApiResponse(200, createdUser, "User Registered Successfully") 
   );
 
})

const loginUser = asyncHandler(async (req, res)=>{
   //get the login credentials data from the user
   //validate credentials
   // verify them through db
   // Access and refresh tokens 
   // send cookies
   //return a response
   const {email, password} = req.body;
   if(
      [email, password].some((fields)=>
          fields.trim() === "" )
       ){
           throw new ApiError(400, "All the fields are required.");
       }
   if(!email.includes("@")) throw new ApiError(400, "Please enter a valid email");

   const user = await User.findOne({email})
   if(!user) throw new ApiError(404, "User not found");
       
   const correctPassword = await user.isCorrectPassword(password);
   if(!correctPassword) throw new ApiError(401, "Invalid user credentials");
       
   const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id);
   // console.log(accessToken, refreshToken);
   user.refreshToken = refreshToken;
   const loggedInUser = await user.save({ validateBeforeSave: false })
   loggedInUser.password = "";
   loggedInUser.refreshToken = "";
   const options = {
      httpOnly: true,
      secure: true
   }
   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreashToken", refreshToken, options)
   .json(
      new ApiResponse(
         200,
         {user: loggedInUser, accessToken, refreshToken},
         "User Logged In Successfully"
      )
   )
})

const logoutUser = asyncHandler( async (req, res)=>{
   // clear the cookies
   // delete the refreshToken
   await User.findByIdAndUpdate(req.user._id,{
      // $set: { refreshToken: undefined }
      $unset: { refreshToken: 1 }  // it removes the field 
    },{ new : true}
);

const options = {
   httpOnly: true,
   secure: true
}
return res.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json( new ApiResponse( 200,{},"User logged out" ))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{

  try {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if(!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");
 
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if(!user) throw new ApiError(401, "Invalid refresh token");
 
    if( incomingRefreshToken !== user.refreshToken) throw new ApiError(401, "Refresh token is expired");
 
    const {accessToken , newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    
    user.refreshToken = newRefreshToken;
     await user.save({ validateBeforeSave: false })
    
    const options = {
       httpOnly: true,
       secure: true
    }
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreashToken", newRefreshToken, options)
    .json(
       new ApiResponse(
          200,
          {accessToken, refreshToken: newRefreshToken},
          "Access token created Successfully"
       )
    )
  } catch (error) {
   throw new  ApiError(401, "Unauthorized request");
  }
})

const changeCurrentPassword = asyncHandler(async (req, res)=>{
   try {
      const {oldPassword, newPassword} = req.body ;
      const user = await User.findById(req.user?._id);
      if(!user) throw new ApiError(404 , "User not found");

      const isPasswordCorrect = await user.isCorrectPassword(oldPassword);
      if(!isPasswordCorrect) throw new ApiError(401, "Invalid password");

      user.password = newPassword ;
      await user.save({validateBeforeSave: false})
      return res.status(200)
      .json(
         new ApiResponse(200,{}, "Password Changed Successfully")
      )
   } catch (error) {
      throw new  ApiError(401, "Unauthorized request");
   }
})

const getCurrentUser = asyncHandler( async (req, res)=>{
   return res.status(200)
   .json( new ApiResponse(200 , req.user , "Current user fetched Successfully"))
})

const updateAccountDetails = asyncHandler( async (req, res)=>{
   const {fullName , email } = req.body;

    if(!fullName || !email) {
      throw new ApiError(400 , "All fields are required");
    }

   const user = await User.findByIdAndUpdate(req.user?._id ,
      { $set: {fullName , email}},
      {new: true}
    ).select("-password -refreshToken");
   return res.status(200)
   .json( new ApiResponse(200 , user , "Account details updated Successfully"))
})

const updateUserAvatar = asyncHandler( async (req, res)=>{
   const previousImagePath = req.user?.avatar;
   if(previousImagePath !== "") {await deleteFromCloudinary(previousImagePath)}

   const avatarLocalPath = req.file?.path;
   if(!avatarLocalPath) throw new ApiError(400 , "Avatar is required");

   const avatar = await uploadOnCludinary(avatarLocalPath);
   if(!avatar.url) throw new ApiError(500 , "Something went wrong when uploading the avatar");

   const user = await User.findByIdAndUpdate(req.user?._id,
          { $set: {avatar: avatar.url}},
          {new: true}
  )
   return res.status(200)
          .json( new ApiResponse(200 , user, "Avatar updated Successfully"));
})

const updateUserCoverImage = asyncHandler( async (req, res)=>{
   const previousImagePath = req.user?.coverImage;
   if(previousImagePath !== "") {await deleteFromCloudinary(previousImagePath)}

   const coverImageLocalPath = req.file?.path;
   if(!coverImageLocalPath) throw new ApiError(400 , "Cover Image is required");

   const coverImage = await uploadOnCludinary(coverImageLocalPath);
   if(!coverImage.url) throw new ApiError(500 , "Something went wrong when uploading the Cover Image");

   const user = await User.findByIdAndUpdate(req.user?._id,
          { $set: {coverImage: coverImage.url}},
          {new: true}
  )
   return res.status(200)
          .json( new ApiResponse(200 , user, "Cover Image updated Successfully"));
})

const getUserChannelProfile = asyncHandler( async (req, res)=>{
    const {username} = req.params;
    if(!username?.trim()) throw new ApiError(400 , "Username is missing");

    const channel = await User.aggregate([
      // stage 1 :-> finding the channel from all the users
      {  
         $match: { username: username?.toLowerCase() }
      },
      // stage 2 :-> Searching in the subscription db to find the subscribers and subscribedTo of the channel
      {
         $lookup: {
               from: "subscriptions",
               localField: "_id",
               foreignField: "channel",
               as: "subscribers"
            }
      },
      {
            $lookup: {
               from: "subscriptions",
               localField: "_id",
               foreignField: "subscriber",
               as: "subscribedTo"
            },   
      },
      // stage 3 :-> get the subscriber count and subscribedTo count and also get if the current user has subscribed the channel or not 
      {
         $addFields: {
            subscriberCount : { $size: "$subscribers"},
            channelSubscribedCount: { $size: "$subscribedTo" },
            isSubscribed: { 
               $cond: { 
                  if: { $in: [req.user?._id , "$subscribers.subscriber"] },
                  then: true,
                  else: false,
                  }
                }
            }
         },
         // stage 4:-> Only choose the necessary fields from the channel 
         {
            $project: {
               fullName: 1,
               username: 1,
               email: 1,
               subscriberCount: 1,
               channelSubscribedCount: 1,
               isSubscribed: 1,
               avatar: 1,
               coverImage:1, 
            }
         }                                      
    ])

    console.log(channel);

    if(!channel?.length ) throw new ApiError(404, "Channel doesn't exist");

    return res.status(200)
    .json( new ApiResponse(
      200, channel[0]  , "Channel details found Successfully"  
    ))
})

const getUserWatchHistory = asyncHandler( async(req, res)=>{
   
   const user = await User.aggregate([
      // stage 1: -> get the user
      {
          $match: {
              _id: new mongoose.Types.ObjectId(req.user?._id)
          }
      },
      // stage 2: -> get the videos which are in watchHistory of users collection
      {
          $lookup: {
              from: "videos", 
              localField: "watchHistory",
              foreignField: "_id",
              as: "watchHistory",
              // 1sub-stage: -> Get the owner details from the users collection
              pipeline: [
                  {
                      $lookup: {
                          from: "users",
                          localField: "owner",
                          foreignField: "_id",
                          as: "owner",
                          // 2sub-stage: -> Get the required fields of owner from users collection 
                          pipeline: [
                              {
                                  $project: {
                                      fullName: 1,
                                      username: 1,
                                      avatar: 1
                                  }
                              }
                          ]
                      }
                  },
                  // We should only provide the object as a data instead of the array of object. So override the array owner to an object owner.
                  {
                      $addFields: {
                          owner: {
                              $first: "$owner"
                          }
                      }
                  }
              ]
          }
      }
  ]);
  
  console.log(user);
   if(!user) throw new ApiError( 404, "User not found")
      
   return res.status(200)
      .json(
         new ApiResponse(
            200, user[0].wathchHistory , "Watch history fetched Successfully"
         )
      )
})

export {registerUser,
        loginUser,
        logoutUser, 
        refreshAccessToken,
        changeCurrentPassword,
        getCurrentUser,
        updateAccountDetails,
        updateUserAvatar,
        updateUserCoverImage,
        getUserChannelProfile,
        getUserWatchHistory 
}