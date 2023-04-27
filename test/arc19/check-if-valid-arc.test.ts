import { Arc19 } from '../../src/arc19/index';
import * as assert from 'assert';
import { generateAccount } from 'algosdk';

describe('Check if is valid ARC19', function () {
  it('should pass when nft is valid ARC19', async function () {
    const response = await Arc19.isValidArc({
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

  it('should fail when URL is invalid template', async function () {
    const response = await Arc19.isValidArc({
      index: 1,
      params: {
        creator: generateAccount().addr,
        decimals: 0,
        total: 1,
        url: 'template-ipfs://{ipfscid,0,dag-pb,reserve,sha2-256}',
        reserve: 'EEQYWGGBHRDAMTEVDPVOSDVX3HJQIG6K6IVNR3RXHYOHV64ZWAEISS4CTI',
      },
    });
    assert.equal(response, false);
  });
});
