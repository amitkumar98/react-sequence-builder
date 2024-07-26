import { useState } from "react";
import { useSequenceBuilder } from "../../hooks";

/* eslint-disable react/prop-types */
const filterFromObject = (object, condition) => {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (condition(key, value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const Controls = ({
  addNode,
  removeNode,
  stepTypeMap,
  conditionsMap,
  showMoreButtons,
  uniqueStepTypes,
  disableAllActions,
  setShowMoreButtons,
  scrollBackToContent,
  addConditionalBranches,
  branchesStepRestriction,
  allowedConditionalBranches,
  conditionalBranchAllowedSteps,
  branchStepSelectionDropdownText,
}) => {
  const { nodes, selectedNodeId } = useSequenceBuilder();

  let filteredStepTypeMap = stepTypeMap;
  let addConditionalBranchButtonDisabled = nodes.length === 0;
  let filteredLeftBranchStepTypeMap = stepTypeMap;
  let filteredRightBranchStepTypeMap = stepTypeMap;

  const [selectedCondition, setSelectedCondition] = useState(
    Object.keys(conditionsMap)[0]
  );

  let conditionalNode;
  let firstBranchNode = false;
  const conditionalNodes = nodes.filter((node) => node.isConditional);
  if (conditionalNodes) {
    addConditionalBranchButtonDisabled =
      conditionalNodes.length >= allowedConditionalBranches;
    // ToDo: update to support multiple conditional branches
    if (conditionalNodes.length > 0) {
      conditionalNode = conditionalNodes[0];
    }
  }

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  if (selectedNode) {
    const condition = selectedNode.condition;
    if (condition) {
      const restrictionForCondition = branchesStepRestriction[condition];
      if (restrictionForCondition) {
        const selectedSideRestriction =
          restrictionForCondition[selectedNode.branchSide];
        if (selectedSideRestriction && selectedSideRestriction.length > 0) {
          filteredStepTypeMap = filterFromObject(
            filteredStepTypeMap,
            (key) => selectedSideRestriction.indexOf(key) === -1
          );
        }
      }
    } else {
      if (selectedCondition) {
        const restrictionForCondition =
          branchesStepRestriction[selectedCondition];
        if (restrictionForCondition) {
          const leftBranchRestrictedSteps =
            restrictionForCondition["left-branch"];
          const rightBranchRestrictedSteps =
            restrictionForCondition["right-branch"];
          filteredLeftBranchStepTypeMap = filterFromObject(
            filteredLeftBranchStepTypeMap,
            (key) => leftBranchRestrictedSteps.indexOf(key) === -1
          );
          filteredRightBranchStepTypeMap = filterFromObject(
            filteredRightBranchStepTypeMap,
            (key) => rightBranchRestrictedSteps.indexOf(key) === -1
          );
        }
      }
    }
    if (selectedNode?.rootBranchNodeUuid) {
      const branchSide = selectedNode.branchSide;
      const restrictionForCondition =
        branchesStepRestriction[selectedNode.condition];
      if (restrictionForCondition) {
        if (branchSide === "right-branch") {
          const rightBranchRestrictedSteps =
            restrictionForCondition["right-branch"];
          filteredRightBranchStepTypeMap = filterFromObject(
            filteredRightBranchStepTypeMap,
            (key) => rightBranchRestrictedSteps.indexOf(key) === -1
          );
        } else if (branchSide === "left-side") {
          const leftBranchRestrictedSteps =
            restrictionForCondition["left-branch"];
          filteredLeftBranchStepTypeMap = filterFromObject(
            filteredLeftBranchStepTypeMap,
            (key) => leftBranchRestrictedSteps.indexOf(key) === -1
          );
        }
      }
    }
    const allowedRootStepForSelectedCondition =
      conditionalBranchAllowedSteps[condition || selectedCondition];

    if (
      allowedRootStepForSelectedCondition &&
      allowedRootStepForSelectedCondition.length > 0
    ) {
      addConditionalBranchButtonDisabled =
        selectedNodeId !== nodes[nodes.length - 1].id ||
        allowedRootStepForSelectedCondition.indexOf(selectedNode.stepType) ===
          -1;
    }

    if (conditionalNode) {
      if (selectedNode.stepNumber === conditionalNode.stepNumber + 1) {
        firstBranchNode = true;
      }
    }
  }

  const uniqueStepNodes = nodes.filter(
    (node) => uniqueStepTypes.indexOf(node.stepType) > -1
  );
  if (uniqueStepNodes && uniqueStepNodes.length > 0) {
    uniqueStepNodes.forEach((node) => {
      filteredStepTypeMap = filterFromObject(
        filteredStepTypeMap,
        (key) => node.stepType !== key
      );
    });
  }

  const leftBranchStepSelectionDropdownText = branchStepSelectionDropdownText[
    selectedCondition
  ]
    ? branchStepSelectionDropdownText[selectedCondition][0]
    : "Choose left branch step type:";
  const rightBranchStepSelectionDropdownText = branchStepSelectionDropdownText[
    selectedCondition
  ]
    ? branchStepSelectionDropdownText[selectedCondition][1]
    : "Choose right branch step type:";

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
      <div>
        <label htmlFor="step_type">Step type:</label>
        <br />
        <select name="step_type" id="step_type" disabled={disableAllActions}>
          {Object.keys(filteredStepTypeMap).map((option) => (
            <option value={option} key={crypto.randomUUID()}>
              {filteredStepTypeMap[option]}
            </option>
          ))}
          {Object.keys(filteredStepTypeMap).length === 0 && (
            <option value={"-------"} key={crypto.randomUUID()}>
              ------- Select -------
            </option>
          )}
        </select>
      </div>
      <button
        onClick={addNode}
        style={{ marginBottom: "10px" }}
        className="actionButtonPrimary"
        disabled={disableAllActions}
        // ToDo: add disabled prop based on multiple conditions
      >
        Add step
      </button>
      <button
        onClick={removeNode}
        style={{ marginBottom: "10px" }}
        disabled={
          disableAllActions ||
          !selectedNodeId ||
          (selectedNode &&
            !selectedNode.isConditional &&
            selectedNode?.stepNumber < nodes[nodes.length - 1].stepNumber) ||
          firstBranchNode
        }
        className="actionButtonPrimary"
      >
        Remove step
      </button>
      {showMoreButtons && (
        <>
          <div>
            <label htmlFor="condition">Choose condition:</label>
            <br />
            <select
              name="condition"
              id="condition"
              value={selectedCondition}
              disabled={disableAllActions}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              {Object.keys(conditionsMap).map((option) => (
                <option value={option} key={crypto.randomUUID()}>
                  {conditionsMap[option]}
                </option>
              ))}
              {Object.keys(conditionsMap).length === 0 && (
                <option value={"-------"} key={crypto.randomUUID()}>
                  ------- Select -------
                </option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor="left_step_type">
              {leftBranchStepSelectionDropdownText}
            </label>
            <br />
            <select
              name="left_step_type"
              id="left_step_type"
              disabled={disableAllActions}
            >
              {Object.keys(filteredLeftBranchStepTypeMap).map((option) => (
                <option value={option} key={crypto.randomUUID()}>
                  {filteredLeftBranchStepTypeMap[option]}
                </option>
              ))}
              {Object.keys(filteredLeftBranchStepTypeMap).length === 0 && (
                <option value={"-------"} key={crypto.randomUUID()}>
                  ------- Select -------
                </option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor="right_step_type">
              {rightBranchStepSelectionDropdownText}
            </label>
            <br />
            <select
              name="right_step_type"
              id="right_step_type"
              disabled={disableAllActions}
            >
              {Object.keys(filteredRightBranchStepTypeMap).map((option) => (
                <option value={option} key={crypto.randomUUID()}>
                  {filteredRightBranchStepTypeMap[option]}
                </option>
              ))}
              {Object.keys(filteredRightBranchStepTypeMap).length === 0 && (
                <option value={"-------"} key={crypto.randomUUID()}>
                  ------- Select -------
                </option>
              )}
            </select>
          </div>
        </>
      )}
      <button
        onClick={
          showMoreButtons
            ? addConditionalBranches
            : () => setShowMoreButtons(true)
        }
        style={{ marginBottom: "10px" }}
        disabled={disableAllActions || addConditionalBranchButtonDisabled}
        className="actionButtonPrimary"
      >
        Add conditional branch
      </button>
      {showMoreButtons && (
        <button
          onClick={() => setShowMoreButtons(false)}
          style={{ marginBottom: "10px" }}
          className="actionButtonSecondary"
        >
          Cancel
        </button>
      )}
      <button
        onClick={scrollBackToContent}
        style={{ marginBottom: "10px" }}
        className="actionButtonOutlined"
      >
        Scroll back to content
      </button>
    </div>
  );
};

export default Controls;
