import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user?._id;
    //TODO: create playlist
    if (!name) throw new ApiError(400, "Playlist name is required.");
    if (!userId) throw new ApiError(401, "Unauthorized Request.");
    const newPlaylist = await Playlist.create({
        name,
        description: description || "",
        owner: userId,
    });
    if (!newPlaylist)
        throw new ApiError(500, "Error while creating new Playlist");
    return res
        .status(200)
        .json(
            new ApiResponse(200, newPlaylist, "Playlist Created Successfully")
        );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists
    if (!userId) throw new ApiError(500, "UserId is required.");
    if (!req.user?._id) throw new ApiError(401, "Unauthorized Request.");

    const allPlaylists = await Playlist.find({ owner: userId });
    if (!allPlaylists?.length) throw new ApiError(404, "No Playlist Found");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                allPlaylists,
                "All Playlist found successfully"
            )
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id
    if (!playlistId) throw new ApiError(500, "UserId is required.");
    if (!req.user?._id) throw new ApiError(401, "Unauthorized Request.");

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "No Saved Playlist Found");

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist found successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!playlistId || !videoId)
        throw new ApiError(500, "PlaylistId or videoId is missing");
    if (!req.user?._id) throw new ApiError(401, "Unauthorized Request.");

    const playlist = await Playlist.findById(playlistId);

    if(!playlist.videos.includes(videoId)){
        playlist.videos.push(videoId);
    }
    else{
      throw new ApiError(400, "Video Already Exists" )
    }
    const newPlaylist = await playlist.save();

    if (!newPlaylist)
        throw new ApiError(
            500,
            "Something went ewrong while saving the video."
        );
    return res.status(200).json(new ApiResponse(200, newPlaylist, "Video is added to the playlist successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
    if (!playlistId || !videoId)
        throw new ApiError(500, "PlaylistId or videoId is missing");
    if (!req.user?._id) throw new ApiError(401, "Unauthorized Request.");

    const playlist = await Playlist.findById(playlistId);
    playlist.videos = playlist.videos.filter((e) => e === videoId);
    const newPlaylist = await playlist.save();
    if (!newPlaylist)
        throw new ApiError(
            500,
            "Something went ewrong while deleting the video."
        );
    return res
        .status(200)
        .json(new ApiResponse(200, newPlaylist, "Video is deleted from the playlist successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist
    if (!playlistId )
        throw new ApiError(500, "PlaylistId is missing");
    if (!req.user?._id) throw new ApiError(401, "Unauthorized Request.");
    const deletedPlaylist = await Playlist.deleteOne({_id: playlistId})
    if (!deletedPlaylist)
        throw new ApiError(
            500,
            "Something went ewrong while deleting the playlist."
        );
    return res
        .status(200)
        .json(new ApiResponse(200, deletedPlaylist, "Playlist is deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist
    if (!playlistId )
        throw new ApiError(500, "PlaylistId is missing");
    if (!req.user?._id) throw new ApiError(401, "Unauthorized Request.");
    if (!name) throw new ApiError(400, "Playlist name is required.");

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId , 
        {
            $set:{
                name,
                 description: description || "",
            }
        }, {new: true}
    )
    if (!updatedPlaylist)
        throw new ApiError(
            500,
            "Something went ewrong while updating the playlist."
        );
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist details is updated successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
