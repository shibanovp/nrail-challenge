import { render, screen } from "@testing-library/react";
import Shop from "./Shop";

test("renders Shop component", () => {
  render(<Shop />);
  const linkElement = screen.getByText(/shop/i);
  expect(linkElement).toBeInTheDocument();
});
