import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Correct import
import { Provider } from "react-redux";
import "./index.css"
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Use createRoot
root.render(
  <Provider store={store}>
    <AuthContextProvider> {/* ✅ Ensure it's wrapping the app */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContextProvider>
  </Provider>
);
