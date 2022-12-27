import { generateAccount } from 'algosdk';
import * as assert from 'assert';
import { Arc3 } from '../../src/arc3/index';

describe('Get ARC3 metadata', function () {
  const creator = generateAccount().addr;
  it('should pass when providing valid metadata URL using decentralized service', async function () {
    try {
      const response = await Arc3.getMetadata({
        index: 1,
        params: {
          creator,
          decimals: 0,
          total: 1,
          url: 'ipfs://QmQZyq4b89RfaUw8GESPd2re4hJqB8bnm4kVHNtyQrHnnK#arc3',
        },
      });
      assert.ok(response);
    } catch (error) {
      assert.fail(error);
    }
  });

  it('should pass when providing valid metadata URL using centralized service', async function () {
    try {
      const response = await Arc3.getMetadata({
        index: 1,
        params: {
          creator,
          decimals: 0,
          total: 1,
          url: 'https://nft-media.trantorian.com/PoA/unified-202209/metadata/arc3.json#arc3',
        },
      });
      assert.ok(response);
    } catch (error) {
      assert.fail(error);
    }
  });

  it('should fail when providing invalid ipfs format', async function () {
    try {
      await Arc3.getMetadata({
        index: 1,
        params: {
          creator,
          decimals: 0,
          total: 1,
          url: 'QmQZyq4b89RfaUw8GESPd2re4hJqB8bnm4kVHNtyQrHnnK#arc3',
        },
      });
    } catch (error) {
      assert.ok(error);
    }
  });

  it('should fail when providing invalid https format', async function () {
    try {
      await Arc3.getMetadata({
        index: 1,
        params: {
          creator,
          decimals: 0,
          total: 1,
          url: 'nft-media.trantorian.com/PoA/unified-202209/metadata/arc3.json#arc3',
        },
      });
    } catch (error) {
      assert.ok(error);
    }
  });

  it('should fail when providing another data different from JSON as url', async function () {
    try {
      await Arc3.getMetadata({
        index: 1,
        params: {
          creator,
          decimals: 0,
          total: 1,
          url: 'https://nft-media.trantorian.com/PoA/unified-202209/img/flyer-unified.jpg',
        },
      });
    } catch (error) {
      assert.ok(error);
    }
  });
});
