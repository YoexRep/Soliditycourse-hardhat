const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

//hacer que solo corra en networks de prueba
!developmentChains.includes(network.name)
  ? describe.skip
  : //Hacemos un describe para el contrato
    describe("FundMe", function () {
      let fundMe;
      let deployer;
      let mockV3Aggregator;

      //const sendValue = "1000000000000000000" // Esto es igual a un ETH, uno 1 con 18 ceros, si lo quiero hacer mas facil, puedo usar la funcion de ether
      const sendValue = ethers.utils.parseEther("1"); // Esto me le pone los 18 ceros al uno

      // Inicializo el contrato
      beforeEach(async function () {
        await deployments.fixture(["all"]);

        // const accounts = await ethers.getSigner();
        // const accountZero = accounts[0]

        deployer = (await getNamedAccounts()).deployer;

        fundMe = await ethers.getContract("FundMe", deployer);

        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      //Dentro del contrato hago un describe para cada metodo
      describe("constructor", function () {
        //Ahora cada IT es un caso de prueba
        it("Sets the aggregator address correctly ", async function () {
          const response = await fundMe.getPriceFeed();

          assert.equal(response, mockV3Aggregator.address);
        });
      });

      describe("fund", function () {
        it("Fallo si no evias suficiente ETH", async function () {
          await expect(fundMe.fud()).to.be.revertedWith("Necesitas mas ETH ");
        });

        it("actualizar la estructura de para la donaciones", async function () {
          await fundMe.fund({ value: sendValue });

          const response = await fundMe.getAddresssToAmountFunded(deployer);

          assert.equal(response.toString(), sendValue.toString());
        });

        it("agregar donadores al array de donadores", async function () {
          await fundMe.fund({ value: sendValue });

          const funder = await fundMe.getFunder(0);

          assert.equal(funder, deployer);
        });
      });

      describe("withdraw", function () {
        //Este before each se llamara antes de ejecutar cualquier prueba IT
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue }); // Espera hasta que mi contrato tenga dinero
        });

        it("Sacar ETH de un solo financiador", async function () {
          // Arrange

          //Optengo el valor inicial del contrato
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );

          //Obtener el valor inicial del deployer.
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // Act
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait();

          //Esto lo puedo sacar del transacctionReceipt / recibo de transaccion, para obtener el gasusado y el precio del gas, para entonces obtener el costo final de cuanto pague por gas
          const { gasUsed, effectiveGasPrice } = transactionReceipt;

          //Para multiplicar valores muy grandes es mejor usar la funcion mul-- en vez de simplemente hacer el num * num
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // Assert
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        });

        //Verificar que puede funder la cuenta desde multples cuentas
        it("is allows us to withdraw with multiple getFunder", async () => {
          // Arrange
          const accounts = await ethers.getSigners();
          for (i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // Act
          const transactionResponse = await fundMe.cheaperWithdraw();
          // Let's comapre gas costs :)
          // const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait();
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const withdrawGasCost = gasUsed.mul(effectiveGasPrice);
          console.log(`GasCost: ${withdrawGasCost}`);
          console.log(`GasUsed: ${gasUsed}`);
          console.log(`GasPrice: ${effectiveGasPrice}`);
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // Assert
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(withdrawGasCost).toString()
          );
          // Make a getter for storage variables
          await expect(fundMe.getFunder(0)).to.be.reverted;

          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getgetAddresssToAmountFunded(accounts[i].address),
              0
            );
          }
        });

        //Impedir que otra persona que no sea el dueño pueda sacar el dinero
        it("Only allows the owner to withdraw", async function () {
          const accounts = await ethers.getSigners();

          const fundMeConnectedContract = await fundMe.connect(accounts[1]);
          await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          );
        });
      });
    });
