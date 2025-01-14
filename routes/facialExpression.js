const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const canvas = require('canvas');
const faceapi = require('face-api.js');

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Load Face-API.js Models
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function loadModels() {
    try {
        const ssdPath = path.join(__dirname, '../models/ssd_mobilenetv1');
        const faceExpressionPath = path.join(__dirname, '../models/face_expression');

        console.log(`Loading models from: ${ssdPath} and ${faceExpressionPath}`);

        if (!fs.existsSync(ssdPath) || !fs.existsSync(faceExpressionPath)) {
            throw new Error('One or more model paths do not exist.');
        }

        // Load the models
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(ssdPath); // Face detection
        await faceapi.nets.faceExpressionNet.loadFromDisk(faceExpressionPath); // Emotion detection // Emotion detection

        console.log('Face-API.js models loaded successfully!');
    } catch (error) {
        console.error(`Error loading models: ${error.message}`);
    }
}
loadModels();

router.get('/', (req, res) => {
    console.log('Facial Expression route hit');
    res.render('expression');
});     
// Analyze Facial Expressions
router.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        // Ensure a file is uploaded
        if (!req.file) {
            return res.status(400).send('No image uploaded!');
        }

        const imagePath = path.join(__dirname, '../public/uploads/', req.file.filename);
        const img = await canvas.loadImage(imagePath);

        // Detect face and emotions
        const detections = await faceapi.detectAllFaces(img).withFaceExpressions();

        if (detections.length === 0) {
            // Cleanup uploaded file
            fs.unlinkSync(imagePath);
            return res.status(400).send('No face detected!');
        }

        // Extract emotions
        const emotions = detections[0].expressions;
        const detectedMood = Object.keys(emotions).reduce((a, b) => (emotions[a] > emotions[b] ? a : b));

        // Cleanup uploaded file
        fs.unlinkSync(imagePath);
console.log(emotions)
        res.json({ output: { message: 'Facial expression analysis complete!',
            mood: detectedMood,
            expressions: emotions}
           
        });
    } catch (error) {
        console.error(`Error during analysis: ${error.message}`);
        res.status(500).send('An error occurred during analysis.');
    }
});

module.exports = router;
