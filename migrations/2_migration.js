var UserCertificates = artifacts.require("./UserCertificates.sol");
var LogicCertificate = artifacts.require("./LogicCertificate.sol");

module.exports = function(deployer) {

  deployer.deploy(UserCertificates).then(function() {
    return deployer.deploy(LogicCertificate, UserCertificates.address, 100);
  });
};
