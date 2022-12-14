import { ArcMetadata } from "../types/json.scheme";

// Used for arc 3 & arc 19
export function retrieveArcMediaForCompatibleArcs({
  image,
  external_url,
  animation_url,
}: ArcMetadata): string[] {
  const media = [image];
  external_url?.length && media.push(external_url);
  animation_url?.length && media.push(animation_url);
  return media;
}
