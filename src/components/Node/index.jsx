/* eslint-disable react/prop-types */
const Node = ({
  node,
  index,
  nodeRef,
  iconsMap = {},
  selectedNodeId,
  nodeStyles = {},
  iconStyles = {},
  nodeIconMap = {},
  stepTypeMap = {},
  setSelectedNodeId,
  subNodeStyles = {},
}) => {
  const nodeBackgroundColor = selectedNodeId === node.id ? "#d3d3d3" : "white";
  const nodeBorderColor = selectedNodeId === node.id ? "grey" : "white";
  const subNodeBorderColor = selectedNodeId === node.id ? "grey" : "white";

  let iconURI = "";
  // iconsMap -> { iconName: "URI" }, nodeIconMap -> { stepType: "iconName" }
  if (Object.keys(iconsMap).length > 0 && Object.keys(nodeIconMap).length > 0) {
    if (node.nodeType === "NODE") {
      const stepType = nodeIconMap[node.stepType];
      if (stepType) {
        iconURI = iconsMap[stepType];
      }
    }
  }

  return (
    <div
      onClick={() => setSelectedNodeId(node.id)}
      ref={index === 0 ? nodeRef : null}
      data-node-id={node.id}
      style={
        node.nodeType === "NODE"
          ? {
              width: nodeStyles?.width ? nodeStyles.width : "400px",
              height: nodeStyles?.height ? nodeStyles.height : "100px",
              display: nodeStyles?.display ? nodeStyles.display : "flex",
              justifyContent: nodeStyles?.justifyContent
                ? nodeStyles.justifyContent
                : "center",
              alignItems: nodeStyles?.justifyContent
                ? nodeStyles.justifyContent
                : "center",
              fontSize: nodeStyles?.fontSize ? nodeStyles.fontSize : "26px",
              backgroundColor: nodeStyles?.backgroundColor
                ? nodeStyles.backgroundColor
                : nodeBackgroundColor,
              position: "absolute",
              top: `${node.y}px`,
              left: `${node.x}px`,
              border: nodeStyles?.border
                ? nodeStyles.border
                : `1px solid ${nodeBorderColor}`,
              boxSizing: nodeStyles?.boxSizing
                ? nodeStyles.boxSizing
                : "border-box",
              boxShadow: nodeStyles?.boxShadow
                ? nodeStyles.boxShadow
                : "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              borderRadius: nodeStyles?.borderRadius
                ? nodeStyles.borderRadius
                : "15px",
              color: nodeStyles?.color ? nodeStyles.color : "black",
            }
          : {
              width: subNodeStyles?.width ? subNodeStyles.width : "250px",
              height: subNodeStyles?.height ? subNodeStyles.height : "100px",
              display: subNodeStyles?.display ? subNodeStyles.display : "flex",
              justifyContent: subNodeStyles?.justifyContent
                ? subNodeStyles.justifyContent
                : "center",
              alignItems: subNodeStyles?.justifyContent
                ? subNodeStyles.justifyContent
                : "center",
              fontSize: subNodeStyles?.fontSize
                ? subNodeStyles.fontSize
                : "20px",
              backgroundColor: subNodeStyles?.backgroundColor
                ? subNodeStyles.backgroundColor
                : "lightblue",
              position: "absolute",
              top: `${node.y}px`,
              left: `${node.x}px`,
              border: subNodeStyles?.border
                ? subNodeStyles.border
                : `1px solid ${subNodeBorderColor}`,
              boxSizing: subNodeStyles?.boxSizing
                ? subNodeStyles.boxSizing
                : "border-box",
              boxShadow: subNodeStyles?.boxShadow
                ? subNodeStyles.boxShadow
                : "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              borderRadius: subNodeStyles?.borderRadius
                ? subNodeStyles.borderRadius
                : "15px",
              color: subNodeStyles?.color ? subNodeStyles.color : "black",
              textAlign: "center",
            }
      }
    >
      {node.nodeType === "NODE" ? (
        <div>
          {iconURI.length > 0 && (
            <img
              style={{
                width: iconStyles?.width ? iconStyles.width : "32px",
                height: iconStyles?.height ? iconStyles.height : "32px",
              }}
              src={iconURI}
              alt={"step-icon"}
            />
          )}
          <span>{stepTypeMap[node.stepType]}</span>
        </div>
      ) : (
        !!node.nodeText && node.nodeText
      )}
    </div>
  );
};

export default Node;
