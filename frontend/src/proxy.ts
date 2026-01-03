import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Use jose directly in middleware for Edge compatibility
import { PermissionCombinationIdentifier, UserPermissions, UserRoles } from "./modules/auth/permission-helpers";

const secretKey = process.env.ACCESS_JWT_SECRET;
if (!secretKey) {
  console.error(
    "FATAL: ACCESS_JWT_SECRET is not set for Middleware. Application is insecure."
  );
}
const JWT_SECRET_KEY = new TextEncoder().encode(
  secretKey || "default-secret-for-build"
);

interface IAccessRule {
  roles?: TUserRole[];
  permissions?: TUserPermission[];
  permissionsAllowIf?: PermissionCombinationIdentifier;
}

const publicPaths = ["/", "/documents", "/auth/login", "/auth/register"];


const AUTHORIZATION_RULES: Record<string, IAccessRule> = {
  "/todos": {
    roles: [UserRoles.MASTER],
    permissions: [UserPermissions.CAN_VIEW_TODO],
  },
  "/users": {
    roles: [UserRoles.MASTER],
  },
};


async function verifyTokenInMiddleware(
  token: string
): Promise<ISignedPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    return payload as unknown as ISignedPayload;
  } catch (e) {
    const error = e as Error;

    if (error.name === "JWTExpired") {
      console.warn("Middleware Token check failed: JWT Expired.");
    } else {
      console.error(
        "Middleware Token check failed: Invalid Signature/Claim.",
        error.message
      );
    }
    return null;
  }
}

function checkMiddlewareCombination(
  userValues: string[],
  required: string[],
  mode: PermissionCombinationIdentifier = PermissionCombinationIdentifier.HAS_ANY
): boolean {
  if (!required.length) return true;

  switch (mode) {
    case PermissionCombinationIdentifier.HAS_ANY:
      return required.some((value) => userValues.includes(value));
    case PermissionCombinationIdentifier.HAS_ALL:
      return required.every((value) => userValues.includes(value));
    default:
      return false;
  }
}


export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  const isPublicPath = publicPaths.includes(path);
  const isAuthPath = path.startsWith("/auth");


  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  if (isPublicPath) {
    return NextResponse.next();
  }


  const userPayload = await verifyTokenInMiddleware(token!);

  if (!userPayload) {
    const response = NextResponse.redirect(
      new URL("/auth/login", request.nextUrl)
    );
    response.cookies.delete("token");
    return response;
  }

  if (isAuthPath) {
    return NextResponse.redirect(new URL("/todos", request.nextUrl));
  }

  const userRole = userPayload.role;
  const userPermissions = userPayload.permissions || [];


  for (const [routePrefix, rule] of Object.entries(AUTHORIZATION_RULES)) {
    if (path.startsWith(routePrefix)) {
      let hasPermission = true;
      if (rule.permissions && rule.permissions.length > 0) {
        hasPermission = checkMiddlewareCombination(
          userPermissions,
          rule.permissions,
          rule.permissionsAllowIf
        );
      }

      let hasRole = true;
      if (rule.roles && rule.roles.length > 0) {
        hasRole = checkMiddlewareCombination(
          [userRole],
          rule.roles,
          PermissionCombinationIdentifier.HAS_ANY
        );
      }


      let authorized = false;

      if (rule.roles && rule.permissions) {
        authorized = hasRole || hasPermission;
      } else if (rule.roles) {
        authorized = hasRole;
      } else if (rule.permissions) {
        authorized = hasPermission;
      } else {
        authorized = true;
      }

      if (authorized) {
        return NextResponse.next(); 
      } else {
        return NextResponse.redirect(
          new URL("/unauthorized/403", request.nextUrl)
        );
      }
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
