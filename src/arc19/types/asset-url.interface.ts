import { CodecName } from "cids";
import { HashName } from "multihashes";

export interface AssetUrl {
    templateType: string;
    version: 0 | 1;
    multiCodec: CodecName; 
    fieldName: string; 
    hashType: HashName;
}