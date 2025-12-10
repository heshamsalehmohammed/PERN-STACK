import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AuthenticationGateClient } from "@/modules/auth/auth-gates-client";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium"
            >
              🚀 PEN2 Stack - Postgres, Express, Node & Next.js
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Welcome to{" "}
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                RetailZoom
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Building the future of retail technology with modern web
              solutions. Explore our components, patterns, and best practices.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/todos">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  View Examples
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </Link>
              <Link href="/documents">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-lg font-semibold hover:bg-muted transition-all duration-300"
                >
                  Documentation
                </Button>
              </Link>
            </div>
            <AuthenticationGateClient requireAuth={false}>
              <div className="mt-12 flex flex-col items-center justify-center gap-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Access Your Workspace
                </h3>

                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-8 py-6 text-lg font-semibold shadow hover:shadow-md transition-all duration-300"
                  >
                    Login
                  </Button>
                </Link>

                <p className="text-sm text-muted-foreground">
                  Don’t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-primary font-medium hover:underline"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </AuthenticationGateClient>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What We Build
          </h2>
          <p className="mt-4 text-muted-foreground">
            Modern tools and components for the RetailZoom ecosystem
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <CardTitle className="text-xl">
                Customer Relationship Management (CRM)
              </CardTitle>
              <CardDescription>
                Personalised Campaigns Powered by Dynamic Filtering and Smart
                Product Recommendations for Loyalty journey enhancement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://retailzoom.net/services/crm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  className="group-hover:text-primary transition-colors"
                >
                  Learn More →
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <CardTitle className="text-xl">Data Science</CardTitle>
              <CardDescription>
                Empowering advanced algorithms and data insights to drive
                actionable decisions, optimise processes, and unlock growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://retailzoom.net/services/data-science"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  className="group-hover:text-secondary transition-colors"
                >
                  Learn More →
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent-foreground">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <CardTitle className="text-xl">
                Retail Measurement Services (RMS)
              </CardTitle>
              <CardDescription>
                Benefit from a detailed, structured approach to tracking sales
                and assessing brand performance across key channels, retailers,
                and markets. Optimize your decisions, boost profitability, and
                strengthen your market presence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://retailzoom.net/services/retail-insights"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  className="group-hover:text-accent-foreground transition-colors"
                >
                  Learn More →
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
    </main>
  );
}
