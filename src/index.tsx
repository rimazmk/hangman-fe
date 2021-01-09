import React from "react";
import ReactDOM from "react-dom";
import { CssBaseline } from "@material-ui/core";
import "./index.css";
import Main from "./components/Main";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
