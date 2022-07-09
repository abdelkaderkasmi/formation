
const Voting = artifacts.require("Voting");

module.exports = async function (deployer,_, accounts) {
  await deployer.deploy(Voting);
  await web3.eth.sendTransaction({
    from: accounts[0],
    to:'0x47586C74AB950b69DF9310b6cf36Fee4D89DF1b2',
    value : web3.utils.toWei('1','ether')
  });
};
