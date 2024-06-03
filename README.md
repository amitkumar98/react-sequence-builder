# React Sequence Builder

- Create sequence flow diagrams using React.

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
  const { nodes } = useSequenceBuilder();

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

 - nodeStyles

  ```
    {
      width: "400px",
      height: "100px",
      display: "flex",
      justifyContent: "center",
      fontSize: "26px",
      backgroundColor: "#white",
      backgroundColorOnSelect: "d3d3d3",
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
      backgroundColorOnSelect: "d3d3d3",
      border: "1px solid white",
      boxSizing: "border-box",
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      borderRadius: "15px",
      color: "black"
    } 
  ```
   
 - wrapperStyles

  ```
    {
      fontFamily: "sans-serif",
      columnGap: "10px"
    } 
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

- iconsMap

```
    {
      iconName: "URL",
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
