import React, { Component } from "react"

export default class Proposals extends Component {
  constructor(props) {
    super(props);
    this.state = { proposals: [] };
    this.loadProposals();
  }

  loadProposals = async () => {
    this.props.contract.getPastEvents('ProposalRegistered', { fromBlock: 0, toBlock: 'latest' })
      .then((results) => {
        let proposals = [];
        results.forEach(async (result) => {
          let proposalInfo = await this.props.contract.methods.getOneProposal(result.returnValues.proposalId).call({ from: this.props.account });
          proposals.push({ proposalId: result.returnValues.proposalId, info: proposalInfo });
          console.log(proposalInfo);
          this.setState({ proposals: proposals });
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <h4>Proposals</h4>
        <table style={{ border: '1px solid black', marginLeft: 'auto', marginRight: 'auto' }}>
          <thead>
            <tr>
              <th>Number</th>
              <th>Description</th>
              <th>Vote count</th>
            </tr>
          </thead>
          <tbody>
            {this.state.proposals.map(proposalDetails =>
              <tr key={proposalDetails.proposalId}>
                <td>#{proposalDetails.proposalId}</td>
                <td>{proposalDetails.info.description}</td>
                <td>{proposalDetails.info.voteCount}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}