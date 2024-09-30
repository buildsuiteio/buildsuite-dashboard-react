import { configureStore, combineReducers } from '@reduxjs/toolkit';
import taskReducer from '../state/task/taskSlice';
import projectReducer from '../state/project/projectSlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Combine the reducers
const rootReducer = combineReducers({
    task: taskReducer,
    project: projectReducer,
});

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['task', 'project'], // Optionally, you can specify which reducers to persist
};

// Apply persistReducer to the combined rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
