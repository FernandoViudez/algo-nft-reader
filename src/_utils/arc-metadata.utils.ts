import { ArcMetadata } from "../types/json.scheme";

// Used for arc 3 & arc 19
export function retrieveArcMediaForCompatibleArcs({
  image,
  animation_url,
}: ArcMetadata): string[] {
  const media = [];
  image?.length && media.push(image);
  animation_url?.length && media.push(animation_url);
  return media;
}
