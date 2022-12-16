import axios from "axios";
import { ArcEnum } from "../enum/arc.enum";
import { Errors } from "../enum/errors.enum";
import { AssetInfo } from "../types/asset-info.interface";
import { ArcMetadata } from "../types/json.scheme";
import { retrieveArcMediaForCompatibleArcs } from "../_utils/arc-metadata.utils";
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
      return (await axios.get(fetchUrl)).data;
    } catch (error) {
      throw new Error(`Arc 3  ${Errors.arcBadConfigured} ` + error);
    }
  }

  static async getDigitalMedia(info: AssetInfo): Promise<string[]> {
    try {
      return retrieveArcMediaForCompatibleArcs(
        await this.getMetadata(info)
      );
    } catch (error) {
      throw new Error(`Arc 3  ${Errors.arcBadConfigured} ` + error);
    }
  }
}
