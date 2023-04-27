import { Arc3 } from '../../src/arc3/index';
import * as assert from 'assert';

describe('Check if ARC3 has valid url and name', function () {
  it('should pass when only url is valid', function () {
    const response = Arc3.isValidUrlAndName(
      'ipfs://Qmdr77E53REayi7nti9tKH9xDmbWr8ziDMtd9yfZ8n4iHU#arc3',
      'nft'
    );
    assert.equal(response, true);
  });

  it('should pass when only name is valid', function () {
    const response = Arc3.isValidUrlAndName(
      'ipfs://Qmdr77E53REayi7nti9tKH9xDmbWr8ziDMtd9yfZ8n4iHU',
      'nft-arc3'
    );
    assert.equal(response, true);
  });

  it('should pass when url and name are valid', function () {
    const response = Arc3.isValidUrlAndName(
      'ipfs://Qmdr77E53REayi7nti9tKH9xDmbWr8ziDMtd9yfZ8n4iHU#arc3',
      'nft-arc3'
    );
    assert.equal(response, true);
  });

  it('should fail when url and name are invalid', function () {
    const response = Arc3.isValidUrlAndName(
      'ipfs://Qmdr77E53REayi7nti9tKH9xDmbWr8ziDMtd9yfZ8n4iHU',
      'nft'
    );
    assert.equal(response, false);
  });
});
