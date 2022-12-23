import { generateAccount } from 'algosdk';
import { Arc3 } from '../../src/arc3/index';
import { expect } from 'chai';

describe("Get ARC3 digital media", function() {
    it("should pass when passing valid asset info url", async function() {
        const creator = generateAccount().addr;
        const asaInfo = {
            index: 1,
            params: {
                creator,
                decimals: 0,
                total: 1,
                url: 'https://nft-media.trantorian.com/PoA/unified-202209/metadata/arc3.json#arc3'
            }
        }
        const response = await Arc3.getDigitalMedia(asaInfo);
        expect(response).to.eql([
            {
                media: 'https://nft-media.trantorian.com/PoA/unified-202209/img/flyer-unified.jpg',
                integrity: 'sha256-A7ni1V3M/7jkHqXeTZuQu8c3gsdaaGofjd08GZrm654='
            }
        ])
    })
    
    it("should return empty string when passing url without digital media", async function() {
        const creator = generateAccount().addr;
        const asaInfo = {
            index: 1,
            params: {
                creator,
                decimals: 0,
                total: 1,
                url: 'ipfs://QmfSnGmfexFsLDkbgN76Qhx2W8sxrNDobFEQZ6ER5qg2wW#arc3'
            }
        }
        const response = await Arc3.getDigitalMedia(asaInfo);
        expect(response).to.be.an("array");
    })
})