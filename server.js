const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage config for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'latest.jpg'); // Overwrite each time
  }
});

const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ message: 'Image uploaded successfully' });
});

// Endpoint to get image URL
app.get('/latest-image', (req, res) => {
  const imagePath = path.join(__dirname, 'uploads', 'latest.jpg');
  if (fs.existsSync(imagePath)) {
    res.json({ imageUrl: `http://localhost:${PORT}/uploads/latest.jpg` });
  } else {
    res.status(404).json({ error: 'No image found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
