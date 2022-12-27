import { generateAccount } from 'algosdk';
import { Arc19 } from '../../src/arc19/index';
import * as assert from 'assert';

describe('Check if is valid ARC19', function () {
  it('should pass when URL is valid template', function () {
    const response = Arc19.checkIfValidArc({
      index: 1,
      params: {
        creator: generateAccount().addr,
        decimals: 0,
        total: 1,
        url: 'template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}',
      },
    });
    assert.equal(response, true);
  });

  it('should fail when URL is invalid template', function () {
    const response = Arc19.checkIfValidArc({
      index: 1,
      params: {
        creator: generateAccount().addr,
        decimals: 0,
        total: 1,
        url: 'template-ipfs://{ipfscid,0,dag-pb,reserve,sha2-256}',
      },
    });
    assert.equal(response, false);
  });
});
