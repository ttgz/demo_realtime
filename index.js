// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // Thay thế cho body-parser.json()
app.use(express.urlencoded({ extended: true })); // Thay thế cho body-parser.urlencoded()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Lắng nghe kết nối từ client
io.on('connection', (socket) => {
    console.log('Client đã kết nối');
    // Gửi dữ liệu giả lập mỗi 1 giây
  
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    console.log('Dữ liệu từ thiết bị:', data);

    // Gửi realtime tới Web
    io.emit('device-data', data);

    res.status(200).send('OK');
});

server.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});
