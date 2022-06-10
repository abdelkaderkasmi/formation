/***** Abdelkader KASMI ***** 
******** PROJET N°1 *********
*****************************/

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Voting is Ownable{
    struct Voter {
                  bool isRegistered;
                  bool hasVoted;
                  uint votedProposalId;
                }
    struct Proposal {
                string description;
                uint voteCount;
                    }   
    enum WorkflowStatus {
                RegisteringVoters,
                ProposalsRegistrationStarted,
                ProposalsRegistrationEnded,
                VotingSessionStarted,
                VotingSessionEnded,
                VotesTallied
                }
    mapping (address=>Voter) private WhiteList ;

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
}