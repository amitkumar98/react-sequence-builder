import { useContext } from "react";
import { PublicContext } from "../context/SequenceBuilderContext";

export const useSequenceBuilder = () => {
  const context = useContext(PublicContext);
  if (!context) {
    throw new Error(
      "useSequenceBuilder must be used within a SequenceBuilderProvider"
    );
  }
  return context;
};
