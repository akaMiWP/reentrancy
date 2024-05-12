const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployAttacker", (m) => {
  const attacker = m.contract("Attacker", [
    "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    m.getAccount(1),
  ]);
  return { attacker };
});
