import { FC, useState } from "react";
import { Button } from "antd";
import Web3 from "web3";
import { OrderMarketplace } from "backend/types/web3-v1-contracts/OrderMarketplace";
import useDocumentTitle from "./useDocumentTitle";
import { CartItem } from "./CartItem";
import OrderTable from "./OrderTable";

export type CheckoutProps = {
  cart: CartItem[];
  instance: OrderMarketplace | null;
  web3: Web3 | null;
  onPaymentSuccess: () => void;
};
const Checkout: FC<CheckoutProps> = ({
  cart,
  onPaymentSuccess,
  instance,
  web3,
}) => {
  useDocumentTitle("Checkout");
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const onPay = async () => {
    const isPayable = web3 && instance && cart.length;
    if (!isPayable) {
      return;
    }
    setPaymentInProgress(true);
    const total =
      cart.reduce((acc, item) => acc + item.product.price * item.amount, 0) *
      10;

    const value = web3.utils.toWei(total.toString(), "gwei");

    const orderItems: [string, string][] = cart.map((item) => {
      return [
        web3.utils.utf8ToHex(item.product.id),
        web3.utils.numberToHex(item.amount),
      ];
    });
    try {
      const accounts = await web3.eth.getAccounts();
      await instance.methods.createOrder(orderItems).send({
        from: accounts[0],
        value,
      });
      onPaymentSuccess();
    } finally {
      setPaymentInProgress(false);
    }
  };
  return (
    <div>
      <h1>Checkout</h1>
      <OrderTable items={cart} />
      <Button
        key="submit"
        type="primary"
        disabled={!instance}
        onClick={onPay}
        loading={paymentInProgress}
      >
        Pay
      </Button>
      {!instance && (
        <Button
          onClick={() => window.open("https://metamask.io/download/", "_blank")}
        >
          Install Metamask
        </Button>
      )}
    </div>
  );
};
export default Checkout;
