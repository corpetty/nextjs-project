declare module 'payload/dist/payload' {
  import { Express } from 'express';
  
  interface PayloadConfig {
    secret: string;
    express: Express;
    configPath: string;
    mongoURL: string;
    onInit?: () => void;
  }

  interface Payload {
    logger: {
      info: (message: string) => void;
    };
    getAdminURL: () => string;
  }

  export function getPayload(config: PayloadConfig): Promise<Payload>;
}

declare module '@payloadcms/next-payload' {
  import { Request, Response } from 'express';
  import { NextApiHandler } from 'next';

  interface NextAppLike {
    prepare(): Promise<void>;
    getRequestHandler(): NextApiHandler;
  }

  export function nextHandler(
    req: Request,
    res: Response,
    nextApp: NextAppLike | { prepare(): Promise<void>; getRequestHandler(): NextApiHandler }
  ): Promise<void>;
}
