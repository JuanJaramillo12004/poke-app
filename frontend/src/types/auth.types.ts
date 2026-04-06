export type AuthUser = {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};
