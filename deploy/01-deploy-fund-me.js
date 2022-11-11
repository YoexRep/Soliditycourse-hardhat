//import -- ya no se importa cuando usas hardhat-deploy

const { network } = require("hardhat");

//main function -- tampoco es necesario usar un main function

//Calling of main function -- y no es necesario hacer un call de esa funcion main

//como se hace

//Declaro una funcion
/*function deployFunc() {
  console.log("Hola yoex");
}
*/
//Y la exporto para que la pueda ver el hardhat deploy
//module.exports.default = deployFunc;

//Export el networkConfig desde el archvio helper
const { networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNameAccounsts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNameAccounsts(); //Para obetner el nombre de las cuentas con private key que creamos para la network

  const chainId = network.config.chainId;

  //puedo obtener el eth price address usando el chain id

  const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
};
