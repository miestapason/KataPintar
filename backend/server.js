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
let players = [];
let currentTurnIndex = 0;

const updateGameState = () => {
  io.emit('update', {
    wordToGuess: wordToGuess,
    guessedLetters: guessedLetters,
    remainingAttempts: remainingAttempts,
    currentTurn: players[currentTurnIndex],
    gameStatus: remainingAttempts <= 0 ? 'lost' : guessedLetters.length === wordToGuess.length ? 'won' : 'ongoing'
  });
};

io.on('connection', (socket) => {
  console.log('New client connected');

  // Tambah pemain baru
  players.push(socket.id);
  updateGameState();

  socket.on('guess', (letter) => {
    if (players[currentTurnIndex] !== socket.id) {
      // Bukan giliran pemain ini
      return;
    }

    console.log('Received guess:', letter);

    if (!guessedLetters.includes(letter) && wordToGuess.includes(letter)) {
      guessedLetters.push(letter);
    } else {
      remainingAttempts -= 1;
    }

    console.log('Updated game state:', { wordToGuess, guessedLetters, remainingAttempts });

    // Tukar giliran ke pemain seterusnya
    currentTurnIndex = (currentTurnIndex + 1) % players.length;

    updateGameState();
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Keluarkan pemain dari senarai
    players = players.filter(player => player !== socket.id);
    if (currentTurnIndex >= players.length) {
      currentTurnIndex = 0; // Setkan giliran ke pemain pertama jika perlu
    }
    updateGameState();
  });
});

server.listen(4000, () => {
  console.log('Listening on port 4000');
});
