const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployAttacker", (m) => {
  const attacker = m.contract("Attacker", [
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    m.getAccount(0),
  ]);
  return { attacker };
});
