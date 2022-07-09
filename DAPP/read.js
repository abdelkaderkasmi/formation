var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/59689efdcd8747aea76c50530741073a'));
var ethTx = ('0xfb0c2cdf3605a5cb98d0281cdc2cd26c0f6bc191d109b8283176eb1131322472');
web3.eth.getTransaction(ethTx, function (err,result){
    if(!err && result !=null){
        console.log(result);
        console.log ('From Adress : '+ result.from);
        console.log ('To Address : '+ result.to);
        console.log ('Ether Transacted: '+ (web3.utils.fromWei(result.value, 'ether')));
    }
    else{
        console.log('Error', err);
    }
})