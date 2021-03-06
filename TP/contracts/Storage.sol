// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Storage {

    uint256 number;
    event dataStored(uint _data, address _addr );

    function store(uint256 num) public {
        number = num;
        require(number>0, "non" );
        emit dataStored(num, msg.sender);
    }

   
    function retrieve() public view returns (uint256){
        return number;
    }
}