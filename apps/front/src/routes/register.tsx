import { useState } from "react";
import { useNavigate } from "react-router";
import type { RegisterInput } from "@ctest/shared";
import { RegisterForm } from "~/components/register-form";
import { authClient } from "~/lib/auth.client";

export default function RegisterRoute() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();

  async function handleSubmit(data: RegisterInput) {
    const result = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      setError(result.error.message || "Registration failed");
      return;
    }

    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <RegisterForm onSubmit={handleSubmit} error={error} />
    </div>
  );
}
