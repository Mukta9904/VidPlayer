import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Owner {
    fullname: string;
    avatar: string;
    username: string;
    _id: string;
}

interface Video {
    createdAt: string;
    title: string;
    description: string;
    videoFile: string;
    thumbNail: string;
    _id: string;
    owner: Owner;
    views: number;
    duration: number;
    isPublished: boolean;
}

interface VideoState {
    video: Video | null;
}

const initialState: VideoState = {
    video: null,
};

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setPlayedVideo(state, action: PayloadAction<Video>) {
            state.video = action.payload;
        },
        clearVideo(state) {
            state.video = null;
        },
    },
});

export const { setPlayedVideo, clearVideo } = videoSlice.actions;

export default videoSlice.reducer;