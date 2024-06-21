/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  PublicContext,
  PrivateContext,
} from "../context/SequenceBuilderContext";
import { getEdgesFromNodes } from "../utils/common";

export const SequenceBuilderProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleSetNodes = (newNodes) => {
    setNodes(newNodes);
    if (newNodes.length > 1) {
      const newEdges = getEdgesFromNodes(newNodes);
      setEdges(newEdges);
    }
  };

  return (
    <PrivateContext.Provider value={{ edges, setEdges }}>
      <PublicContext.Provider
        value={{
          nodes,
          setNodes,
          handleSetNodes,
          selectedNodeId,
          setSelectedNodeId,
        }}
      >
        {children}
      </PublicContext.Provider>
    </PrivateContext.Provider>
  );
};
