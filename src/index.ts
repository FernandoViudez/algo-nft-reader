import { IndexerCredentials } from "./types/indexer.interface"
import { Indexer } from 'algosdk';
import { Asset } from "./asset";
import { checkIpfsGatewayPath } from "./_utils/ipfs.utils";
import { constants } from "./constants";
import { ArcMetadata } from "./types/json.scheme";
import { Arc69Metadata } from "./arc69/types/json.scheme";


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
    async validateIntegrity(asaId: number) {
        const asset = new Asset(asaId, this.indexerClient);
        await asset.resolveAsset();
        return await asset.validateIntegrity();
    }
}
export { ArcMetadata, Arc69Metadata };