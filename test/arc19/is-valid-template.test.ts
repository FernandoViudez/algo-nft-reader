import { Arc19 } from '../../src/arc19';
import * as assert from 'assert';

describe('check if is valid template', function () {
  it('should pass when template is valid', function () {
    const response = Arc19.isValidTemplate('template-ipfs://{ipfscid:1:dag-pb:reserve:sha2-256}');
    assert.equal(response, true);
  });

  it('should fail when invalid template version', function () {
    const response = Arc19.isValidTemplate('template-ipfs://{ipfscid:2:dag-pb:reserve:sha2-256}');
    assert.equal(response, false);
  });

  it('should fail when invalid template format', function () {
    const response = Arc19.isValidTemplate('template-ipfs://{ipfscid,1,dag-pb,reserve,sha2-256}');
    assert.equal(response, false);
  });
});
