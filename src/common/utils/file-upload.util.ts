import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const multerImageOptions = {
  storage: memoryStorage(),
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
