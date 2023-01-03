import { IsDefined, IsObject, IsOptional, IsString } from 'class-validator';

export class MetadataSchema {
  @IsDefined()
  @IsString()
  readonly standard: string;
  @IsString()
  @IsOptional()
  readonly description?: string;
  @IsString()
  @IsOptional()
  readonly external_url?: string;
  @IsString()
  @IsOptional()
  readonly media_url?: string;
  @IsObject()
  @IsOptional()
  readonly properties?: Record<string, string>;
  @IsString()
  @IsOptional()
  readonly mime_type?: string;
  @IsObject()
  @IsOptional()
  readonly attributes?: Record<string, string>[];
}
