// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Set up Express and HTTP
const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('✅ VLC Sync Server is running');
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`👤 User connected: ${socket.id}`);

  // Join a specific room
  socket.on('join-room', ({ room, username }) => {
    if (!room) return;

    socket.join(room);
    console.log(`➡️ User ${username || socket.id} joined room ${room}`);

    // Broadcast to room that someone joined
    socket.to(room).emit('chat-message', {
      username: 'System',
      message: `${username || 'A user'} joined the room.`,
    });
  });

  // VLC commands scoped to room
  socket.on('vlc-command', (data) => {
    const { room, command, username } = data;
    if (!room) {
      return console.warn(`⚠️ Command without a room from ${socket.id}. Ignored.`);
    }
    console.log(`🔁 ${command} from ${username || socket.id} in room ${room}`);
    socket.to(room).emit('vlc-command', data); // send to other clients in room
  });

  // Chat messages scoped to room
  socket.on('chat-message', (data) => {
    const { room, username, message } = data;
    if (!room) {
      return console.warn(`⚠️ Chat without a room from ${socket.id}. Ignored.`);
    }
    console.log(`💬 Chat from ${username || socket.id} in room ${room}: ${message}`);
    socket.to(room).emit('chat-message', { username, message }); // send to other clients
  });

  // User disconnected
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Listen on dynamic port for Render or default to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});