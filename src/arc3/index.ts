import axios from "axios";
import { ArcEnum } from "../enum/arc.enum";
import { Errors } from "../enum/errors.enum";
import { ASADigitalMedia } from "../types/asa-digital-media.interface";
import { AssetInfo } from "../types/asset-info.interface";
import { ArcMetadata } from "../types/json.scheme";
import { createASADigitalMediaListHandler } from "../_utils/arc-metadata.utils";
import { buildFetchUrlFromUrl } from "../_utils/fetch-path.utils";

export abstract class Arc3 {
  static async checkIfValidArc(info: AssetInfo) {
    if (
      (info.params.url &&
        info.params.url?.endsWith("#" + ArcEnum.arc3)) ||
      (info.params?.name &&
        (info.params.name?.endsWith("@" + ArcEnum.arc3) ||
          info.params.name?.includes(ArcEnum.arc3)))
    ) {
      return true;
    }
  }

  static async getMetadata(info: AssetInfo): Promise<ArcMetadata> {
    try {
      const fetchUrl = buildFetchUrlFromUrl(info.params.url);
      const response = (await axios.get(fetchUrl, { responseType: "text" })).data.trim();
      if (
        response.startsWith("{") &&
        response.endsWith("}")
      ) {
        return JSON.parse(response);
      }
    } catch (error) {
      throw new Error(`Arc 3  ${Errors.arcBadConfigured} ` + error);
    }
    throw new Error(Errors.invalidMetadata);
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
      throw new Error(`Arc 3  ${Errors.arcBadConfigured} ` + error);
    }
  }

  static getMetadataIntegrity(info: AssetInfo) {
    if (info.params.url.startsWith("ipfs://")) {
      return undefined;
    } else {
      return info.params["metadata-hash"];
    }
  }
}
