import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://katapintar.onrender.com'); // Gantikan dengan URL backend anda

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Menerima mesej dari server
        socket.on('message', (data) => {
            setMessage(data);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message');
        };
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Selamat Datang ke KataPintar</h1>
                <p>{message}</p>
            </header>
        </div>
    );
}

export default App;
