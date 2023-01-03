import axios from 'axios';
import { CodecName } from 'cids';
import { HashName } from 'multihashes';
import { Errors } from '../enum/errors.enum';
import { ASADigitalMedia } from '../types/asa-digital-media.interface';
import { AssetInfo } from '../types/asset-info.interface';
import { ArcMetadata } from '../types/json.scheme';
import { createASADigitalMediaListHandler } from '../_utils/arc-metadata.utils';
import { buildFetchUrlFromUrl, fromCidToIpfsTemplate } from '../_utils/fetch-path.utils';
import { AssetUrl } from './types/asset-url.interface';
import { fromCIDToAddress, getCIDFromAddress } from '../_utils/ipfs.utils';
import { MetadataSchema } from '../schema/metadata.schema';
import { validateMetadata } from '../_utils/validate.utils';
import { makeAssetCreateTxnWithSuggestedParamsFromObject } from 'algosdk';
import { CreateArc19 } from './types/create-asa.interface';

export abstract class Arc19 {
  static async isValidArc(info: AssetInfo) {
    return this.isValidTemplate(info.params.url) && (await this.isValidMetadata(info));
  }

  static isValidTemplate(assetUrl: string): boolean {
    const regex = `template-ipfs:\/\/{ipfscid:([01]):([a-z0-9\-]+):([a-z0-9\-]+):([a-z0-9\-]+)}`;
    if (assetUrl.match(regex)) {
      return true;
    }
    return false;
  }

  static async isValidMetadata(info: AssetInfo) {
    const cid = getCIDFromAddress(info);
    const fetchUrl = buildFetchUrlFromUrl(fromCidToIpfsTemplate(cid));
    const response = (await axios.get(fetchUrl)).data;
    const metadata: MetadataSchema = Object.assign(new MetadataSchema(), response);
    const errors = await validateMetadata(metadata);
    return !errors.length;
  }

  static async getMetadata(info: AssetInfo): Promise<ArcMetadata> {
    try {
      const cid = getCIDFromAddress(info);
      const fetchUrl = buildFetchUrlFromUrl(fromCidToIpfsTemplate(cid));
      return (await axios.get(fetchUrl)).data;
    } catch (error) {
      throw new Error(`Arc 19 ${Errors.arcBadConfigured} ` + error);
    }
  }

  static resolveAssetUrl(assetUrl: string): AssetUrl {
    if (!this.isValidTemplate(assetUrl)) {
      throw new Error(Errors.invalidAssetUrlTemplate);
    }
    const start = assetUrl.indexOf('{');
    const finish = assetUrl.indexOf('}');
    assetUrl = assetUrl.substring(start + 1, finish);
    const [templateType, version, multiCodec, fieldName, hashType] = assetUrl.split(':');
    if (!templateType || !version || !multiCodec || !fieldName || !hashType) {
      throw new Error(Errors.invalidAssetUrlTemplate);
    }
    return {
      templateType,
      version: parseInt(version) as 0 | 1,
      multiCodec: multiCodec as CodecName,
      fieldName,
      hashType: hashType as HashName,
    };
  }

  static async getDigitalMedia(info: AssetInfo): Promise<ASADigitalMedia[]> {
    try {
      return createASADigitalMediaListHandler(info, await this.getMetadata(info));
    } catch (error) {
      throw new Error(`Arc 19 ${Errors.arcBadConfigured} ` + error);
    }
  }

  static async create({
    client,
    decimals,
    defaultFrozen,
    from,
    total,
    metadataCID,
    assetName,
    clawback,
    freeze,
    manager,
    note,
    rekeyTo,
    template,
    unitName,
  }: CreateArc19) {
    const encodedAddress = fromCIDToAddress(metadataCID);
    if (
      !(await this.isValidArc({
        index: 1,
        params: {
          creator: from,
          decimals,
          total,
          reserve: encodedAddress,
          url: template,
        },
      }))
    ) {
      throw new Error('Invalid params for ARC19');
    }
    return makeAssetCreateTxnWithSuggestedParamsFromObject({
      decimals,
      defaultFrozen,
      from,
      suggestedParams: await client.getTransactionParams().do(),
      total,
      assetURL: template,
      assetName,
      clawback,
      freeze,
      manager,
      note,
      rekeyTo,
      reserve: encodedAddress,
      unitName,
    });
  }
}
