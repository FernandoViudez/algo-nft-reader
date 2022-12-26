import {generateAccount} from 'algosdk';
import { Arc19 } from '../../src/arc19/index';
import * as assert from 'assert';
import { expect } from 'chai';

describe("Get digital media of ARC19", function() {
    it("should pass when valid reserve field", async function() {
        const response = await Arc19.getDigitalMedia({
            index: 1,
            params: {
                creator: generateAccount().addr,
                decimals: 0,
                total: 1,
                url: 'template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}',
                reserve: 'EEQYWGGBHRDAMTEVDPVOSDVX3HJQIG6K6IVNR3RXHYOHV64ZWAEISS4CTI'
            }
        });
        assert.ok(response);
    })
    
    it("should return empty string when passing empty metadata", async function() {
        const response = await Arc19.getDigitalMedia({
            index: 1,
            params: {
                creator: generateAccount().addr,
                decimals: 0,
                total: 1,
                url: 'template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}',
                reserve: '7YULNXKOHBA2X2CLF6OUE3BL2EVNYR2VNMCDDS6YED2JOZQJQ2K6G7XIEU'
            }
        });
        expect(response).to.be.an("array");
    })
})