import { render, screen } from "@testing-library/react";
import "./matchMediaSetup";
import OrderTable from "./OrderTable";

test("renders app", () => {
  const { getByTestId } = render(<OrderTable items={[]} />);
  const linkElement = getByTestId("table");
  expect(linkElement).toBeInTheDocument();
});
