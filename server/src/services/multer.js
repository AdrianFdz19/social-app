import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary, 
    params: {
        folder: 'media', 
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'webm'],
    },
});

const upload = multer({ storage }); 

export default upload;
