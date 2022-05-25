import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "./App";

test("renders learn react link", async () => {
  const { getByText } = render(<App />);
  await waitFor(() => {
    expect(getByText("ESP 8266 State")).toBeInTheDocument();
  });
  const linkElement = getByText(/esp 8266 state/i);
  expect(linkElement).toBeInTheDocument();
});
