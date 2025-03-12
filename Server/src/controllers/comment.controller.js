import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { log } from "console";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    
    if(!videoId) throw new ApiError(500 , "VideoId is missing")
    const comments = await Comment.aggregate([
       {
        $match: { video: new mongoose.Types.ObjectId(videoId) }
       },
       {
        $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "owner",
            as: "ownerDetails",
            pipeline: [
                {
                   $project: {
                        fullName: 1,
                        email: 1,
                        avatar: 1,
                        username: 1
                    }
                }
            ]
        }
       },
       {
         $addFields: {
            ownerDetails : {
                $first : "$ownerDetails"
            }
         }
       },
       {
        $sort: {
          createdAt: -1,
        },
        },
    ])
    
    return res.status(200)
    .json( new ApiResponse(200 , comments || [] , "Comments found successfully"))
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { content } = req.body;
    const { videoId } = req.params;
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!videoId || !content)
        throw new ApiError(400, "videoId or content is missing");
    const newComment = await Comment.create({
        content,
        owner: userId,
        video: videoId,
    });
    if (!newComment)
        throw new ApiError(
            500,
            "Something went wrong while saving the comment"
        );
    return res
        .status(200)
        .json(new ApiResponse(200, newComment, "Comment Added Successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId, content } = req.body;
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!commentId || !content)
        throw new ApiError(400, "commentId or content is missing");

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content,
            },
        },
        { new: true }
    );
    if (!updatedComment)
        throw new ApiError(
            500,
            "Something went wrong while updating the comment"
        );
    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedComment, "Commnet Updated Successfully")
        );
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.body;
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!commentId) throw new ApiError(400, "commentId or content is missing");

    const deletedComment = await Comment.deleteOne({ _id: commentId });
    if (!deletedComment)
        throw new ApiError(
            500,
            "Something went wrong while deleting the comment"
        );
    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedComment, "Commnet Deleted Successfully")
        );
});

export { getVideoComments, addComment, updateComment, deleteComment };