import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'airbnb-clone',
    format: file.mimetype.split('/')[1], // tự map jpg, png, webp
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});
