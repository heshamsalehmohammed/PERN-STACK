"use client";

import React from "react";
import { useAuth } from "./auth-provider";
import { checkCombination, PermissionCombinationIdentifier, UserPermissions, UserRoles } from "./permission-helpers";

interface AuthenticationGateClientProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export function AuthenticationGateClient({
  children,
  requireAuth = true,
  fallback = null,
}: AuthenticationGateClientProps) {
  const { isAuthenticated } = useAuth();

  const shouldShow = requireAuth ? isAuthenticated : !isAuthenticated;

  if (!shouldShow) {
    if (fallback !== null) {
      return <>{fallback}</>;
    }
    return null;
  }

  return <>{children}</>;
}


interface AuthorizationGateClientProps {
  children: React.ReactElement;
  permissions?: (typeof UserPermissions)[keyof typeof UserPermissions][];
  roles?: (typeof UserRoles)[keyof typeof UserRoles][];
  permissionsAllowIf?: PermissionCombinationIdentifier;
  rolesAllowIf?: PermissionCombinationIdentifier;
  noAccessMode?: "hide" | "applyProps";
  noAccessProps?: Partial<React.ComponentProps<any>>;
}

export function AuthorizationGateClient({
  children,
  permissions = [],
  roles = [],
  permissionsAllowIf = PermissionCombinationIdentifier.HAS_ANY,
  rolesAllowIf = PermissionCombinationIdentifier.HAS_ANY,
  noAccessMode = "hide",
  noAccessProps,
}: AuthorizationGateClientProps) {
  const { user } = useAuth();

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
