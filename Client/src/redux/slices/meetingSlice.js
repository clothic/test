import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi, postApi, putApi, deleteApi } from '../../services/api';

// Fetch all meetings
export const fetchMeetingData = createAsyncThunk('fetchMeetingData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/meeting' : `api/meeting/?createBy=${user._id}`);
        return response;
    } catch (error) {
        throw error;
    }
});

// Fetch a single meeting by ID
export const fetchMeetingById = createAsyncThunk('fetchMeetingById', async (id) => {
    try {
        const response = await getApi(`api/meeting/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
});

// Create a new meeting
export const createMeeting = createAsyncThunk('createMeeting', async (meetingData) => {
    try {
        const response = await postApi('api/meeting', meetingData);
        return response;
    } catch (error) {
        throw error;
    }
});

// Update an existing meeting
export const updateMeeting = createAsyncThunk('updateMeeting', async ({ id, meetingData }) => {
    try {
        const response = await putApi(`api/meeting/${id}`, meetingData);
        return response;
    } catch (error) {
        throw error;
    }
});

// Delete a meeting
export const deleteMeeting = createAsyncThunk('deleteMeeting', async (id) => {
    try {
        const response = await deleteApi(`api/meeting/`, id);
        return response;
    } catch (error) {
        throw error;
    }
});

const meetingSlice = createSlice({
    name: 'meetingData',
    initialState: {
        data: [],
        currentMeeting: null,
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            // Fetch all meetings
            .addCase(fetchMeetingData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMeetingData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchMeetingData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            })

            // Fetch meeting by ID
            .addCase(fetchMeetingById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMeetingById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentMeeting = action.payload.data;
                state.error = "";
            })
            .addCase(fetchMeetingById.rejected, (state, action) => {
                state.isLoading = false;
                state.currentMeeting = null;
                state.error = action.error.message;
            })

            // Create meeting
            .addCase(createMeeting.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createMeeting.fulfilled, (state) => {
                state.isLoading = false;
                state.error = "";
            })
            .addCase(createMeeting.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Update meeting
            .addCase(updateMeeting.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateMeeting.fulfilled, (state) => {
                state.isLoading = false;
                state.error = "";
            })
            .addCase(updateMeeting.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Delete meeting
            .addCase(deleteMeeting.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteMeeting.fulfilled, (state) => {
                state.isLoading = false;
                state.error = "";
            })
            .addCase(deleteMeeting.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default meetingSlice.reducer;