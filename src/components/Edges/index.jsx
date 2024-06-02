/* eslint-disable react/prop-types */
const Edges = ({ edges, nodes, stroke }) => {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {edges.map((edge) => {
        const fromNode = nodes.find((node) => node.id === edge.from);
        const toNode = nodes.find((node) => node.id === edge.to);
        return (
          <line
            key={crypto.randomUUID()}
            x1={
              fromNode.nodeType === "NODE" ? fromNode.x + 200 : fromNode.x + 125
            }
            y1={fromNode.y + 50}
            x2={toNode.nodeType === "NODE" ? toNode.x + 200 : toNode.x + 125}
            y2={toNode.y + 50}
            stroke={stroke || "lightgrey"}
          />
        );
      })}
    </svg>
  );
};

export default Edges;
