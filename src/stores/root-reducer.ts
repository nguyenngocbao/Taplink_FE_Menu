import { combineReducers } from '@reduxjs/toolkit';

import { reducer as confirmDialogReducer } from './slices/confirmDialog';

export const rootReducer = combineReducers({
  confirmDialog: confirmDialogReducer
});
