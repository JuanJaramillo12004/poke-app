// Type alias: AuthUser.
export type AuthUser = {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
};

// DTO type: contract used for request payloads.
export type LoginDto = {
  email: string;
  password: string;
};

// DTO type: contract used for request payloads.
export type RegisterDto = {
  email: string;
  password: string;
};

// API response shape used by consumers of this endpoint.
export type LoginResponse = {
  access_token: string;
  token_type: string;
};
