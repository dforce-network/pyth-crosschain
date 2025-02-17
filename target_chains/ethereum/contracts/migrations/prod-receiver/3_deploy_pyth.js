const loadEnv = require("../../scripts/loadEnv");
loadEnv("../../");

const PythUpgradable = artifacts.require("PythUpgradable");
const WormholeReceiver = artifacts.require("WormholeReceiver");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const tdr = require("truffle-deploy-registry");

const emitterChainIds = [
  process.env.SOLANA_CHAIN_ID,
  process.env.PYTHNET_CHAIN_ID,
];
const emitterAddresses = [
  process.env.SOLANA_EMITTER,
  process.env.PYTHNET_EMITTER,
];
const governanceChainId = process.env.GOVERNANCE_CHAIN_ID;
const governanceEmitter = process.env.GOVERNANCE_EMITTER;
// Default value for this field is 0
const governanceInitialSequence = Number(
  process.env.GOVERNANCE_INITIAL_SEQUENCE ?? "0"
);

const validTimePeriodSeconds = Number(process.env.VALID_TIME_PERIOD_SECONDS);
const singleUpdateFeeInWei = Number(process.env.SINGLE_UPDATE_FEE_IN_WEI);

console.log("emitterChainIds: " + emitterChainIds);
console.log("emitterAddresses: " + emitterAddresses);
console.log("governanceEmitter: " + governanceEmitter);
console.log("governanceChainId: " + governanceChainId);
console.log("governanceInitialSequence: " + governanceInitialSequence);
console.log("validTimePeriodSeconds: " + validTimePeriodSeconds);
console.log("singleUpdateFeeInWei: " + singleUpdateFeeInWei);

module.exports = async function (deployer, network) {
  // Deploy the proxy. This will return an instance of PythUpgradable,
  // with the address field corresponding to the fronting ERC1967Proxy.
  let proxyInstance = await deployProxy(
    PythUpgradable,
    [
      (await WormholeReceiver.deployed()).address,
      emitterChainIds,
      emitterAddresses,
      governanceChainId,
      governanceEmitter,
      governanceInitialSequence,
      validTimePeriodSeconds,
      singleUpdateFeeInWei,
    ],
    { deployer }
  );

  // Add the ERC1967Proxy address to the PythUpgradable contract's
  // entry in the registry. This allows us to call upgradeProxy
  // functions with the value of PythUpgradable.deployed().address:
  // e.g. upgradeProxy(PythUpgradable.deployed().address, NewImplementation)
  if (!tdr.isDryRunNetworkName(network)) {
    await tdr.appendInstance(proxyInstance);
  }
};
