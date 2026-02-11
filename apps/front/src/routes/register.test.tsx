import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import RegisterRoute from "./register";

describe("Register Route", () => {
  it("renders the RegisterForm", async () => {
    const Stub = createRoutesStub([
      {
        path: "/register",
        Component: RegisterRoute,
      },
    ]);

    render(<Stub initialEntries={["/register"]} />);

    expect(await screen.findByRole("button", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
