import { Indexer } from "algosdk";
import { ArcEnum } from "./enum/arc.enum";
import { AssetInfo } from "./types/asset-info.interface";
import { Arc3 } from "./arc3";
import { Arc19 } from "./arc19";
import { Arc69 } from "./arc69";

export class Asset {
    private id: number;
    private arc: ArcEnum;
    private info: AssetInfo;
    constructor(
        id: number,
        private readonly indexerService: Indexer
    ) {
        this.id = id;
    }
    get index() {
        return this.id
    }
    get standard() {
        return this.arc;
    }
    get data() {
        return this.info;
    }
    async resolveAsset() {
        await this.getAssetInfo();
        this.setStandard();
    }
    
    private async getAssetInfo() {
        const response = await this.indexerService.lookupAssetByID(this.id).do();
        // TODO: Add response formatter to replace kebab case to camel case (export that util function)
        this.info = response["asset"] as AssetInfo;
        return response["asset"] as AssetInfo;
    }

    private setStandard(): void {
        if (Arc19.checkIfValidArc(this.info)) {
            this.arc = ArcEnum.arc19;
        } else if (
            Arc3.checkIfValidArc(this.info)
        ) {
            this.arc = ArcEnum.arc3;
        } else if (
            Arc69.checkIfValidArc(this.info, this.indexerService)
        ) {
            this.arc = ArcEnum.arc69;
        } else {
            this.arc = ArcEnum.invalidArc;
        }
    }

    async getMetadata() {
        switch (this.arc) {
            case ArcEnum.arc3: {
                return await Arc3.getMetadata(this.info);
            }
            case ArcEnum.arc19: {
                return await Arc19.getMetadata(this.info);
            }
            case ArcEnum.arc69: {
                return await Arc69.getMetadata(this.info, this.indexerService);
            }
            default: {
                throw new Error(`Asset with id ${this.id} has not a valid standard (arc)`);
            }
        }
    }
}