import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { RegisterForm } from "./register-form";

function renderForm(onSubmit = vi.fn()) {
  return {
    onSubmit,
    user: userEvent.setup(),
    ...render(
      <MemoryRouter>
        <RegisterForm onSubmit={onSubmit} />
      </MemoryRouter>,
    ),
  };
}

describe("RegisterForm", () => {
  it("renders name, email, password fields and Sign Up button", () => {
    renderForm();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("calls onSubmit with name, email and password on valid submission", async () => {
    const { onSubmit, user } = renderForm();

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
  });

  it("shows validation error for empty name", async () => {
    const { onSubmit, user } = renderForm();

    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("has a link to login page", () => {
    renderForm();
    const link = screen.getByRole("link", { name: /sign in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });
});
