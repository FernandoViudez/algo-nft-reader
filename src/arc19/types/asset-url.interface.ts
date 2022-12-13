import { MulticodecEnum } from './multicodec.types';
import { MultihashEnum } from './multihash.types';
export interface AssetUrl {
    templateType: string;
    version: 0 | 1;
    multiCodec: MulticodecEnum; 
    fieldName: string; 
    hashType: MultihashEnum;
}