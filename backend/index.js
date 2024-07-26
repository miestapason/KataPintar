const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Gunakan cors
app.use(cors({
  origin: 'https://katapintar-frontend.onrender.com', // URL frontend anda
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));
