import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import setup from './setup';

const rootReducer = combineReducers({ setup });

const makeStore = () => configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
});

export const wrapper = createWrapper(makeStore);
