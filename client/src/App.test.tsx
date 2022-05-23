import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";
import { HashRouter } from "react-router-dom";
import App from "./App";

test("page should have a title and navigation with the home page and another page with some text on it", async () => {
  const { getByText } = render(
    <HashRouter>
      <App />
    </HashRouter>
  );
  await waitFor(() => {
    expect(getByText("Home")).toBeInTheDocument();
  });
  const headerElement = getByText(/shop/i);
  expect(headerElement).toBeInTheDocument();
  expect(document.title).toBe("🚆 Shop");
});

test("should navigate to about and back", async () => {
  const { getByText, getByRole, getByTestId } = render(
    <HashRouter>
      <App />
    </HashRouter>
  );
  await waitFor(() => {
    expect(getByText("Home")).toBeInTheDocument();
  });

  const menu = getByRole("menu");
  expect(menu).toBeInTheDocument();
  const aboutLink = within(menu).getByText("About");
  userEvent.click(aboutLink);

  const content = getByTestId("content");
  let shop = within(content).queryByText(/shop/i);
  expect(shop).toBeNull();
  const about = within(content).getByText(/about/i);
  expect(about).toBeInTheDocument();
  expect(document.title).toBe("About");

  const homeLink = within(menu).getByText("Home");
  userEvent.click(homeLink);
  shop = within(content).getByText(/shop/i);
  expect(shop).toBeInTheDocument();
  expect(document.title).toBe("🚆 Shop");
});
