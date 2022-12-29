import { Indexer } from 'algosdk';
import { Arc69Metadata } from './arc69/types/json.scheme';
import { Asset } from './asset';
import { constants } from './constants';
import { IndexerCredentials } from './types/indexer.interface';
import { ArcMetadata } from './types/json.scheme';
import { checkIpfsGatewayPath, fromCIDToAddress, getCIDFromAddress } from './_utils/ipfs.utils';

export class NFTReader {
  private indexerClient: Indexer;
  static ipfsGateway: string = constants.defaultIpfsGateway;

  constructor(
    private readonly indexer: IndexerCredentials | Indexer,
    private readonly ipfsGateway?: string
  ) {
    if (ipfsGateway) {
      checkIpfsGatewayPath(ipfsGateway);
      NFTReader.ipfsGateway = ipfsGateway;
    }
    if (indexer instanceof Indexer) {
      this.indexerClient = indexer;
    } else {
      this.indexerClient = new Indexer(indexer.token, indexer.host, indexer.port);
    }
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

  async validateDigitalMediaIntegrity(asaId: number) {
    const asset = await this.initializeAsset(asaId);
    return await asset.validateDigitalMediaIntegrity();
  }

  async validateMetadataIntegrity(asaId: number) {
    const asset = await this.initializeAsset(asaId);
    return await asset.validateMetadataIntegrity();
  }
}

export { ArcMetadata, Arc69Metadata, fromCIDToAddress, getCIDFromAddress };
