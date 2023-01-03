import { Algodv2 } from 'algosdk';

export interface CreateArc3 {
  client: Algodv2;
  defaultFrozen: boolean;
  from: string;
  decimals: number;
  total: number;
  metadataURI: string;
  metadataHash?: string;
  assetName?: string;
  clawback?: string;
  freeze?: string;
  manager?: string;
  reserve?: string;
  unitName?: string;
  rekeyTo?: string;
  note?: Uint8Array;
}
