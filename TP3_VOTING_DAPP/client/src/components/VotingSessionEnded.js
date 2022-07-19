import React, { Component } from "react"

export default class VotingSessionEndedInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmitWorkflowChange = async (e) => {
    e.preventDefault();

    // Needed to keep the correct 'this' in promises
    const component = this;

    await this.props.contract.methods.tallyVotes().send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ tallyVotesResult: error.message });
      })
      .then(function (receipt) {
        // will be fired once the receipt is mined
        component.setState({ tallyVotesResult: "Votes are tallied !" });
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  render() {
    return (
      <div>
        <h4>Current Workflow Status : {this.props.contractStatus}</h4>
        <form onSubmit={this.handleSubmitWorkflowChange} className="form">
          <input type="submit" value="Tally votes !" className="button" />
        </form>
        &nbsp;
        <b>Results: {this.state.tallyVotesResult}</b>
      </div>
    )
  }

}