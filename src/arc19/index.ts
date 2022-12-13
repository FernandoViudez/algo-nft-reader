import { AssetInfo } from "../types/asset-info.interface";
import { buildFetchUrlFromUrl, fromCidToIpfsTemplate } from "../_utils/fetch-path.utils";
import { decodeAddress } from "algosdk";
import { MulticodecEnum } from "./types/multicodec.types";
import { MultihashEnum } from "./types/multihash.types";
import { ArcMetadata } from "../types/json.scheme";
import { AssetUrl } from "./types/asset-url.interface";
import { Base } from "../types/cid-tool.interface";
import { encode, HashName } from "multihashes";
const CIDTool = require('cid-tool')
const CID = require('cids')

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

        // TODO: Refactor
        const hash = (CIDTool.hashes() as Base[]).find(item => item.name == hashType)
        const codec = (CIDTool.codecs() as Base[]).find(item => item.name == hashType)
        if (!hash || !codec){
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
        const encodedDigest = encode(multiHashDigestBytes, hash.name as HashName)
        const cid = new CID(version, multiCodec, encodedDigest)
        return cid.toString();
    }
    static resolveAssetUrl(assetUrl: string): AssetUrl {
        const [templateType, version, multiCodec, fieldName, hashType] = assetUrl.split(":");
        return {
            templateType,
            version: parseInt(version) as 0 | 1,
            multiCodec: MulticodecEnum[multiCodec],
            fieldName,
            hashType: MultihashEnum[hashType],
        };
    }
}