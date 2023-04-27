import { generateAccount } from 'algosdk';
import { CreateArc69 } from '../../src';
import { Arc69 } from '../../src/arc69/index';
import * as assert from 'assert';
import { getIntegrityB64 } from '../../src/_utils/integrity.utils';

describe('create NFT using ARC69', () => {
  it('should pass when metadata is valid', async () => {
    const nftParams: CreateArc69 = {
      decimals: 0,
      defaultFrozen: false,
      digitalMediaURI: 'ipfs://QmNvHmQTDQRUFpuZZGvUGQDiT9QHXvVQXMBSDCa26jxRMK',
      from: generateAccount().addr,
      metadata: {
        standard: 'arc69',
      },
      suggestedParams: {
        fee: 1,
        firstRound: 1,
        genesisHash: 'asd',
        genesisID: 'asd',
        lastRound: 1,
      },
      total: 1,
    };
    const txn = await Arc69.create(nftParams);
    assert.equal(txn.assetDefaultFrozen, nftParams.defaultFrozen);
    assert.equal(txn.assetURL, nftParams.digitalMediaURI);
    assert.deepStrictEqual(
      txn.note,
      new Uint8Array(Buffer.from(JSON.stringify(nftParams.metadata)))
    );
  });

  it('should pass when digital media URI is centralized and metadata hash is specified', async () => {
    const digitalMediaURI =
      'https://src.trantorian.com/img/landing-page/trantorian-wallpaper-logo.png';
    const nftParams: CreateArc69 = {
      decimals: 0,
      defaultFrozen: false,
      digitalMediaURI,
      digitalMediaHash: new Uint8Array(
        Buffer.from(await getIntegrityB64(digitalMediaURI), 'base64')
      ),
      from: generateAccount().addr,
      metadata: {
        standard: 'arc69',
      },
      suggestedParams: {
        fee: 1,
        firstRound: 1,
        genesisHash: 'asd',
        genesisID: 'asd',
        lastRound: 1,
      },
      total: 1,
    };
    const txn = await Arc69.create(nftParams);
    assert.equal(txn.assetDefaultFrozen, nftParams.defaultFrozen);
    assert.equal(txn.assetURL, nftParams.digitalMediaURI);
    assert.deepStrictEqual(
      txn.note,
      new Uint8Array(Buffer.from(JSON.stringify(nftParams.metadata)))
    );
  });

  it('should fail when providing invalid metadata schema', async () => {
    const nftParams: CreateArc69 = {
      decimals: 0,
      defaultFrozen: false,
      digitalMediaURI: 'ipfs://QmNvHmQTDQRUFpuZZGvUGQDiT9QHXvVQXMBSDCa26jxRMK',
      from: generateAccount().addr,
      metadata: {
        invalid: 'metadata',
      } as any,
      suggestedParams: {
        fee: 1,
        firstRound: 1,
        genesisHash: 'asd',
        genesisID: 'asd',
        lastRound: 1,
      },
      total: 1,
    };
    try {
      await Arc69.create(nftParams);
    } catch (error) {
      return assert.ok(error);
    }
    throw new Error();
  });

  it('should fail when digital media URI is centralized and metadata hash is not specified', async () => {
    const digitalMediaURI =
      'https://src.trantorian.com/img/landing-page/trantorian-wallpaper-logo.png';
    const nftParams: CreateArc69 = {
      decimals: 0,
      defaultFrozen: false,
      digitalMediaURI,
      from: generateAccount().addr,
      metadata: {
        standard: 'arc69',
      } as any,
      suggestedParams: {
        fee: 1,
        firstRound: 1,
        genesisHash: 'asd',
        genesisID: 'asd',
        lastRound: 1,
      },
      total: 1,
    };
    try {
      await Arc69.create(nftParams);
    } catch (error) {
      return assert.ok(error);
    }
    throw new Error();
  });
});
