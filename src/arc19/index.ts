import { decodeAddress } from "algosdk";
import axios from "axios";
import { encode, HashName } from "multihashes";
import { Errors } from "../enum/errors.enum";
import { AssetInfo } from "../types/asset-info.interface";
import { ArcMetadata } from "../types/json.scheme";
import { retrieveArcMediaForCompatibleArcs } from "../_utils/arc-metadata.utils";
import {
  buildFetchUrlFromUrl,
  fromCidToIpfsTemplate,
} from "../_utils/fetch-path.utils";
const CID = require("cids");

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
    const idxStart = info.params.url.indexOf("{");
    const idxFinish = info.params.url.indexOf("}");
    const obj = info.params.url.substring(idxStart + 1, idxFinish);
    const [templateType, version, multiCodec, fieldName, hashType] =
      obj.split(":");
    const addrBytes = decodeAddress(info.params[fieldName]).publicKey;
    const hash = encode(addrBytes, hashType as HashName);
    let cidResult;
    if (version == "0") {
      if (
        multiCodec != 'dag-pb' ||
        hashType != 'sha-256'
      ) {
        throw new Error(Errors.invalidVersion);
      }
      cidResult = new CID(0, multiCodec, hash);
    } else {
      cidResult = new CID(1, multiCodec, hash);
    }
    return cidResult.toString();
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
