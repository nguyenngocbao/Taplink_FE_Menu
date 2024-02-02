import axios from '@/lib/axios';
import fetchServer from '@/lib/fetch-server';
import { SendOtpRequest, VerifyOtpRequest } from '@/types/auth';
import { bindMethodsToSelf, isOnServer } from '@/utils/common';

export const AUTH_APIs = {
  SEND_OTP: '/api/v1/auth/send-otp',
  VERIFY_OTP: '/api/v1/auth/verify-otp',
  LOGOUT: ''
};

class AuthService {
  constructor() {
    bindMethodsToSelf(AuthService, this);
  }
  async veriryOTP(body: VerifyOtpRequest) {
    let res = null;

    if (isOnServer()) {
      res = await fetchServer(AUTH_APIs.VERIFY_OTP, 'POST', {
        body: body
      });
    } else {
      res = await axios.post(AUTH_APIs.VERIFY_OTP, {
        params: body
      });
    }

    return res;
  }

  async sendOTP(body: SendOtpRequest): Promise<unknown> {
    let res = null;

    if (isOnServer()) {
      res = await fetchServer(AUTH_APIs.SEND_OTP, 'POST', {
        body: body
      });
    } else {
      res = await axios.post(AUTH_APIs.SEND_OTP, body);
    }

    return res;
  }
}

export const authService = new AuthService();
