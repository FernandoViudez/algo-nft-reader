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

    private async initializeAsset(asaId: number): Promise<Asset> {
        const asset = new Asset(asaId, this.indexerClient);
        await asset.resolveAsset();
        return asset;
    }

    async getStandard(asaId: number) {
        const asset = await this.initializeAsset(asaId);
        return asset.standard;
    }

    async getAssetMetadata(asaId: number) {
        const asset = await this.initializeAsset(asaId);
        return await asset.getMetadata();
    }

    async getAssetDigitalMedia(asaId: number) {
        const asset = await this.initializeAsset(asaId);
        return await asset.getDigitalMedia();
    }

    async validateIntegrity(asaId: number) {
        const asset = await this.initializeAsset(asaId);
        return await asset.validateIntegrity();
    }
}

export { ArcMetadata, Arc69Metadata };
