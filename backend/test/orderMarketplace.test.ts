import { OrderState } from "common";
import utils from "../utils";
const OrderMarketplace = artifacts.require("OrderMarketplace");

const ORDER = [
  {
    id: "f9f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f8f8",
    amount: 100,
  },
];
const ORDER2 = [
  {
    id: "f9f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f8f8",
    amount: 10,
  },
  {
    id: "a9f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f8f8",
    amount: 50,
  },
];
const getGas = async (result: Truffle.TransactionResponse<never>) => {
  const tx = await web3.eth.getTransaction(result.tx);
  const gasUsed = web3.utils.toBN(result.receipt.gasUsed);
  const gasPrice = web3.utils.toBN(tx.gasPrice);
  const gas = gasPrice.mul(gasUsed);
  return gas;
};

contract("OrderMarketplace", function (accounts) {
  describe("Contract", () => {
    it("should be deployed", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      assert.ok(orderMarketplaceInstance.address);
    });
  });
  describe("Recieve funds", () => {
    it("should recieve funds", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      const contractBeforeTx = await web3.eth.getBalance(
        orderMarketplaceInstance.address
      );
      const value = web3.utils.toWei("1", "ether");
      await web3.eth.sendTransaction({
        from: accounts[1],
        to: orderMarketplaceInstance.address,
        value,
      });
      const contractAfterTx = await web3.eth.getBalance(
        orderMarketplaceInstance.address
      );
      assert.equal(
        web3.utils
          .toBN(contractBeforeTx)
          .add(web3.utils.toBN(value))
          .toString(),
        contractAfterTx,
        "Contract balance is not changed!"
      );
    });
  });
  describe("Withdraw funds", () => {
    it("should not withdraw funds by not an owner", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      const value = web3.utils.toWei("0.1", "ether");
      try {
        await orderMarketplaceInstance.withdraw(value, {
          from: accounts[1],
        });
        assert.fail("Should throw an error");
      } catch (error: unknown) {
        if (error instanceof Error) {
          assert.ok(error.message.includes("revert"));
        } else {
          assert.fail("Should throw an error");
        }
      }
    });

    it("should withdraw funds", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      const currentOwner = await orderMarketplaceInstance.getContractOwner();
      const ownerBalance = await web3.eth.getBalance(currentOwner);
      await web3.eth.getBalance(orderMarketplaceInstance.address);
      const value = web3.utils.toWei("0.1", "ether");
      const result = await orderMarketplaceInstance.withdraw(value, {
        from: currentOwner,
      });
      const gas = await getGas(result);
      const ownerBalanceAfter = await web3.eth.getBalance(currentOwner);
      assert.equal(
        web3.utils
          .toBN(ownerBalance)
          .add(web3.utils.toBN(value))
          .sub(gas)
          .toString(),
        ownerBalanceAfter,
        "Contract balance is not changed!"
      );
    });
  });
  describe("Order", () => {
    it("should create an order and retrive it", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      const orderCountBefore = await orderMarketplaceInstance.getOrderCount();
      assert.equal(web3.utils.toNumber(orderCountBefore), 0);
      await orderMarketplaceInstance.createOrder(
        ORDER.map(utils.orderItemtoHex)
      );
      const orderCountAfter = await orderMarketplaceInstance.getOrderCount();
      assert.equal(web3.utils.toNumber(orderCountAfter), 1);
      const result = await orderMarketplaceInstance.getOrderById(
        web3.utils.numberToHex(0)
      );
      assert.deepEqual(result.items.map(utils.hexToOrderItem), ORDER);
    });
    it("should create an order with multiple items and retrive it", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      const orderCountBefore = await orderMarketplaceInstance.getOrderCount();
      assert.equal(web3.utils.toNumber(orderCountBefore), 1);
      await orderMarketplaceInstance.createOrder(
        ORDER2.map(utils.orderItemtoHex)
      );
      const orderCountAfter = await orderMarketplaceInstance.getOrderCount();
      assert.equal(web3.utils.toNumber(orderCountAfter), 2);
      const result = await orderMarketplaceInstance.getOrderById(
        web3.utils.numberToHex(0)
      );
      assert.deepEqual(result.items.map(utils.hexToOrderItem), ORDER);
    });

    it("should trace orders by id with 2 matches", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      const result = await orderMarketplaceInstance.traceOrdersByProductId(
        web3.utils.utf8ToHex(ORDER[0].id)
      );
      assert.equal(result.length, 2);
    });

    it("should trace orders by id with 1 match", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      const result = await orderMarketplaceInstance.traceOrdersByProductId(
        web3.utils.utf8ToHex(ORDER2[1].id)
      );
      assert.equal(result.length, 1);
    });
    it("should confirm order", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      const index = web3.utils.numberToHex(0);
      const before = await orderMarketplaceInstance.getOrderById(index);
      const beforeOrder = utils.truffle.hexToOrder(before);
      assert.deepEqual(
        beforeOrder.state,
        OrderState.Created,
        "order is not in created state"
      );
      await orderMarketplaceInstance.confirmOrder(index);
      const after = await orderMarketplaceInstance.getOrderById(index);
      const afterOrder = utils.truffle.hexToOrder(after);
      assert.deepEqual(
        afterOrder.state,
        OrderState.Confirmed,
        "order is not in confirmed state"
      );
    });
    it("should cancel order", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      const index = web3.utils.numberToHex(1);
      const before = await orderMarketplaceInstance.getOrderById(index);
      const beforeOrder = utils.truffle.hexToOrder(before);
      assert.deepEqual(
        beforeOrder.state,
        OrderState.Created,
        "order is not in created state"
      );
      await orderMarketplaceInstance.cancelOrder(index);
      const after = await orderMarketplaceInstance.getOrderById(index);
      const afterOrder = utils.truffle.hexToOrder(after);
      assert.deepEqual(
        afterOrder.state,
        OrderState.Cancelled,
        "order is not in cancelled state"
      );
    });
  });
  describe("Self destruct", () => {
    it("should not self destruct by not an owner", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      try {
        await orderMarketplaceInstance.selfDestruct({
          from: accounts[1],
        });
        assert.fail("Should throw an error");
      } catch (error: unknown) {
        if (error instanceof Error) {
          assert.ok(error.message.includes("revert"));
        } else {
          assert.fail("Should throw an error");
        }
      }
    });
    it("should self destruct", async () => {
      const orderMarketplaceInstance = await OrderMarketplace.deployed();
      const currentOwner = await orderMarketplaceInstance.getContractOwner();
      await orderMarketplaceInstance.selfDestruct({
        from: currentOwner,
      });
      const code = await web3.eth.getCode(orderMarketplaceInstance.address);
      assert.equal(code, "0x", "Contract code is not 0x!");
    });
  });
});
