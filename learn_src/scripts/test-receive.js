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
  const ContractFactory = await hre.ethers.getContractFactory('ReceiveEther');
  const contract = await ContractFactory.deploy();

  await contract.deployed();
  console.log('ReceiveEther Contract deployed to:', contract.address);
  contract.on('Log', (msg) => {
    console.log('Log(): ', msg);
    process.exit(0);
  });
  try {
    const balanceBefore = await contract.provider.getBalance(contract.address);
    console.log('Contract balance before sending ether: ', balanceBefore.toString());
    console.log(`Calling sendTransaction() without msg.data`);
    await deployer.sendTransaction({
      from: deployer.address,
      to: contract.address,
      value: ethers.utils.parseUnits('1', 'ether').toHexString(),
    });
    const balanceAfter = await contract.provider.getBalance(contract.address);
    console.log('Contract balance after sending ether: ', balanceAfter.toString());
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
    setTimeout(() => {
      process.exit(0);
    }, 6000);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
