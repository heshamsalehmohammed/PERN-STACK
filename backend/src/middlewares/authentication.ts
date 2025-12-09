import type { Request, Response, NextFunction } from 'express';

import { config } from '../config/general.config';
import JwtMethods from '../utils/jwt.methods';

class AuthenticationMiddleware {
  private readonly jwtMethods: JwtMethods;

  constructor(jwtMethods: JwtMethods = new JwtMethods()) {
    this.jwtMethods = jwtMethods;
  }

  public authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    const openUrls: string[] = ["/health", "/auth/login", "/auth/register"];

    // clean url remove query params
    const url = req.path.split('?')[0];

    // open urls
    if (url && openUrls.includes(url)) {
      return next();
    }

    let token = req.cookies.token as string;

    if (!token) {
      token = req.headers['access-token'] as string;
    } 

    if (!token) {
      token = req.headers['access-key'] as string;
      res.locals.jwtPayload = {
        id: "0",
        email: "internal@service",
        role: "master",
        permissions: [],
      };
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'token not found' });
    }

    const tokenData = this.jwtMethods.verifyToken(token);

    if (tokenData.success && tokenData.data) {
      // locals
      res.locals.jwtPayload = tokenData.data as ISignedPayload;

      return next();
    }

    // else check if token is valid with internal key
    if (token === config.serverOptions.internalKey) {
      return next();
    }

    if (token !== config.serverOptions.internalKey && !tokenData.success) {
      return res
        .status(401)
        .json({ success: false, message: 'Authentication failed' });
    }

    return next();
  };
}

// Export instance for use in app.ts
const authMiddleware = new AuthenticationMiddleware();
export const authentication = authMiddleware.authenticate;

export default AuthenticationMiddleware;
