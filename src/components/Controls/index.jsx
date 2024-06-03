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
}) => {
  const node = nodes.find(
    (node) => uniqueStepTypes.indexOf(node.stepType) > -1
  );
  let filteredStepTypeMap = stepTypeMap;
  if (node) {
    filteredStepTypeMap = filterFromObject(
      stepTypeMap,
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
      >
        Add step
      </button>
      <button
        onClick={removeNode}
        style={{ marginBottom: "10px" }}
        disabled={!selectedNodeId}
        className="actionButtonPrimary"
      >
        Remove step
      </button>
      {showMoreButtons && (
        <>
          <div>
            <label htmlFor="condition">Choose condition:</label>
            <br />
            <select name="condition" id="condition">
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
          <div>
            <label htmlFor="right_step_type">
              Choose right branch step type:
            </label>
            <br />
            <select name="right_step_type" id="right_step_type">
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
        </>
      )}
      <button
        onClick={
          showMoreButtons
            ? addConditionalBranches
            : () => setShowMoreButtons(true)
        }
        style={{ marginBottom: "10px" }}
        disabled={nodes.length === 0}
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
