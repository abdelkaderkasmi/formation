// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


/**
 * Exercice Banque decentralisée
 */
contract Exo is Ownable{
    struct apprenant{ string nom; uint note;}
    enum Statut{apprenti,certifie,recale}
    Statut public statut;

    mapping (address=>apprenant) apprenantsMapping;
    apprenant[] apprenantsArray;

    function setAppMapp(address _addr,string calldata _name, uint _note) public onlyOwner{
        apprenantsMapping[_addr]=apprenant(_name,_note);
    }

    function delte1AppMapp(address _addr) public onlyOwner{
        delete apprenantsMapping[_addr];
    }

    function addAppArray(string calldata _name, uint _note) public onlyOwner{
        apprenantsArray.push(apprenant(_name,_note));
    }

    function setAppArray(uint _id, string calldata _name, uint _note) public onlyOwner{
        require(_id<apprenantsArray.length,"index hors limite du tableau");
        apprenantsArray[_id]=apprenant(_name,_note);
    }

    function delLastAppArray ()public onlyOwner{
        apprenantsArray.pop();
    }

    function deleteAllAppArray() public onlyOwner{
        delete apprenantsArray;
    }

    function setStatutCertifie() public onlyOwner{
        statut=Statut.certifie;
    }

    function changeStatut (Statut _num) public onlyOwner{
        require (uint (_num)<3,"statut inexistant");
        statut = _num;
    }

    function incrementStatut() public  onlyOwner {
        require(statut!=Statut.certifie && statut !=Statut.recale,"impossible");
        statut = Statut.certifie;
    }


}