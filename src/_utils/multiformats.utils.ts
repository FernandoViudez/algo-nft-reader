import { Base } from "../types/cid-tool.interface"
const CIDTool = require('cid-tool')

export function getHashCodeFromName(hashName: string) {
    return (CIDTool.hashes() as Base[]).find(item => item.name == hashName);
}

export function getCodecCodeFromName(codecName: string) {
    return (CIDTool.codecs() as Base[]).find(item => item.name == codecName);
}