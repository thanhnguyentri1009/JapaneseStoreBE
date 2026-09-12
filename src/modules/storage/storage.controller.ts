import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { multerImageOptions } from '../../common/utils/file-upload.util';
import { StorageService } from './storage.service';

@ApiBearerAuth()
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file (jpg/png/gif/webp, max 5MB)',
        },
      },
    },
  })
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Image is required');
    return this.storageService.uploadImage(file);
  }
}
