/* eslint-disable react/prop-types */
import Node from "../Node";
import Edges from "../Edges";
import Board from "../Board";
import Controls from "../Controls";
import { wait } from "../../utils/common";
import { useRef, useState, useEffect, useCallback } from "react";
import { useSequenceBuilder } from "../../context/SequenceBuilderContext";

const SequenceBuilder = ({
  edgeStroke,
  iconsMap = {},
  iconStyles = {},
  nodeStyles = {},
  nodeIconMap = {},
  boardStyles = {},
  stepTypeMap = {},
  addSubNode = false,
  subNodeStyles = {},
  wrapperStyles = {},
  conditionsMap = {},
  uniqueStepTypes = [],
  branchesStepRestriction = {},
  allowedConditionalBranches = 1,
  conditionalBranchAllowedSteps = {},
  subNodeContent = () => <>Sub-Node content</>,
  onNodeDoubleClick = () => console.log("Node double clicked"),
  leftBranchSubNodeContent = () => <>Left branch sub-node content</>,
  rightBranchSubNodeContent = () => <>Right branch sub-node content</>,
}) => {
  const {
    nodes,
    edges,
    selectedNodeId,
    handleSetNodes: setNodes,
    handleSetEdges: setEdges,
    handleSetSelectedNodeId: setSelectedNodeId,
  } = useSequenceBuilder();

  const nodeRef = useRef(null);
  const centerRef = useRef(null);
  const contentRef = useRef(null);
  const containerRef = useRef(null);

  const [zoom, setZoom] = useState(0.6);
  const [draggingNode, setDraggingNode] = useState(null);
  const [isDraggingBoard, setIsDraggingBoard] = useState(false);
  const [showMoreButtons, setShowMoreButtons] = useState(false);
  const [dragStartNode, setDragStartNode] = useState({ x: 0, y: 0 });
  const [dragStartBoard, setDragStartBoard] = useState({ x: 0, y: 0 });
  const [dragOffsetBoard, setDragOffsetBoard] = useState({ x: 0, y: 0 });

  let lowestStepNumber = nodes[0]?.stepNumber;

  const scrollBackToContent = useCallback(() => {
    if (nodes.length > 0) {
      nodeRef.current?.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "center",
      });
    } else {
      centerRef.current?.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "center",
      });
    }
  }, [nodes.length]);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const zoomChange = e.deltaY * -0.005;
      setZoom((prevZoom) =>
        Math.min(Math.max(prevZoom + zoomChange, 0.2), 1.5)
      );
      wait(1).then(() => {
        scrollBackToContent();
      });
    },
    [scrollBackToContent]
  );

  const handleMouseDown = (e) => {
    if (e.target.dataset.nodeId !== undefined) {
      setSelectedNodeId(e.target.dataset.nodeId);
      const nodeId = e.target.dataset.nodeId;
      const node = nodes.find((n) => n.id === nodeId);
      setDraggingNode(node);
      setDragStartNode({
        x: e.clientX - node.x * zoom,
        y: e.clientY - node.y * zoom,
      });
    } else {
      setIsDraggingBoard(true);
      setDragStartBoard({
        x: e.clientX - dragOffsetBoard.x,
        y: e.clientY - dragOffsetBoard.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDraggingBoard) {
      setDragOffsetBoard({
        x: e.clientX - dragStartBoard.x,
        y: e.clientY - dragStartBoard.y,
      });
    } else if (draggingNode) {
      const newX = (e.clientX - dragStartNode.x) / zoom;
      const newY = (e.clientY - dragStartNode.y) / zoom;
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === draggingNode.id ? { ...node, x: newX, y: newY } : node
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDraggingBoard(false);
    setDraggingNode(false);
  };

  useEffect(() => {
    if (centerRef.current) {
      centerRef.current?.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "center",
      });
    }
  }, []);

  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current?.scrollIntoView({
        behavior: "instant",
        block: "start",
        inline: "center",
      });
    }
  }, [nodes]);

  useEffect(() => {
    const board = contentRef.current;
    board.addEventListener("wheel", handleWheel);
    return () => {
      board.removeEventListener("wheel", handleWheel);
    };
  }, [zoom, handleWheel]);

  const addNode = () => {
    const stepType = document.getElementById("step_type").value;
    let newNodeX;
    let newNodeY;
    let stepNumber = 0;
    let edgeNumber = 0;
    let selectedNode = null;
    if (nodes.length > 0) {
      if (!selectedNodeId) {
        return;
      }
      selectedNode = nodes.find((n) => n.id === selectedNodeId);

      if (selectedNode && selectedNode.nodeType === "SUB_NODE") {
        console.error(
          "Can't add a node to sub-node. Select a node to add more nodes."
        );
        return;
      }

      if (selectedNode) {
        // To avoid adding intermediate nodes
        const edgesConnectedToSelectedNode = edges.filter(
          (edge) => edge.from === selectedNodeId || edge.to === selectedNodeId
        );
        if (
          edgesConnectedToSelectedNode &&
          edgesConnectedToSelectedNode.length === 2
        ) {
          console.error(
            "Can't add node to an intermediate node",
            edgesConnectedToSelectedNode
          );
          return;
        }

        newNodeX = selectedNode.x + 75;
        newNodeY = selectedNode.y + 150;
        stepNumber = selectedNode.stepNumber + 1;
        if (
          !addSubNode &&
          nodes.length > 1 &&
          selectedNode.stepNumber === lowestStepNumber
        ) {
          console.error(
            "Can't add node to first node when number of nodes is higher than 1"
          );
          return;
        }
      }
    } else {
      const centerX = centerRef.current.offsetLeft;
      const centerY = centerRef.current.offsetTop;

      newNodeX = centerX - 150;
      newNodeY = centerY - 300;
    }

    let subNode;
    let newNode;
    if (addSubNode) {
      subNode = {
        id: crypto.randomUUID(),
        x: newNodeX,
        y: newNodeY,
        stepNumber,
        nodeType: "SUB_NODE",
        nodeText: subNodeContent(),
        condition:
          selectedNode && selectedNode.condition
            ? selectedNode.condition
            : null,
        branchSide:
          selectedNode && selectedNode.branchSide
            ? selectedNode.branchSide
            : null,
        rootBranchNodeUuid:
          selectedNode && selectedNode.rootBranchNodeUuid
            ? selectedNode.rootBranchNodeUuid
            : null,
      };
      newNode = {
        id: crypto.randomUUID(),
        x: newNodeX - 75,
        y: newNodeY + 150,
        stepType,
        stepNumber: stepNumber + 1,
        nodeType: "NODE",
        condition:
          selectedNode && selectedNode.condition
            ? selectedNode.condition
            : null,
        branchSide:
          selectedNode && selectedNode.branchSide
            ? selectedNode.branchSide
            : null,
        rootBranchNodeUuid:
          selectedNode && selectedNode.rootBranchNodeUuid
            ? selectedNode.rootBranchNodeUuid
            : null,
      };
      setNodes([...nodes, subNode, newNode]);
    } else {
      newNode = {
        id: crypto.randomUUID(),
        x: newNodeX - 75,
        y: newNodeY + 100,
        stepType,
        stepNumber: stepNumber,
        nodeType: "NODE",
        condition:
          selectedNode && selectedNode.condition
            ? selectedNode.condition
            : null,
        branchSide:
          selectedNode && selectedNode.branchSide
            ? selectedNode.branchSide
            : null,
        rootBranchNodeUuid:
          selectedNode && selectedNode.rootBranchNodeUuid
            ? selectedNode.rootBranchNodeUuid
            : null,
      };
      setNodes([...nodes, newNode]);
    }

    // Case 1: When existing nodes are there
    if (nodes.length > 0) {
      const selectedNode = nodes.find((n) => n.id === selectedNodeId);
      const lastEdgeNumber = edges[edges.length - 1]
        ? edges[edges.length - 1].edgeNumber
        : 0;

      if (addSubNode) {
        setEdges([
          ...edges,
          {
            from: selectedNode.id,
            to: subNode.id,
            edgeNumber: lastEdgeNumber + 1,
          },
          { from: subNode.id, to: newNode.id, edgeNumber: lastEdgeNumber + 2 },
        ]);
      } else {
        setEdges([
          ...edges,
          {
            from: selectedNode.id,
            to: newNode.id,
            edgeNumber: lastEdgeNumber + 1,
          },
        ]);
      }
    }
    // Case 2: 1st node
    else {
      if (addSubNode) {
        setEdges([...edges, { from: subNode.id, to: newNode.id, edgeNumber }]);
      }
    }
    setSelectedNodeId(newNode.id);
  };

  const removeNode = () => {
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    if (selectedNode && selectedNode.nodeType === "SUB_NODE") {
      console.error("Can't delete a sub-node. Delete the parent node instead.");
      return;
    }

    let newNodes = [];
    let newEdges = [];
    if (selectedNode) {
      if (selectedNode.isConditional) {
        newNodes = nodes.filter(
          (node) => node.stepNumber < selectedNode.stepNumber - 1
        );
        const selectedNodeEdge = edges.find(
          (edge) => edge.to === selectedNodeId
        );
        newEdges = edges.filter(
          (edge) => edge.edgeNumber < selectedNodeEdge.edgeNumber - 1
        );
      } else {
        // To avoid removing intermediate nodes
        const edgesConnectedToSelectedNode = edges.filter(
          (edge) => edge.from === selectedNodeId || edge.to === selectedNodeId
        );
        if (
          (selectedNode.stepNumber === 0 &&
            edgesConnectedToSelectedNode.length === 1) ||
          edgesConnectedToSelectedNode.length === 2
        ) {
          console.error(
            "Can't remove the intermediate or first node",
            edgesConnectedToSelectedNode
          );
          return;
        }
        newNodes = nodes.filter((node) => node.id !== selectedNodeId);
        newEdges = edges.filter((edge) => edge.to !== selectedNodeId);

        // check and remove if any sub-node attached to the selected node
        const subNodeToDelete = newNodes.find(
          (node) =>
            node.stepNumber === selectedNode.stepNumber - 1 &&
            node.nodeType !== "NODE"
        );

        if (subNodeToDelete) {
          newNodes = newNodes.filter((node) => node.id !== subNodeToDelete.id);
          newEdges = newEdges.filter((edge) => edge.to !== subNodeToDelete.id);
        }
        // handle deletion of itermediate nodes here, if required
      }
      setNodes(newNodes);
      setEdges(newEdges);
      if (newNodes.length === 0) {
        setSelectedNodeId(null);
        return;
      }
      setSelectedNodeId(newNodes[newNodes.length - 1].id);
    }
  };

  const addConditionalBranches = () => {
    if (!selectedNodeId) {
      return;
    }

    if (nodes.length <= 0) {
      console.error(
        "At least one node is required to add conditional branches"
      );
      return;
    }

    const conditionalBranches = nodes.filter((node) => node.isConditional);
    if (conditionalBranches.length > allowedConditionalBranches) {
      console.error(
        "Maximum number of conditional branches allowed is ",
        allowedConditionalBranches
      );
      return;
    }

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    const condition = document.getElementById("condition").value;
    // To avoid adding intermediate nodes
    const edgesConnectedToSelectedNode = edges.filter(
      (edge) => edge.from === selectedNodeId || edge.to === selectedNodeId
    );
    if (
      edgesConnectedToSelectedNode &&
      edgesConnectedToSelectedNode.length === 2
    ) {
      console.error(
        "Can't add conditional branch to intermediate node",
        edgesConnectedToSelectedNode
      );
      return;
    }
    let newNodeX1 = selectedNode.x - 400;
    let newNodeY1 = selectedNode.y + 270;

    let newNodeX2 = newNodeX1 + 950;
    let newNodeY2 = newNodeY1;
    const stepNumber = selectedNode.stepNumber + 1;

    const leftBranchStepType = document.getElementById("left_step_type").value;
    const rightBranchStepType =
      document.getElementById("right_step_type").value;

    const subNode1 = {
      id: crypto.randomUUID(),
      x: newNodeX1,
      y: newNodeY1,
      stepNumber: stepNumber,
      nodeType: "SUB_NODE",
      nodeText: leftBranchSubNodeContent(),
      condition,
      branchSide: "left-branch",
      rootBranchNodeUuid: selectedNode.id,
    };
    const newNode1 = {
      id: crypto.randomUUID(),
      x: newNodeX1 - 75,
      y: newNodeY1 + 150,
      stepNumber: stepNumber,
      stepType: leftBranchStepType,
      nodeType: "NODE",
      condition,
      branchSide: "left-branch",
      rootBranchNodeUuid: selectedNode.id,
    };
    const subNode2 = {
      id: crypto.randomUUID(),
      x: newNodeX2,
      y: newNodeY2,
      stepNumber: stepNumber,
      nodeType: "SUB_NODE",
      nodeText: rightBranchSubNodeContent(),
      condition,
      branchSide: "right-branch",
      rootBranchNodeUuid: selectedNode.id,
    };
    const newNode2 = {
      id: crypto.randomUUID(),
      x: newNodeX2 - 75,
      y: newNodeY2 + 150,
      stepNumber: stepNumber,
      stepType: rightBranchStepType,
      nodeType: "NODE",
      condition,
      branchSide: "right-branch",
      rootBranchNodeUuid: selectedNode.id,
    };
    selectedNode.isConditional = true;
    selectedNode.condition = condition;
    setNodes([...nodes, subNode1, newNode1, subNode2, newNode2]);
    setEdges([
      ...edges,
      { from: selectedNode.id, to: subNode1.id },
      { from: subNode1.id, to: newNode1.id },
      { from: selectedNode.id, to: subNode2.id },
      { from: subNode2.id, to: newNode2.id },
    ]);
    setSelectedNodeId(newNode1.id);
    setShowMoreButtons(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: wrapperStyles?.fontFamily
          ? wrapperStyles.fontFamily
          : "sans-serif",
        columnGap: wrapperStyles?.columnGap ? wrapperStyles.columnGap : "10px",
      }}
    >
      <Board
        zoom={zoom}
        contentRef={contentRef}
        boardStyles={boardStyles}
        containerRef={containerRef}
        draggingNode={draggingNode}
        handleMouseUp={handleMouseUp}
        dragOffsetBoard={dragOffsetBoard}
        isDraggingBoard={isDraggingBoard}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
      >
        {nodes.length === 0 && <div ref={centerRef}>.</div>}
        <Edges edges={edges} nodes={nodes} stroke={edgeStroke} />
        {nodes.map((node, index) => (
          <Node
            node={node}
            index={index}
            key={node.id}
            nodeRef={nodeRef}
            iconsMap={iconsMap}
            iconStyles={iconStyles}
            nodeStyles={nodeStyles}
            stepTypeMap={stepTypeMap}
            nodeIconMap={nodeIconMap}
            subNodeStyles={subNodeStyles}
            selectedNodeId={selectedNodeId}
            onNodeDoubleClick={onNodeDoubleClick}
            setSelectedNodeId={setSelectedNodeId}
          />
        ))}
      </Board>
      <Controls
        nodes={nodes}
        addNode={addNode}
        removeNode={removeNode}
        stepTypeMap={stepTypeMap}
        conditionsMap={conditionsMap}
        selectedNodeId={selectedNodeId}
        showMoreButtons={showMoreButtons}
        uniqueStepTypes={uniqueStepTypes}
        setShowMoreButtons={setShowMoreButtons}
        scrollBackToContent={scrollBackToContent}
        addConditionalBranches={addConditionalBranches}
        branchesStepRestriction={branchesStepRestriction}
        allowedConditionalBranches={allowedConditionalBranches}
        conditionalBranchAllowedSteps={conditionalBranchAllowedSteps}
      />
    </div>
  );
};

export default SequenceBuilder;
