/* eslint-disable react/prop-types */
import Node from "../Node";
import Edges from "../Edges";
import Board from "../Board";
import Controls from "../Controls";
import { useRef, useState, useEffect, useCallback } from "react";
import { useSequenceBuilder } from "../../context/SequenceBuilderContext";

function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 500);
  });
}

const SequenceBuilder = ({
  edgeStroke,
  iconsMap = {},
  iconStyles = {},
  nodeStyles = {},
  nodeIconMap = {},
  boardStyles = {},
  stepTypeMap = {},
  subNodeStyles = {},
  wrapperStyles = {},
  conditionsMap = {},
  uniqueStepTypes = [],
  subNodeContent = () => <>Sub-Node content</>,
  leftBranchSubNodeContent = () => <>Left branch sub-node content</>,
  rightBranchSubNodeContent = () => <>Right branch sub-node content</>,
}) => {
  const { nodes, handleSetNodes: setNodes } = useSequenceBuilder();

  const nodeRef = useRef(null);
  const centerRef = useRef(null);
  const contentRef = useRef(null);
  const containerRef = useRef(null);

  const [zoom, setZoom] = useState(0.6);
  const [edges, setEdges] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isDraggingBoard, setIsDraggingBoard] = useState(false);
  const [showMoreButtons, setShowMoreButtons] = useState(false);
  const [dragStartNode, setDragStartNode] = useState({ x: 0, y: 0 });
  const [dragStartBoard, setDragStartBoard] = useState({ x: 0, y: 0 });
  const [dragOffsetBoard, setDragOffsetBoard] = useState({ x: 0, y: 0 });

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
    if (nodes.length > 0) {
      if (!selectedNodeId) {
        return;
      }
      const selectedNode = nodes.find((n) => n.id === selectedNodeId);

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
            "Intermediate node selected",
            edgesConnectedToSelectedNode
          );
          return;
        }

        newNodeX = selectedNode.x + 75;
        newNodeY = selectedNode.y + 150;
        stepNumber = selectedNode.stepNumber + 1;
      }
    } else {
      const centerX = centerRef.current.offsetLeft;
      const centerY = centerRef.current.offsetTop;

      newNodeX = centerX - 150;
      newNodeY = centerY - 300;
    }

    const delayNode = {
      id: crypto.randomUUID(),
      x: newNodeX,
      y: newNodeY,
      stepNumber,
      nodeType: "SUB_NODE",
      nodeText: subNodeContent(),
    };
    const newNode = {
      id: crypto.randomUUID(),
      x: newNodeX - 75,
      y: newNodeY + 150,
      stepType,
      stepNumber: stepNumber + 1,
      nodeType: "NODE",
    };
    setNodes([...nodes, delayNode, newNode]);

    // Add an edge if there is at least one existing node
    if (nodes.length > 0) {
      const selectedNode = nodes.find((n) => n.id === selectedNodeId);
      const lastEdgeNumber = edges[edges.length - 1].edgeNumber;
      setEdges([
        ...edges,
        {
          from: selectedNode.id,
          to: delayNode.id,
          edgeNumber: lastEdgeNumber + 1,
        },
        { from: delayNode.id, to: newNode.id, edgeNumber: lastEdgeNumber + 2 },
      ]);
    } else {
      setEdges([...edges, { from: delayNode.id, to: newNode.id, edgeNumber }]);
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
          edgesConnectedToSelectedNode &&
          edgesConnectedToSelectedNode.length === 2
        ) {
          console.error(
            "Intermediate node selected",
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
            node.stepType !== "NODE"
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

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    // To avoid adding intermediate nodes
    const edgesConnectedToSelectedNode = edges.filter(
      (edge) => edge.from === selectedNodeId || edge.to === selectedNodeId
    );
    if (
      edgesConnectedToSelectedNode &&
      edgesConnectedToSelectedNode.length === 2
    ) {
      console.error("Intermediate node selected", edgesConnectedToSelectedNode);
      return;
    }
    let newNodeX1 = selectedNode.x - 400;
    let newNodeY1 = selectedNode.y + 270;

    let newNodeX2 = newNodeX1 + 950;
    let newNodeY2 = newNodeY1;
    const stepNumber = selectedNode.stepNumber;

    const leftBranchStepType = document.getElementById("left_step_type").value;
    const rightBranchStepType =
      document.getElementById("right_step_type").value;

    const delayNode1 = {
      id: crypto.randomUUID(),
      x: newNodeX1,
      y: newNodeY1,
      stepNumber: stepNumber + 1,
      nodeType: "SUB_NODE",
      nodeText: leftBranchSubNodeContent(),
    };
    const newNode1 = {
      id: crypto.randomUUID(),
      x: newNodeX1 - 75,
      y: newNodeY1 + 150,
      stepNumber: stepNumber + 2,
      stepType: leftBranchStepType,
      nodeType: "NODE",
    };
    const delayNode2 = {
      id: crypto.randomUUID(),
      x: newNodeX2,
      y: newNodeY2,
      stepNumber: stepNumber + 3,
      nodeType: "SUB_NODE",
      nodeText: rightBranchSubNodeContent(),
    };
    const newNode2 = {
      id: crypto.randomUUID(),
      x: newNodeX2 - 75,
      y: newNodeY2 + 150,
      stepNumber: stepNumber + 4,
      stepType: rightBranchStepType,
      nodeType: "NODE",
    };
    selectedNode.isConditional = true;
    setNodes([...nodes, delayNode1, newNode1, delayNode2, newNode2]);
    setEdges([
      ...edges,
      { from: selectedNode.id, to: delayNode1.id },
      { from: delayNode1.id, to: newNode1.id },
      { from: selectedNode.id, to: delayNode2.id },
      { from: delayNode2.id, to: newNode2.id },
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
      />
    </div>
  );
};

export default SequenceBuilder;
