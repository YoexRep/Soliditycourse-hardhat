//Este archivo me  ayudara a selecionar el pricefeed dependiendo en la red que este

const networkConfig = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x8A7847",
  },
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
};

const developmentChains = ["hardhat", "localhost"];

const DECIMALS = 8; // Es la cantidad de 0 decimales que manejaran los precios

//Esta inicializa en 2000 pero como le agrego 8 ceros, se ve asi.
const INITIAL_ANSWER = 200000000000;

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};
