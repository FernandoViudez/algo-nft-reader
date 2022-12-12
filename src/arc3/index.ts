import { ArcEnum } from "../enum/arc.enum";
import { AssetInfo } from "../types/asset-info.interface";
import { buildFetchUrlFromUrl } from "../_utils/fetch-path.utils";
import { ArcMetadata } from "../types/json.scheme";

export abstract class Arc3 {
    static checkIfValidArc(info: AssetInfo) {
        if (
            (
                info.params.url &&
                info.params.url?.endsWith("#" + ArcEnum.arc3)
            ) ||
            (
                info.params?.name &&
                (
                    info.params.name?.endsWith("@" + ArcEnum.arc3) ||
                    info.params.name?.includes(ArcEnum.arc3)
                )
            )
        ) {
            return true;
        }
        return false;
    }
    static async getMetadata(info: AssetInfo): Promise<ArcMetadata> {
        try {
            const fetchUrl = buildFetchUrlFromUrl(info.params.url);
            const response = (await (await fetch(fetchUrl)).json())
            return response;
        } catch (error) {
            throw new Error("Arc 3 not configured correctly. Asset url is invalid.");
        }
    }
}