/* eslint-disable react/prop-types */
const Board = ({
  zoom,
  children,
  contentRef,
  containerRef,
  draggingNode,
  handleMouseUp,
  isDraggingBoard,
  handleMouseDown,
  handleMouseMove,
  dragOffsetBoard,
  boardStyles = {},
}) => {
  return (
    <div
      ref={containerRef}
      style={{
        width: boardStyles?.width ? boardStyles.width : "1000px",
        height: boardStyles?.height ? boardStyles.height : "700px",
        backgroundColor: boardStyles?.backgroundColor
          ? boardStyles.backgroundColor
          : "white",
        overflow: "hidden",
        position: "relative",
        border: boardStyles?.border ? boardStyles.border : "1px solid black",
        cursor: isDraggingBoard || draggingNode ? "grabbing" : "grab",
        margin: boardStyles?.margin ? boardStyles.margin : "50px 50px 0 50px",
        borderRadius: boardStyles?.borderRadius
          ? boardStyles.borderRadius
          : "10px",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        ref={contentRef}
        style={{
          width: "800vw",
          height: "800vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid red",
          backgroundImage: boardStyles?.backgroundImage
            ? boardStyles.backgroundImage
            : "radial-gradient(circle, grey 2px, rgba(0, 0, 0, 0) 1px)",
          backgroundSize: boardStyles?.backgroundSize
            ? boardStyles.backgroundSize
            : "40px 40px",
          backgroundColor: boardStyles?.backgroundColor
            ? boardStyles.backgroundColor
            : "white",
          transform: `scale(${zoom}) translate(${dragOffsetBoard.x / zoom}px, ${
            dragOffsetBoard.y / zoom
          }px)`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Board;
