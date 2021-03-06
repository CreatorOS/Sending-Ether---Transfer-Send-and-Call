// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');
const BN = require('bn.js');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [deployer, deployer2] = await ethers.getSigners();
  const ContractFactory = await hre.ethers.getContractFactory('SendEther');
  const contract = await ContractFactory.deploy();

  await contract.deployed();
  console.log('SendEther Contract deployed to:', contract.address);
  try {
    const balBeforeTransfer = new BN((await deployer2.getBalance()).toString());
    const balBeforeTransfer1 = new BN((await deployer.getBalance()).toString());
    console.log(
      `Balance of account 1: ${deployer.address} before Transfer : ${balBeforeTransfer1} wei`,
    );
    console.log(
      `Balance of account 2: ${deployer2.address} before Transfer : ${balBeforeTransfer} wei`,
    );
    console.log(`Calling sendViaVall(${deployer2.address}, '1 ether')`);
    const receipt = await contract.sendViaCall(deployer2.address, {
      value: ethers.utils.parseUnits('1', 'ether').toHexString(),
    });
    const balAfterTransfer = new BN((await deployer2.getBalance()).toString());
    const balAfterTransfer1 = new BN((await deployer.getBalance()).toString());
    console.log(
      `Balance of account 1: ${deployer.address}  after Transfer : ${balAfterTransfer1} wei`,
    );
    console.log(
      `Balance of account 2: ${deployer2.address}  after Transfer : ${balAfterTransfer} wei`,
    );
    if (balAfterTransfer.gt(balBeforeTransfer)) {
      console.log('Test Passed!');
      process.exit(0);
    } else {
      console.log('Test Failed!');
      process.exit(1);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
