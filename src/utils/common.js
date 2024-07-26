export function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 500);
  });
}

export const getEdgesFromNodes = (nodes) => {
  let newEdges = [];
  let edgeNumber = 0;
  let conditionalRootNode;
  const conditionalRootNodes = nodes.filter((node) => node.isConditional);

  if (conditionalRootNodes.length === 1) {
    conditionalRootNode = conditionalRootNodes[0];
  }

  const mainSequenceNodes = nodes.filter((node) => !node.branchSide);
  mainSequenceNodes.sort((a, b) => a.stepNumber - b.stepNumber);

  for (let i = 1; i < mainSequenceNodes.length; i++) {
    newEdges.push({
      from: mainSequenceNodes[i - 1].id,
      to: mainSequenceNodes[i].id,
      edgeNumber,
    });
    edgeNumber++;
  }

  let leftBranchNodes = nodes.filter(
    (node) =>
      node.condition === "CONNECTION_ACCEPTANCE" &&
      node.branchSide === "left-branch"
  );
  let rightBranchNodes = nodes.filter(
    (node) =>
      node.condition === "CONNECTION_ACCEPTANCE" &&
      node.branchSide === "right-branch"
  );

  if (leftBranchNodes.length > 0 && rightBranchNodes.length > 0) {
    leftBranchNodes.sort((a, b) => a.stepNumber - b.stepNumber);
    rightBranchNodes.sort((a, b) => a.stepNumber - b.stepNumber);

    const leftBranchSubNode = leftBranchNodes.find(
      (node) => node.nodeType === "SUB_NODE"
    );
    const rightBranchSubNode = rightBranchNodes.find(
      (node) => node.nodeType === "SUB_NODE"
    );

    newEdges.push(
      {
        from: conditionalRootNode.id,
        to: leftBranchSubNode.id,
        edgeNumber: edgeNumber + 1,
      },
      {
        from: conditionalRootNode.id,
        to: rightBranchSubNode.id,
        edgeNumber: edgeNumber + 2,
      }
    );

    edgeNumber += 3;

    for (let i = 0; i < leftBranchNodes.length - 1; i++) {
      if (i === 0) {
        newEdges.push({
          from: leftBranchSubNode.id,
          to: leftBranchNodes[i + 1].id,
          edgeNumber,
        });
      } else {
        newEdges.push({
          from: leftBranchNodes[i].id,
          to: leftBranchNodes[i + 1].id,
          edgeNumber,
        });
      }
      edgeNumber++;
    }

    for (let i = 0; i < rightBranchNodes.length - 1; i++) {
      if (i === 0) {
        newEdges.push({
          from: rightBranchSubNode.id,
          to: rightBranchNodes[i + 1].id,
          edgeNumber,
        });
      } else {
        newEdges.push({
          from: rightBranchNodes[i].id,
          to: rightBranchNodes[i + 1].id,
          edgeNumber,
        });
      }
      edgeNumber++;
    }
  }

  return newEdges;
};

export const getIcon = (node, iconsMap, nodeIconMap) => {
  let iconURI = "";
  let iconElement;
  // iconsMap -> { iconName: "URI || <Icon/>" }, nodeIconMap -> { stepType: "iconName" }
  if (Object.keys(iconsMap).length > 0 && Object.keys(nodeIconMap).length > 0) {
    if (node.nodeType === "NODE") {
      const stepType = nodeIconMap[node.stepType];
      if (stepType) {
        if (typeof iconsMap[stepType] === "string") {
          iconURI = iconsMap[stepType];
        } else if (typeof iconsMap[stepType] === "function") {
          iconElement = iconsMap[stepType];
        }
      }
    }
  }
  return { iconURI, iconElement };
};
