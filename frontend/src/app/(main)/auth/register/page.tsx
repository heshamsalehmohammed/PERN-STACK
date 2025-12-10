import Link from "next/link";

import { RegisterForm } from "@/modules/auth/register-form";
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
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
