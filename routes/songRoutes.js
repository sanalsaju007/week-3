const express = require('express');
const multer = require('multer');
const Song = require('../models/songModels');
const router = express.Router();

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null, 'uploads/');
    },
    filename: (req,file,cb) => {
        cb(null,`${Date.now()}-${file.originalname}`);
    }

});
// Add a new song
const upload = multer({storage});

router.post('/api/songs',upload.single('file'), async (req, res) => {
    try {
        const newSong = new Song({
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            genre: req.body.genre,
            releaseDate: req.body.releaseDate,
            filePath: req.file.path,    

        });
        await newSong.save();
        res.status(201).json({ message: 'Song added successfully!' });
    } catch (error) {
        console.error('Error adding song:', error);
        res.status(500).json({ message: 'Failed to add song.' });
    }
});

// Get all songs
router.get('/api/songs', async (req, res) => {
    try {
        const songs = await Song.find();
        res.status(200).json(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ message: 'Failed to fetch songs.' });
    }
});

module.exports = router;
