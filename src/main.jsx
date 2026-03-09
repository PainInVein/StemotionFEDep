import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";
import "./index.css";

const rootEl = document.getElementById("root");

createRoot(rootEl, { identifierPrefix: "stem" }).render(
  <React.StrictMode>
    <Provider store={store}>
      <div className="font-sans">
        <App />
      </div>
    </Provider>
  </React.StrictMode>
);
