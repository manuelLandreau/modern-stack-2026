import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import LoginRoute from "./login";

describe("Login Route", () => {
  it("renders the LoginForm", async () => {
    const Stub = createRoutesStub([
      {
        path: "/login",
        Component: LoginRoute,
      },
    ]);

    render(<Stub initialEntries={["/login"]} />);

    expect(await screen.findByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
