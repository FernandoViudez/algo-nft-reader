import { Arc19 } from '../../src/arc19/index';
import * as assert from 'assert';

describe('Resolve asset URL - ARC19', function () {
  it('should pass when passing valid asset url', function () {
    try {
      const response = Arc19.resolveAssetUrl('template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}');
      assert.ok(response);
    } catch (error) {
      throw new Error();
    }
  });

  it('should fail when passing invalid asset url', function () {
    try {
      Arc19.resolveAssetUrl('template-ipfs://{ipfscid,0,dag-pb,sha-256}');
    } catch (error) {
      return assert.ok(error);
    }
    throw new Error();
  });
});
