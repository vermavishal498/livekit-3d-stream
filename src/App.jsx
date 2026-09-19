import React, { useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import Scene3D from './components/Scene3D';

// Replace with your actual LiveKit WebSocket URL
const LIVEKIT_URL = 'wss://virtual-conferencing-0jl28510.livekit.cloud';

export default function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);

  const joinRoom = async (e) => {
    e.preventDefault();
    if (!username.trim()) return alert('Please enter a username');

    try {
      const res = await fetch(`http://localhost:3001/api/token?room=main-room&username=${encodeURIComponent(username)}`);
      const data = await res.json();
      setToken(data.token);
      setJoined(true);
    } catch (err) {
      console.error('Failed to fetch token:', err);
      alert('Failed to connect to backend token server. Make sure server.js is running.');
    }
  };

  if (!joined) {
    return (
      <div className="join-container">
        <form onSubmit={joinRoom} style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <h2>Join 3D Virtual Conference Room</h2>
          <input 
            type="text" 
            placeholder="Enter Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff', fontSize: '16px', outline: 'none' }}
          />
          <button 
            type="submit"
            style={{ padding: '10px 24px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Join Room
          </button>
        </form>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      data-lk-theme="default"
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      {/* 3D Scene containing VideoPanel3D, ChatPanel3D, and Controls3D */}
      <Scene3D />
      
      {/* Essential component to play incoming participant voice/audio */}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}