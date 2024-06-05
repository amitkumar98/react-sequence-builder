import { useState } from "react";

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
  nodes,
  addNode,
  removeNode,
  stepTypeMap,
  conditionsMap,
  selectedNodeId,
  showMoreButtons,
  uniqueStepTypes,
  setShowMoreButtons,
  scrollBackToContent,
  addConditionalBranches,
  branchesStepRestriction,
  allowedConditionalBranches,
  conditionalBranchAllowedSteps,
}) => {
  let filteredStepTypeMap = stepTypeMap;
  let addConditionalBranchButtonDisabled = nodes.length === 0;
  let filteredLeftBranchStepTypeMap = stepTypeMap;
  let filteredRightBranchStepTypeMap = stepTypeMap;

  const [selectedCondition, setSelectedCondition] = useState(
    Object.keys(conditionsMap)[0]
  );

  const conditionalBranches = nodes.filter((node) => node.isConditional);
  if (conditionalBranches) {
    addConditionalBranchButtonDisabled =
      conditionalBranches.length > allowedConditionalBranches;
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
        allowedRootStepForSelectedCondition.indexOf(selectedNode.stepType) ===
        -1;
    }
  }

  const node = nodes.find(
    (node) => uniqueStepTypes.indexOf(node.stepType) > -1
  );
  if (node) {
    filteredStepTypeMap = filterFromObject(
      filteredStepTypeMap,
      (key) => uniqueStepTypes.indexOf(key) === -1
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
      <div>
        <label htmlFor="step_type">Step type:</label>
        <br />
        <select name="step_type" id="step_type">
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
        // ToDo: add disabled prop based on multiple conditions
      >
        Add step
      </button>
      <button
        onClick={removeNode}
        style={{ marginBottom: "10px" }}
        // ToDo: Improve this to allow removing 1st node in left branch
        disabled={
          !selectedNodeId || selectedNode?.stepNumber < nodes.length - 1
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
              Choose left branch step type:
            </label>
            <br />
            <select name="left_step_type" id="left_step_type">
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
              Choose right branch step type:
            </label>
            <br />
            <select name="right_step_type" id="right_step_type">
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
        disabled={addConditionalBranchButtonDisabled}
        className="actionButtonPrimary"
      >
        Add conditional branch
      </button>
      {showMoreButtons && (
        <button
          onClick={() => setShowMoreButtons(false)}
          style={{ marginBottom: "10px" }}
          disabled={nodes.length === 0}
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
