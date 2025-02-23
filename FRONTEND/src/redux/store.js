// import { configureStore } from "@reduxjs/toolkit";
// import authSlice from "./authSlice.js";

// const store= configureStore({
//   reducer:{
//     auth: authSlice
//   }
// });
// export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import authSlice from "./authSlice.js";

// // Configuration for redux-persist
// const persistConfig = {
//   key: "auth",      // Key under which the data will be stored in storage (localStorage in this case)
//   storage,     
//   timeout:10000,     // Type of storage
// };

// // Wrap the auth reducer with persistReducer
// const persistedAuthReducer = persistReducer(persistConfig, authSlice);

// const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer, // Persisted reducer
//     auth: authSlice,
//     post: postSlice,
//   },
// });

// // Export the store and persistor
// export const persistor = persistStore(store);
// export default store;

import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice'; // Import your reducers

const store = configureStore({
  reducer: {
    user: authSlice, // Ensure this matches your reducer
  },
});

export default store;
