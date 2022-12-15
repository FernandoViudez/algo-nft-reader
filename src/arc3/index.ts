import axios from "axios";
import { ArcEnum } from "../enum/arc.enum";
import { Errors } from "../enum/errors.enum";
import { ASADigitalMedia } from "../types/asa-digital-media.interface";
import { AssetInfo } from "../types/asset-info.interface";
import { ArcMetadata } from "../types/json.scheme";
import { createASADigitalMediaListHandler } from "../_utils/arc-metadata.utils";
import { buildFetchUrlFromUrl } from "../_utils/fetch-path.utils";

export abstract class Arc3 {
  static checkIfValidArc(info: AssetInfo) {
    if (
      (info.params.url &&
        info.params.url?.endsWith("#" + ArcEnum.arc3)) ||
      (info.params?.name &&
        (info.params.name?.endsWith("@" + ArcEnum.arc3) ||
          info.params.name?.includes(ArcEnum.arc3)))
    ) {
      return true;
    }
    return false;
  }

  static async getMetadata(info: AssetInfo): Promise<ArcMetadata> {
    try {
      const fetchUrl = buildFetchUrlFromUrl(info.params.url);
      return (await axios.get(fetchUrl)).data;
    } catch (error) {
      throw new Error(`Arc 3  ${Errors.arcBadConfigured} ` + error);
    }
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
}
