var LogicCertificate = artifacts.require("./LogicCertificate.sol");
var UserCertificates = artifacts.require("./UserCertificates.sol");

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract("Testing del contrato de logica de certificados", async (accounts) => {
    
    it("Incializacion del contrato", async () => {
        let instance = await LogicCertificate.deployed();
        let owner = await instance.getOwner.call();
        assert.notEqual(owner, ZERO_ADDRESS);
        assert.equal(owner, accounts[0]);
        let price = await instance.getPriceInWei.call();
        assert.equal(price, 100);
    });

    it("Modificar el propietario desde el owner", async () => {
        let instance = await LogicCertificate.deployed();
        await instance.setOwner(accounts[1], {from : accounts[0]});
        assert.equal(accounts[1], await instance.getOwner.call());
    }); 

    it("Modificar el propietario del contrato desde una cuenta sin permiso", async () => {
        let instance = await LogicCertificate.deployed();
        let e;
        try {
            await instance.setOwner(accounts[2], {from : accounts[2]});
        }
        catch (error){
            e = error;
        }
        assert.notEqual(e,null);
        assert.equal(accounts[1], await instance.getOwner.call());
    });

    it("Modificar priceInWei desde el owner", async () => {
        let instance = await LogicCertificate.deployed();
        let newPrice = 150;
        await instance.setPriceInWei(newPrice, {from : accounts[1]});
        assert.equal(newPrice, await instance.getPriceInWei.call());
    }); 
    
    it("Modificar priceInWei desde una cuenta sin permiso", async () => {
        let instance = await LogicCertificate.deployed();
        let newPrice = 150;
        let e;
        try {
            await instance.setPriceInWei(newPrice, {from : accounts[2]});
        }
        catch (error){
            e = error;
        }
        assert.isNotNull(e);
        assert.equal(newPrice, await instance.getPriceInWei.call());
    });

    it("Agregar certificado de forma incorrecta porque no tiene permisos", async () => {
        let instance = await LogicCertificate.deployed();
        let actualPrice = await instance.getPriceInWei.call();
        let certificate = "0x04324921394";
        let e;
        try {
            await instance.addCertificate(certificate, {from: accounts[1], value: actualPrice});
        }
        catch (error){
            e = error;
        }
        assert.isNotNull(e);
    });

    it("Agregar certificado de forma correcta", async () => {
        let instance = await LogicCertificate.deployed();
        let certificates = await UserCertificates.deployed();
        await certificates.setLogicContract(instance.address,{from: accounts[0]});
        let actualPrice = await instance.getPriceInWei.call();
        let certificate = "0x04324921394";
        let wallet = await certificates.getOwner.call();
        let balance = await web3.eth.getBalance(wallet).toNumber();
        await instance.addCertificate(certificate, {from: accounts[1], value: actualPrice});
        let sender = await instance.getCertificateSender(certificate);
        assert.isNotNull(sender);
        assert.equal(sender, accounts[1]);
        let postbalance = await web3.eth.getBalance(wallet).toNumber();
        assert.equal(postbalance, balance + parseInt(actualPrice));
    });

    it("Agregar certificado de forma incorrecta con poco value", async () => {
        let instance = await LogicCertificate.deployed();
        let actualPrice = await instance.getPriceInWei.call();
        let certificate = "0x04324921394";
        let e;
        try {
            await instance.addCertificate(certificate, {from: accounts[1], value: actualPrice-1});
        }
        catch (error){
            e = error;
        }
        assert.isNotNull(e);
    });

    it("Comprobar certificado no existente de forma correcta", async () => {
        let instance = await LogicCertificate.deployed();
        let certificate = "0x123123123";
        let sender = await instance.getCertificateSender(certificate);
        assert.isNotNull(sender);
        assert.equal(sender, ZERO_ADDRESS);
    });

    it("Comprobar si existe un certificado de forma correcta", async () => {
        let instance = await LogicCertificate.deployed();
        let certificate = "0x04324921394";
        let existe = await instance.existsCertificate(certificate);
        assert.isTrue(existe);
    });

    it("Comprobar si existe un certificado no existente de forma correcta", async () => {
        let instance = await LogicCertificate.deployed();
        let certificate = "0x043123a21394";

        let existe = await instance.existsCertificate(certificate);
        assert.isFalse(existe);
    });

    it("Comprobar si el certificado es mio de forma correcta", async () => {
        let instance = await LogicCertificate.deployed();
        let certificate = "0x04324921394";
        let isMine = await instance.isMyCertificate(certificate, {from: accounts[1]});
        assert.isTrue(isMine);
        let isNotMine = await instance.isMyCertificate(certificate, {from: accounts[2]});
        assert.isFalse(isNotMine);
    });

    it("Comprobar si un certificado no existente es mio de forma correcta", async () => {
        let instance = await LogicCertificate.deployed();
        let certificate = "0x123a211234";
        let isMine = await instance.isMyCertificate(certificate, {from: accounts[1]});
        assert.isFalse(isMine);
    });

    it("Borrar un certificado externo de forma incorrecta", async () => {
        let instance = await LogicCertificate.deployed();
        let certificate = "0x04324921394";

        let e;
        try {
            await instance.deleteCertificate(certificate, {from: accounts[2]});
        }
        catch (error){
            e = error;
        }
        assert.isNotNull(e);
        let existe = await instance.existsCertificate(certificate);
        assert.isTrue(existe);
    });

    it("Borrar un certificado existente de forma correcta", async () => {
        let instance = await LogicCertificate.deployed();
        let certificate = "0x04324921394";

        await instance.deleteCertificate(certificate, {from: accounts[1]});
        let existe = await instance.existsCertificate(certificate);
        assert.isFalse(existe);
    });
});
