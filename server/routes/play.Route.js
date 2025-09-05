const express = require('express');
const router = express.Router();
const { getVideoDetails, getVideoStream } = require('../controllers/play.Controller');

// Get video details for playing
router.get('/:id', getVideoDetails);

// Get video stream/trailer URL
router.get('/:id/stream', getVideoStream);

module.exports = router;
