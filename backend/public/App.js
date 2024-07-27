const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import cors
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');

// Gunakan cors middleware
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('message', 'Hello from server');

  setInterval(() => {
    const serverTime = new Date().toLocaleTimeString();
    socket.emit('message', `Server time: ${serverTime}`);
  }, 5000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
