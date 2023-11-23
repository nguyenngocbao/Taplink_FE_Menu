import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../index';

interface AuthStore {
  user: null;
}

const initialState: AuthStore = {
  user: null
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {}
});

export const { reducer } = slice;

// export const getUserList = createAsyncThunk(
//   'user/getUserList',
//   async (params?: SearchConditionParams) => {
//     return await getUserListAPI(params);
//   }
// );

export const getAuthtoreSelector: (state: RootState) => AuthStore = state =>
  state.auth;
