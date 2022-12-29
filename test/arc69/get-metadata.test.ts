import { generateAccount, Indexer } from 'algosdk';
import { expect } from 'chai';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';
import { Arc69 } from '../../src/arc69/index';
import * as assert from 'assert';
import { setMockObj } from './utils/mock';

let indexer = new Indexer('', process.env.INDEXER_HOST, process.env.INDEXER_PORT);
let sandbox: SinonSandbox;
let mockObj: SinonStub;

describe('get ARC69 metadata', function () {
  beforeEach(() => {
    sandbox = createSandbox();
    mockObj = sandbox.stub(Arc69, 'lookupLastAssetCfgTxn');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should pass when passing valid metadata', async function () {
    let expectedMetadata = {
      standard: 'arc69',
    };
    setMockObj({
      mockObj,
      NFTmetadata: expectedMetadata,
    });
    const metadata = await Arc69.getMetadata(
      {
        index: 1,
        params: {
          creator: generateAccount().addr,
          decimals: 0,
          total: 1,
          url: 'ipfs://QmfM89SDKizrDec6JoohuoZVBJGBUDCMRumJRHD5Q99Ffk',
        },
      },
      indexer
    );
    expect(metadata).to.eql(expectedMetadata);
  });

  it('should fail when NFT has not cfg txns', async function () {
    setMockObj({
      mockObj,
      emptyResponse: true,
    });
    try {
      await Arc69.getMetadata(
        {
          index: 1,
          params: {
            creator: generateAccount().addr,
            decimals: 0,
            total: 1,
            url: 'ipfs://QmfM89SDKizrDec6JoohuoZVBJGBUDCMRumJRHD5Q99Ffk',
          },
        },
        indexer
      );
    } catch (error) {
      return assert.ok(error);
    }
    throw new Error();
  });

  it('should fail when NFT metadata is not a json', async function () {
    setMockObj({
      mockObj,
      NFTmetadata: 'test',
    });
    try {
      await Arc69.getMetadata(
        {
          index: 1,
          params: {
            creator: generateAccount().addr,
            decimals: 0,
            total: 1,
            url: 'ipfs://QmfM89SDKizrDec6JoohuoZVBJGBUDCMRumJRHD5Q99Ffk',
          },
        },
        indexer
      );
    } catch (error) {
      return assert.ok(error);
    }
    throw new Error();
  });
});
