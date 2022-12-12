import { AssetInfo } from "../types/asset-info.interface";
import { buildFetchUrlFromUrl, fromCidToIpfsTemplate } from "../_utils/fetch-path.utils";
import { encode, HashName } from "multihashes";
import { decodeAddress } from "algosdk";
import { multicodecEnum } from "./types/multicodec.types";
import { multihashEnum } from "./types/multihash.types";
import { ArcMetadata } from "../types/json.scheme";
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
            const response = (await (await fetch(fetchUrl)).json())
            return response;
        } catch (error) {
            throw new Error("Arc 19 not configured correctly. Asset url is invalid. " + error);
        }
    }
    static getMetadataCID(info: AssetInfo): string {
        const idxStart = info.params.url.indexOf("{")
        const idxFinish = info.params.url.indexOf("}")
        const obj = info.params.url.substring(idxStart + 1, idxFinish);
        const [templateType, version, multiCodec, fieldName, hashType ] = obj.split(":");
        const addrBytes = decodeAddress(info.params[fieldName]).publicKey
        const hash = encode(addrBytes, hashType as HashName)
        let cidResult;
        if (version == '0') {
            if (multiCodec != multicodecEnum.dagPb || hashType != multihashEnum.SHA2_256) {
                throw new Error("Invalid version ~> 0");
            }
            cidResult = new CID(0, multiCodec , hash)
        } else {
            cidResult = new CID(1, multiCodec, hash);
        }
        return cidResult.toString();
    }
}