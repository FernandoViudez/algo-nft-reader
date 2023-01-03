import { Algodv2, makeAssetCreateTxnWithSuggestedParamsFromObject } from 'algosdk';
import axios from 'axios';
import { MetadataSchema } from '../schema/metadata.schema';
import { ArcEnum } from '../enum/arc.enum';
import { Errors } from '../enum/errors.enum';
import { ASADigitalMedia } from '../types/asa-digital-media.interface';
import { AssetInfo } from '../types/asset-info.interface';
import { ArcMetadata } from '../types/json.scheme';
import { createASADigitalMediaListHandler } from '../_utils/arc-metadata.utils';
import { buildFetchUrlFromUrl } from '../_utils/fetch-path.utils';
import { checkIfValidIpfsMetadataTemplate } from '../_utils/ipfs.utils';
import { isJson } from '../_utils/json';
import { validateMetadata } from '../_utils/validate.utils';

export abstract class Arc3 {
  static async isValidArc(assetUrl: string, assetName: string) {
    return this.isValidUrlAndName(assetUrl, assetName) && (await this.isValidMetadata(assetUrl));
  }

  static isValidUrlAndName(assetUrl: string, assetName: string) {
    if (
      (assetUrl && assetUrl?.endsWith('#' + ArcEnum.arc3)) ||
      (assetName && (assetName?.endsWith('@' + ArcEnum.arc3) || assetName?.includes(ArcEnum.arc3)))
    ) {
      return true;
    }
    return false;
  }

  static async isValidMetadata(metadataURI: string) {
    const fetchUrl = buildFetchUrlFromUrl(metadataURI);
    const response = (await axios.get(fetchUrl, { responseType: 'json' })).data;
    const metadata: MetadataSchema = Object.assign(new MetadataSchema(), response);
    const errors = await validateMetadata(metadata);
    return !errors.length;
  }

  static async getMetadata(info: AssetInfo): Promise<ArcMetadata> {
    try {
      const fetchUrl = buildFetchUrlFromUrl(info.params.url);
      const response = (await axios.get(fetchUrl, { responseType: 'text' })).data.trim();
      if (isJson(response)) {
        return JSON.parse(response);
      }
    } catch (error) {
      throw new Error(`Arc 3  ${Errors.arcBadConfigured} ` + error);
    }
    throw new Error(Errors.invalidMetadata);
  }

  static async getDigitalMedia(info: AssetInfo): Promise<ASADigitalMedia[]> {
    try {
      return createASADigitalMediaListHandler(info, await this.getMetadata(info));
    } catch (error) {
      throw new Error(`Arc 3  ${Errors.arcBadConfigured} ` + error);
    }
  }

  static getMetadataIntegrity(info: AssetInfo) {
    if (info.params.url.startsWith('ipfs://')) {
      return undefined;
    } else {
      return info.params['metadata-hash'];
    }
  }

  static async create({
    client,
    defaultFrozen,
    metadataURI,
    metadataHash,
    from,
    decimals,
    total,
    assetName,
    clawback,
    freeze,
    manager,
    reserve,
    unitName,
    rekeyTo,
    note,
  }: {
    client: Algodv2;
    defaultFrozen?: boolean;
    metadataURI: string;
    metadataHash?: string;
    from: string;
    decimals: number;
    total: number;
    assetName?: string;
    clawback?: string;
    freeze?: string;
    manager?: string;
    reserve?: string;
    unitName?: string;
    rekeyTo?: string;
    note?: Uint8Array;
  }) {
    if (!checkIfValidIpfsMetadataTemplate(metadataURI) && !metadataHash) {
      throw new Error('Integrity of metadata is required if decentralized service its not used.');
    }
    if (!this.isValidArc(metadataURI, assetName)) {
      throw new Error(`Invalid configuration. Please check the following items:
      - Metadata URI is valid (follows this structure -> ipfs://<CID>)
      - Metadata follows ARC3 schema
      - If metadata URI not ends with #arc3, then check if your asset name contains at least this word: "arc3" or ends with "@arc3"`);
    }
    return makeAssetCreateTxnWithSuggestedParamsFromObject({
      decimals,
      total,
      from,
      defaultFrozen,
      suggestedParams: await client.getTransactionParams().do(),
      assetMetadataHash: metadataHash,
      assetURL: metadataURI,
      assetName,
      clawback,
      freeze,
      manager,
      reserve,
      unitName,
      rekeyTo,
      note,
    });
  }
}
