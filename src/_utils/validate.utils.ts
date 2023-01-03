import { validate } from 'class-validator';

export const validateMetadata = async (metadata: any) => {
  const errors = await validate(metadata, {
    // forbidNonWhitelisted: true,
    // whitelist: true,
    // skipMissingProperties: false,
  });
  return errors;
};
