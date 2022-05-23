import { render, screen } from "@testing-library/react";
import Cart from "./Cart";
import { CartItem } from "./CartItem";
const CART_ITEM: CartItem = {
  product: {
    id: "f9f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f8f8",
    name: "nrail-engine",
    description: "a rail engine",
    amountAvaliable: 10,
    price: 10000,
    image: "https://via.placeholder.com/150",
  },
  amount: 3,
};

test("renders empty Cart", () => {
  render(<Cart items={[]} />);
  const cartElement = screen.getByText(/empty cart/i);
  expect(cartElement).toBeInTheDocument();
});

test("renders empty Cart", () => {
  render(<Cart items={[CART_ITEM]} />);
  const cartElement = screen.getByText(/1 products with 3 items in cart/i);
  expect(cartElement).toBeInTheDocument();
});
