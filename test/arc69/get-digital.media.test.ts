import { SinonSandbox, SinonStub, createSandbox } from 'sinon';
import { Arc69 } from '../../src/arc69/index';

let sandbox: SinonSandbox;
let mockObj: SinonStub;

describe('Get ARC69 digital media', function () {
  beforeEach(() => {
    sandbox = createSandbox();
    mockObj = sandbox.stub(Arc69, 'lookupLastAssetCfgTxn');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get digital media of the NFT', async function () {});
});
