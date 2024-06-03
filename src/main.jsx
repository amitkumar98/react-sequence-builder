/* eslint-disable react/no-deprecated */
import React from "react";
import ReactDOM from "react-dom";
import SequenceBuilder from "./components/SequenceBuilder";
import { SequenceBuilderProvider } from "./context/SequenceBuilderContext";

ReactDOM.render(
  <React.StrictMode>
    <SequenceBuilderProvider>
      <SequenceBuilder />
    </SequenceBuilderProvider>
  </React.StrictMode>,
  document.querySelector("#root")
);
