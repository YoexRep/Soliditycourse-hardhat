const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

//Creo un describe con el contrato que quiero probar
describe("SimpleStorage", function () {
  let SimpleStorageFactory, SimpleStorage;

  // Inicializo el contrato
  beforeEach(async function () {
    SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    SimpleStorage = await SimpleStorageFactory.deploy();
  });

  //Ahora cada IT es un caso de prueba

  it("Debe de empezar con 0 el numero favorito ", async function () {
    const currentValue = await SimpleStorage.retrieve();

    const expectValue = "0";

    //Evaluar si el valor actual es el valor esperado
    assert.equal(currentValue.toString(), expectValue);
  });
});
