// Import the necessary modules
import * as jwt from "jsonwebtoken";

import { config } from "../config/general.config";
import ErrorHandling from "../helpers/error-handling";

// Define the signToken function

class JwtMethods {
  private readonly errorHandling: typeof ErrorHandling;

  constructor(errorHandling: typeof ErrorHandling = ErrorHandling) {
    this.errorHandling = errorHandling;
  }

  public signToken(
    payload: ISignedPayload,
    expiresIn: string | number = "15m"
  ): string {
    return jwt.sign(payload, config.jwtOptions.tokenSecret, {
      expiresIn: config.jwtOptions.expireTime,
    });
  }

  public verifyToken(token: string): IDataResponse<ISignedPayload> {
    try {
      const decoded = jwt.verify(
        token,
        config.jwtOptions.tokenSecret
      ) as ISignedPayload;

      return {
        success: true,
        data: decoded,
        message: "ok",
      };
    } catch (error) {
      return {
        success: false,
        message: this.errorHandling.getErrorMessage(error),
      };
    }
  }
}

export default JwtMethods;
