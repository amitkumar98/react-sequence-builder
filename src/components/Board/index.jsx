/* eslint-disable react/prop-types */
const Board = ({
  zoom,
  children,
  contentRef,
  boardStyles,
  containerRef,
  draggingNode,
  handleMouseUp,
  isDraggingBoard,
  handleMouseDown,
  handleMouseMove,
  dragOffsetBoard,
  handleZoom,
  zoomButtonsStyle,
  boardWidth,
}) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", width: boardWidth }}
    >
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
            transform: `scale(${zoom}) translate(${
              dragOffsetBoard.x / zoom
            }px, ${dragOffsetBoard.y / zoom}px)`,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            top: "20%",
            right: "30%",
            display: "flex",
            flexDirection: "column",
            rowGap: "2px",
          }}
        >
          <button
            onClick={() => handleZoom(null, true, false)}
            style={zoomButtonsStyle}
          >
            +
          </button>
          <button
            onClick={() => handleZoom(null, false, true)}
            style={zoomButtonsStyle}
            disabled={zoom === 0.3}
          >
            -
          </button>
        </span>
      </div>
    </div>
  );
};

export default Board;
