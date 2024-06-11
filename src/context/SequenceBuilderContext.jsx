/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { getEdgesFromNodes } from "../utils/common";
import { createContext, useContext, useState } from "react";

const SequenceBuilderContext = createContext(undefined);

export const SequenceBuilderProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleSetNodes = (newNodes) => {
    setNodes(newNodes);
    if (nodes.length > 1) {
      const newEdges = getEdgesFromNodes(newNodes);
      setEdges(newEdges);
    }
  };

  const handleSetSelectedNodeId = (newSelectedNodeId) => {
    setSelectedNodeId(newSelectedNodeId);
  };

  return (
    <SequenceBuilderContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
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
