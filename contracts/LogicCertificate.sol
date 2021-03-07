pragma solidity 0.4.24;

/// @title Logica de eis-cert-espoch
/// @author kgallardo97

import "./UserCertificates.sol";

contract LogicCertificate {
    
    address private owner;
    uint256 private priceInWei;
    UserCertificates userCertificates;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta funcion");
        _;
    }
    
    constructor(address _userCertificatesAddress, uint256  _priceInWei) public {
        owner = msg.sender;
        userCertificates = UserCertificates(_userCertificatesAddress);
        priceInWei = _priceInWei;
    }
    
    /// @notice Cambia la direccion del propietario del contrato.
    /// @dev Solo el propietario puede realizar esta acción.
    /// @param _newOwner La direccion del nuevo propietario.
    function setOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }
    
    /// @notice Devuelve el propietario del contrato.
    /// @return address La direccion del propietario.
    function getOwner() public view returns(address) {
        return owner;
    }

    /// @notice Cambia la el precio que recibe el propietario al guardar un certificado.
    /// @dev Solo el propietario puede realizar esta acción.
    /// @param _priceInWei El precio en Wei.
    function setPriceInWei(uint256 _priceInWei) public onlyOwner {
        priceInWei = _priceInWei;
    }
    
    /// @notice Devuelve el precio en Wei que recibe el propietario lguardar un certificado.
    /// @return uint256 El precio en Wei.
    function getPriceInWei() public view returns (uint256) {
        return priceInWei;
    }
    
    /// @notice Guarda un certificado en el almacenamiento. Para saber cual es el precio por guardar el certificado, llamar a getPriceInWei().
    /// @dev Es necesario que este contrato tenga permisos en UserCertificates.sol.
    /// @param _idCertificate La clave del certificado.    
    function addCertificate(bytes32 _idCertificate) public payable {
        require(msg.value == priceInWei, "El pago no corresponde con el precio en Wei");
        userCertificates.getOwner().transfer(msg.value);
        userCertificates.addCertificate(_idCertificate, msg.sender);
    }

    /// @notice Devuelve la direccion asociada con el certificado.
    /// @dev Es necesario que este contrato tenga permisos en UserCertificates.sol.
    /// @param _idCertificate La clave del certificado.
    /// @return uint256 El precio en Wei.
    function getCertificateSender(bytes32 _idCertificate) public view returns(address) {
        return userCertificates.getCertificateSender(_idCertificate);
    }

    /// @notice Devuelve true si el certificado existe.
    /// @dev Es necesario que este contrato tenga permisos en UserCertificates.sol.
    /// @param _idCertificate La clave del certificado.
    /// @return bool .
    function existsCertificate(bytes32 _idCertificate) public view returns(bool) {
        return (userCertificates.getCertificateSender(_idCertificate) != address(0x0));
    }

    /// @notice Devuelve true si el certificado pertenece al sender.
    /// @dev Es necesario que este contrato tenga permisos en UserCertificates.sol.
    /// @param _idCertificate La clave del certificado.
    /// @return bool .
    function isMyCertificate(bytes32 _idCertificate) public view returns(bool) {
        return (userCertificates.getCertificateSender(_idCertificate) == msg.sender);
    }
    
    /// @notice Borra un certificado de la blockchain.
    /// @dev Es necesario que este contrato tenga permisos en UserCertificates.sol y el sender debe ser el emisor del certificado.
    /// @param _idCertificate La clave del certificado.
    function deleteCertificate(bytes32 _idCertificate) public {
        require(msg.sender == getCertificateSender(_idCertificate), "");
        userCertificates.addCertificate(_idCertificate, address(0x0));
    }
}
