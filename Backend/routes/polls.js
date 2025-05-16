const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

// Get all polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single poll
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new poll
router.post('/', async (req, res) => {
  const poll = new Poll({
    question: req.body.question,
    options: req.body.options.map(option => ({ text: option }))
  });

  try {
    const newPoll = await poll.save();
    res.status(201).json(newPoll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Vote on a poll
router.patch('/:id/vote', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const optionIndex = req.body.optionIndex;
    if (optionIndex >= 0 && optionIndex < poll.options.length) {
      poll.options[optionIndex].votes += 1;
      const updatedPoll = await poll.save();
      res.json(updatedPoll);
    } else {
      res.status(400).json({ message: 'Invalid option index' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 