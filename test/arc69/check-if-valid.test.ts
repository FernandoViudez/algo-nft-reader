import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { Arc69 } from '../../src/arc69/index';
import { generateAccount, Indexer } from 'algosdk';
import * as assert from 'assert';
import { setMockObj } from './utils/mock';

let sandbox: SinonSandbox;
let mockObj: SinonStub;
let indexer = new Indexer('', process.env.INDEXER_HOST, process.env.INDEXER_PORT);

describe('Check if valid ARC69', function () {
  beforeEach(() => {
    sandbox = createSandbox();
    mockObj = sandbox.stub(Arc69, 'getLastCfgTxnNoteParsed');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should pass when valid NFT txn note is passed', async function () {
    setMockObj({
      mockObj,
      isTxn: false,
      NFTmetadata: {
        standard: 'arc69',
      },
    });
    const res = await Arc69.checkIfValidArc(
      {
        index: 1,
        params: {
          creator: generateAccount().addr,
          decimals: 0,
          total: 1,
          url: 'ipfs//QmNvHmQTDQRUFpuZZGvUGQDiT9QHXvVQXMBSDCa26jxRMK',
        },
      },
      indexer
    );
    assert.equal(res, true);
  });

  it('should fail when NFT has not a valid metadata schema', async function () {
    setMockObj({
      mockObj,
      isTxn: false,
      emptyResponse: true,
    });
    const res = await Arc69.checkIfValidArc(
      {
        index: 1,
        params: {
          creator: generateAccount().addr,
          decimals: 0,
          total: 1,
          url: 'ipfs//QmNvHmQTDQRUFpuZZGvUGQDiT9QHXvVQXMBSDCa26jxRMK',
        },
      },
      indexer
    );
    assert.equal(res, false);
  });
});
