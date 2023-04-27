import { IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Localization } from './localization.schema';

export class MetadataSchema {
  @IsString()
  @IsOptional()
  readonly name?: string;
  @IsNumber()
  @IsOptional()
  readonly decimals?: number;
  @IsString()
  @IsOptional()
  readonly description?: string;
  @IsString()
  @IsOptional()
  readonly image?: string;
  @IsString()
  @IsOptional()
  readonly image_integrity?: string;
  @IsString()
  @IsOptional()
  readonly image_mimetype?: string;
  @IsString()
  @IsOptional()
  readonly background_color?: string;
  @IsString()
  @IsOptional()
  readonly external_url?: string;
  @IsString()
  @IsOptional()
  readonly external_url_integrity?: string;
  @IsString()
  @IsOptional()
  readonly external_url_mimetype?: string;
  @IsString()
  @IsOptional()
  readonly animation_url?: string;
  @IsString()
  @IsOptional()
  readonly animation_url_integrity?: string;
  @IsString()
  @IsOptional()
  readonly animation_url_mimetype?: string;
  @IsObject()
  @IsOptional()
  readonly properties?: Record<string, any>;
  @IsString()
  @IsOptional()
  readonly extra_metadata?: string;
  @ValidateNested()
  readonly localization?: Localization;
}
