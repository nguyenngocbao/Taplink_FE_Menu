import axios from '@/lib/axios';
import fetchServer from '@/lib/fetch-server';
import { SignupModal } from '@/types/user';
import { isOnServer } from '@/utils/common';

export const USER_APIs = {
  SIGN_UP: '/api/v1/users/signup'
};

class UserService {
  async signUp(body: SignupModal): Promise<unknown> {
    let res = null;

    if (isOnServer()) {
      res = await fetchServer(USER_APIs.SIGN_UP, 'POST', {
        body: body
      });
    } else {
      res = await axios.post(USER_APIs.SIGN_UP, body);
    }

    return res;
  }
}

export const userService = new UserService();
