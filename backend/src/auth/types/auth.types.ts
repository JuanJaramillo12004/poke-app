import { Request } from 'express';

export type JwtPayload = {
  sub: number;
  email: string;
};

export type RequestWithUser = Request & {
  user: {
    id: number;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
