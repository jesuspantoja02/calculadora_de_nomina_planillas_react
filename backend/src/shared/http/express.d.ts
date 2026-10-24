import type { TokenPayload } from '../security/token.ts';

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

export {};
