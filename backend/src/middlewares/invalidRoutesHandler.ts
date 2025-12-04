import type { Request, Response } from 'express';

class InvalidRoutesHandlerMiddleware {
  public handle(req: Request, res: Response<IBasicResponse>) {
    return res.status(404).json({ success: false, message: 'Not a valid route' });
  }
}

// Export instance for use in app.ts
const invalidRoutesMiddleware = new InvalidRoutesHandlerMiddleware();
export const invalidRoutesHandler = invalidRoutesMiddleware.handle.bind(invalidRoutesMiddleware);

export default InvalidRoutesHandlerMiddleware;
