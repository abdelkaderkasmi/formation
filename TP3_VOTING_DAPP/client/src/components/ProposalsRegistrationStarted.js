import React, { Component } from "react"

export default class ProposalRegistrationStartedInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: null, interactionResult: "-" };
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    // Needed to keep the correct 'this' in promises
    const component = this;

    await this.props.contract.methods.addProposal(this.state.inputValue).send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ interactionResult: error.message });
      })
      .then(function (receipt) {
        // will be fired once the receipt is mined
        let addedProposalId = receipt.events.ProposalRegistered.returnValues.proposalId;
        component.setState({ interactionResult: "Proposal #" + addedProposalId + " has been added!" });
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  handleSubmitWorkflowChange = async (e) => {
    e.preventDefault();

    // Needed to keep the correct 'this' in promises
    const component = this;

    await this.props.contract.methods.endProposalsRegistering().send({ from: this.props.account })
      .once('transactionHash', function (hash) {
        console.log('Transaction sent with hash: ' + hash);
      })
      .on('error', function (error) {
        component.setState({ endRegisteringResult: error.message });
      })
      .then(function (receipt) {
        // will be fired once the receipt is mined
        component.setState({ endRegisteringResult: "Voting contract is now in proposal registering ended state" });
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  render() {
    return (
      <div>
        <h4>Current Workflow Status : {this.props.contractStatus}</h4>
        <form onSubmit={this.handleSubmit} className="form">
          <label htmlFor="proposalDesc">Proposal description: </label>
          <span><input id="proposalDesc" type="text" name='inputValue' onChange={this.handleOnChange} className="input" />
          </span>
          &nbsp;
          <input type="submit" value="Add proposal" className="button" />
        </form>
        &nbsp;
        <form onSubmit={this.handleSubmitWorkflowChange} className="form">
          <input type="submit" value="End proposal registering" className="button" />
        </form>
        &nbsp;
      </div>
    )
  }
}