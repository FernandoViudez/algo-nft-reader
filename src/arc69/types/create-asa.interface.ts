import { SuggestedParams } from 'algosdk';
import { Arc69Metadata } from './json.scheme';

export interface CreateArc69 {
  suggestedParams: SuggestedParams;
  decimals: number;
  defaultFrozen: boolean;
  digitalMediaURI: string;
  metadata: Arc69Metadata;
  from: string;
  total: number;
  digitalMediaHash?: string | Uint8Array;
  assetName?: string;
  clawback?: string;
  freeze?: string;
  manager?: string;
  rekeyTo?: string;
  reserve?: string;
  unitName?: string;
}
