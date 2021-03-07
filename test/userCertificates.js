var UserCertificates = artifacts.require("./UserCertificates.sol");

contract("Testing del contrato de almacenamiento de certificados", async (accounts) => {
    it("Modificar el propietario desde el owner", async () => {
        let instance = await UserCertificates.deployed();
        await instance.setOwner(accounts[1], {from : accounts[0]});
        assert.equal(accounts[1], await instance.getOwner.call());
    }); 
    it("Modificar el propietario del contrato desde una cuenta sin permiso", async () => {
        let instance = await UserCertificates.deployed();
        let e;
        try {
            await instance.setOwner(accounts[2], {from : accounts[2]});
        }
        catch (error){
            e = error;
        }
        assert.isNotNull(e);
        assert.equal(accounts[1], await instance.getOwner.call());
    });
    it("Obtener un certificado desde una cuenta con permisos", async () => {
        let instance = await UserCertificates.deployed();
        await instance.setLogicContract(accounts[2], {from : await instance.getOwner.call()});
        await instance.getCertificateSender.call(0x8, {from : accounts[2]});
        assert.equal(0x0, await instance.getCertificateSender.call(0x8, {from : accounts[2]}));
    });
    it("Obtener un certificado desde una cuenta sin permisos", async () => {
        let instance = await UserCertificates.deployed();
        let e;
        try {
            await instance.getCertificateSender.call(0x8, {from : accounts[3]});
        }
        catch (error){
            e = error;
        }
        assert.isNotNull(e);
    })
    it("Guardar un certificado desde una cuenta con permisos", async () => {
        let instance = await UserCertificates.deployed();
        await instance.addCertificate(0x1, accounts[1], {from : accounts[2]});
        assert.equal(accounts[1], await instance.getCertificateSender.call(0x1, {from : accounts[2]}));
    });
    it("Guardar un certificado desde una cuenta sin permisos", async () => {
        let instance = await UserCertificates.deployed();
        let e;
        try {
            await instance.addCertificate(0x2, accounts[2], {from : accounts[3]});
        }
        catch (error){
            e = error;
        }
        assert.isNotNull(e);    
        assert.equal(0x0, await instance.getCertificateSender.call(0x2, {from : accounts[2]}));
    });
});
