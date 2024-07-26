const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://katapintar-frontend.onrender.com', // URL frontend anda
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }
});

// Gunakan cors untuk semua permintaan HTTP
app.use(cors({
  origin: 'https://katapintar-frontend.onrender.com', // URL frontend anda
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Hidangkan fail statik dari direktori public
app.use(express.static(path.join(__dirname, 'public')));

// Laluan untuk URL akar
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New client connected');

  // Hantar mesej ujian sebaik sahaja disambungkan
  socket.emit('message', 'Hello from server');

  // Tambah lagi mesej setiap beberapa saat
  setInterval(() => {
    const message = `Server time: ${new Date().toLocaleTimeString()}`;
    console.log('Sending message:', message);
    socket.emit('message', message);
  }, 5000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));
