import { buildIpfsPath } from './ipfs.utils';
const isUrl = require('is-url');

export function buildFetchUrlFromUrl(assetUrl: string) {
  if (assetUrl.startsWith('ipfs://')) {
    return buildIpfsPath(assetUrl);
  } else if (isUrl(assetUrl)) {
    return assetUrl;
  }
  throw new Error('Invalid asset url. Not a valid URL');
}

export function fromCidToIpfsTemplate(cid: string) {
  return 'ipfs://' + cid;
}
