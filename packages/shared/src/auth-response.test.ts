import { describe, it, expect } from "vitest";
import { AuthUserSchema, SessionSchema } from "./auth-response";

describe("AuthUserSchema", () => {
  it("validates a correct user object", () => {
    const result = AuthUserSchema.safeParse({
      id: "abc-123",
      name: "John",
      email: "john@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const result = AuthUserSchema.safeParse({
      name: "John",
      email: "john@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = AuthUserSchema.safeParse({
      id: "abc-123",
      name: "John",
      email: "bad",
    });
    expect(result.success).toBe(false);
  });
});

describe("SessionSchema", () => {
  it("validates a correct session object", () => {
    const result = SessionSchema.safeParse({
      session: {
        id: "sess-1",
        userId: "abc-123",
        expiresAt: "2026-12-31T00:00:00Z",
      },
      user: {
        id: "abc-123",
        name: "John",
        email: "john@example.com",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing session", () => {
    const result = SessionSchema.safeParse({
      user: {
        id: "abc-123",
        name: "John",
        email: "john@example.com",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing user", () => {
    const result = SessionSchema.safeParse({
      session: {
        id: "sess-1",
        userId: "abc-123",
        expiresAt: "2026-12-31T00:00:00Z",
      },
    });
    expect(result.success).toBe(false);
  });
});
