import { Indexer } from "algosdk";
import { ArcEnum } from "../enum/arc.enum";
import { Errors } from "../enum/errors.enum";
import { AssetInfo } from "../types/asset-info.interface";
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
  ): Promise<Arc69Metadata> {
    const response = (await indexer
      .lookupAssetTransactions(asaId)
      .txType("acfg")
      .do()) as any[];
    const lastTxn = response["transactions"].pop();
    if (!lastTxn || !lastTxn.note) {
      return {
        standard: ArcEnum.custom,
      };
    } else {
      return JSON.parse(Buffer.from(lastTxn.note, "base64").toString());
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
  ): Promise<string[]> {
    try {
      const { media_url } = await this.getMetadata(info, indexer);
      const media = [];
      info.params.url?.startsWith("ipfs://") &&
        media.push(info.params.url.split("/").pop());
      media_url && media.push(media_url);
      return media;
    } catch (error) {
      throw new Error(`Arc 69 ${Errors.arcBadConfigured} ` + error);
    }
  }
}
