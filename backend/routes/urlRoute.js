const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/urlModel');

// POST /api/url/shorten - Create a short URL
router.post('/shorten', async (req, res) => {
    let { originalUrl } = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Ensure original URL includes protocol
    if (!originalUrl.match(/^https?:\/\//)) {
        originalUrl = `http://${originalUrl}`;
    }

    // Validate original URL
    if (validUrl.isUri(originalUrl)) {
        try {
            let url = await Url.findOne({ originalUrl });

            if (url) {
                // URL already exists
                return res.json({ shortUrl: url.shortUrl }); // Return existing short URL
            } else {
                // Generate a new short URL
                const urlCode = shortid.generate();
                const shortUrl = `${baseUrl}/${urlCode}`;

                url = new Url({
                    originalUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                });
                
                await url.save();
                res.json({ shortUrl, urlCode }); // Return the newly created short URL
            }
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    } else {
        // Invalid original URL
        res.status(400).json('Invalid original URL');
        console.log('invalid url')
    }
});


// GET /:code - Redirect to the original URL
router.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code });

        if (url) {
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});


// Test route
router.get('/', (req, res) => {
    res.send('Server is running properly on the specified port!');
});

module.exports = router;
