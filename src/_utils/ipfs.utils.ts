import { decodeAddress, encodeAddress } from 'algosdk';
import { CID } from 'multiformats/cid';
import { encode, decode } from 'multihashes';
import { Arc } from '..';
import { Arc19 } from '../arc19';
import { AssetInfo } from '../types/asset-info.interface';
import { getHashCodeFromName, getCodecCodeFromName } from './multiformats.utils';
const isUrl = require('is-url');

/**
 * Should be a public gateway
 * Should follow this structure: "https://ipfs.domain.io/ipfs/"
 * @param ipfsGateway
 */
export function checkIpfsGatewayPath(ipfsGateway: string) {
  if (
    !ipfsGateway.startsWith('https://') ||
    !ipfsGateway.includes('/ipfs/') ||
    !isUrl(ipfsGateway)
  ) {
    throw new Error('Invalid gateway');
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
    cid = cid.split('#arc3')[0]; // for incompatible apps on arc3
  }
  return Arc.ipfsGateway + cid;
}

export function fromCIDToAddress(cid: string) {
  const _cid = CID.parse(cid);
  return encodeAddress(_cid.multihash.digest);
}

export function getCIDFromAddress(info: AssetInfo): string {
  const { fieldName, hashType, version, multiCodec } = Arc19.resolveAssetUrl(info.params.url);

  if (!getHashCodeFromName(hashType) || !getCodecCodeFromName(multiCodec)) {
    throw new Error('Codec or hash not valid. Please create a valid asset url.');
  }

  if (version == 0) {
    if (multiCodec != 'dag-pb' || hashType != 'sha2-256') {
      throw new Error('Invalid version ~> 0 for specified CID codec or hash');
    }
  }

  const multiHashDigestBytes = decodeAddress(info.params[fieldName]).publicKey;
  const multiHashBytes = encode(multiHashDigestBytes, hashType);
  const hash = decode(multiHashBytes);
  const cid = CID.create(version, getCodecCodeFromName(multiCodec).code, {
    bytes: multiHashBytes,
    code: hash.code,
    size: hash.length,
    digest: multiHashDigestBytes,
  });
  return cid.toString();
}
