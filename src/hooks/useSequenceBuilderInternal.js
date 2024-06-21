import { useContext } from "react";
import { PrivateContext } from "../context/SequenceBuilderContext";

export const useSequenceBuilderInternal = () => {
  const context = useContext(PrivateContext);
  if (!context) {
    throw new Error(
      "useSequenceBuilderInternal must be used within a SequenceBuilderProvider"
    );
  }
  return context;
};
