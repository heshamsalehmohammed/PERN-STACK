import type { Request, Response, NextFunction, RequestHandler } from "express";
import {
  checkCombination,
  PermissionCombinationIdentifier,
} from "../helpers/auth";

interface IAuthorizationOptions {
  roles?: TUserRole[];
  permissions?: TUserPermission[];
  rolesAllowIf?: PermissionCombinationIdentifier;
  permissionsAllowIf?: PermissionCombinationIdentifier;
}

class AuthorizationMiddleware {
  public authorize = (options: IAuthorizationOptions): RequestHandler => {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void | Response> => {
      const user: ISignedPayload = res.locals.jwtPayload;

      if (!user) {
        res.status(403).json({
          success: false,
          message: "Forbidden: Missing authenticated user data",
        });
        return;
      }

      const userPermissions = user.permissions ?? [];
      const userRole = user.role;

      const {
        roles = [],
        permissions = [],
        rolesAllowIf = PermissionCombinationIdentifier.HAS_ANY,
        permissionsAllowIf = PermissionCombinationIdentifier.HAS_ANY,
      } = options;

      const hasPermission =
        permissions.length > 0
          ? checkCombination(userPermissions, permissions, permissionsAllowIf)
          : true;

      const hasRole =
        roles.length > 0
          ? checkCombination([userRole], roles, rolesAllowIf)
          : true;

      let authorized = false;

      if (roles.length > 0 && permissions.length > 0) {
        authorized = hasRole || hasPermission;
      } else if (roles.length > 0) {
        authorized = hasRole;
      } else if (permissions.length > 0) {
        authorized = hasPermission;
      } else {
        authorized = true;
      }

      if (authorized) {
        next();
        return;
      }

      res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient role or permissions",
      });
    };
  };
}

const authorizationMiddleware = new AuthorizationMiddleware();

export const authorization = authorizationMiddleware.authorize;

export default AuthorizationMiddleware;
