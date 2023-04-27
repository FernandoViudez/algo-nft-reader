import { Arc69 } from '../../src/arc69';
import * as assert from 'assert';

describe('Check if metadata schema is valid', function () {
  it('should pass when metadata has valid schema', async function () {
    const isValidMetadata = await Arc69.isValidMetadata({
      standard: 'arc69',
    });
    assert.equal(isValidMetadata, true);
  });

  it('should fail when metadata has invalid schema', async function () {
    const isValidMetadata = await Arc69.isValidMetadata({
      test: '123',
    });
    assert.equal(isValidMetadata, false);
  });
});
