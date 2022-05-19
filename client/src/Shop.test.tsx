import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Shop from "./Shop";
import { InventoryItem } from "./InventoryItem";

window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

const originalFetch = global.fetch;

const INVENTORY_ITEM: InventoryItem = {
  id: "f9f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f8f8",
  name: "nrail-engine",
  description: "a rail engine",
  amountAvaliable: 10,
  price: 10000,
  image: "https://via.placeholder.com/150",
};

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([INVENTORY_ITEM]),
    })
  ) as jest.Mock;
});

afterEach(() => {
  global.fetch = originalFetch;
});

test("renders Shop component, calls onAddToCart on submit", async () => {
  const handler = jest.fn();
  await act(async () => {
    render(<Shop cart={[]} onAddToCart={handler} />);
  });
  const cardTitle = screen.getByText(/a rail engine/i);
  expect(cardTitle).toBeInTheDocument();
  const addToCartButton = screen.getByText(/add to cart/i);
  await act(async () => {
    userEvent.click(addToCartButton);
  });
  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith({
    product: INVENTORY_ITEM,
    amount: 1,
  });
});
test("renders Shop component, calls onAddToCart on submit with amount 5", async () => {
  const handler = jest.fn();
  await act(async () => {
    render(<Shop cart={[]} onAddToCart={handler} />);
  });
  const cardTitle = screen.getByText(/a rail engine/i);
  expect(cardTitle).toBeInTheDocument();
  const amountSelect = screen.getByTitle(/1/i);
  await act(async () => {
    userEvent.click(amountSelect);
  });
  const select5 = screen.getByTitle(/5/i);
  await act(async () => {
    userEvent.click(select5);
  });
  const addToCartButton = screen.getByText(/add to cart/i);
  await act(async () => {
    userEvent.click(addToCartButton);
  });
  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith({
    product: INVENTORY_ITEM,
    amount: 5,
  });
});
