import { Suspense } from "react";
import Link from "next/link";

import { LoginForm } from "@/modules/auth/login-form";
import FormSkeleton from "@/features/skeletons/form-skeleton";
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
          <Suspense fallback={<FormSkeleton />}>
            <LoginForm />
          </Suspense>

          <p className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
