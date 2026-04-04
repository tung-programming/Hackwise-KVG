// Request logging (pino/winston)
import { Request, Response, NextFunction } from 'express';

const formatDuration = (start: [number, number]): string => {
  const diff = process.hrtime(start);
  const ms = diff[0] * 1000 + diff[1] / 1000000;
  return ms.toFixed(2);
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  const { method, url } = req;

  res.on('finish', () => {
    const duration = formatDuration(start);
    const { statusCode } = res;
    const timestamp = new Date().toISOString();

    const log = {
      timestamp,
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
    };

    if (statusCode >= 400) {
      console.error(JSON.stringify(log));
    } else {
      console.log(JSON.stringify(log));
    }
  });

  next();
};
