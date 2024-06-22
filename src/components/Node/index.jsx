import {
  endIconStyles,
  nodeIconStyles,
  nodeContentStyles,
  nodeTitleRowStyles,
  nodeContainerStyles,
  nodeSubTitleRowStyles,
  subNodeContainerStyles,
} from "../../styles/nodeStyles";
import { getIcon } from "../../utils/common";
import { useSequenceBuilder } from "../../hooks";

/* eslint-disable react/prop-types */
const Node = ({
  node,
  index,
  nodeRef,
  iconsMap,
  nodeStyles,
  iconStyles,
  nodeEndIcon,
  nodeIconMap,
  stepTypeMap,
  subNodeStyles,
  nodeContentMap,
  onNodeDoubleClick,
}) => {
  const { selectedNodeId, setSelectedNodeId } = useSequenceBuilder();

  const nodeContent = nodeContentMap[node.id];

  const nodeBackgroundColor =
    selectedNodeId === node.id
      ? nodeStyles?.backgroundColorOnSelect
        ? nodeStyles.backgroundColorOnSelect
        : "#d3d3d3"
      : "white";
  const nodeBorderColor = selectedNodeId === node.id ? "grey" : "white";
  const subNodeBorderColor = selectedNodeId === node.id ? "grey" : "white";

  const { iconURI, iconElement } = getIcon(node, iconsMap, nodeIconMap);

  const renderStartIcon = () => {
    return iconElement
      ? iconElement()
      : iconURI.length > 0 && (
          <img
            src={iconURI}
            alt={"step-start-icon"}
            style={nodeIconStyles(iconStyles)}
          />
        );
  };

  const renderEndIcon = () => {
    return nodeEndIcon && typeof nodeEndIcon === "function"
      ? nodeEndIcon()
      : nodeEndIcon && nodeEndIcon.length > 0 && (
          <img
            src={nodeEndIcon}
            alt={"step-end-icon"}
            style={endIconStyles(iconStyles)}
          />
        );
  };

  return (
    <div
      onClick={() => setSelectedNodeId(node.id)}
      onDoubleClick={() => onNodeDoubleClick()}
      ref={index === 0 ? nodeRef : null}
      data-node-id={node.id}
      style={
        node.nodeType === "NODE"
          ? nodeContainerStyles(
              node.x,
              node.y,
              nodeStyles,
              nodeBorderColor,
              nodeBackgroundColor
            )
          : subNodeContainerStyles(
              node.x,
              node.y,
              subNodeStyles,
              subNodeBorderColor
            )
      }
    >
      {node.nodeType === "NODE" ? (
        <div style={nodeContentStyles}>
          <div style={nodeTitleRowStyles(!!iconElement || !!nodeEndIcon)}>
            {renderStartIcon()}
            <span>{stepTypeMap[node.stepType]}</span>
            {renderEndIcon()}
          </div>
          {!!nodeContent && (
            <span style={nodeSubTitleRowStyles}>{nodeContent}</span>
          )}
        </div>
      ) : (
        !!node.nodeText && node.nodeText
      )}
    </div>
  );
};

export default Node;
