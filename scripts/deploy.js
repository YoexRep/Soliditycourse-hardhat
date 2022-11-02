//Ya no es necesario hacer un require de ethers, ya que hardhat tiene esto dentro
const { ethers } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract...");

  const simpleStorage = await SimpleStorageFactory.deploy();

  await simpleStorage.deployed();

  console.log(simpleStorage.address);

  //En hardhat no es necesario por defecto indicarle un RPC URL, ya que hardhat usa una redblockchain de prueba interna
  // Osea que si no se lo indico simplemente usara esa por defecto
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
