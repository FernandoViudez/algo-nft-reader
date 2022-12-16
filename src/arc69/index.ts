import { Indexer } from "algosdk";
import { ArcEnum } from "../enum/arc.enum";
import { Errors } from "../enum/errors.enum";
import { ASADigitalMedia } from "../types/asa-digital-media.interface";
import { AssetInfo } from "../types/asset-info.interface";
import { createASADigitalMediaListHandler } from "../_utils/arc-metadata.utils";
import { Arc69Metadata } from "./types/json.scheme";

export abstract class Arc69 {
  static async checkIfValidArc(asaInfo: AssetInfo, indexer: Indexer) {
    const metadata = await Arc69.getLastCfgTxnNoteParsed(
      asaInfo.index,
      indexer
    );
    return metadata.standard === ArcEnum.arc69;
  }
  static async getLastCfgTxnNoteParsed(
    asaId: number,
    indexer: Indexer
  ) {
    try {
      const response = (await indexer
        .lookupAssetTransactions(asaId)
        .txType("acfg")
        .do()) as any[];
      const lastTxn = response["transactions"].pop();
      if (!lastTxn || !lastTxn.note) {
        return {
          standard: ArcEnum.custom,
        };
      }
      return JSON.parse(
        Buffer.from(lastTxn.note, "base64").toString()
      );
    } catch (error) {
      throw new Error(
        `Arc 69 ${Errors.arcBadConfiugredNoteIsUndefinedOrInvalid}` +
          error
      );
    }
  }
  static async getMetadata(
    info: AssetInfo,
    indexer: Indexer
  ): Promise<Arc69Metadata> {
    try {
      const metadata = await this.getLastCfgTxnNoteParsed(
        info.index,
        indexer
      );
      return metadata;
    } catch (error) {
      throw new Error(`Arc 69 ${Errors.arcBadConfigured} ` + error);
    }
  }
  static async getDigitalMedia(
    info: AssetInfo,
    indexer: Indexer
  ): Promise<ASADigitalMedia[]> {
    try {
      return createASADigitalMediaListHandler(
        info,
        await this.getMetadata(info, indexer)
      );
    } catch (error) {
      throw new Error(`Arc 69 ${Errors.arcBadConfigured} ` + error);
    }
  }
}
