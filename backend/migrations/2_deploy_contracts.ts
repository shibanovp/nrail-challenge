var OrderMarketplace = artifacts.require("OrderMarketplace");

module.exports = function (deployer) {
  deployer.deploy(OrderMarketplace);
} as Truffle.Migration;

export {};
