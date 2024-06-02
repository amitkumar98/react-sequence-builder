/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const SequenceBuilderContext = createContext(undefined);

export const SequenceBuilderProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);

  const handleSetNodes = (newNodes) => {
    setNodes(newNodes);
  };

  return (
    <SequenceBuilderContext.Provider
      value={{
        nodes,
        handleSetNodes,
      }}
    >
      {children}
    </SequenceBuilderContext.Provider>
  );
};

export const useSequenceBuilder = () => {
  const context = useContext(SequenceBuilderContext);
  if (!context) {
    throw new Error(
      "useSequenceBuilder must be used within a SequenceBuilderProvider"
    );
  }
  return context;
};
