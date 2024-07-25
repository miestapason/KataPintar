import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('https://katapintar.onrender.com/')
            .then(response => {
                setMessage(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
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
