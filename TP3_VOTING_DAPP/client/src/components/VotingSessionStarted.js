import React, { Component } from "react"

export default class VotingSessionStartedInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedProposal: null, proposals: [] };
    this.loadProposals();
  }

  loadProposals = async () => {
    this.props.contract.getPastEvents('ProposalRegistered', { fromBlock: 0, toBlock: 'latest' })
      .then((results) => {
        let proposals = [];
        results.forEach(async (result) => {
          proposals.push(result.returnValues.proposalId);
          this.setState({ proposals: proposals });
        })
        // this.setState({ proposals: proposals });
        if (this.state.proposals.length > 0) {
          this.setState({ ...this.state.proposals, selectedProposal: this.state.proposals[0] })
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onProposalSelect = e => {
    this.setState({ selectedProposal: e.target.value })
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    // Needed to keep the correct 'this' in promises
    const component = this;

    await this.props.contract.methods.setVote(this.state.selectedProposal).send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ interactionResult: error.message });
      })
      .then(function (receipt) {
        // will be fired once the receipt is mined
        let voter = receipt.events.Voted.returnValues.voter;
        let votedProposal = receipt.events.Voted.returnValues.proposalId;
        component.setState({ interactionResult: "User " + voter + " voted for proposal #" + votedProposal });
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  handleSubmitWorkflowChange = async (e) => {
    e.preventDefault();

    // Needed to keep the correct 'this' in promises
    const component = this;

    await this.props.contract.methods.endVotingSession().send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ endVotingResult: error.message });
      })
      .then(function (receipt) {
        // will be fired once the receipt is mined
        component.setState({ endVotingResult: "Voting contract is now in voting session ended state" });
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  render() {
    return (
      <div>
        <h4>Current Workflow Status : {this.props.contractStatus}</h4>
        <form onSubmit={this.handleSubmit} className="form">
          <label htmlFor="proposals">Vote for proposal: </label>
          <span>
          <select name="proposals" id="proposals" onChange={this.onProposalSelect}>
            {this.state.proposals.map((proposalId) =>
              <option key={proposalId} value={proposalId}>#{proposalId}</option>
            )}
          </select></span>
          &nbsp;
          <input type="submit" value="Vote" className="button" />
        </form>&nbsp;
        <form onSubmit={this.handleSubmitWorkflowChange} className="form">
          <input type="submit" value="End voting session" className="button" />
        </form>
      </div>
    )
  }

}