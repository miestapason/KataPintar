// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://katapintar.onrender.com'); // URL backend anda yang betul

const App = () => {
  const [wordToGuess, setWordToGuess] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [gameStatus, setGameStatus] = useState('ongoing');
  const [currentGuess, setCurrentGuess] = useState('');

  useEffect(() => {
    socket.on('update', ({ wordToGuess, guessedLetters, remainingAttempts, gameStatus }) => {
      setWordToGuess(wordToGuess);
      setGuessedLetters(guessedLetters);
      setRemainingAttempts(remainingAttempts);
      setGameStatus(gameStatus || 'ongoing');
    });

    return () => socket.off('update');
  }, []);

  const handleGuess = () => {
    if (currentGuess) {
      socket.emit('guess', currentGuess.toUpperCase());
      setCurrentGuess('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div>
      <h1>Permainan Katapintar</h1>
      <p>Perkataan: {wordToGuess.split('').map(letter => (guessedLetters.includes(letter) ? letter : '_')).join(' ')}</p>
      <p>Huruf Diteka: {guessedLetters.join(', ')}</p>
      <p>Baki Percubaan: {remainingAttempts}</p>
      <p>Status Permainan: {gameStatus === 'won' ? 'Menang!' : gameStatus === 'lost' ? 'Kalah' : 'Sedang Berlangsung'}</p>
      <input 
        type="text" 
        value={currentGuess} 
        onChange={(e) => setCurrentGuess(e.target.value)} 
        maxLength={1} 
        id="guessInput" 
        name="guessInput" 
        onKeyPress={handleKeyPress} 
      />
      <button onClick={handleGuess} disabled={gameStatus !== 'ongoing'}>Teka</button>
    </div>
  );
};

export default App;
