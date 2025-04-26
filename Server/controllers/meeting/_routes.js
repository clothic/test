const express = require('express');
const meeting = require('./meeting');
const auth = require('../../middelwares/auth');

const router = express.Router();

// Create a new meeting
router.post('/', auth, meeting.add);

// Get all meetings
router.get('/', auth, meeting.index);

// Get a specific meeting
router.get('/:id', auth, meeting.view);

// Update a meeting
router.put('/:id', auth, meeting.edit);

// Delete a meeting
router.delete('/:id', auth, meeting.deleteData);

// Delete multiple meetings
router.post('/deleteMany', auth, meeting.deleteMany);

module.exports = router