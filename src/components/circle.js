import React from "react"
import {Ellipse} from "react-konva"


const Circle = React.forwardRef((props, ref) => (
  <Ellipse
    ref={ref}
    fill="#4433FF"
    onMouseDown={()=>{ if(props.onMouseDown) props.onMouseDown(); }}
    onTouchStart={()=>{ if(props.onMouseDown) props.onMouseDown(); }}
    {...props}
    draggable/>
));
// class Circle extends React.Component {
//   render() {

//     const {onChange, canvas, ...otherProps} = this.props;
    
//     return (
//         <Circ
//           ref={(ref)=>{this.shapeRef=ref;}}
//           fill="#4433FF"
//           onMouseDown={()=>{ if(canvas) canvas.itemSelected(this.shapeRef);}}
//           {...otherProps}
//           draggable
          
//           // onDragEnd={e => {
//           //   if (!onChange) return;
//           //   onChange({
//           //     ...otherProps,
//           //     x: e.target.x(),
//           //     y: e.target.y(),
//           //   });
//           // }}
//           // onTransformEnd={e => {
//           //   if (!onChange) return;
//           //   // transformer is changing scale
//           //   const node = this.shapeRef;
//           //   const scaleX = node.scaleX();
//           //   const scaleY = node.scaleY();
//           //   node.scaleX(1);
//           //   node.scaleY(1);
//           //   onChange({
//           //     ...otherProps,
//           //     x: node.x(),
//           //     y: node.y(),
//           //     width: node.width() * scaleX,
//           //     height: node.height() * scaleY,
//           //   });
//           // }}
//         />
//       );
//   }
// }

//export default React.forwardRef((props, ref) => <Circle innerRef={ref} {...props}/>);
export default Circle;