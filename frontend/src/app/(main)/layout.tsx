import Link from "next/link";

import { AuthenticationGateServer, AuthorizationGateServer } from "@/modules/auth/auth-gates-server";
import LogoutButton from "@/modules/auth/LogoutButton";
import { PermissionCombinationIdentifier, UserPermissions, UserRoles } from "@/modules/auth/permission-helpers";
import { getServerAuthUser } from "@/modules/auth/server-auth";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getServerAuthUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <span className="text-xl font-bold bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  RetailZoom
                </span>
              </Link>
              <span className="text-xs p-2">{user?.email}</span>
            </div>
            <nav className="flex items-center gap-6">
              <AuthorizationGateServer
                roles={[UserRoles.MASTER]}
                rolesAllowIf={PermissionCombinationIdentifier.HAS_ALL}
              >
                <Link
                  href="/users"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Users
                </Link>
              </AuthorizationGateServer>
              <AuthorizationGateServer
                roles={[UserRoles.MASTER]}
                permissions={[UserPermissions.CAN_VIEW_TODO]}
              >
                <Link
                  href="/todos"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Todos
                </Link>
              </AuthorizationGateServer>
              <Link
                href="/documents"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Documentation
              </Link>
              <AuthenticationGateServer>
                <LogoutButton />
              </AuthenticationGateServer>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
