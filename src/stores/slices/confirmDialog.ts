import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Option } from '@/types';

export interface ConfirmDialogState {
  isOpen?: boolean;
  title: string;
  desc: React.ReactElement | string;
  items: Option[];
  cancelBtnText?: string;
  submitBtnText?: string;
  callback?: (() => void) | null;
  action?: 'update' | 'delete';
}

const initialState: ConfirmDialogState = {
  isOpen: false,
  title: '',
  desc: null,
  items: [],
  callback: null,
  cancelBtnText: '',
  submitBtnText: '',
  action: 'update'
};
const confirmDialogSlice = createSlice({
  name: 'confirmDialog',
  initialState,
  reducers: {
    showConfirmDialog: (state, action: PayloadAction<ConfirmDialogState>) => {
      state.title = action.payload.title ?? state.title;
      state.desc = action.payload.desc ?? state.desc;
      state.items = action.payload.items ?? state.items;
      state.callback = action.payload.callback ?? state.callback;
      state.cancelBtnText = action.payload.cancelBtnText ?? state.cancelBtnText;
      state.submitBtnText = action.payload.submitBtnText ?? state.submitBtnText;
      state.action = action.payload.action ?? state.action;
      state.isOpen = true;
    },
    hideConfirmDialog: state => {
      state.isOpen = false;
      state.action = 'update';
      state.cancelBtnText = '';
      state.submitBtnText = '';
      return state;
    }
  }
});

export const { showConfirmDialog, hideConfirmDialog } =
  confirmDialogSlice.actions;

export const { reducer } = confirmDialogSlice;
