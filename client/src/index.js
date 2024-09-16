import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const observerErrHandler = (e) => {
  if (
    e.message ===
    "ResizeObserver loop completed with undelivered notifications."
  ) {
    return;
  }
  console.error(e);
};

window.addEventListener("error", observerErrHandler);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
