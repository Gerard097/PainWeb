import React from "react";
import { Rect } from "react-konva";

const Rectangle = React.forwardRef((props, ref) => (
    <Rect
        strokeWidth={4}
        onMouseDown={()=>{ if(props.onMouseDown) props.onMouseDown(); }}
        onTouchStart={()=>{ if(props.onMouseDown) props.onMouseDown(); }}
        ref={ref}
        {...props}
        draggable
        // onDragEnd={e => {
        //     if (!onChange) return;
        //     onChange({
        //     ...otherProps,
        //     x: e.target.x(),
        //     y: e.target.y(),
        //     });
        // }}
        // onTransformEnd={e => {
        //     if (!onChange) return;
        //     // transformer is changing scale
        //     const node = shapeRef.current;
        //     const scaleX = node.scaleX();
        //     const scaleY = node.scaleY();
        //     node.scaleX(1);
        //     node.scaleY(1);
        //     onChange({
        //     ...otherProps,
        //     x: node.x(),
        //     y: node.y(),
        //     width: node.width() * scaleX,
        //     height: node.height() * scaleY,
        //     });
        // }}
    />)
);

export default Rectangle;