require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Recordar agregar dotenv con -- yarn add --dev dotev
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //aqui se le puede indicar la red que usara por defecto hardhat

  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY], // Es la direccion de clave privada de mi wallet
      chainId: 5,
    },
  },
  solidity: "0.8.7",
};
