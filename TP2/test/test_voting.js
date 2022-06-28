const Voting = artifacts.require('./Voting.sol');
const {BN,expectRevert,expectEvent}=require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract("test_voting", accounts=>{
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const voter4 = accounts[4];
    const voter5 = accounts[5];
    const voter6 = accounts[6];
    const voter7 = accounts[7];
    const voter8 = accounts[8];
    const voter9 = accounts[9];
    const nonVoter = accounts[10];

    let proposal1 = 'proposal 1';
    let proposal2 = 'proposal 2';
    let proposal3 = 'proposal 3';
    let proposal4 = 'proposal 4';
    let proposal5 = 'proposal 5';
    let proposal6 = 'proposal 6';
    let proposal7 = 'proposal 7';
    let proposal8 = 'proposal 8';
    let proposal9 = 'proposal 9';
    let votingInstance;

    const WorkflowStatus = {
        RegisteringVoters:0,
        ProposalsRegistrationStarted:1,
        ProposalsRegistrationEnded:2,
        VotingSessionStarted: 3,
        VotingSessionEnded: 4,
        VotesTallied: 5
    }

    function newInstance(){
        return Voting.new({from : owner})
    }
    
    describe("Test RegisteringVoters status", function(){
        let votingInstance;

        before (async () =>{
            votingInstance = await (newInstance());
        });


        describe("getVoter function", function (){
            describe('Test reverts', function () {
                before(async () => {
                    votingInstance = await newInstance();
                    await votingInstance.addVoter(voter1, {from: owner});
                });

                it ("should require 1 argument", async ()=> {
                    await expectRevert( votingInstance.getVoter(), 'Invalid number of parameters for "getVoter". Got 0 expected 1!');
                });

                it ("should require an address as argument", async ()=> {
                    await expectRevert( votingInstance.getVoter('toto'), 'invalid address (argument="address", value="toto", code=INVALID_ARGUMENT, version=address/5.0.5) (argument="_addr", value="toto", code=INVALID_ARGUMENT, version=abi/5.0.7)');
                });
    
                it ("should reject non whitelist voter", async ()=> {
                    await expectRevert( votingInstance.getVoter(owner), "You're not a voter");
                });

                it('should isRegistered to be false', async () => {
                    const voter = await votingInstance.getVoter(voter2, {from: voter1});
                    expect(voter.isRegistered).to.be.false;
                });
                it('should hasVoted to be false', async () => {
                    const voter = await votingInstance.getVoter(voter2, {from: voter1});
                    expect(voter.hasVoted).to.be.false;
                });
            });

            describe('Test return data', function () {
                let voter;
                before(async () => {

                    votingInstance = await newInstance();
                    await votingInstance.addVoter(voter1, {from: owner});
                    await votingInstance.addVoter(voter2, {from: owner});
                    voter = await votingInstance.getVoter(voter1, {from: voter2});
                });

                it('should isRegistered to be true', async () => {
                    expect(voter.isRegistered).to.be.true;
                });
                it('should hasVoted to be false', async () => {
                    expect(voter.hasVoted).to.be.false;
                });
            });
        });

        describe('addVoter function', function () {
            let result;
            it('should require 1 parameter', async () => {
                await expectRevert( votingInstance.addVoter(), 'Invalid number of parameters for "addVoter". Got 0 expected 1!');
            });
            it('should require an address as parameter', async () => {
                await expectRevert( votingInstance.addVoter('test'), 'invalid address (argument="address", value="test", code=INVALID_ARGUMENT, version=address/5.0.5) (argument="_addr", value="test", code=INVALID_ARGUMENT, version=abi/5.0.7)' );
            });
            it('should be restricted to owner only', async () => {
                await expectRevert( votingInstance.addVoter(voter1, {from: voter1}), 'Ownable: caller is not the owner.' );
            });
         
            it('should add 3rd voter', async () => {
                await votingInstance.addVoter(voter3, {from: owner});
                const voter = await votingInstance.getVoter(voter3, {from: voter1});
                expect(voter.isRegistered).to.be.true;
            });
            it('should add 4th voters', async () => {
                result = await votingInstance.addVoter(voter4, {from: owner});
                const voter = await votingInstance.getVoter(voter4, {from: voter1});
                expect(voter.isRegistered).to.be.true;
            });
            it('should not add an added voter', async () => {
                expectRevert(votingInstance.addVoter(voter3, {from: owner}), 'Already registered');
            });
            it('should emit VoterRegistered event', async () => {
                expectEvent(result, 'VoterRegistered', {voterAddress: voter4});
            })

        });

    });

    describe("Test ProposalsRegistrationStarted status", function(){
        let votingInstance;
        describe('addProposal function', function () {
            before(async () => {
                votingInstance = await newInstance();
                await votingInstance.addVoter(voter1, {from: owner});
                await votingInstance.addVoter(voter2, {from: owner});
                await votingInstance.addVoter(voter3, {from: owner});
                await votingInstance.addVoter(voter4, {from: owner});
                await votingInstance.addVoter(voter5, {from: owner});
                await votingInstance.addVoter(voter6, {from: owner});
                await votingInstance.addVoter(voter7, {from: owner});
                await votingInstance.addVoter(voter8, {from: owner});
                await votingInstance.addVoter(voter9, {from: owner});
                await votingInstance.startProposalsRegistering({from: owner});
            });
            it('should reject non whitelist voter', async () => {
                await expectRevert( votingInstance.addProposal(proposal1, {from: nonVoter}), 'You\'re not a voter' );
            });
            it('should expect 1 argument', async () => {
                await expectRevert( votingInstance.addProposal('', {from: voter1}), 'Vous ne pouvez pas ne rien proposer.');
            });

            describe('Emit ProposalRegistered event', () => {
                let res1,res2,res3,res4,res5,res6,res7,res8,res9;
                before(async () => {
                    res1 = await votingInstance.addProposal(proposal1, {from: voter1});
                    res2 = await votingInstance.addProposal(proposal2, {from: voter2});
                    res3 = await votingInstance.addProposal(proposal3, {from: voter3});
                    res4 = await votingInstance.addProposal(proposal4, {from: voter4});
                    res5 = await votingInstance.addProposal(proposal5, {from: voter5});
                    res6 = await votingInstance.addProposal(proposal6, {from: voter6});
                    res7 = await votingInstance.addProposal(proposal7, {from: voter7});
                    res8 = await votingInstance.addProposal(proposal8, {from: voter8});
                    res9 = await votingInstance.addProposal(proposal9, {from: voter9});
                });

                it('should emit "ProposalRegistered" event , id = 0', async () => {
                    expectEvent(res1, 'ProposalRegistered',{0 : new BN(0)});
                });
                it('should emit "ProposalRegistered" event , id = 1', async () => {
                    expectEvent(res2, 'ProposalRegistered', {0 : new BN(1)});
                });
                it('should emit "ProposalRegistered" event , id = 2', async () => {
                    expectEvent(res3, 'ProposalRegistered', {0 : new BN(2)});
                });
                it('should emit "ProposalRegistered" event , id = 3', async () => {
                    expectEvent(res4, 'ProposalRegistered', {0 : new BN(3)});
                });
                it('should emit "ProposalRegistered" event , id = 4', async () => {
                    expectEvent(res5, 'ProposalRegistered', {0 : new BN(4)});
                });
                it('should emit "ProposalRegistered" event , id = 5', async () => {
                    expectEvent(res6, 'ProposalRegistered', {0 : new BN(5)});
                });
                it('should emit "ProposalRegistered" event , id = 6', async () => {
                    expectEvent(res7, 'ProposalRegistered', {0 : new BN(6)});
                });
                it('should emit "ProposalRegistered" event , id = 7', async () => {
                    expectEvent(res8, 'ProposalRegistered', {0 : new BN(7)});
                });
                it('should emit "ProposalRegistered" event , id = 8', async () => {
                    expectEvent(res9, 'ProposalRegistered', {0 : new BN(8)});
                });
            });

            describe('getOneProposal', function (){
                before(async () => {
                    votingInstance = await newInstance();
                    await votingInstance.addVoter(voter1, {from: owner});
                    await votingInstance.startProposalsRegistering({from : owner});
                });

                it('should reject proposal from non whitelist voter', async () => {
                    await expectRevert( votingInstance.getOneProposal(0, {from: nonVoter}), 'You\'re not a voter' );
                });
            });
        });

    });

    describe("Test VotingSessionStarted status", function (){
        let votingInstance;

        describe('setVote function', function () {
            before(async () => {
                votingInstance = await newInstance();
                await votingInstance.addVoter(voter1, {from : owner});
                await votingInstance.addVoter(voter2, {from : owner});
                await votingInstance.addVoter(voter3, {from : owner});
                await votingInstance.addVoter(voter4, {from : owner});
                await votingInstance.addVoter(voter5, {from : owner});
                await votingInstance.addVoter(voter6, {from : owner});
                await votingInstance.addVoter(voter7, {from : owner});
                await votingInstance.addVoter(voter8, {from : owner});
                await votingInstance.addVoter(voter9, {from : owner});
                await votingInstance.startProposalsRegistering({from: owner});
                await votingInstance.addProposal(proposal1,{from : voter1});
                await votingInstance.addProposal(proposal2,{from : voter2});
                await votingInstance.addProposal(proposal3,{from : voter3});
                await votingInstance.addProposal(proposal4,{from : voter4});
                await votingInstance.endProposalsRegistering({from: owner});
                await votingInstance.startVotingSession({from: owner});
            });
        
            it('should reject non whitelist voter', async () => {
                await expectRevert(votingInstance.setVote(0, {from: nonVoter}), 'You\'re not a voter' );
            });
        
            it('should emit "Voted" event for voter 1', async () => {
                expectEvent( await votingInstance.setVote(1, {from: voter1}), 'Voted', {voter: voter1, proposalId: new BN(1)} );
            });
            it('should revert for already voted', async () => {
                await expectRevert( votingInstance.setVote(1, {from: voter1}), 'You have already voted');
            });
            it('should hasVoted equal true to voter1', async () => {
                const voter = await votingInstance.getVoter(voter1, {from: voter1});
                expect(voter.hasVoted).to.be.true;
            });
        });
    });

    describe("Test VotingSessionEnded status", function(){
        let votingInstance;

        describe("Test TallyVotes function",function(){
            before(async()=>{
                // on refait le processus intégral
                votingInstance = await newInstance();
                //on ajoute les 9 electeurs
                await votingInstance.addVoter(voter1, {from : owner});
                await votingInstance.addVoter(voter2, {from : owner});
                await votingInstance.addVoter(voter3, {from : owner});
                await votingInstance.addVoter(voter4, {from : owner});
                await votingInstance.addVoter(voter5, {from : owner});
                await votingInstance.addVoter(voter6, {from : owner});
                await votingInstance.addVoter(voter7, {from : owner});
                await votingInstance.addVoter(voter8, {from : owner});
                await votingInstance.addVoter(voter9, {from : owner});
                /// on ajouter 4 propositions (0,1,2,3)
                await votingInstance.startProposalsRegistering({from : owner});
                await votingInstance.addProposal(proposal1,{from : voter1});
                await votingInstance.addProposal(proposal2,{from : voter2});
                await votingInstance.addProposal(proposal3,{from : voter3});
                await votingInstance.addProposal(proposal4,{from : voter4});
                await votingInstance.endProposalsRegistering({from : owner});
                //on vote
                await votingInstance.startVotingSession({from:owner});
                await votingInstance.setVote(0, {from : voter1});
                await votingInstance.setVote(1, {from : voter2});
                await votingInstance.setVote(0, {from : voter3});
                await votingInstance.setVote(2, {from : voter4});
                await votingInstance.setVote(2, {from : voter5});
                await votingInstance.setVote(3, {from : voter6});
                await votingInstance.setVote(1, {from : voter7});
                await votingInstance.setVote(0, {from : voter8});
                await votingInstance.setVote(0, {from : voter9});
                await votingInstance.endVotingSession({from:owner});
                //resultats du vote : {prop0,prop1,prop2,prop3} = {4,2,2,1} - winnerId=0
            });
            it('should emit WorkflowStatusChange event', async () => {
                const res = await votingInstance.tallyVotes({from: owner});
                expectEvent(res, 'WorkflowStatusChange', {previousStatus: new BN(WorkflowStatus.VotingSessionEnded), newStatus: new BN(WorkflowStatus.VotesTallied)});
            });

            it('should set winnigProposalId to 0', async () => {
                expect(await votingInstance.winningProposalID()).to.be.bignumber.equal(new BN(0));
            });
        });
    });

});