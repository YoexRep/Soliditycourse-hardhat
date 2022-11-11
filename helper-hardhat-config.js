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

module.exports = {
  networkConfig,
};
