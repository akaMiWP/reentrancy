const { expect } = require("chai");
const { ethers } = require("hardhat");

const convertEtherToWei = (ether) => {
  return ethers.parseEther(ether);
};

const convertWeiToEther = (wei) => {
  return ethers.formatUnits(wei, "ether");
};

describe("Reentrancy", () => {
  let deployer, user;
  let bank;
  let attacker;

  beforeEach(async () => {
    let accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];

    const Bank = await ethers.getContractFactory("Bank", deployer);
    bank = await Bank.deploy();

    const Attacker = await ethers.getContractFactory("Attacker", accounts[2]);
    attacker = await Attacker.deploy(
      await bank.getAddress(),
      await deployer.getAddress()
    );

    await bank.connect(deployer).deposit({ value: convertEtherToWei("100") });
    await bank.connect(user).deposit({ value: convertEtherToWei("50") });
  });

  describe("Deposit and Withdraw", () => {
    it("expect deposit to update balances correctly", async () => {
      const deployerBalance = await bank.balanceOf(deployer.address);
      const userBalance = await bank.balanceOf(user.address);
      expect(deployerBalance).to.equal(convertEtherToWei("100"));
      expect(userBalance).to.equal(convertEtherToWei("50"));
    });

    it("expect withdraw to update balances correctly", async () => {
      let previousDeployerAddressBalance = await ethers.provider.getBalance(
        deployer.address
      );
      await bank.connect(deployer).withdraw();
      let afterDeployerAddressBalance = await ethers.provider.getBalance(
        deployer.address
      );
      const deployerBalance = await bank.balanceOf(deployer.address);
      const userBalance = await bank.balanceOf(user.address);
      expect(deployerBalance).to.equal(0);
      expect(afterDeployerAddressBalance).to.greaterThan(
        previousDeployerAddressBalance
      );
      expect(userBalance).to.equal(convertEtherToWei("50"));
    });

    it("expect Bank contract is able to protect malicious users to drain the balance", async () => {
      await expect(
        attacker.connect(deployer).attack({ value: convertEtherToWei("10") })
      ).to.reverted;

      // expect(
      //   await ethers.provider.getBalance(await bank.getAddress())
      // ).to.equal(0);
    });
  });
});
