import React from "react";
import ReactDOM from "react-dom/client";
import SequenceBuilder from "./components/SequenceBuilder";
import { SequenceBuilderProvider } from "./context/SequenceBuilderContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SequenceBuilderProvider>
      <SequenceBuilder />
    </SequenceBuilderProvider>
  </React.StrictMode>
);
