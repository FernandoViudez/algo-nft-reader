import { generateAccount, Indexer } from 'algosdk';
import { expect } from 'chai';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';
import { Arc69 } from '../../src/arc69/index';
import { setMockObj } from './utils/mock';

let sandbox: SinonSandbox;
let mockObj: SinonStub;
let indexer = new Indexer('', process.env.INDEXER_HOST, process.env.INDEXER_PORT);

describe('Get ARC69 digital media', function () {
  beforeEach(() => {
    sandbox = createSandbox();
    mockObj = sandbox.stub(Arc69, 'lookupLastAssetCfgTxn');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get digital media of the NFT', async function () {
    setMockObj({
      mockObj,
      NFTmetadata: {
        standard: 'arc69',
        media_url: 'ipfs://QmNvHmQTDQRUFpuZZGvUGQDiT9QHXvVQXMBSDCa26jxRMK',
      },
    });

    const digitalMedia = await Arc69.getDigitalMedia(
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

    expect(digitalMedia).to.be.an('array');
    expect(digitalMedia.length).eql(2);
    expect(digitalMedia[0].media).eql('ipfs://QmfM89SDKizrDec6JoohuoZVBJGBUDCMRumJRHD5Q99Ffk');
    expect(digitalMedia[1].media).eql('ipfs://QmNvHmQTDQRUFpuZZGvUGQDiT9QHXvVQXMBSDCa26jxRMK');
    expect(digitalMedia[0].integrity).eq(undefined);
    expect(digitalMedia[1].integrity).eq(undefined);
  });

  it('should return empty string when NFT has not digital media', async function () {
    setMockObj({
      mockObj,
      NFTmetadata: {
        standard: 'arc69',
      },
    });
  });
});
