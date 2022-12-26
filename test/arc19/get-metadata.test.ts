import { generateAccount } from 'algosdk';
import { Arc19 } from '../../src/arc19/index';
import * as assert from 'assert';

describe("Get ARC19 metadata", function() {
    it("should pass when reserve address & url are valid", async function(){
        const response = await Arc19.getMetadata({
            index: 1,
            params: {
                creator: generateAccount().addr,
                decimals: 0,
                total: 1,
                reserve: 'EEQYWGGBHRDAMTEVDPVOSDVX3HJQIG6K6IVNR3RXHYOHV64ZWAEISS4CTI',
                url: 'template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}'
            }
        })
        assert.ok(response);
    })
    
    it("should fail when url has invalid hash name", async function(){
        try {
            await Arc19.getMetadata({
                index: 1,
                params: {
                    creator: generateAccount().addr,
                    decimals: 0,
                    total: 1,
                    reserve: 'EEQYWGGBHRDAMTEVDPVOSDVX3HJQIG6K6IVNR3RXHYOHV64ZWAEISS4CTI',
                    url: 'template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-512}'
                }
            });
            assert.fail();
        } catch (error) {
            assert.ok(error);
        }
    })

    it("should fail when url has invalid version", async function(){
        try {
            await Arc19.getMetadata({
                index: 1,
                params: {
                    creator: generateAccount().addr,
                    decimals: 0,
                    total: 1,
                    reserve: 'EEQYWGGBHRDAMTEVDPVOSDVX3HJQIG6K6IVNR3RXHYOHV64ZWAEISS4CTI',
                    url: 'template-ipfs://{ipfscid:2:dag-pb:reserve:sha2-256}'
                }
            });
            assert.fail();
        } catch (error) {
            assert.ok(error);
        }
    })
    
    it("should fail when url has invalid codec name", async function(){
        try {
            await Arc19.getMetadata({
                index: 1,
                params: {
                    creator: generateAccount().addr,
                    decimals: 0,
                    total: 1,
                    reserve: 'EEQYWGGBHRDAMTEVDPVOSDVX3HJQIG6K6IVNR3RXHYOHV64ZWAEISS4CTI',
                    url: 'template-ipfs://{ipfscid:0:aaaaaa:reserve:sha2-256}'
                }
            });
            assert.fail();
        } catch (error) {
            assert.ok(error);
        }
    })
    
    it("should fail when url not match the pattern for ARC19", async function(){
        try {
            await Arc19.getMetadata({
                index: 1,
                params: {
                    creator: generateAccount().addr,
                    decimals: 0,
                    total: 1,
                    reserve: 'EEQYWGGBHRDAMTEVDPVOSDVX3HJQIG6K6IVNR3RXHYOHV64ZWAEISS4CTI',
                    url: 'ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}'
                }
            });
            assert.fail();
        } catch (error) {
            assert.ok(error);
        }
    })
})