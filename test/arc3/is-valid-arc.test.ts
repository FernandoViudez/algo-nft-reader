import { Arc3 } from '../../src/arc3/index';
import { generateAccount } from 'algosdk';
import * as assert from 'assert';

describe('Check if is valid ARC3', function () {
  const creator = generateAccount().addr;
  it('should pass when valid url & name', async function () {
    const response = await Arc3.isValidArc(
      'ipfs://Qmdr77E53REayi7nti9tKH9xDmbWr8ziDMtd9yfZ8n4iHU#arc3',
      'my-nft'
    );
    assert.equal(response, true);
  });

  it('should pass when valid name', async function () {
    const response = await Arc3.isValidArc(
      'ipfs://Qmdr77E53REayi7nti9tKH9xDmbWr8ziDMtd9yfZ8n4iHU',
      'my-nft@arc3'
    );
    assert.equal(response, true);
  });

  it('should fail when passing invalid url & name', async function () {
    const response = await Arc3.isValidArc(
      'ipfs://Qmdr77E53REayi7nti9tKH9xDmbWr8ziDMtd9yfZ8n4iHU',
      'my-nft'
    );
    assert.equal(response, false);
  });

  it('should fail when passing invalid url & name', async function () {
    const response = await Arc3.isValidArc(
      'ipfs://Qmdr77E53REayi7nti9tKH9xDmbWr8ziDMtd9yfZ8n4iHU',
      'my-nft'
    );
    assert.equal(response, false);
  });
});
