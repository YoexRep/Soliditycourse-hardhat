const { network } = require("hardhat");

//Export el networkConfig desde el archvio helper
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts(); //Para obetner el nombre de las cuentas con private key que creamos para la network

  const chainId = network.config.chainId;

  //puedo obtener el eth price address usando el chain id

  //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

  let ethUsdPriceFeedAddress;

  //Si es una red local de prueba uso un mock para conseguir el precio
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");

    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    //de lo contrario solo busco el precio con chainlink
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const args = [ethUsdPriceFeedAddress];

  //Metodo para deploy el contrato fundme
  const fundme = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1, //Me espera el numero de bloques(definido en hardhat.config) o 1
  });

  //verifico si es una localnetowrk no lo verifico, pero si es una red como goerli o rinkipi si lo hago
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }

  log("-------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
