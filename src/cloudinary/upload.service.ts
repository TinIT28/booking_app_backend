import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(
    @Inject('CLOUDINARY') private cloudinaryInstance: typeof cloudinary,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinaryInstance.uploader
        .upload_stream({ folder: 'airbnb-clone' }, (error, result) => {
          if (error) return reject(error);

          if (!result) return reject(new Error('File upload failed'));
          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
