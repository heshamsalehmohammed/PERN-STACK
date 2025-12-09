import { Suspense } from "react";
import Link from "next/link";

import { RegisterForm } from "@/modules/auth/register-form";
import FormSkeleton from "@/features/skeletons/form-skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const metadata = {
  title: "Register - RetailZoom",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-md border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Join RetailZoom to manage todos and explore the PEN2 stack.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Suspense fallback={<FormSkeleton />}>
            <RegisterForm />
          </Suspense>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
