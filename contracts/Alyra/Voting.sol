/***** Abdelkader KASMI ***** 
******** PROJET N°1 *********
*****************************/

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Voting is Ownable{
    //id winning proposal
    uint public winningProposalId;
    
    //compte votes blancs
    uint public countVoteBlanc;
    
    //timestamps des diffrentes evenements
    uint private startRegisteringProposal;
    uint private endRegisteringProposal;
    uint private startVoting;
    uint private endVoting;
    uint private startCountingVotes;
    uint private endCountingVotes;

    //nombre total de votant enregistrés
    uint private totalRegistered;
    
    //nombre d'enregistré ayant voté
    uint private totalRegisterdVoted;

    struct Voter {
                  bool isRegistered;
                  bool hasVoted;
                  uint votedProposalId;
                }
    struct Proposal {
                string description;
                uint voteCount;
                    }   
    Proposal[] public proposals;

    enum WorkflowStatus {
                RegisteringVoters,
                ProposalsRegistrationStarted,
                ProposalsRegistrationEnded,
                VotingSessionStarted,
                VotingSessionEnded,
                VotesTallied
                }
    
    //whitelist des electeurs autorisés
    mapping (address=>Voter) public WhiteList ;

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);


    function registerVoter(address _addr) public  onlyOwner { //enregistrement d'un votant
        require(!WhiteList[_addr].isRegistered, "Deja enregistre");
        WhiteList[_addr].isRegistered = true;
        totalRegistered ++;
        emit VoterRegistered(_addr);
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.RegisteringVoters);
    }

    function startRegiseringProposal() public onlyOwner{
        startRegisteringProposal = block.timestamp; 
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }
    
    function endRegiseringProposal() public onlyOwner{
        endRegisteringProposal = block.timestamp; 
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    function registerProposal(string calldata _description, address  _addrVoter) public onlyOwner{ //enregistrement d'une proposal
        require(block.timestamp >= startRegisteringProposal && block.timestamp <= endRegisteringProposal, "La session d'enregistrement des proposals est terminee");
        require(WhiteList[_addrVoter].isRegistered, "Electeur non enregistre");
        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length-1);  //Id proposal = longueur tableau -1 (ex: l'id de la 1ere proposal est 0)
    }

    function startVotingSession() public onlyOwner{
        startVoting = block.timestamp;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    function endVotingSession() public onlyOwner{
        endVoting = block.timestamp;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    function voting (uint _proposalId) public onlyOwner{
        require(block.timestamp >= startVoting && block.timestamp <= endVoting, "La session de vote nest pas en cours");
        require(WhiteList[msg.sender].isRegistered, "Vous netes pas enregistre");
        require(!WhiteList[msg.sender].hasVoted, "Vous avez deja vote");
        if(_proposalId < proposals.length)
            proposals[_proposalId].voteCount++;
        else// si le proposalId n'existe pas, on le considère comme un vote blanc
            countVoteBlanc++;
        
        totalRegisterdVoted ++;
        emit Voted(msg.sender, _proposalId);
    }

    function getWinner()  public onlyOwner returns (uint){ //décompte des voix et désignation du proposalId gagnant
        require(block.timestamp > endVoting, "La session de vote est toujours en cours");
        uint total = 0;
        for (uint i = 0 ; i < proposals.length; i++){
                if (proposals[i].voteCount > total){
                    total = proposals[i].voteCount;
                    winningProposalId = i;
                }
        }
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
        return winningProposalId;
    }


    function getPercentageVoteBlanc () public view onlyOwner returns (uint) {//retourne le taux de vote blanc
        uint totalVotes=0;
        for(uint i = 0 ; i < proposals.length; i++)
            totalVotes += proposals[i].voteCount; 

        return (countVoteBlanc / totalVotes ) * 100;   
    }

    function getTauxParticipation () public view onlyOwner returns (uint){ // retorune le taux de participation = nb votant / nb inscrit * 100
        return (totalRegisterdVoted / totalRegistered) * 100; 
    }

    function  getTauxAbstention() public view onlyOwner returns (uint){ // retorune le taux d'abstention
        return 100 - getTauxParticipation(); 
    }

}