import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = performance.now();
    res.on('finish', () => {
      const { statusCode } = res;
      const endTime = performance.now();
      const finalTime = endTime - startTime;
      if (statusCode === 201)
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${finalTime} ms`,
        );
      if (statusCode === 400)
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} ${finalTime.toFixed(2)} ms`,
        );
    });
    next();
  }
}
