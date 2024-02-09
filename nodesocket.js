const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on('connection', (socket) => {
  try {
    socket.on('join', (username) => {
      let id = "123";
      socket.join(id);
      console.log(`${username} joined the global chat`);
    });

    socket.on('joined', (username) => {
      socket.to('123').emit('users', username);
    });

    socket.on('send_message', (data) => {
      console.log(`GLOBAL CHAT - ${data.message}`);
      socket.to(data.id).emit('receive_message', data.message);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  } catch (error) {
    console.log(error);
  }

});


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
