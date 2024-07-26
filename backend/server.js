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

app.use(cors({
  origin: 'https://katapintar-frontend.onrender.com', // URL frontend anda
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const wordToGuess = "SOMEBODY"; // Contoh perkataan teka-teki
let guessedLetters = []; // Simpan huruf yang diteka oleh pemain
let remainingAttempts = 6; // Bilangan percubaan yang tinggal

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.emit('update', { wordToGuess, guessedLetters, remainingAttempts });

  socket.on('guess', (letter) => {
    if (!guessedLetters.includes(letter)) {
      guessedLetters.push(letter);

      if (!wordToGuess.includes(letter)) {
        remainingAttempts -= 1;
      }

      const gameStatus = remainingAttempts > 0 ? 'ongoing' : 'lost';
      if (!wordToGuess.split('').some(l => !guessedLetters.includes(l))) {
        gameStatus = 'won';
      }

      io.emit('update', { wordToGuess, guessedLetters, remainingAttempts, gameStatus });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));
