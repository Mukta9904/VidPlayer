import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Note } from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const saveNote = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const {content} = req.body;
    console.log(content);
    const videoId = req.params?.videoId;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!content) throw new ApiError(400, "Note content is missing");
    if (!videoId) throw new ApiError(500, "VideoId is missing");

    const savedNote = await Note.create({
        video: videoId,
        owner: userId,
        content,
    });

    if (!savedNote)
        throw new ApiError(500, "Something went wrong when saving the note");
    return res
        .status(200)
        .json(new ApiResponse(200, savedNote, "Note Saved Successfully"));
});

const getNote = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const videoId = req.params?.videoId;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!videoId) throw new ApiError(500, "VideoId is missing");

    const note = await Note.findOne(
        {
            video: videoId,
            owner: userId,
        },
    );
    if (!note)
        throw new ApiError(500, "Something went wrong when getting the note");
    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note Fetched Successfully"));
});

const editNote = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const {content} = req.body;
    const videoId = req.params?.videoId;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!content) throw new ApiError(400, "Note content is missing");
    if (!videoId) throw new ApiError(500, "VideoId is missing");

    const editedNote = await Note.findOneAndUpdate(
        {
            video: videoId,
            owner: userId,
        },
        {
            $set: {
                content,
            },
        },{new: true}
    );

    if (!editedNote)
        throw new ApiError(500, "Something went wrong when editing the note");
    return res
        .status(200)
        .json(new ApiResponse(200, editedNote, "Note Edited Successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const videoId = req.params?.videoId;
    if (!userId) throw new ApiError(401, "Unauthorized request");
    if (!videoId) throw new ApiError(500, "VideoId is missing");

    const deletedNote = await Note.deleteOne({ video: videoId, owner: userId });

    if (!deletedNote)
        throw new ApiError(500, "Something went wrong when deleting the note");
    return res
        .status(200)
        .json(new ApiResponse(200, deletedNote, "Note Edited Successfully"));
});

export {
    saveNote,
    editNote,
    deleteNote,
    getNote
};
