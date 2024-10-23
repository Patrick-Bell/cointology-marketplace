const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Ensure the 'uploads' folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Specify the folder to store uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize multer middleware (accepting any file type)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Max 5 MB
});

module.exports = upload;
