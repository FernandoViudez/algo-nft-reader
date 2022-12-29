import { Indexer } from 'algosdk';
import { expect } from 'chai';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';
import { Arc69 } from '../../src/arc69/index';
import { setMockObj } from './utils/mock';

let sandbox: SinonSandbox;
let mockObj: SinonStub;
let indexer = new Indexer('', process.env.INDEXER_HOST, process.env.INDEXER_PORT);

describe('Get last cfg txn note', function () {
  beforeEach(() => {
    sandbox = createSandbox();
    mockObj = sandbox.stub(Arc69, 'lookupLastAssetCfgTxn');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should pass when note is correctly parsed & exists', async function () {
    setMockObj({
      mockObj,
      NFTmetadata: { standard: 'arc69' },
    });
    const res = await Arc69.getLastCfgTxnNoteParsed(1, indexer);
    expect(res).eql({ standard: 'arc69' });
  });

  it('should fail when txn not exists', async function () {
    setMockObj({
      mockObj,
      emptyResponse: true,
    });
    const res = await Arc69.getLastCfgTxnNoteParsed(1, indexer);
    expect(res).eql({ standard: 'custom' });
  });

  it('should fail when txn note is not present', async function () {
    setMockObj({
      mockObj,
      emptyTxn: true,
    });
    const res = await Arc69.getLastCfgTxnNoteParsed(1, indexer);
    expect(res).eql({ standard: 'custom' });
  });
});
