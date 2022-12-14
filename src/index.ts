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

new Arc({
  token: {
    "X-API-Key": "if9ITfbz7f2OqCqsH1nB7mnYD29kP3m6UFMoPsm8",
  },
  // host: "https://testnet-algorand.api.purestake.io/idx2",
  host: "https://mainnet-algorand.api.purestake.io/idx2",
  port: "",
  // }).getAssetDigitalMedia(976342693);
})
  // .getAssetDigitalMedia(976298396)
  .getAssetDigitalMedia(976426038)
  .then((response) => console.log(response));
