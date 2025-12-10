import { LoginForm } from "@/modules/auth/login-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const metadata = {
  title: "Login - RetailZoom",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-md border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Welcome back! Enter your credentials to access your todos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
