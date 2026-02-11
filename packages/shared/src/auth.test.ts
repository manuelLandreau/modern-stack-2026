import { describe, it, expect } from "vitest";
import { LoginSchema, RegisterSchema } from "./auth";

describe("LoginSchema", () => {
  it("validates a correct login input", () => {
    const result = LoginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = LoginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = LoginSchema.safeParse({
      email: "test@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(LoginSchema.safeParse({}).success).toBe(false);
    expect(LoginSchema.safeParse({ email: "test@example.com" }).success).toBe(false);
    expect(LoginSchema.safeParse({ password: "password123" }).success).toBe(false);
  });
});

describe("RegisterSchema", () => {
  it("validates a correct register input", () => {
    const result = RegisterSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = RegisterSchema.safeParse({
      email: "john@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = RegisterSchema.safeParse({
      name: "",
      email: "john@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = RegisterSchema.safeParse({
      name: "John",
      email: "bad",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});
