import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class Localization {
  @IsString()
  @IsOptional()
  readonly uri?: string;
  @IsString()
  @IsOptional()
  readonly default?: string;
  @IsArray()
  @IsOptional()
  readonly locales?: string[];
  @IsObject()
  @IsOptional()
  readonly integrity?: {};
}
