import { Indexer } from "algosdk";
import { Arc19 } from "./arc19";
import { Arc3 } from "./arc3";
import { Arc69 } from "./arc69";
import { Arc69Metadata } from "./arc69/types/json.scheme";
import { ArcEnum } from "./enum/arc.enum";
import { AssetInfo } from "./types/asset-info.interface";
import { ArcMetadata } from "./types/json.scheme";
import { formatMediaIntegrity } from "./_utils/digital-media.utils";
import { getIntegrityB64 } from "./_utils/integrity.utils";

export class Asset {
    private id: number;
    private arc: ArcEnum;
    private info: AssetInfo;

    constructor(id: number, private readonly indexerService: Indexer) {
        this.id = id;
    }

    get index() {
        return this.id;
    }

    get standard() {
        return this.arc;
    }

    get data() {
        return this.info;
    }

    async resolveAsset() {
        await this.getAssetInfo();
        await this.setStandard();
    }

    private async getAssetInfo() {
        const response = await this.indexerService
            .lookupAssetByID(this.id)
            .do();
        // TODO: Add response formatter to replace kebab case to camel case (export that util function)
        this.info = response["asset"] as AssetInfo;
        return response["asset"] as AssetInfo;
    }

    private async setStandard() {
        if (Arc19.checkIfValidArc(this.info)) {
            this.arc = ArcEnum.arc19;
        } else if (
            await Arc69.checkIfValidArc(this.info, this.indexerService)
        ) {
            this.arc = ArcEnum.arc69;
        } else if (
            await Arc3.checkIfValidArc(this.info)
        ) {
            this.arc = ArcEnum.arc3;
        } else {
            this.arc = ArcEnum.custom;
        }
    }

    async getMetadata(): Promise<ArcMetadata | Arc69Metadata> {
        switch (this.arc) {
            case ArcEnum.arc3: {
                return await Arc3.getMetadata(this.info);
            }
            case ArcEnum.arc19: {
                return await Arc19.getMetadata(this.info);
            }
            case ArcEnum.arc69: {
                return await Arc69.getMetadata(
                    this.info,
                    this.indexerService
                );
            }
            default: {
                throw new Error(
                    `Asset with id ${this.id} has not a valid standard (arc)`
                );
            }
        }
    }

    async getDigitalMedia(): Promise<string[]> {
        switch (this.arc) {
            case ArcEnum.arc3: {
                return await Arc3.getDigitalMedia(this.info);
            }
            case ArcEnum.arc19: {
                return await Arc19.getDigitalMedia(this.info);
            }
            case ArcEnum.arc69: {
                return await Arc69.getDigitalMedia(
                    this.info,
                    this.indexerService
                );
            }
            default: {
                return [this.info.params.url];
            }
        }
    }

    async validateIntegrity() {
        // TODO: Add type for digital media
        let digitalMedia: any[] = await this.getDigitalMedia();
        digitalMedia = formatMediaIntegrity(digitalMedia);
        let validIntegrity = true;
        let i = 0;
        while (i <= digitalMedia.length || validIntegrity) {
            const realIntegrity = await getIntegrityB64(digitalMedia[i].media);
            if (digitalMedia[i].integrity != realIntegrity) {
                validIntegrity = false;
            }
            i++;
        }
        return validIntegrity;
    }
}
