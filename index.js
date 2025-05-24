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
    setInterval(() => {
        // Giả lập dữ liệu từ thiết bị
        const data = {
            "sali": Math.random().toFixed(2) * 100, // Giả lập dữ liệu nồng độ muối
            "temp": (Math.random() * 30 + 20).toFixed(2), // Giả lập nhiệt độ
            "do": (Math.random() * 10).toFixed(2), // Giả lập nồng độ oxy hòa tan
            "ph": (Math.random() * 14).toFixed(2) // Giả lập độ pH
        };
        io.emit('device-data', data);    // Gửi dữ liệu giả lập mỗi 1 giây
    }, 1000); // 1000ms = 1 giây
    io.emit('device-data', data);    // Gửi dữ liệu giả lập mỗi 1 giây
  
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    console.log('Dữ liệu từ thiết bị:', data);
    if(!data.sali)
        data.sali = '...';
    if(!data.temp)
        data.temp = '...';
    if(!data.do)
        data.do = '...';
    if(!data.ph)
        data.ph = '...';
    // Gửi realtime tới Web
    io.emit('device-data', data);

    res.status(200).send('OK');
});

server.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});
