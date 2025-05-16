const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/voting_app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinPoll', (pollId) => {
    socket.join(pollId);
  });

  socket.on('vote', ({ pollId, updatedPoll }) => {
    io.to(pollId).emit('voteUpdate', updatedPoll);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
const pollRoutes = require('./routes/polls');
app.use('/api/polls', pollRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 