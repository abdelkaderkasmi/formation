const Web3 = require('web3')
const rpcURL = "https://ropsten.infura.io/v3/59689efdcd8747aea76c50530741073a"
const web3 = new Web3(rpcURL)
 
web3.eth.getBalance("0x75ff623e8B90547820ba51350b13A5d11DAE8F91", (err, wei) => { 
   balance = web3.utils.fromWei(wei, 'ether'); // convertir la valeur en ether
   console.log(balance);
});
