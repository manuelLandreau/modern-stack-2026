import { redirect, useLoaderData, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { authClient } from "~/lib/auth.client";

export async function loader({ request }: { request: Request }) {
  const apiUrl = process.env.VITE_API_URL || "http://localhost:3000";
  const cookieHeader = request.headers.get("Cookie") || "";

  const res = await fetch(`${apiUrl}/api/auth/get-session`, {
    headers: { Cookie: cookieHeader },
  });

  if (!res.ok) {
    throw redirect("/login");
  }

  const data = await res.json();
  if (!data?.user) {
    throw redirect("/login");
  }

  return { user: data.user };
}

export default function HomeRoute() {
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  async function handleSignOut() {
    await authClient.signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome, {user.name}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{user.email}</p>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
