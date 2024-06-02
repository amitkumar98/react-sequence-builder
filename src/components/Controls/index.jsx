/* eslint-disable react/prop-types */
const Controls = ({
  nodes,
  addNode,
  removeNode,
  stepTypeMap = {},
  conditionMap = {},
  selectedNodeId,
  showMoreButtons,
  setShowMoreButtons,
  scrollBackToContent,
  addConditionalBranches,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
      <div>
        <label htmlFor="step_type">Step type:</label>
        <br />
        <select name="step_type" id="step_type">
          {Object.keys(stepTypeMap).map((option) => (
            <option value={option} key={crypto.randomUUID()}>
              {stepTypeMap[option]}
            </option>
          ))}
          {Object.keys(stepTypeMap).length === 0 && (
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
              {Object.keys(conditionMap).map((option) => (
                <option value={option} key={crypto.randomUUID()}>
                  {conditionMap[option]}
                </option>
              ))}
              {Object.keys(conditionMap).length === 0 && (
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
              {Object.keys(stepTypeMap).map((option) => (
                <option value={option} key={crypto.randomUUID()}>
                  {stepTypeMap[option]}
                </option>
              ))}
              {Object.keys(stepTypeMap).length === 0 && (
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
              {Object.keys(stepTypeMap).map((option) => (
                <option value={option} key={crypto.randomUUID()}>
                  {stepTypeMap[option]}
                </option>
              ))}
              {Object.keys(stepTypeMap).length === 0 && (
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
