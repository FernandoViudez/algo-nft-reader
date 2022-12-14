import { Arc69Metadata } from "../arc69/types/json.scheme";
import { ASADigitalMedia } from "../types/asa-digital-media.interface";
import { AssetInfo } from "../types/asset-info.interface";
import { ArcMetadata } from "../types/json.scheme";

export function createASADigitalMediaListHandler(
  info: AssetInfo,
  metadata: ArcMetadata | Arc69Metadata
): ASADigitalMedia[] {
  const mediaList: ASADigitalMedia[] = [];
  if ("image" in metadata)
    _createASADigitalMediaListForCompatibleArcs(mediaList, metadata);
  else
    _createASADigitalMediaListForArc69(
      mediaList,
      info,
      <Arc69Metadata>metadata
    );
  return mediaList;
}

// Used for arc 3 & arc 19
function _createASADigitalMediaListForCompatibleArcs(
  media: ASADigitalMedia[],
  metadata: ArcMetadata
): void {
  if (metadata.image?.length) {
    const mediaObject: ASADigitalMedia = {
      media: metadata.image,
    };
    if (metadata.image?.startsWith("https://"))
      mediaObject.integrity = metadata?.image_integrity || "";

    media.push(mediaObject);
  }

  if (metadata.animation_url?.length) {
    const mediaObject: ASADigitalMedia = {
      media: metadata.animation_url,
    };
    if (metadata.animation_url?.startsWith("https://"))
      mediaObject.integrity = metadata.animation_url_integrity || "";

    media.push(mediaObject);
  }
}

function _createASADigitalMediaListForArc69(
  media: ASADigitalMedia[],
  info: AssetInfo,
  metadata: Arc69Metadata
): void {
  if (info.params.url?.startsWith("ipfs://"))
    media.push({
      media: info.params.url,
    });
  else if (info.params.url?.startsWith("https://"))
    media.push({
      media: info.params.url,
      integrity: info.params["metadata-hash"] || "",
    });
}
