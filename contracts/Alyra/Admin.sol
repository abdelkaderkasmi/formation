// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
/**
 * Exercice Banque decentralisée
 */
contract Admin is Ownable {

     mapping (address=>bool) private WhiteList;
     mapping (address=>bool) private BlackList;


    event whitelisted(address _address);
    event blacklisted(address _address);
    
    function autoriser (address _address)  public payable onlyOwner{
        require(!WhiteList[_address],"Already whitelisted");
        require(!BlackList[_address],"Already blacklisted");
        WhiteList[_address]=true;
        emit whitelisted(_address);
    }

     function bloquer (address _address)  public payable onlyOwner{
        require(!WhiteList[_address],"Already whitelisted");
        require(!BlackList[_address],"Already blacklisted");
        BlackList[_address]=true;
        emit blacklisted(_address);
    }

    function isWhiteListed(address _address) public view returns (bool) {
        return WhiteList[_address];
    }

      function isBlackListed(address _address) public view returns (bool){
        return BlackList[_address];
    }
}