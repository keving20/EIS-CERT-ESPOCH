pragma solidity 0.4.24;

/// @title Almacenamiento de certificados de eis-cert-espoch.
/// @author kgallardo97

contract UserCertificates {
    
    mapping (bytes32 => address) private certificates;
    address private owner;
    address private logicContract;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta funcion");
        _;
    }

    modifier onlyLogicContract() {
        require(msg.sender == logicContract, "Solo la direccion con permisos puede ejecutar esta funcion");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }
    
    /// @notice Cambia la direccion del propietario del contrato.
    /// @dev Solo el propietario puede realizar esta accion.
    /// @param _newOwner La direccion del nuevo propietario.
    function setOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }
    
    /// @notice Devuelve el propietario del contrato.
    /// @return address La direccion del propietario.
    function getOwner() public view returns(address) {
        return owner;
    }
    
    /// @notice Permite a una direccion almacenar certificados.
    /// @dev Solo el propietario puede realizar esta accion.
    /// @param _logicContract La direccion que podra almacenar certificados.
    function setLogicContract(address _logicContract) public onlyOwner {
        logicContract = _logicContract;
    }
    
    /// @notice Devuelve la direccion que tiene permisos para almacenar certificados.
    /// @return address La direccion que tiene permisos para almacenar certificados.
    function getLogicContract() public view returns(address) {
        return logicContract;
    }
    
    /// @notice Permite almacenar certificados.
    /// @dev Solo la direccion con permisos podra realizar esta accion.
    /// @param _idCertificate La clave del certificado.
    /// @param _sender La direccion asociada a esa clave.   
    function addCertificate(bytes32 _idCertificate, address _sender) public onlyLogicContract {
        certificates[_idCertificate] = _sender;
    }

    /// @notice Devuelve la direccion asociada al certificado.
    /// @dev Solo la direccion con permisos podra realizar esta accion.
    /// @param _idCertificate La clave del certificado.
    /// @return address La direccion asociada al certificado.   
    function getCertificateSender(bytes32 _idCertificate) public view onlyLogicContract returns(address) {
        return certificates[_idCertificate];
    }
}


