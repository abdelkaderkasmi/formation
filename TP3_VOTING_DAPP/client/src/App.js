import React, { useEffect, useState } from 'react';
import VotingContract from './contracts/Voting.json';
import getWeb3 from './getWeb3';

import './App.css';
import Header from './components/Header';
import ContractStatus from './components/ContractStatus';
import ContractInteraction from './components/ContractInteraction';
import Voters from './components/Voters';
import Proposals from './components/Proposals';

function App() {
  const [state, setState] = useState({ isOwner: false, isVoter: false, web3: null, accounts: null, contract: null });
  const [contractState, setContractState] = useState({
    owner: '',
    workflowStatus: 0
    // events: { voterRegistered: [], workflowStatusChange: [], proposalRegistered: [], voted: [] },
  });
  const restartProcess = async () => {
    await state.contract.methods.restartProcess().send({ from: state.accounts[0] });
    window.location.reload(false);
  }
  useEffect(() => {
    (async function () {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];
        console.log(VotingContract.networks);
        console.log(networkId);
        const instance = new web3.eth.Contract(VotingContract.abi, deployedNetwork && deployedNetwork.address);

        console.log(instance.methods);

        let workflowStatus = await instance.methods.workflowStatus().call();
        let owner = await instance.methods.owner().call();
        setContractState({ owner: owner, workflowStatus: workflowStatus });

        //let value = await instance.methods.get().call();
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setState({ web3: web3, accounts: accounts, contract: instance });
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    })();
  }, []);

  if (!state.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  } else {
    return (
      <div className="App">
        <div class="center">
        <h1  >Voting DAPP</h1>
        </div>

        <Header addr={state.accounts[0]} />
      &nbsp;
        <ContractInteraction
          workflowStatus={contractState.workflowStatus}
          account={state.accounts[0]}
          contract={state.contract}
        />
        <br/>
        <span>
        <button class="button" onClick ={restartProcess}>Restart Process</button>
        </span>
        
      </div>
    );
  }
}
export default App;
