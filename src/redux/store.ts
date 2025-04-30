import { combineReducers, configureStore } from '@reduxjs/toolkit'
import roleReducer from './slices/roleSlice'
import loadingReducer from './slices/loadingSlice'; 

const appReducer = {
  role: roleReducer,
  loading: loadingReducer, 
};

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET') {
    state = undefined;  // fully reset the store
  }
  return combineReducers(appReducer)(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
