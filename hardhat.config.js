require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Recordar agregar dotenv con -- yarn add --dev dotev

require("@nomiclabs/hardhat-etherscan"); // Plugin para utilizar el api de etherscan y poder verificar y validar los contratos
require("./tasks/block-number"); // Tarea para ver el ultimo numero de bloque de una blockchain
require("hardhat-gas-reporter"); // Para probar cuanto gas consume cada parrte de mi codigo.
require("hardhat-deploy"); //Paquete para facilitar el deploy y testing de nuesto codigo

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "key"; //Estos pipes es para en caso de que no tenga el url
const PRIVATE_KEY = process.env.PRIVATE_KEY || "key";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //aqui se le puede indicar la red que usara por defecto hardhat
  // solidity: "0.8.8",
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY], // Es la direccion de clave privada de mi wallet
      chainId: 5,
      blockConfirmation: 6, //Los bloques que tiene que esperar la red de goerli, indice nuestra transaccion. y podamos verla
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },

  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt", // para exportarlo a un fichero
    noColors: true, // sin color para evitar problemas con el archivo txt
    currency: "USD", // y podemos ponerle en que unidad queremos ver el reporte del gas
    coinmarketcap: COINMARKETCAP_API_KEY, // Para obtener el precio necesito conectarme a coinmarketcap con una API
    token: "BNB",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
};
