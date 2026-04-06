import { Request } from 'express';

// Type alias: JwtPayload.
export type JwtPayload = {
  sub: number;
  email: string;
};

// Type alias: RequestWithUser.
export type RequestWithUser = Request & {
  user: {
    id: number;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
