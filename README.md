 
 Contract: test_voting
 
     Test RegisteringVoters status
       getVoter function
         Test reverts
          ✔ should require 1 argument (755ms)
          ✔ should require an address as argument
          ✔ should reject non whitelist voter (39ms)
          ✔ should isRegistered to be false
          ✔ should hasVoted to be false
        - Test return data
          ✔ should isRegistered to be true
          ✔ should hasVoted to be false
      addVoter function
        ✔ should require 1 parameter
        ✔ should require an address as parameter
        ✔ should be restricted to owner only
        ✔ should add 3rd voter (107ms)
        ✔ should add 4th voters (95ms)
        ✔ should not add an added voter
        ✔ should emit VoterRegistered event
    Test ProposalsRegistrationStarted status
      addProposal function
        ✔ should reject non whitelist voter
        ✔ should expect 1 argument
        Emit ProposalRegistered event
          ✔ should emit "ProposalRegistered" event , id = 0
          ✔ should emit "ProposalRegistered" event , id = 1
          ✔ should emit "ProposalRegistered" event , id = 2
          ✔ should emit "ProposalRegistered" event , id = 3
          ✔ should emit "ProposalRegistered" event , id = 4
          ✔ should emit "ProposalRegistered" event , id = 5
          ✔ should emit "ProposalRegistered" event , id = 6
          ✔ should emit "ProposalRegistered" event , id = 7
          ✔ should emit "ProposalRegistered" event , id = 8
        getOneProposal
          ✔ should reject proposal from non whitelist voter
    Test VotingSessionStarted status
      setVote function
        ✔ should reject non whitelist voter
        ✔ should emit "Voted" event for voter 1 (142ms)
        ✔ should revert for already voted
        ✔ should hasVoted equal true to voter1
    Test VotingSessionEnded status
      Test TallyVotes function
        ✔ should emit WorkflowStatusChange event (200ms)
        ✔ should set winnigProposalId to 0 (39ms)


  32 passing (9s)
