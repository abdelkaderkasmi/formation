// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
/**
 * Exercice Banque decentralisée
 */
contract Admin is Ownable {

     address [] private _whiteListArray;
     address [] private  _blackListArray;
     mapping (address=>bool) private WhiteList;
     mapping (address=>bool) private BlackList;


    event whitelisted(address _address);
    event blacklisted(address _address);
    
    function autoriser (address _address)  public payable onlyOwner{
        WhiteList[_address]=true;
        _whiteListArray.push(_address);
        emit whitelisted(_address);
    }

     function bloquer (address _address)  public payable onlyOwner{
        BlackList[_address]=true;
        _blackListArray.push(_address);
        emit blacklisted(_address);
    }

    function isWhiteListed() public view returns (address) {
        require(_whiteListArray.length>=0);
        return _whiteListArray[0];
    }

      function isBlackListed() public view returns (address){
        require(_blackListArray.length>=0);
        return _blackListArray[0];
    }
}