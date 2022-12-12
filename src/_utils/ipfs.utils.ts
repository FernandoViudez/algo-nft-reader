import { Arc } from "..";
const isUrl = require("is-url");

/**
 * Should be a public gateway
 * Should follow this structure: "https://ipfs.domain.io/ipfs/"
 * @param ipfsGateway 
 */
export function checkIpfsGatewayPath(ipfsGateway: string) {
    if(
        !ipfsGateway.startsWith('https://') || 
        !ipfsGateway.includes('/ipfs/') || 
        !isUrl(ipfsGateway)
    ) {
        throw new Error("Invalid gateway");
    }
}

/**
 * Receives assetUrl which should be the following: ipfs://<ipfs-cid>
 * @param assetUrl 
 * @returns 
 */
export function buildIpfsPath(assetUrl: string) {
    let cid = assetUrl.split('ipfs://')[1];
    if (assetUrl.endsWith('#arc3')) {
        cid = cid.split("#arc3")[0]; // for incompatible apps on arc3 
    }
    return Arc.ipfsGateway + cid;
}