import { Algodv2 } from 'algosdk';
import { Arc69Metadata } from './json.scheme';

export interface CreateArc69 {
  decimals: number;
  defaultFrozen: boolean;
  digitalMediaURI: string;
  metadata: Arc69Metadata;
  from: string;
  client: Algodv2;
  total: number;
  digitalMediaHash: string;
  assetName?: string;
  clawback?: string;
  freeze?: string;
  manager?: string;
  rekeyTo?: string;
  reserve?: string;
  unitName?: string;
}
