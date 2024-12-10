const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// Cấu hình multer để lưu hình ảnh vào thư mục 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Thư mục lưu trữ
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file dựa trên thời gian
    },
});

const upload = multer({ storage: storage });

// Tạo endpoint để upload hình ảnh
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ imageUrl: `http://localhost:${port}/uploads/${req.file.filename}` });
});

// Cung cấp thư mục uploads để truy cập hình ảnh
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});