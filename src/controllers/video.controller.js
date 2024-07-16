import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { deleteFromCloudinary, uploadOnCludinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query , sortBy = "createdAt", sortType = "des", userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
    const videos = await Video.aggregate([
        {
         $match: {
            title: {
               $regex: query || "",
               $options: 'i'
            },
            isPublished: true,
         }
        },
        // pagination as per sort and limit 
        {
          $sort: {
            [sortBy]: sortType === 'asc' ? 1 : -1,
          },
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        },
        {  // find the owner from videos and only get their necessary fields 
            $lookup: {
                from: "users",
                localField:"owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                $first: "$owner"
                }
            }
            
        }
    ])


   if(!videos?.length) throw new ApiError (404, "No Videos found")
    res.status(200)
.json( new ApiResponse(200, videos , "Videos found successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    const userId = req.user?._id;
    if(!userId) throw new ApiError(401, "Unauthorized Request")
    // TODO: get video, upload to cloudinary, create video
    if(!title) throw new ApiError(400, "Video title is required.")

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if( !videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "Video or thumbnail is missing.")
    } 

    const videoFile = await uploadOnCludinary(videoLocalPath);
    const thumbnail = await uploadOnCludinary(thumbnailLocalPath);

    if(!videoFile || !thumbnail) {
        throw new ApiError(500, "Something went wrong while uploading on Cloudinary");
    }

    const uploadedVideo = await Video.create({
        videoFile: videoFile.url,
        thumbNail: thumbnail.url,
        title ,
        description: description || "",
        duration: videoFile.duration,
        isPublished: true,
        owner: userId
     })

     if(!uploadedVideo) throw new ApiError(500, "Something went wrong while saving video data")
     return res.status(200)
    .json( new ApiResponse(
        200 , uploadedVideo, "Video Uploaded and Published Successfully"
    ))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId) throw new ApiError(500, "Video Id is missing");
    console.log(videoId);
    const video = await Video.findById(videoId);
    
    return res.status(200).json(new ApiResponse(200, video, "Video Successfully fetched"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!videoId) throw new ApiError(500, "Video Id is missing");

    const { title, description } = req.body;
    if(!title) throw new ApiError(400, "Video title is required.");

    const thumbnailLocalPath = req.file?.thumbnail.path;
    if( !thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is missing.");
    }
    const thumbnail = await uploadOnCludinary(thumbnailLocalPath);

    if(!thumbnail) throw new ApiError(500, "Something went wrong while uploading on Cloudinary");
    
    const video = await Video.findByIdAndUpdate(videoId,
        {$set: {
            thumbnail: thumbnail.url,
            title,
            description: description || "",
        }},
        { new: true }
    )

    if(!video) throw new ApiError(500, "Something went wrong while updating video data")
    return res.status(200)
    .json( new ApiResponse(200 , video, "Video details Updated Successfully"));
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!videoId) throw new ApiError(500, "Video Id is missing");
    
    const deletedVideo = await Video.findOneAndDelete({_id: videoId});
    if(!deleteVideo) throw new ApiError(404 , "Video not found");
    
    const deletedVideoUrl = deleteVideo.videoFile;
    await deleteFromCloudinary(deletedVideoUrl);
    
    
     res.status(200)
     .json( new ApiResponse( 200 , deletedVideo, "Video Deleted Successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId) throw new ApiError(500, "Video Id is missing");

    const video = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                isPublished: !isPublished 
            }
        },
        {new: true}
    )

    if(!video) throw new ApiError(404 , "Not found" )

    return res.status(200)
    .json(new ApiResponse(200 , video,  "Pusblished status changed Successfully"))
    
})

// const showSearchedVideos = asyncHandler(async(req, res)=>{
//     const searchString = req.query.search;
//     if(!searchString) throw new ApiError(404, "Search string not found");

//     const sanitizedSearchString = searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

//     const searchedVideos =  await Video.find({
//         title: {
//             $regex: sanitizedSearchString,
//             $options: 'i'
//         }
//     })

//     if(!searchedVideos) throw new ApiError(
//         404, "Video not found"
//     )
//     return res.status(200)
//     .json(200 , searchedVideos , "Vedios Found Successfully")
//  })
export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
//     showSearchedVideos,
}