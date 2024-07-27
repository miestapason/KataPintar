const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let wordToGuess = "HELLO";
let guessedLetters = [];
let remainingAttempts = 6;

const updateGameState = (socket) => {
  socket.emit('update', {
    wordToGuess: wordToGuess,
    guessedLetters: guessedLetters,
    remainingAttempts: remainingAttempts,
    gameStatus: remainingAttempts <= 0 ? 'lost' : guessedLetters.length === wordToGuess.length ? 'won' : 'ongoing'
  });
};

io.on('connection', (socket) => {
  console.log('New client connected');
  updateGameState(socket);

  socket.on('guess', (letter) => {
    console.log('Received guess:', letter);

    if (!guessedLetters.includes(letter) && wordToGuess.includes(letter)) {
      guessedLetters.push(letter);
    } else {
      remainingAttempts -= 1;
    }

    console.log('Updated game state:', { wordToGuess, guessedLetters, remainingAttempts });
    io.emit('update', {
      wordToGuess: wordToGuess,
      guessedLetters: guessedLetters,
      remainingAttempts: remainingAttempts,
      gameStatus: remainingAttempts <= 0 ? 'lost' : guessedLetters.length === wordToGuess.length ? 'won' : 'ongoing'
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Listening on port 4000');
});
