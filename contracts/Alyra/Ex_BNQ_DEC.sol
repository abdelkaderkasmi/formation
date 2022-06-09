// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * Exercice Banque decentralisée
 */
contract Bank {

    mapping (address=>uint) private _balances ;

    function deposit(uint _amount) public payable{
        _balances[msg.sender]+=_amount;
    }

    function transfer (uint _amount, address _recipient) public payable{
        require (_recipient !=address(0),"message d'erreur");
        require(_balances[msg.sender]>=_amount,"fonds insuffisants");
        _balances[_recipient] += _amount;
        _balances[msg.sender] -= _amount;
    }
    
    function balanceOf(address _address)public view returns (uint){
        return _balances[_address];
    }
}