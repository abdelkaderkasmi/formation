import React from 'react';
import ProposalRegistrationStartedInteraction from './ProposalsRegistrationStarted';
import RegisteringVotersInteraction from './RegisteringVoters';
import ProposalsRegistrationEndedInteraction from './ProposalsRegistrationEnded';
import VotesTalliedInteraction from './VotesTallied';
import VotingSessionEndedInteraction from './VotingSessionEnded';
import VotingSessionStartedInteraction from './VotingSessionStarted';

const workflowStatusString = [
  'Registering Voters',
  'Proposals Registration Started',
  'Proposals Registration Ended',
  'Voting Session Started',
  'Voting Session Ended',
  'Votes Tallied',
];


export default class ContractInteraction extends React.Component {

  render() {
    const InteractionComponent = () => {
      switch (Number(this.props.workflowStatus)) {
        case 0:
          return <RegisteringVotersInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatusString[this.props.workflowStatus]}
            />;
        case 1:
          return <ProposalRegistrationStartedInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatusString[this.props.workflowStatus]}
            />;
        case 2:
          return <ProposalsRegistrationEndedInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatusString[this.props.workflowStatus]}
            />;
        case 3:
          return <VotingSessionStartedInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatusString[this.props.workflowStatus]}
             />;
        case 4:
          return <VotingSessionEndedInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatusString[this.props.workflowStatus]}
           />;
        case 5:
          return <VotesTalliedInteraction
            account={this.props.account}
            contract={this.props.contract}
            contractStatus={workflowStatusString[this.props.workflowStatus]}
             />;
        default:
          console.log('Workflow status: ' + this.props.workflowStatus);
          return <p>Unknown workflow status!</p>;
      }
    };

    return (
      <div >
        <InteractionComponent />
      </div>
    );
  }
}
