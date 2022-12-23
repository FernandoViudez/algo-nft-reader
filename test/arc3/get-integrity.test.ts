import { Arc3 } from '../../src/arc3/index';
import { generateAccount } from 'algosdk';
import * as assert from 'assert';
import { expect } from 'chai';

describe("Get ARC3 integrity", function() {
    it("should return integrity string when using https", function() {
        const creator = generateAccount().addr;
        const response = Arc3.getMetadataIntegrity({
            index: 1,
            params: {
                creator,
                decimals: 0,
                total: 1,
                url: 'https://nft-media.trantorian.com/PoA/unified-202209/img/flyer-unified.jpg',
                "metadata-hash": 'A7ni1V3M/7jkHqXeTZuQu8c3gsdaaGofjd08GZrm654=',
            }
        })
        assert.equal(response, 'A7ni1V3M/7jkHqXeTZuQu8c3gsdaaGofjd08GZrm654=');
    })

    it("should return undefined when using ipfs", function() {
        const creator = generateAccount().addr;
        const response = Arc3.getMetadataIntegrity({
            index: 1,
            params: {
                creator,
                decimals: 0,
                total: 1,
                url: 'ipfs://QmfSnGmfexFsLDkbgN76Qhx2W8sxrNDobFEQZ6ER5qg2wW',
            }
        })
        assert.equal(response === undefined, true);
    })
})