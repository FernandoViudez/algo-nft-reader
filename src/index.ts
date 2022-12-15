import { Indexer } from "algosdk";
import { Arc69Metadata } from "./arc69/types/json.scheme";
import { Asset } from "./asset";
import { constants } from "./constants";
import { IndexerCredentials } from "./types/indexer.interface";
import { ArcMetadata } from "./types/json.scheme";
import { checkIpfsGatewayPath } from "./_utils/ipfs.utils";

export class Arc {
  private indexerClient: Indexer;
  static ipfsGateway: string = constants.defaultIpfsGateway;

  constructor(
    private readonly indexerCredentials: IndexerCredentials,
    private readonly ipfsGateway?: string
  ) {
    if (ipfsGateway) {
      checkIpfsGatewayPath(ipfsGateway);
      Arc.ipfsGateway = ipfsGateway;
    }
    this.indexerClient = new Indexer(
      indexerCredentials.token,
      indexerCredentials.host,
      indexerCredentials.port
    );
  }

  async getAssetMetadata(asaId: number) {
    const asset = new Asset(asaId, this.indexerClient);
    await asset.resolveAsset();
    return await asset.getMetadata();
  }

  async getAssetDigitalMedia(asaId: number) {
    const asset = new Asset(asaId, this.indexerClient);
    await asset.resolveAsset();
    return await asset.getDigitalMedia();
  }
}

export { ArcMetadata, Arc69Metadata };
