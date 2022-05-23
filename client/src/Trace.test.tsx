import { render, screen } from "@testing-library/react";
import "./matchMediaSetup";
import Trace from "./Trace";
const inventory = {
  items: [],
  isLoading: false,
};
test("renders app", () => {
  const { getByTestId } = render(
    <Trace inventory={inventory} instance={null} web3={null} />
  );
  const linkElement = getByTestId("header");
  expect(linkElement).toBeInTheDocument();
});
