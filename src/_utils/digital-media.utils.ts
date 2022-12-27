import { ASADigitalMedia } from '../types/asa-digital-media.interface';

export function formatMediaIntegrity(digitalMedia: ASADigitalMedia[]) {
  digitalMedia = digitalMedia.filter((value) => value.integrity);
  digitalMedia = digitalMedia.map((value) => {
    if (value.integrity.startsWith('sha256-')) {
      value.integrity = value.integrity.split('sha256-').pop();
    }
    return value;
  });
  return digitalMedia;
}
