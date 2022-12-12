import { Indexer } from "algosdk";
import { ArcEnum } from "../enum/arc.enum";
import { AssetInfo } from "../types/asset-info.interface";
import { Arc69Metadata } from "./types/json.scheme";

export abstract class Arc69 {
    static async checkIfValidArc(asaInfo: AssetInfo, indexer: Indexer) {
        const metadata = await Arc69.getLastCfgTxnNoteParsed(asaInfo.index, indexer);
        if(metadata.standard === ArcEnum.arc69) {
            return true;
        } else {
            return false;
        }
    }
    static async getLastCfgTxnNoteParsed(asaId: number, indexer: Indexer) {
        const response = await indexer.lookupAssetTransactions(asaId).txType("acfg").do() as any[];
        const lastTxn = response["transactions"].pop()
        return JSON.parse(Buffer.from(lastTxn.note, "base64").toString());
    }
    static async getMetadata(info: AssetInfo, indexer: Indexer): Promise<Arc69Metadata> {
        try {
            const metadata = await this.getLastCfgTxnNoteParsed(info.index, indexer);
            return metadata;
        } catch (error) {
            throw new Error("Arc 19 not configured correctly. Asset url is invalid. " + error);
        }
    }
}