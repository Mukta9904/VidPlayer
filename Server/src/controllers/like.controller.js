import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: toggle like on video
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!videoId) throw new ApiError(401, "videoId is missing");

    const likedVideo = await Like.findOneAndDelete({
        video: videoId,
        likedBy: userId,
    });
    if (!likedVideo) {
        const newLike = await Like.create({
            video: videoId,
            likedBy: userId,
        });
        if (!newLike)
            throw new ApiError(
                500,
                "Something went wrong while creating the like"
            );

        return res
            .status(200)
            .json(new ApiResponse(200, newLike, "Video is liked successfully"));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideo,
                "Video is removed from liked successfully"
            )
        );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!commentId) throw new ApiError(401, "commentId is missing");

    const likedComment = await Like.findOneAndDelete({
        comment: commentId,
        likedBy: userId,
    });
    if (!likedComment) {
        const newLike = await Like.create({
            comment: commentId,
            likedBy: userId,
        });
        if (!newLike)
            throw new ApiError(
                500,
                "Something went wrong while creating the like"
            );

        return res
            .status(200)
            .json(
                new ApiResponse(200, newLike, "Comment is liked successfully")
            );
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedComment,
                "Comment is removed from liked successfully"
            )
        );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!tweetId) throw new ApiError(401, "tweetId is missing");

    const likedTweet = await Like.findOneAndDelete({
        tweet: tweetId,
        likedBy: userId,
    });
    if (!likedTweet) {
        const newLike = await Like.create({
            tweet: tweetId,
            likedBy: userId,
        });
        if (!newLike)
            throw new ApiError(
                500,
                "Something went wrong while creating the like"
            );

        return res
            .status(200)
            .json(new ApiResponse(200, newLike, "Tweet is liked successfully"));
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedTweet,
                "Tweet is removed from liked successfully"
            )
        );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $ne: null },
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        email: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            ownerDetails: {
                                $first: "$ownerDetails",
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                videoDetails: {
                    $first: "$videoDetails",
                },
            },
        },
    ]);

    if (!likedVideos?.length) throw new ApiError(404, "No liked videos found");
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideos,
                "All Liked Videos Found Successfully"
            )
        );
});

const getVideoLikes = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const { videoId } = req.params;
    if (!videoId) throw new ApiError(401, "videoId is missing");
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    const likes = await Video.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(videoId) },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $addFields: {
                likes: {
                    $size: "$likes",
                },
            },
        },
    ]);

    if (!likes?.length) throw new ApiError(404, "likes can't be found");
    return res
        .status(200)
        .json(
            new ApiResponse(200, likes[0]?.likes, "Liked Found Successfully")
        );
});
const getCommentLikes = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const { commentId } = req.params;
    if (!commentId) throw new ApiError(401, "commentId is missing");
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    const likes = await Comment.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(commentId) },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes",
            },
        },
        {
            $addFields: {
                likes: {
                    $size: "$likes",
                },
            },
        },
    ]);

    if (!likes?.length) throw new ApiError(404, "likes can't be found");
    return res
        .status(200)
        .json(
            new ApiResponse(200, likes[0]?.likes, "Liked Found Successfully")
        );
});
const getTweetLikes = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const { tweetId } = req.params;
    if (!tweetId) throw new ApiError(401, "tweetId is missing");
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    const likes = await Tweet.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(tweetId) },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
            },
        },
        {
            $addFields: {
                likes: {
                    $size: "$likes",
                },
            },
        },
    ]);

    if (!likes?.length) throw new ApiError(404, "likes can't be found");
    return res
        .status(200)
        .json(
            new ApiResponse(200, likes[0]?.likes, "Liked Found Successfully")
        );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getVideoLikes,
    getCommentLikes,
    getTweetLikes,
};
