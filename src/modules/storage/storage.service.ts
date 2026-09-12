import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extname } from 'path';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.client = createClient(
      this.config.get('SUPABASE_URL'),
      this.config.get('SUPABASE_SERVICE_ROLE_KEY'),
    );
    this.bucket = this.config.get('SUPABASE_STORAGE_BUCKET', 'product-images');
  }

  async onModuleInit() {
    try {
      const { data, error } = await this.client.storage.getBucket(this.bucket);
      if (!data && !error) return;
      if (error) {
        await this.client.storage.createBucket(this.bucket, {
          public: true,
        });
      }
    } catch (error) {
      this.logger.error(
        `Failed to verify/create Supabase Storage bucket "${this.bucket}"`,
        error,
      );
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<{
    filename: string;
    url: string;
    createdAt: Date;
  }> {
    const path = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;

    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      this.logger.error(
        `Failed to upload image to Supabase Storage: ${error.message}`,
      );
      throw new InternalServerErrorException('Failed to upload image');
    }

    const url = this.client.storage.from(this.bucket).getPublicUrl(path)
      .data.publicUrl;

    return {
      filename: file.originalname,
      url,
      createdAt: new Date(),
    };
  }
}
