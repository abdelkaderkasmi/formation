// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract etudiant{
    struct student{
        string  name;
        uint note;
    }
    mapping (address=>student) public studentMapping;
    student [] public studentsArray;

    function  getStudent (address _addr)  public view returns ( student memory) {
        return studentMapping[_addr];
    }
    function  getStudent2 (uint id)  public view returns (student memory) {
        return studentsArray[id];
    }

    function setStudent(string calldata _name, uint _note, address _addr )public {
        studentMapping[_addr]=student(_name,_note);
    }

    function deleteStudent(address _addr) public view{
    
    }
}