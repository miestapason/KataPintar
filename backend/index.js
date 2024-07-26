const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, KataPintar!');
});

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Hantar mesej kepada klien yang baru disambungkan
    socket.emit('message', 'Selamat datang ke permainan KataPintar!');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
