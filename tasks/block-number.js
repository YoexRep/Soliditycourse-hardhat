const { task } = require("hardhat/config");

//Este task me recibe 2 parametros, el nombre y la descripcion del parametro
task("block-number", "Imprime el numero del bloque actual").setAction(
  //Defino una funcion anonima, la cual me recibe 2 parametros, el primero son los argumots de taks, y la segunda una variable hre.
  //hre me contiene la importacion de hardhat, por lo que puedo acceder a ethers.provider, y usar su metodo getblock
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("bloque actual " + blockNumber.toString());
  }
);
