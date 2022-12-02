const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();

  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding...");

  //Invo el metodo withdraw para sacar el total invertido.
  const transactionResponse = await fundMe.withdraw();
  await transactionResponse.wait(1);
  console.log("Goty it back");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
