import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Correct import
import { Provider } from "react-redux";
import "./index.css"
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider  } from "./context/AuthContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Use createRoot
root.render(
  <Provider store={store}>
    <AuthProvider > {/* ✅ Ensure it's wrapping the app */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider >
  </Provider>
);
