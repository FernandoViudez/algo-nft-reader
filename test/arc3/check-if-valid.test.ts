import { Arc3 } from '../../src/arc3/index';
import { generateAccount } from 'algosdk';
import * as assert from 'assert';

describe('Check If Valid ARC3', function () {
  const creator = generateAccount().addr;
  it('should pass when valid url', async function () {
    const response = await Arc3.checkIfValidArc({
      index: 1,
      params: {
        creator,
        decimals: 0,
        total: 1,
        url: 'ipfs://QmQZyq4b89RfaUw8GESPd2re4hJqB8bnm4kVHNtyQrHnnK#arc3',
        name: 'my-nft',
      },
    });
    assert.equal(response, true);
  });

  it('should pass when valid name', async function () {
    const response = await Arc3.checkIfValidArc({
      index: 1,
      params: {
        creator,
        decimals: 0,
        total: 1,
        url: 'ipfs://QmQZyq4b89RfaUw8GESPd2re4hJqB8bnm4kVHNtyQrHnnK',
        name: 'my-nft@arc3',
      },
    });
    assert.equal(response, true);
  });

  it('should fail when passing invalid url & name', async function () {
    const response = await Arc3.checkIfValidArc({
      index: 1,
      params: {
        creator,
        decimals: 0,
        total: 1,
        url: 'ipfs://QmQZyq4b89RfaUw8GESPd2re4hJqB8bnm4kVHNtyQrHnnK',
        name: 'my-nft',
      },
    });
    assert.equal(response, undefined);
  });
});
