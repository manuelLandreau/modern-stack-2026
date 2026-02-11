import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { LoginForm } from "./login-form";

function renderForm(onSubmit = vi.fn()) {
  return {
    onSubmit,
    user: userEvent.setup(),
    ...render(
      <MemoryRouter>
        <LoginForm onSubmit={onSubmit} />
      </MemoryRouter>,
    ),
  };
}

describe("LoginForm", () => {
  it("renders email, password fields and Sign In button", () => {
    renderForm();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("calls onSubmit with email and password on valid submission", async () => {
    const { onSubmit, user } = renderForm();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("shows validation error for invalid email", async () => {
    const { onSubmit, user } = renderForm();

    await user.type(screen.getByLabelText(/email/i), "not-email");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  it("shows validation error for short password", async () => {
    const { onSubmit, user } = renderForm();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "short");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/8/i)).toBeInTheDocument();
  });

  it("has a link to register page", () => {
    renderForm();
    const link = screen.getByRole("link", { name: /sign up/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/register");
  });
});
