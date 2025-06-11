// const { Server } = require('socket.io');
// const express = require('express');
// const http = require('http');
// const path = require('path'); // Make sure path is imported

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// const PORT = 3000;

// // --- IMPORTANT PATH CHANGE HERE ---
// // Define the absolute path to your 'app' directory
// const appDirPath = '/Users/anushka/vlc-sync-app'; // Explicitly define the absolute path

// // Serve static files from the 'app' directory
// app.use(express.static(appDirPath));

// // Serve index.html specifically for the root path
// app.get('/', (req, res) => {
//   res.sendFile(path.join(appDirPath, 'index.html'));
// });
// // --- END IMPORTANT PATH CHANGE ---

// console.log(`Socket.IO server running at http://localhost:${PORT}`);

// io.on('connection', (socket) => {
//   console.log('👤 A user connected:', socket.id);

//   socket.on('vlc-command', (data) => {
//     console.log('Got command:', data.command);
//     // Broadcast the command to all other connected clients
//     socket.broadcast.emit('vlc-command', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`HTTP and Socket.IO server running at http://localhost:${PORT}`);
// });


// server.js
const { Server } = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve a simple status page
app.get('/', (req, res) => {
  res.send('✅ VLC Sync Server is running!');
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('👤 A user connected:', socket.id);

  socket.on('vlc-command', (data) => {
    console.log('🔁 Command received:', data.command);
    socket.broadcast.emit('vlc-command', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Dynamic port for Replit or localhost fallback
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
