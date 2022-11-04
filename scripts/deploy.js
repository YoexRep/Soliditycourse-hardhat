//Ya no es necesario hacer un require de ethers, ya que hardhat tiene esto dentro
const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract...");

  const simpleStorage = await SimpleStorageFactory.deploy();

  await simpleStorage.deployed();

  console.log(simpleStorage.address);

  //En hardhat no es necesario por defecto indicarle un RPC URL, ya que hardhat usa una redblockchain de prueba interna
  // Osea que si no se lo indico simplemente usara esa por defecto

  //Esto es para validar que si el id de la red es 5, osea goerli, y existe el api key, entonces si ejecuto el verificar, por que si es hardhat no es necesario.
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    //primero espero que que se hayan registrado 6 bloques para poder entonces verificar el nuestro
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }
}

async function verify(contractAddress, args) {
  console.log("Verigying contract...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(e);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
