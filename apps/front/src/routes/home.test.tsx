import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import HomeRoute from "./home";

describe("Home Route", () => {
  it("shows welcome message with user name", async () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: HomeRoute,
        loader() {
          return {
            user: { id: "1", name: "John", email: "john@test.com" },
          };
        },
      },
    ]);

    render(<Stub initialEntries={["/"]} hydrationData={{ loaderData: { "0": { user: { id: "1", name: "John", email: "john@test.com" } } } }} />);

    expect(await screen.findByText(/welcome, john/i)).toBeInTheDocument();
  });

  it("shows sign out button", async () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: HomeRoute,
        loader() {
          return {
            user: { id: "1", name: "John", email: "john@test.com" },
          };
        },
      },
    ]);

    render(<Stub initialEntries={["/"]} hydrationData={{ loaderData: { "0": { user: { id: "1", name: "John", email: "john@test.com" } } } }} />);

    expect(await screen.findByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });
});
