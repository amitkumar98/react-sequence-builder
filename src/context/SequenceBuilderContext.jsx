/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const SequenceBuilderContext = createContext(undefined);

export const SequenceBuilderProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleSetNodes = (newNodes) => {
    setNodes(newNodes);
  };

  const handleSetSelectedNodeId = (newSelectedNodeId) => {
    setSelectedNodeId(newSelectedNodeId);
  };

  return (
    <SequenceBuilderContext.Provider
      value={{
        nodes,
        handleSetNodes,
        selectedNodeId,
        handleSetSelectedNodeId,
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
