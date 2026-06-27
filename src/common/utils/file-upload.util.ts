import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

const UPLOAD_DIR = './uploads';

export const multerImageOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
      cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      return cb(
        new BadRequestException(
          'Only image files (jpg, jpeg, png, gif, webp) are allowed',
        ),
        false,
      );
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};
