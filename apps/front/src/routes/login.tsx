import { useState } from "react";
import { useNavigate } from "react-router";
import type { LoginInput } from "@ctest/shared";
import { LoginForm } from "~/components/login-form";
import { authClient } from "~/lib/auth.client";

export default function LoginRoute() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();

  async function handleSubmit(data: LoginInput) {
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      setError(result.error.message || "Invalid credentials");
      return;
    }

    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm onSubmit={handleSubmit} error={error} />
    </div>
  );
}
