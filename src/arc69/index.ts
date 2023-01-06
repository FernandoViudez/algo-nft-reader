import { Indexer, makeAssetCreateTxnWithSuggestedParamsFromObject } from 'algosdk';
import { ArcEnum } from '../enum/arc.enum';
import { Errors } from '../enum/errors.enum';
import { ASADigitalMedia } from '../types/asa-digital-media.interface';
import { AssetInfo } from '../types/asset-info.interface';
import { createASADigitalMediaListHandler } from '../_utils/arc-metadata.utils';
import { isDecentralizedURI } from '../_utils/ipfs.utils';
import { validateMetadata } from '../_utils/validate.utils';
import { MetadataSchema } from './schema/metadata.schema';
import { CreateArc69 } from './types/create-asa.interface';
import { Arc69Metadata } from './types/json.scheme';

export abstract class Arc69 {
  static async isValidArc(asaInfo: AssetInfo, indexer: Indexer) {
    const metadata = await Arc69.getLastCfgTxnNoteParsed(asaInfo.index, indexer);
    return await this.isValidMetadata(metadata);
  }

  static async isValidMetadata(metadata: any) {
    const metadataValidationClass: MetadataSchema = Object.assign(new MetadataSchema(), metadata);
    const errors = await validateMetadata(metadataValidationClass);
    return !errors.length;
  }

  static async getLastCfgTxnNoteParsed(asaId: number, indexer: Indexer) {
    const lastTxn = await this.lookupLastAssetCfgTxn(asaId, indexer);
    if (!lastTxn || !lastTxn.note) {
      return {
        standard: ArcEnum.custom,
      };
    } else {
      const decodedNote = Buffer.from(lastTxn.note, 'base64').toString();
      try {
        return JSON.parse(decodedNote);
      } catch (error) {
        return {
          standard: ArcEnum.custom,
        };
      }
    }
  }

  static async getMetadata(info: AssetInfo, indexer: Indexer): Promise<Arc69Metadata> {
    try {
      const metadata = await this.getLastCfgTxnNoteParsed(info.index, indexer);
      if (metadata.standard == ArcEnum.custom) {
        throw new Error();
      }
      return metadata;
    } catch (error) {
      throw new Error(`Arc 69 ${Errors.arcBadConfigured} ` + error);
    }
  }

  static async getDigitalMedia(info: AssetInfo, indexer: Indexer): Promise<ASADigitalMedia[]> {
    try {
      return createASADigitalMediaListHandler(info, await this.getMetadata(info, indexer));
    } catch (error) {
      throw new Error(`Arc 69 ${Errors.arcBadConfigured} ` + error);
    }
  }

  static async lookupLastAssetCfgTxn(asaId: number, indexer: Indexer) {
    return (await indexer.lookupAssetTransactions(asaId).txType('acfg').do())['transactions'].pop();
  }

  static async create({
    decimals,
    defaultFrozen,
    from,
    suggestedParams,
    total,
    digitalMediaHash,
    assetName,
    digitalMediaURI,
    clawback,
    freeze,
    manager,
    metadata,
    rekeyTo,
    reserve,
    unitName,
  }: CreateArc69) {
    if (!(await this.isValidMetadata(metadata))) {
      throw new Error('Invalid metadata for ARC69');
    }
    if (!isDecentralizedURI(digitalMediaURI) && !digitalMediaHash) {
      throw new Error('Integrity of metadata is required if decentralized service its not used.');
    }
    return makeAssetCreateTxnWithSuggestedParamsFromObject({
      decimals,
      defaultFrozen,
      from,
      suggestedParams,
      total,
      assetMetadataHash: digitalMediaHash,
      assetName,
      assetURL: digitalMediaURI,
      clawback,
      freeze,
      manager,
      note: new Uint8Array(Buffer.from(JSON.stringify(metadata))),
      rekeyTo,
      reserve,
      unitName,
    });
  }
}
