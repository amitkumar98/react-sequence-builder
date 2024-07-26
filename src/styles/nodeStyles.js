const nodeContainerStyles = (
  nodeX,
  nodeY,
  nodeStyles,
  nodeBorderColor,
  nodeBackgroundColor
) => {
  return {
    minWidth: nodeStyles?.minWidth ? nodeStyles.minWidth : "520px",
    width: nodeStyles?.width && nodeStyles.width,
    height: nodeStyles?.height ? nodeStyles.height : "140px",
    display: nodeStyles?.display ? nodeStyles.display : "flex",
    justifyContent: nodeStyles?.justifyContent
      ? nodeStyles.justifyContent
      : "center",
    alignItems: nodeStyles?.alignItems ? nodeStyles.alignItems : "center",
    fontSize: nodeStyles?.fontSize ? nodeStyles.fontSize : "26px",
    backgroundColor: nodeStyles?.backgroundColor
      ? nodeStyles.backgroundColor
      : nodeBackgroundColor,
    position: "absolute",
    top: `${nodeY}px`,
    left: `${nodeX}px`,
    border: nodeStyles?.border
      ? nodeStyles.border
      : `1px solid ${nodeBorderColor}`,
    boxSizing: nodeStyles?.boxSizing ? nodeStyles.boxSizing : "border-box",
    boxShadow: nodeStyles?.boxShadow
      ? nodeStyles.boxShadow
      : "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius: nodeStyles?.borderRadius ? nodeStyles.borderRadius : "15px",
    color: nodeStyles?.color ? nodeStyles.color : "black",
  };
};

const subNodeContainerStyles = (
  nodeX,
  nodeY,
  subNodeStyles,
  subNodeBorderColor
) => {
  return {
    width: subNodeStyles?.width ? subNodeStyles.width : "250px",
    height: subNodeStyles?.height ? subNodeStyles.height : "100px",
    display: subNodeStyles?.display ? subNodeStyles.display : "flex",
    justifyContent: subNodeStyles?.justifyContent
      ? subNodeStyles.justifyContent
      : "center",
    alignItems: subNodeStyles?.justifyContent
      ? subNodeStyles.justifyContent
      : "center",
    fontSize: subNodeStyles?.fontSize ? subNodeStyles.fontSize : "20px",
    backgroundColor: subNodeStyles?.backgroundColor
      ? subNodeStyles.backgroundColor
      : "lightblue",
    position: "absolute",
    top: `${nodeY}px`,
    left: `${nodeX}px`,
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
  };
};

const nodeContentStyles = {
  display: "flex",
  width: "100%",
  justifyContent: "center",
  flexDirection: "column",
  padding: "10px 30px",
  rowGap: "10px",
  userSelect: "none",
};

const nodeTitleRowStyles = (iconPresent) => {
  return {
    display: "flex",
    width: "100%",
    justifyContent: iconPresent ? "space-between" : "center",
    alignItems: "center",
    columnGap: "30px",
  };
};

const nodeSubTitleRowStyles = { fontSize: "16px", textAlign: "center" };

const nodeIconStyles = (iconStyles) => {
  return {
    width: iconStyles?.width ? iconStyles.width : "32px",
    height: iconStyles?.height ? iconStyles.height : "32px",
  };
};

const endIconStyles = (iconStyles) => {
  return {
    width: iconStyles?.width ? iconStyles.width : "32px",
    height: iconStyles?.height ? iconStyles.height : "32px",
  };
};

export {
  endIconStyles,
  nodeIconStyles,
  nodeContentStyles,
  nodeTitleRowStyles,
  nodeContainerStyles,
  nodeSubTitleRowStyles,
  subNodeContainerStyles,
};
