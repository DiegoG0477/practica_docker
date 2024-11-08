import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const response = await fetch('http://docker-backend:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      setMessage(data.message);
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '8px' }}>Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default App
