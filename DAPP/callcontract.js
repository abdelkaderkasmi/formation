var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/59689efdcd8747aea76c50530741073a'));

console.log ('Calling contract..');
var abi = [
    {
        "inputs" : [],
        "name" : "retrieve",
        "outputs" : [
            {
                "internalType" : "uint256",
                "name" : "",
                "type" : "uint256"
            }
        ],
        "stateMutability" : "view",
        "type" : "function"
    },
    {
        "inputs" : [
            {
                "internelType" : "uint256",
                "name" : "num",
                "type" : "uint256"
            }
        ],
        "name" : "store",
        "outputs" : [],
        "stateMutability" : "nonpayable",
        "type" : "function"
    }
];

var addr 