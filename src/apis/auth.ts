import { axios } from '@/lib/axios';
import { ServerData } from '@/types';
import {
  AdminLoginForm,
  ResetPasswordForm,
  User,
  UserResponse
} from '@/types/auth';

export const AUTH_APIs = {
  LOGIN: '/api/login',
  USER_INFO: '/api/user',
  SEND_PASSWORD_RESET_LINK: '/api/send-password-reset-link',
  RESET_PASSWORD: '/api/reset-password',
  GET_PASSWORD_RESET_TOKEN: '/api/password-reset-token',
  UPDATE_PASSWORD: '/api/user/update-password',
  LOG_OUT: 'api/logout',
  UPDATE_USER_PROFILE_INFO: '/api/user',
  UPLOAD_PROFILE_PHOTO: '/api/user/upload-photo',
  LOGIN_COMPANY: '/api/login-company'
};

export const getAuthUser = (): Promise<{ user: User }> => {
  return axios.get(AUTH_APIs.USER_INFO);
};

export const login = (data: AdminLoginForm): Promise<UserResponse> => {
  return axios.post(AUTH_APIs.LOGIN, data);
};

export const sendPasswordResetLink = (email): Promise<{ message: string }> => {
  return axios.post(AUTH_APIs.SEND_PASSWORD_RESET_LINK, {
    email: email
  });
};

export const resetPassword = (
  data: ResetPasswordForm
): Promise<ServerData<any>> => {
  return axios.post(AUTH_APIs.RESET_PASSWORD, data);
};

export const getPasswordResetToken = (email): Promise<{ token: string }> => {
  return axios.get(AUTH_APIs.GET_PASSWORD_RESET_TOKEN, {
    params: {
      email: email
    }
  });
};

interface UpdatePasswordForm {
  current_password: string;
  password: string;
  password_confirmation: string;
}
export const updatePassword = (
  data: UpdatePasswordForm
): Promise<ServerData<any>> => {
  return axios.post(AUTH_APIs.UPDATE_PASSWORD, data);
};

export const logout = (): Promise<ServerData<any>> => {
  return axios.post(AUTH_APIs.LOG_OUT);
};

interface UpdateProfileInfoForm {
  first_name: string;
  last_name: string;
  email: string;
}
interface UpdateProfileRes {
  user: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    company_id: number;
    profile_photo_path: string;
    email_verified_at: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: null;
  };
}
export const updateUserProfileInfo = (
  data: UpdateProfileInfoForm
): Promise<UpdateProfileRes> => {
  return axios.post(AUTH_APIs.UPDATE_USER_PROFILE_INFO, data);
};

export const uploadProfilePhoto = (
  file: File
): Promise<{
  profile_photo_path: string;
}> => {
  return axios.post(
    AUTH_APIs.UPLOAD_PROFILE_PHOTO,
    {
      photo: file
    },
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
};
