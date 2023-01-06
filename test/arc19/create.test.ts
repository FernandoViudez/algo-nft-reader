import { decodeAddress, generateAccount } from 'algosdk';
import { Arc19 } from '../../src/arc19';
import { CreateArc19 } from '../../src/arc19/types/create-asa.interface';
import * as assert from 'assert';
import { fromCIDToAddress } from '../../src';

describe('create NFT using ARC19', () => {
  it('should pass when providing valid nft params', async () => {
    const nftParams: CreateArc19 = {
      decimals: 0,
      defaultFrozen: false,
      from: generateAccount().addr,
      metadataCID: 'QmQZyq4b89RfaUw8GESPd2re4hJqB8bnm4kVHNtyQrHnnK',
      suggestedParams: {
        fee: 1,
        firstRound: 1,
        genesisHash: 'zxc',
        genesisID: 'zxc',
        lastRound: 1,
      },
      template: 'template-ipfs://{ipfscid:1:dag-pb:reserve:sha2-256}',
      total: 1,
    };
    const txn = await Arc19.create(nftParams);
    assert.equal(txn.assetDefaultFrozen, nftParams.defaultFrozen);
    assert.equal(txn.assetURL, nftParams.template);
    assert.deepStrictEqual(
      txn.assetReserve,
      decodeAddress(fromCIDToAddress(nftParams.metadataCID))
    );
  });

  it('should fail when providing invalid template', async () => {
    const nftParams: CreateArc19 = {
      decimals: 0,
      defaultFrozen: false,
      from: generateAccount().addr,
      metadataCID: 'QmQZyq4b89RfaUw8GESPd2re4hJqB8bnm4kVHNtyQrHnnK',
      suggestedParams: {
        fee: 1,
        firstRound: 1,
        genesisHash: 'zxc',
        genesisID: 'zxc',
        lastRound: 1,
      },
      template: 'template://{ipfscid:1:dag-pb:reserve:sha2-256}',
      total: 1,
    };
    try {
      await Arc19.create(nftParams);
    } catch (error) {
      return assert.ok(error);
    }
    throw new Error();
  });
});
