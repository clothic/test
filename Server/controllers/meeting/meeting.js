const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');
const User = require('../../model/schema/user');
const Contact = require('../../model/schema/contact');
const Lead = require('../../model/schema/lead');

// Create a new meeting
const add = async (req, res) => {
    try {
        const meeting = new MeetingHistory(req.body);
        await meeting.save();
        res.status(200).json({ message: "Meeting created successfully", meeting });
    } catch (error) {
        console.error("Error creating meeting:", error);
        res.status(500).json({ error: "Failed to create meeting" });
    }
}

// Get all meetings with optional filtering
const index = async (req, res) => {
    try {
        const query = { ...req.query, deleted: false };

        // Fetch meetings with populated references
        const meetings = await MeetingHistory.find(query)
            .populate('createBy', 'firstName lastName username')
            .populate('attendes', 'firstName lastName')
            .populate('attendesLead', 'leadName')
            .sort({ timestamp: -1 });

        // Format the response data
        const formattedMeetings = meetings.map(meeting => {
            return {
                ...meeting._doc,
                createdByName: meeting.createBy ? `${meeting.createBy.firstName} ${meeting.createBy.lastName}` : 'Unknown',
                timestamp: new Date(meeting.timestamp).toLocaleString()
            };
        });

        res.status(200).json(formattedMeetings);
    } catch (error) {
        console.error("Error fetching meetings:", error);
        res.status(500).json({ error: "Failed to fetch meetings" });
    }
}

// Get a specific meeting by ID
const view = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findOne({
            _id: req.params.id,
            deleted: false
        })
            .populate('createBy', 'firstName lastName username')
            .populate('attendes', 'firstName lastName email phoneNumber')
            .populate('attendesLead', 'leadName email phoneNumber');

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json(meeting);
    } catch (error) {
        console.error("Error fetching meeting:", error);
        res.status(500).json({ error: "Failed to fetch meeting" });
    }
}

// Update a meeting
const edit = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json({ message: "Meeting updated successfully", meeting });
    } catch (error) {
        console.error("Error updating meeting:", error);
        res.status(500).json({ error: "Failed to update meeting" });
    }
}

// Soft delete a meeting
const deleteData = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findByIdAndUpdate(
            req.params.id,
            { $set: { deleted: true } },
            { new: true }
        );

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json({ message: "Meeting deleted successfully" });
    } catch (error) {
        console.error("Error deleting meeting:", error);
        res.status(500).json({ error: "Failed to delete meeting" });
    }
}

// Soft delete multiple meetings
const deleteMany = async (req, res) => {
    try {
        const result = await MeetingHistory.updateMany(
            { _id: { $in: req.body } },
            { $set: { deleted: true } }
        );

        res.status(200).json({
            message: "Meetings deleted successfully",
            deletedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Error deleting meetings:", error);
        res.status(500).json({ error: "Failed to delete meetings" });
    }
}

module.exports = { add, index, view, edit, deleteData, deleteMany }