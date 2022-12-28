import { Indexer } from 'algosdk';
import { expect } from 'chai';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';
import { Arc69 } from '../../src/arc69/index';

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
    mockObj.callsFake(() =>
      Promise.resolve({
        transactions: [
          {
            note: Buffer.from(`{"standard":"arc69"}`).toString('base64'),
          },
        ],
      })
    );
    const res = await Arc69.getLastCfgTxnNoteParsed(1, indexer);
    expect(res).eql({ standard: 'arc69' });
  });

  it('should fail when txn not exists', async function () {
    mockObj.callsFake(() =>
      Promise.resolve({
        transactions: [],
      })
    );
    const res = await Arc69.getLastCfgTxnNoteParsed(1, indexer);
    expect(res).eql({ standard: 'custom' });
  });

  it('should fail when txn note is not present', async function () {
    mockObj.callsFake(() =>
      Promise.resolve({
        transactions: [{}],
      })
    );
    const res = await Arc69.getLastCfgTxnNoteParsed(1, indexer);
    expect(res).eql({ standard: 'custom' });
  });
});
