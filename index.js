// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS enabled
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (safe for now, limit later)
    methods: ["GET", "POST"]
  }
});

// Simple status endpoint
app.get('/', (req, res) => {
  res.send('✅ VLC Sync Server is running');
});

// Handle connections
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  socket.on('vlc-command', (data) => {
    console.log('🔁 Command received:', data.command);
    socket.broadcast.emit('vlc-command', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Use dynamic port for Render or default to 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);

// // Setup Socket.IO with CORS enabled
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Allow all origins for now (can restrict in future)
//     methods: ["GET", "POST"]
//   }
// });

// // Simple status endpoint
// app.get('/', (req, res) => {
//   res.send('VLC Sync Server is running');
// });

// // Handle connections
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // User joins a room
//   socket.on('join-room', (roomCode) => {
//     socket.join(roomCode);
//     console.log(`User ${socket.id} joined room ${roomCode}`);
//   });

//   // Handle incoming VLC command and broadcast within the room
//   socket.on('vlc-command', (data) => {
//     const { room, command, ...rest } = data;

//     if (!room) {
//       console.warn(`Command without room from ${socket.id}. Ignored.`);
//       return;
//     }

//     console.log(`Command '${command}' from ${socket.id} to room '${room}'`);
//     socket.to(room).emit('vlc-command', { command, ...rest });
//   });

//   // Handle disconnect
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Use dynamic port for Render or default to 3000 locally
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
