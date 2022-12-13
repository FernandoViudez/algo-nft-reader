import { AssetInfo } from "../types/asset-info.interface";
import { buildFetchUrlFromUrl, fromCidToIpfsTemplate } from "../_utils/fetch-path.utils";
import { decodeAddress } from "algosdk";
import { ArcMetadata } from "../types/json.scheme";
import { AssetUrl } from "./types/asset-url.interface";
import { decode, encode, HashName } from "multihashes";
import { CodecName } from "cids";
import { getCodecCodeFromName, getHashCodeFromName } from "../_utils/multiformats.utils";
import { CID } from 'multiformats/cid';

export abstract class Arc19 {
    static checkIfValidArc(info: AssetInfo): boolean {
        if (info.params.url?.startsWith("template-")) {
            return true;
        }
        return false;
    }
    static async getMetadata(info: AssetInfo): Promise<ArcMetadata> {
        try {
            const cid = await this.getMetadataCID(info);
            await this.getMetadataCID(info);
            const fetchUrl = buildFetchUrlFromUrl(
                fromCidToIpfsTemplate(cid)
            );
            const response = (await (await fetch(fetchUrl)).json())
            return response;
        } catch (error) {
            throw new Error("Arc 19 not configured correctly. Asset url is invalid. " + error);
        }
    }
    static async getMetadataCID(info: AssetInfo): Promise<any> {
        const idxStart = info.params.url.indexOf("{")
        const idxFinish = info.params.url.indexOf("}")
        const urlSubstr = info.params.url.substring(idxStart + 1, idxFinish);

        const {
            fieldName,
            hashType,
            version,
            multiCodec,
        } = this.resolveAssetUrl(urlSubstr);

        
        if (!getHashCodeFromName(hashType) || !getCodecCodeFromName(multiCodec)){
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
        const [templateType, version, multiCodec, fieldName, hashType] = assetUrl.split(":");
        return {
            templateType,
            version: parseInt(version) as 0 | 1,
            multiCodec: multiCodec as CodecName,
            fieldName,
            hashType: hashType as HashName,
        };
    }
}