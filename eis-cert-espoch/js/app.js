//Dirección del contrato UserCertificates.sol (en Ropsten) donde se almacenan los certificdos.
var certificatesContract = "0x75e7f7c6a42a9e7b4bcb47b73ff97aafd57976bf";

//Dirección del contrato LogicContract.sol (en Ropsten) con las funciones a ejecutar.
var logicContract = "0x81efa4f101d2399c37277eb23fc94e138e92a20f";

//ABI del contrato LogicCertificate.sol.
var abiArray = [{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_idCertificate","type":"bytes32"}],"name":"getCertificateSender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_idCertificate","type":"bytes32"}],"name":"addCertificate","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_idCertificate","type":"bytes32"}],"name":"existsCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_idCertificate","type":"bytes32"}],"name":"deleteCertificate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_priceInWei","type":"uint256"}],"name":"setPriceInWei","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_idCertificate","type":"bytes32"}],"name":"isMyCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPriceInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_userCertificatesAddress","type":"address"},{"name":"_priceInWei","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]


//***********************************************************************************/
//Se ejecuta al acceder a la aplicación.
//***********************************************************************************/
async function web3bootstrap() {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
        } catch (error) {
            console.log(error);
        }
    } else if (window.web3) {   // Legacy web3 browsers...
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
    } else {    // Non-dapp browsers...
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

$(document).ready(function () {
    web3bootstrap();
    $('#form-login').on('submit', function (response) {
        response.preventDefault();
        $("#login-panel").hide();
        $("#tabs").tabs();
        $("#main-panel").show();
        if (typeof web3 === "undefined" || !web3.currentProvider.isMetaMask) {
            $('#notMetamask').show();
            $("#submit-certificate").prop("disabled", true);
        }
        else if (web3.eth.coinbase === null) {
            $('#notAccount').show();
            $("#submit-certificate").prop("disabled", true);
        }
    });
    $('#form-certification').on('submit', function (response) {
        response.preventDefault()
        var unindexed_array = $(this).serializeArray();
        var indexed_array = {};
        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });
        makeCertification(indexed_array);
    });
    $('#search-input').on('keyup', function (event) {
        if (event.keyCode === 13) {
            submitSearchForm();
        }
    });
    $('#search-button').on('click', function (event) {
        submitSearchForm();
    })

    if (window.web3) {
        CertificationContract = web3.eth.contract(abiArray);
        certification = CertificationContract.at(logicContract);
    }
})

function setLoadingStatus() {
    $("#spinner").show();
    $("#submit-certificate").prop("disabled", true);
}

function setEnableStatus() {
    $("#spinner").hide();
    $("#submit-certificate").prop("disabled", false);
}





//***********************************************************************************/
// Función que crea el certificado
//***********************************************************************************/

function makeCertification(formDataJson) {
    setLoadingStatus();
    encrypted = encryptData(formDataJson);
    // Las 30 primeras letras del AES (8c7ff6b8d251ca98d81a9915903b12) coiniciden 
    // por la info del JSON inicial que es siempre la misma, con lo que no cogeremos esos datos.
    key = renderKey(encrypted.slice(30));
    makeTransaction(key, encrypted);
}





//***********************************************************************************/
// Se ejecuta cuando se va a realizar la transacción
//***********************************************************************************/

function makeTransaction(key, encrypted) {
    certification.getPriceInWei(
        function (error, response) {
            certification.addCertificate("0x" + key, { gas: 3000000, value: response, gasPrice: web3.toWei(1, 'gwei') },
                function (error, txId) {
                    if (error) {
                        setEnableStatus();
                        var modal = document.getElementById('myModalCancel');
                        var span = document.getElementsByClassName("close")[0];
                        modal.style.display = "block";
                        span.onclick = function () {
                            modal.style.display = "none";
                        }
                        window.onclick = function (event) {
                            if (event.target === modal) {
                                modal.style.display = "none";
                            }
                        }
                    }
                    else {
                        waitForReceipt(txId, function () {
                            window.location.href = "mailto:destinatario@correo.com?subject=Certificado eis-cert-espoch&body=La clave de tu certificado es la siguiente: " + encrypted + " No pierdas la clave o perderás el certificado!%0D%0APuedes verificar tu certificado aquí: " + window.location.origin + "/certificate.html?" + encrypted;
                            $("#certificate-link-container").show();
                            $("#certificate-link").attr("href", "/certificate.html?" + encrypted);
                            setEnableStatus();
                        });
                    }
                });
        });
}





//***********************************************************************************/
// Función que espera a que se realice la transacción
//***********************************************************************************/

function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
        if (err) {
            alert("No se ha podido realizar la transacción contra la blockchain")
        }
        if (receipt !== null) {
            // Transaction went through
            if (cb) {
                cb(receipt);
            }
        } else {
            // Try again in 1 second
            window.setTimeout(function () {
                waitForReceipt(hash, cb);
            }, 1000);
        }
    });
}





//***********************************************************************************/
// Función para encriptar la información del certificado.
//***********************************************************************************/

function encryptData(data) {
    data = JSON.stringify(data);
    // Se puede generar la key con https://www.npmjs.com/package/scrypt-js
    var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    var textBytes = aesjs.utils.utf8.toBytes(data);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
}





//***********************************************************************************/
// Función para desencriptar la información del certificado.
//***********************************************************************************/

function decryptData(data) {
    var encryptedBytes = aesjs.utils.hex.toBytes(data);
    var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText;
}





//********************************************************************************************************* */
//Función para obtener la clave del certificado.
//Como máximo podemos coger 64 letras de informacion (estamos usando el tipo bytes32 en nuestro smart contract)
//Menos probabilidad de coincidencia con otro ctificado cuanto mayor sea el byte del smart contract.
//********************************************************************************************************* */

// Longitud del ID del certificado que se registrará en Ethereum.
const keyLength = 64;

function renderKey(encrypted) {
    var key = "";
    var jump = Math.floor(encrypted.length / keyLength);
    var selected;
    for (counter = 1; counter < keyLength; counter++) {
        selected = jump * counter;
        key = key.concat(encrypted.slice(selected, selected + 1));
    }
    return key;
}





//***********************************************************************************/
// Esta función se ejecuta cuando se solicita una búsqueda
//***********************************************************************************/

//Variable global para que deleteCertificat() pueda eliminar el certificado (no se puede pasar como argumento).
var searchParam;

function submitSearchForm() {
    searchParam = $('#search-input').val();
    try {
        drecrypted = decryptData(searchParam);
        key = renderKey(searchParam.slice(30));
        certification.isMyCertificate("0x" + key,
            function (error, response) {
                if (error) {
                    $('#notContract').show();
                }
                else if (response) {
                    $('#showCertificate').show();

                } else {
                    $('#notFoundCertificate').show();
                }
            });
        document.getElementById("resultSearch").src = window.location.href + "certificate.html?" + searchParam;
        $('#search-result').show();
    }
    catch (err) {
        var modal = document.getElementById('myModalHexError');
        var span = document.getElementsByClassName("close")[1];
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }
}





//***********************************************************************************/
// Esta función se ejecuta al borrar el certificado
//***********************************************************************************/

function deleteCertificate() {
    $("#spinner2").show();
    $("#delete-container").prop("disabled", true);
    $("#certificate-deleted-container").show();
    key = renderKey(searchParam.slice(30));
    certification.deleteCertificate("0x" + key, { gas: 3000000, gasPrice: web3.toWei(1, 'gwei') },
        function (error, txId) {
            if (error) {
                var modal = document.getElementById('myModalCancel');
                var span = document.getElementsByClassName("close")[0];
                modal.style.display = "block";
                span.onclick = function () {
                    modal.style.display = "none";
                }
                window.onclick = function (event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                }
            }
            else {
                waitForReceipt(txId, function () {
                    $("#spinner2").hide();
                    $("#search-result").show();
                    submitSearchForm();
                    $("#showCertificate").hide();
                });
            }
        }
    );
}