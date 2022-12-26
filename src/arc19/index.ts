import axios from "axios";
import { CodecName } from "cids";
import { HashName } from "multihashes";
import { Errors } from "../enum/errors.enum";
import { ASADigitalMedia } from "../types/asa-digital-media.interface";
import { AssetInfo } from "../types/asset-info.interface";
import { ArcMetadata } from "../types/json.scheme";
import { createASADigitalMediaListHandler } from "../_utils/arc-metadata.utils";
import {
  buildFetchUrlFromUrl,
  fromCidToIpfsTemplate,
} from "../_utils/fetch-path.utils";
import { AssetUrl } from "./types/asset-url.interface";
import { getCIDFromAddress } from "../_utils/ipfs.utils";

export abstract class Arc19 {
  static checkIfValidArc(info: AssetInfo): boolean {
    const regex = `template-ipfs:\/\/{ipfscid:([01]):([a-z0-9\-]+):([a-z0-9\-]+):([a-z0-9\-]+)}`;
    if (info.params.url.match(regex)) {
      return true;
    }
    return false;
  }

  static async getMetadata(info: AssetInfo): Promise<ArcMetadata> {
    try {
      const cid = getCIDFromAddress(info);
      const fetchUrl = buildFetchUrlFromUrl(
        fromCidToIpfsTemplate(cid)
      );
      return (await axios.get(fetchUrl)).data;
    } catch (error) {
      throw new Error(`Arc 19 ${Errors.arcBadConfigured} ` + error);
    }
  }

  static resolveAssetUrl(assetUrl: string): AssetUrl {
    const start = assetUrl.indexOf("{");
    const finish = assetUrl.indexOf("}");
    assetUrl = assetUrl.substring(start + 1, finish);
    const [templateType, version, multiCodec, fieldName, hashType] = assetUrl.split(":");
    if (!templateType || !version || !multiCodec || !fieldName ||  !hashType) {
      throw new Error(Errors.invalidAssetUrlTemplate);
    }
    return {
      templateType,
      version: parseInt(version) as 0 | 1,
      multiCodec: multiCodec as CodecName,
      fieldName,
      hashType: hashType as HashName,
    };
  }

  static async getDigitalMedia(
    info: AssetInfo
  ): Promise<ASADigitalMedia[]> {
    try {
      return createASADigitalMediaListHandler(
        info,
        await this.getMetadata(info)
      );
    } catch (error) {
      throw new Error(`Arc 19 ${Errors.arcBadConfigured} ` + error);
    }
  }
}
