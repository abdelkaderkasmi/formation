const Web3 = require('web3');
const MyContract =require ('./build/contracts/Voting.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const address ="0x47586C74AB950b69DF9310b6cf36Fee4D89DF1b2";
const privateKey ="0xa314da9f2fff8de21e3c5a2bc3a72bd3de5e6076937da3cf105097f698eb4d98";

 async() =>{
    const provider = new HDWalletProvider(
        privateKey,
        'https://ropsten.infura.io/v3/Your-59689efdcd8747aea76c50530741073a-ID'
    );
    const web3 = new Web3(provider);
    console.log("ttt");
    const id = await web3.eth.net.getId();
    console.log(id);
    const deployNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployNetwork.address
    );

    await contract.methods.addVoter("0x47586C74AB950b69DF9310b6cf36Fee4D89DF1b2").Send({from : address});

    const result = await contract.methods.getVoter("0x47586C74AB950b69DF9310b6cf36Fee4D89DF1b2").call();
    console.log(result);
}