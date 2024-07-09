import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCludinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"

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
   
   const avatarLocalPath = req.files?.avatar[0]?.path;  // avatar[0] because it is an array of objects
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
      $set: { refreshToken: undefined }
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

   const incomingRefreshToken = req.cookies?.refreshToken;
   if(!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

   const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
   const user = await User.findById(decodedToken?._id);
   if(!user) throw new ApiError(401, "Invalid refresh token");

   if( incomingRefreshToken !== user.refreshToken) throw new ApiError(401, "Refresh token is expired");

   const {accessToken , newRefreshToken} = await generateAccessAndRefreshToken(user._id);
   
   user.refreshToken = refreshToken;
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

} )
export {registerUser, loginUser, logoutUser, refreshAccessToken
}