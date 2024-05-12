const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployBank", (m) => {
  const bank = m.contract("Bank");
  return { bank };
});
