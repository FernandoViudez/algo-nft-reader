import { decodeAddress } from "algosdk";
import axios from "axios";
import { CodecName } from "cids";
import { decode, encode, HashName } from "multihashes";
import { Errors } from "../enum/errors.enum";
import { AssetInfo } from "../types/asset-info.interface";
import { ArcMetadata } from "../types/json.scheme";
import { retrieveArcMediaForCompatibleArcs } from "../_utils/arc-metadata.utils";
import {
  buildFetchUrlFromUrl,
  fromCidToIpfsTemplate,
} from "../_utils/fetch-path.utils";
import { getCodecCodeFromName, getHashCodeFromName } from "../_utils/multiformats.utils";
import { AssetUrl } from "./types/asset-url.interface";
import { CID } from "multiformats/cid";

export abstract class Arc19 {
  static checkIfValidArc(info: AssetInfo): boolean {
    if (info.params.url?.startsWith("template-")) {
      return true;
    }
    return false;
  }
  static async getMetadata(info: AssetInfo): Promise<ArcMetadata> {
    try {
      const cid = this.getMetadataCID(info);
      const fetchUrl = buildFetchUrlFromUrl(
        fromCidToIpfsTemplate(cid)
      );
      return (await axios.get(fetchUrl)).data;
    } catch (error) {
      throw new Error(`Arc 19 ${Errors.arcBadConfigured} ` + error);
    }
  }

  static getMetadataCID(info: AssetInfo): string {
    const {
      fieldName,
      hashType,
      version,
      multiCodec,
    } = this.resolveAssetUrl(info.params.url);


    if (!getHashCodeFromName(hashType) || !getCodecCodeFromName(multiCodec)) {
      throw new Error("Codec or hash not valid. Please create a valid asset url.");
    }

    if (version == 0) {
      if (
        multiCodec != 'dag-pb' ||
        hashType != "sha2-256"
      ) {
        throw new Error("Invalid version ~> 0 for specified CID codec or hash");
      }
    }

    const multiHashDigestBytes = decodeAddress(info.params[fieldName]).publicKey;
    const multiHashBytes = encode(multiHashDigestBytes, hashType)
    const hash = decode(multiHashBytes);
    const cid = CID.create(version, getCodecCodeFromName(multiCodec).code, {
      bytes: multiHashBytes,
      code: hash.code,
      size: hash.length,
      digest: multiHashDigestBytes,
    })
    return cid.toString();
  }

  static resolveAssetUrl(assetUrl: string): AssetUrl {
    const start = assetUrl.indexOf("{");
    const finish = assetUrl.indexOf("}");
    assetUrl = assetUrl.substring(start + 1, finish);
    const [templateType, version, multiCodec, fieldName, hashType] = assetUrl.split(":");
    return {
      templateType,
      version: parseInt(version) as 0 | 1,
      multiCodec: multiCodec as CodecName,
      fieldName,
      hashType: hashType as HashName,
    };
  }

  static async getDigitalMedia(info: AssetInfo): Promise<string[]> {
    try {
      return retrieveArcMediaForCompatibleArcs(
        await this.getMetadata(info)
      );
    } catch (error) {
      throw new Error(`Arc 19 ${Errors.arcBadConfigured} ` + error);
    }
  }
}
