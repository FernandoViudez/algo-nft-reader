import { Algodv2, SuggestedParams } from 'algosdk';

export interface CreateArc19 {
  suggestedParams: SuggestedParams;
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
