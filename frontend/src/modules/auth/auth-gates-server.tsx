// src/modules/auth/auth-gates-server.tsx
import React from "react";
import { checkCombination, PermissionCombinationIdentifier } from "./permission-helpers";
import { getServerAuthUser } from "./server-auth";

//
// AuthenticationGateServer
//
interface AuthenticationGateServerProps {
  children: React.ReactNode;
  /**
   * If true (default): show children only when user IS authenticated.
   * If false: show children only when user is NOT authenticated.
   */
  requireAuth?: boolean;
  /**
   * What to render if condition is not met.
   * Default: render nothing.
   */
  fallback?: React.ReactNode;
}

export async function AuthenticationGateServer({
  children,
  requireAuth = true,
  fallback = null,
}: AuthenticationGateServerProps) {
  const user = await getServerAuthUser();
  const isAuthenticated = !!user;

  const shouldShow = requireAuth ? isAuthenticated : !isAuthenticated;

  if (!shouldShow) {
    if (fallback !== null) {
      return <>{fallback}</>;
    }
    return null;
  }

  return <>{children}</>;
}

//
// AuthorizationGateServer
//
interface AuthorizationGateServerProps {
  children: React.ReactElement;
  permissions?: string[];
  roles?: string[];
  permissionsAllowIf?: PermissionCombinationIdentifier;
  rolesAllowIf?: PermissionCombinationIdentifier;
  noAccessMode?: "hide" | "applyProps";
  noAccessProps?: Partial<React.ComponentProps<any>>;
}

export async function AuthorizationGateServer({
  children,
  permissions = [],
  roles = [],
  permissionsAllowIf = PermissionCombinationIdentifier.HAS_ANY,
  rolesAllowIf = PermissionCombinationIdentifier.HAS_ANY,
  noAccessMode = "hide",
  noAccessProps,
}: AuthorizationGateServerProps) {
  const user = await getServerAuthUser();

  if (!user) {
    if (noAccessMode === "applyProps" && noAccessProps) {
      return React.cloneElement(children, {
        ...noAccessProps,
      });
    }
    return null;
  }

  const userPermissions = user.permissions ?? [];
  const userRole = user.role;

  const hasPermission = checkCombination(
    userPermissions,
    permissions,
    permissionsAllowIf
  );

  const hasRole = roles.length
    ? checkCombination([userRole], roles, rolesAllowIf)
    : false;

  let authorized = false;

  if (!roles.length && !permissions.length) {
    authorized = true;
  } else if (roles.length && permissions.length) {
    authorized = hasRole || hasPermission;
  } else if (roles.length) {
    authorized = hasRole;
  } else if (permissions.length) {
    authorized = hasPermission;
  }

  if (!authorized) {
    if (noAccessMode === "applyProps" && noAccessProps) {
      return React.cloneElement(children, {
        ...noAccessProps,
      });
    }
    return null;
  }

  return <>{children}</>;
}

