import React, { Component } from "react"

export default class VotesTalliedInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = { winningProposalId: null };

    this.loadWinningProposalId();
  }

  restartProcess = async () => {
    await this.state.contract.methods.restartProcess().call({ from: this.props.account });
    window.location.reload(false);
  }  

  loadWinningProposalId = async () => {
    this.props.contract.methods.winningProposalID().call({ from: this.props.account })
      .then((result) => {
        this.setState({winningProposalId: result});
      })
      .catch((err) => {
        console.log(err);
      })

       
  }


  
  render() {
    return (
      <div>
        <h4>Current Workflow Status : {this.props.contractStatus}</h4>
        <b>The winning proposal is {this.state.winningProposalId == null ? '...' : '#' + this.state.winningProposalId + ' !'}</b>
        &nbsp;<br/>
        &nbsp;<br/>

      </div>
    );
  }

}