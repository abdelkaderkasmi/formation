const etudiant = artifacts.require("./etudiant.sol");
const {BN,expectRevert,expectEvent}=require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract("etudiant2", accounts => {
    const owner = accounts[0];
    let etudiantInstance;
    describe("test complet",function(){
        this.beforeEach(async function(){
            etudiantInstance = await etudiant.new({from : owner});
        });

        it("...should store the student 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",async() =>{
            await etudiantInstance.setStudent("toto2",new BN(2),"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",{from : owner});
            const storedData = await etudiantInstance.getStudent.call("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
            expect(storedData.note).to.be.bignumber.equal(new BN(2));
            expect(storedData.name).to.be.equal("toto2");
        });

        
        it("...should store the student 2 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",async() =>{
            const storedData = await etudiantInstance.getStudent2.call("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
            expect(storedData.note).to.be.bignumber.equal(new BN(2));
            expect(storedData.name).to.be.equal("toto4");
        });

    })
});