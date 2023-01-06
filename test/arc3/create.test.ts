import { generateAccount } from 'algosdk';
import { Arc3 } from '../../src/arc3/index';
import * as assert from 'assert';
import { CreateArc3 } from '../../src';
import { getIntegrityB64 } from '../../src/_utils/integrity.utils';

describe('create NFT following ARC3', function () {
  it('should pass when creating a valid txn', async () => {
    const nftParams: CreateArc3 = {
      decimals: 0,
      defaultFrozen: false,
      from: generateAccount().addr,
      metadataURI: 'ipfs://QmQZyq4b89RfaUw8GESPd2re4hJqB8bnm4kVHNtyQrHnnK#arc3',
      suggestedParams: {
        fee: 1000,
        firstRound: 1,
        genesisHash: 'asda',
        genesisID: 'asdas',
        lastRound: 1,
      },
      total: 1,
    };
    const txn = await Arc3.create(nftParams);
    assert.equal(txn.assetURL, nftParams.metadataURI);
    assert.equal(txn.type, 'acfg');
    assert.deepEqual(txn.note, new Uint8Array(0));
    assert.equal(txn.assetTotal, 1);
    assert.equal(txn.assetDecimals, 0);
    assert.equal(txn.assetDefaultFrozen, false);
  });

  it('should fail when passing invalid metadata URI & asset name', async () => {
    const nftParams: CreateArc3 = {
      decimals: 0,
      defaultFrozen: false,
      from: generateAccount().addr,
      metadataURI: 'ipfs://QmQZyq4b89RfaUw8GESPd2re4hJqB8bnm4kVHNtyQrHnnK',
      assetName: 'nft',
      suggestedParams: {
        fee: 1000,
        firstRound: 1,
        genesisHash: 'asda',
        genesisID: 'asdas',
        lastRound: 1,
      },
      total: 1,
    };
    try {
      await Arc3.create(nftParams);
    } catch (error) {
      return assert.ok(error);
    }
    throw new Error();
  });

  it('should fail when passing valid metadata URI but without metadata hash', async () => {
    const nftParams: CreateArc3 = {
      decimals: 0,
      defaultFrozen: false,
      from: generateAccount().addr,
      metadataURI: 'https://nft-media.trantorian.com/PoA/unified-202209/metadata/arc3.json#arc3',
      assetName: 'nft',
      suggestedParams: {
        fee: 1000,
        firstRound: 1,
        genesisHash: 'asda',
        genesisID: 'asdas',
        lastRound: 1,
      },
      total: 1,
    };
    try {
      await Arc3.create(nftParams);
    } catch (error) {
      return assert.ok(error);
    }
    throw new Error();
  });

  it('should pass when passing valid metadata URI with metadata hash', async () => {
    const metadataURI =
      'https://nft-media.trantorian.com/PoA/unified-202209/metadata/arc3.json#arc3';
    const nftParams: CreateArc3 = {
      decimals: 0,
      defaultFrozen: false,
      from: generateAccount().addr,
      metadataURI,
      assetName: 'nft',
      metadataHash: new Uint8Array(Buffer.from(await getIntegrityB64(metadataURI), 'base64')),
      suggestedParams: {
        fee: 1000,
        firstRound: 1,
        genesisHash: 'asda',
        genesisID: 'asdas',
        lastRound: 1,
      },
      total: 1,
    };
    const txn = await Arc3.create(nftParams);
    assert.equal(txn.assetName, nftParams.assetName);
    assert.equal(txn.assetURL, nftParams.metadataURI);
    assert.deepEqual(txn.assetMetadataHash, nftParams.metadataHash);
  });
});
