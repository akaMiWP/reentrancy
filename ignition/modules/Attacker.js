const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployAttacker", (m, { DeployBank }) => {
  const attacker = m.contract("Attacker", [
    DeployBank.contract,
    m.getAddress(1),
  ]);
  return { attacker };
});
