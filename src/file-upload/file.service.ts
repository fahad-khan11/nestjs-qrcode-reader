import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable()
export class MulterService {
  private readonly logger = new Logger(MulterService.name);

  getOptions(): MulterOptions {
    return {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileExt = path.extname(file.originalname);
          const filename = `${uuidv4()}${fileExt}`;
          this.logger.log(`File extension: ${fileExt}`);
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Invalid file type! Only images (PNG, JPG, JPEG) are allowed.'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, 
    };
  }
}
