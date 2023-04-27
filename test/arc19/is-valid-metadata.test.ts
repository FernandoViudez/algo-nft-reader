import { generateAccount } from 'algosdk';
import { Arc19 } from '../../src/arc19';
import * as assert from 'assert';

describe('check if is valid metadata', function () {
  it('should pass when NFT is valid', async function () {
    const response = await Arc19.isValidMetadata({
      index: 1,
      params: {
        creator: generateAccount().addr,
        decimals: 0,
        total: 1,
        url: 'template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}',
        reserve: 'EEQYWGGBHRDAMTEVDPVOSDVX3HJQIG6K6IVNR3RXHYOHV64ZWAEISS4CTI',
      },
    });
    assert.equal(response, true);
  });
});
