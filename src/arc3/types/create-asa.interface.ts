import { Algodv2, SuggestedParams } from 'algosdk';

export interface CreateArc3 {
  suggestedParams: SuggestedParams;
  defaultFrozen: boolean;
  from: string;
  decimals: number;
  total: number;
  metadataURI: string;
  metadataHash?: string | Uint8Array;
  assetName?: string;
  clawback?: string;
  freeze?: string;
  manager?: string;
  reserve?: string;
  unitName?: string;
  rekeyTo?: string;
  note?: Uint8Array;
}
