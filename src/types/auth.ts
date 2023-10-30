export type User = {
  name: string;
};

export type AdminLoginForm = {
  email: string;
  password: string;
  company_id: string;
};

export type ResetPasswordForm = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type RegisterCredentialsDTO = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthCompany = {
  id: number;
  company_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type UserResponse = {
  access_token: string;
  user: User;
};
