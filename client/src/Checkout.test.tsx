import { render, screen } from "@testing-library/react";
import "./matchMediaSetup";
import Checkout from "./Checkout";

test("renders app", () => {
  const handler = jest.fn();
  render(
    <Checkout
      cart={[]}
      instance={null}
      web3={null}
      onPaymentSuccess={handler}
    />
  );
  const linkElement = screen.getByText(/checkout/i);
  expect(linkElement).toBeInTheDocument();
});
