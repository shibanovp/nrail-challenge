var SampleContract = artifacts.require("SampleContract");

module.exports = function (deployer) {
  deployer.deploy(SampleContract);
} as Truffle.Migration;

export {};
