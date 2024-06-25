# React Sequence Builder

- Create sequence flow diagrams using react.
- It only uses react and react-dom as dependencies.

## Installation

```
npm install react-sequence-builder
yarn add react-sequence-builder
```

## Usage example

- index.jsx

```
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SequenceBuilderProvider } from "react-sequence-builder";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SequenceBuilderProvider>
      <App />
    </SequenceBuilderProvider>
  </React.StrictMode>
);
```

- SequenceBuilderWrapper.jsx

```
import "./App.css";
import { SequenceBuilder, useSequenceBuilder } from "react-sequence-builder";

function SequenceBuilderWrapper() {

  // Get nodes
  const { nodes, handleSetNodes, selectedNodeId, setSelectedNodeId } = useSequenceBuilder();

  return (
    <>
      <div>
        <SequenceBuilder />
      </div>
    </>
  );
}

export default SequenceBuilderWrapper;
```

Props:

The SequilderBuilder component has the following props:

- addSubNode

```
  accepts boolean, default - false
```

- nodeStyles

```
  {
    width: "400px",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    fontSize: "26px",
    backgroundColor: "#white",
    backgroundColorOnSelect: "#d3d3d3",
    border: "1px solid white",
    boxSizing: "border-box",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius: "15px",
    color: "black"
  }
```

- subNodeStyles

```
  {
    width: "250px",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    fontSize: "20px",
    backgroundColor: "lightblue",
    border: "1px solid white",
    boxSizing: "border-box",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius: "15px",
    color: "black"
  }
```

- boardStyles

```
  {
    fontFamily: "sans-serif",
    columnGap: "10px"
  }
```

- edgeStroke

```
  "lightgrey"
```

- stepTypeMap

```
  {
    stepTypeKey: "Text to display on the node",
    ...
  }
```

- conditionsMap

```
  {
    conditionKey: "Text to display in select input",
    ...
  }
```

- uniqueStepTypes - Can have only one node of these step types

```
  [...stepTypeKeys]
```

- iconsMap

```
    {
      iconName: "URL" || () => <Icon/>,
      ...
    }
```

- iconStyles

```
    {
      width: "32px",
      height: "32px"
    }
```

- nodeIconMap

```
    {
      stepTypeKey: "iconName",
      ...
    }
```

- nodeContentMap **(New)**

```
    {
      nodeId: "content",
      ...
    }
```

- nodeEndIcon **(New)**

```
    "URL" || () => <Icon/>
```

- branchesStepRestriction

```
    {
      "conditionKey": {
        "left-branch": [...restrictedStepTypeKeys],
        "right-branch": [...restrictedStepTypeKeys],
    },
  }
```

- allowedConditionalBranches

```
   accepts integer >= 0
```

- onNodeDoubleClick

```
() => console.log("Node double clicked");
```

- conditionalBranchAllowedSteps

```
    {
      "conditionKey": [...allowedRootStepTypeKeysForThisCondition],
    }
```

- subNodeContent

```
() => <>Sub-Node content</>
```

- leftBranchSubNodeContent

```
() => <>Left branch sub-node content</>
```

- rightBranchSubNodeContent

```
() => <>Right branch sub-node content</>
```

#### All style related props given in above snippets are applied by default.
