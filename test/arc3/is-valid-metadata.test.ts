import { Arc3 } from '../../src/arc3';
import * as assert from 'assert';

describe('check if metadata is following correct schema', function () {
  it('should pass when following correct schema', async function () {
    const response = await Arc3.isValidMetadata(
      'ipfs://Qmdr77E53REayi7nti9tKH9xDmbWr8ziDMtd9yfZ8n4iHU'
    );
    assert.equal(response, true);
  });
});
