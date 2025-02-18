const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {}; // To store usernames for users

// home route
app.get('/', (req, res) => {
    res.send('Real-Time Collaboration Tool');
  });

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');
  
// Set username
socket.on('set-username', (username) => {
      users[socket.id] = username;
      io.emit('user-list', users); // Emit the updated user list
    });

// Handle typing event
socket.on('typing', () => {
    socket.broadcast.emit('typing', users[socket.id]);
});

  // Handle text changes
socket.on('text-change', (text) => {
    socket.broadcast.emit('text-change', text);
});

  // Handle disconnections
socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user-list', users); // Emit the updated user list
    console.log('User disconnected');
   });
});

// Start the server on port 5000
server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
  });