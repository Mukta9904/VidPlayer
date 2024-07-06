import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCludinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res)=>{
  //datbase connection
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

export {registerUser}