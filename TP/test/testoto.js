const Storage = artifacts.require("./Storage.sol");
const {BN,expectRevert,expectEvent}=require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract("Storage2", accounts => {
    const owner = accounts[0];
    let storageInstance;
    describe("test complet",function(){
        this.beforeEach(async function(){
            storageInstance = await Storage.new({from : owner});
        });

        it("...should store the value 89",async() =>{
            await storageInstance.store(89,{from : owner});
            const storedData = await storageInstance.retrieve.call();
            expect(new BN(storedData)).to.be.bignumber.equal(new BN(89));
        });

        it("should revert on value 0", async()=>{
            await expectRevert(storageInstance.store(0,{from : owner}), 'non');
        });

        it("shouled emit event on set",async()=>{
             expectEvent(await storageInstance.store (new BN(12),{from : owner}),"dataStored", {_data: new BN(12),_addr:owner})
        });
    })
});