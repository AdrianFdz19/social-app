import express from 'express';
import { uploadMedia } from '../controllers/mediaControllers.js';
import upload from '../services/multer.js';

const media = express.Router();

media.post('/upload', upload.single('media'), uploadMedia);

export default media;