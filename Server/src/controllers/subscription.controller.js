import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const userId = req.user?._id;
  // TODO: toggle subscription

  if (!channelId) throw new ApiError(500, "ChannelId is missing");
  if (!userId) throw new ApiError(401, "Unauthorized request");

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (existingSubscription) {
    // Subscription exists, delete it
    await Subscription.deleteOne({
      _id: existingSubscription._id,
    });
    return res.status(200).json({
      success: true,
      subscribed: false,
      message: "Subscription removed successfully",
    });
  } else {
    // Subscription doesn't exist, create a new one
    const newSubscription = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
    if (!newSubscription) {
      throw new ApiError(500, "Subscription creation failed");
    }
    return res.status(200).json({
      success: true,
      subscribed: true,
      message: "Subscription added successfully",
    });
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;
  if (!channelId) throw new ApiError(500, "ChannelId is missing");
  if (!userId)
    throw new ApiError(401, "Unauthorized request: userId is missing");

  if ((await userId.toString()) !== channelId)
    throw new ApiError(401, "Unauthorized request");
  const subscribers = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(channelId) },
    },
    {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
         pipeline:[
           {
             $lookup: {
               from: "users",
               localField: "subscriber",
               foreignField: "_id",
               as: "subscriberDetails",
               pipeline: [
                 {
                   $project: {
                     fullName: 1,
                     email: 1,
                     avatar: 1,
                     username: 1,
                   }
                 }
               ]
               
             }
           },
           {
             $addFields: {
               subscriberDetails:{
                 $first: "$subscriberDetails"
               }
             }
           }
         ]
        },
      },
  ]);

  if (!subscribers?.length) throw new ApiError(404, "No subscribers found");
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers[0]?.subscribers, "All Subscribers Found Successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const userId = req.user?._id;
  console.log(userId);
  console.log(subscriberId);
  if (!subscriberId) throw new ApiError(500, "SubscriberId is missing");
  if (!userId)
    throw new ApiError(401, "Unauthorized request: userId is missing");

  if (subscriberId !== (await userId.toString()))
    throw new ApiError(401, "unauthorized request");

  const subscribedChannels = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(subscriberId) },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "channel",
              foreignField: "_id",
              as: "channelDetails",
              pipeline: [
                {
                  $project: {
                    email: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "subscriptions",
              localField: "channel",
              foreignField: "channel",
              as: "channelSubscribers",
            },
          },
          {
            $addFields: {
              channelDetails: {
                $first: "$channelDetails",
              },
              channelSubscribers: {
                $size: "$channelSubscribers",
              },
            },
          },
        ],
      },
    },
  ]);

  if (!subscribedChannels?.length)
    throw new ApiError(404, "No subscribed channel found");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels[0]?.subscribedTo,
        "All Subscribed Channels Found Successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
