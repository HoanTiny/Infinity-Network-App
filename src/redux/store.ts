import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slice//authSlice';
import { rootApi } from '@services/rootApi';
import snackbarReducer from './slice/snackbar';
import settingsReducer from './slice/settingSlice';
import dialogReducer from './slice/dialogSlice';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/lib/persistStore';
import { logOutMiddleware } from './middleware';
// ...

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: [rootApi.reducerPath],
};

const rootReducer = combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
  settings: settingsReducer,
  dialog: dialogReducer,
  [rootApi.reducerPath]: rootApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logOutMiddleware, rootApi.middleware);
  },
});

export const persistor = persistStore(store);

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch
// export type AppStore = typeof store
