import { Algodv2 } from 'algosdk';

export interface CreateArc19 {
  client: Algodv2;
  metadataCID: string;
  template: string;
  decimals: number;
  from: string;
  total: number;
  defaultFrozen: boolean;
  assetName?: string;
  clawback?: string;
  freeze?: string;
  manager?: string;
  note?: Uint8Array;
  rekeyTo?: string;
  unitName?: string;
}
