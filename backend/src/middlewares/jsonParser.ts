import bodyParser from 'body-parser';
import type { Request, Response, NextFunction } from 'express';

class JsonParserMiddleware {
  public parse(req: Request, res: Response<IBasicResponse>, next: NextFunction) {
    bodyParser.json()(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format on request body',
        });
      }
      return next();
    });
  }
}

// Export instance for use in app.ts
const jsonParserMiddleware = new JsonParserMiddleware();
export const safeJsonParser = jsonParserMiddleware.parse.bind(jsonParserMiddleware);

export default JsonParserMiddleware;
