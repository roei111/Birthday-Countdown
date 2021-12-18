import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import "./index.css";
import App from "./App";
import RTL from "./RTL";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <RTL>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </RTL>,
  document.getElementById("root")
);
