

const multer = require('multer');
const path = require('path');

const postStorage = multer.diskStorage({
    
    destination: (req, file, cb) => cb(null, 'uploads/posts'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const avatarStorage = multer.diskStorage({

    destination: (req, file, cb) => cb(null, 'uploads/avatars'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

module.exports = multer({ storage: postStorage });
module.exports.avatar = multer({ 

    storage: avatarStorage,
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});