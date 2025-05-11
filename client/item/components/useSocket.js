// Replace your current socket.io client connection with this

import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
  withCredentials: true,
  path: '/socket.io/', // Must match server path
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

export default socket;