/***** Abdelkader KASMI ***** 
******** PROJET N°1 *********
*****************************/

// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.14;
import "./utils/Ownable.sol";

contract Voting is Ownable{
    
    //id winning proposal, on retourne -1 si pas de gagnant
    int public winningProposalId = -1;
    
    //compte votes blancs
    uint public countVoteBlanc;
    
    //nombre total de votants enregistrés
    uint private totalRegistered;
    
    //nombre d'enregistré ayant voté, pour le caclul du taux de participation/abstention
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
    //tableau des proposals                
    Proposal[] public proposals;

    //tableau des addr de voters
    address [] private voters;

    enum WorkflowStatus {
                RegisteringVoters,
                ProposalsRegistrationStarted,
                ProposalsRegistrationEnded,
                VotingSessionStarted,
                VotingSessionEnded,
                VotesTallied
                }
    //status du workflow courant pour la gestion des sessions, plus pratiqe que les timestamps
    WorkflowStatus private currentStatus = WorkflowStatus.RegisteringVoters; 
    
    //whitelist des electeurs autorisés
    mapping (address=>Voter) public WhiteList ;

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);


    function registerVoter(address _addr) public  onlyOwner { //enregistrement d'un votant
        require (currentStatus == WorkflowStatus.RegisteringVoters, "Registering voters session is over ! Restart process to register new voters" );//session terminé
        require (!WhiteList[_addr].isRegistered, "Already registered !");
        WhiteList[_addr].isRegistered = true;
        voters.push(_addr);
        totalRegistered ++;
        currentStatus = WorkflowStatus.RegisteringVoters;
        emit VoterRegistered(_addr);
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.RegisteringVoters);
    }

    function startRegiseringProposal() public onlyOwner{
        currentStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }
    
    function endRegiseringProposal() public onlyOwner{
        currentStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    function registerProposal(string calldata _description, address  _addrVoter) public onlyOwner{ //enregistrement d'une proposal
        require(currentStatus == WorkflowStatus.ProposalsRegistrationStarted, "Registering proposal session is over or did not started");
        require(WhiteList[_addrVoter].isRegistered, "Not registered !");
        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length-1);  //Id proposal = longueur tableau -1 (ex: l'id de la 1ere proposal est 0)
    }

    function startVotingSession() public onlyOwner{
        currentStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    function endVotingSession() public onlyOwner{
        currentStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    function voting (uint _proposalId) public onlyOwner{
        require(currentStatus == WorkflowStatus.VotingSessionStarted, "Voting session is over or did not started");
        require(WhiteList[msg.sender].isRegistered, "Not registered !");
        require(!WhiteList[msg.sender].hasVoted, "Already voted !");
        if(_proposalId < proposals.length)
            proposals[_proposalId].voteCount++;
        else// si le proposalId n'existe pas, on le considère comme un vote blanc
            countVoteBlanc++;
        
        totalRegisterdVoted ++;
        WhiteList[msg.sender].hasVoted = true;
        emit Voted(msg.sender, _proposalId);
    }

    function getWinner()  public onlyOwner returns (int){ //décompte des voix et désignation du proposalId gagnant, une fois le vote terminé
        require(currentStatus == WorkflowStatus.VotingSessionEnded, "Voting session is not finished");
        uint total = 0;
        for (uint i = 0 ; i < proposals.length; i++){
                if (proposals[i].voteCount > total){
                    total = proposals[i].voteCount;
                    winningProposalId = int (i);
                }
        }

        currentStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
        return total >=countVoteBlanc? winningProposalId : -1; //si vote blanc majoritaire on retourne -1 (pas de gagnant)
    }


    function getPercentageVoteBlanc () public view onlyOwner returns (uint) {//retourne le taux de vote blanc, une fois le decompte terminé
        require (currentStatus == WorkflowStatus.VotesTallied, "Tallying votes process is not finished");
        uint totalVotes=0;
        for(uint i = 0 ; i < proposals.length; i++)
            totalVotes += proposals[i].voteCount; 

        return (countVoteBlanc / totalVotes ) * 100;   
    }

    function getTauxParticipation () public view onlyOwner returns (uint){ // retorune le taux de participation = nb votant / nb inscrit * 100, une fois le décompte terminé
        require (currentStatus == WorkflowStatus.VotesTallied, "Tallying votes process is not finished yet");
        return (totalRegisterdVoted / totalRegistered) * 100; 
    }

    function  getTauxAbstention() public view onlyOwner returns (uint){ // retorune le taux d'abstention, une fois le décompte terminé
        require (currentStatus == WorkflowStatus.VotesTallied, "Tallying votes process is not finished yet");
        return 100 - getTauxParticipation(); 
    }

    function restartProcess () public  onlyOwner(){ //on recommence le process au début
       currentStatus = WorkflowStatus.RegisteringVoters;
       countVoteBlanc = totalRegisterdVoted = totalRegisterdVoted = 0;
       winningProposalId = -1;
       //on reinit les status isRegisterd et hasVoted de la whitelist
       for(uint i = 0; i < voters.length; i++){
           WhiteList[voters[i]].isRegistered = WhiteList[voters[i]].hasVoted = false;
        }

        delete voters;
    }

}
