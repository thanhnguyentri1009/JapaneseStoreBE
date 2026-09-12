import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const multerImageOptions = {
  storage: memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(
        new BadRequestException('Only image files (jpg, jpeg, png) are allowed'),
        false,
      );
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 },
};
