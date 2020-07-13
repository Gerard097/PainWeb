import React, {Component, createRef} from 'react'

import {Stage, Layer, Transformer} from 'react-konva'

import {addLine} from './free-line'

import Circle from './circle'
import Rectangle from './rectangle';

import { GrSelect } from "react-icons/gr";

import { BsPencil, BsCircle, BsSquare } from "react-icons/bs"

import { RiEraserLine, RiDeleteBin6Line } from 'react-icons/ri'

import { IconContext } from 'react-icons'

import '../styles/canvas.css'

class TransformAction {

    constructor(target, oldAttrs) {
        this.target = target;
        this.old = {};
        Object.assign(this.old, oldAttrs);
    }

    excecute() {}

    undo() {
        let redo = {};
        Object.assign(redo, this.target.attrs);
        this.apply(this.target, this.old);
        this.old = redo;
    }

    redo() {
        let undo = {};
        Object.assign(undo, this.target.attrs);
        this.apply(this.target, this.old);
        this.old = undo;
    }

    apply(target, source) {
        target.scaleY(source.scaleY);
        target.scaleX(source.scaleX);
        target.x(source.x);
        target.y(source.y);
        target.rotation(source.rotation);
        target.skewX(source.skewX);
        target.skewY(source.skewY);
        target.getLayer().batchDraw();
    }
}

// class EraseItemAction {

//     constructor(canvas, item) {
//         this.canvas = canvas;
//         this.item = item;
//     }

//     excecute() {

//     }

//     undo() {

//     }

//     redo() {

//     }
    
// }
const equalObjects = (a, b) => {

    let x;
    for (x in a) {
        if (a[x] !== b[x]) return false;
    }

    for (x in b) {
        if (a[x] !== b[x]) return false;
    }

    return true;
}

class Canvas extends Component 
{
    constructor(props) {
        super(props);

        this.userFillColor = '#000000';
        this.userOutlineColor = '#FFFFFF';

        this.state = {
            currentMode: 1,
            isShapeSelected: true,
            dummyObject: null,
            shapes: [],
            canvasWidth: 0,
            canvasHeight: 0,
            fillColor: this.userFillColor,
            outlineColor: this.userOutlineColor
        }

        this.windowResized = this.onWindowResized.bind(this);
        this.canvas = this;

        //Will not work if the monitor size is bigger but window is not on full screen size
        // this.cvWidth = Math.max(1920, window.outerWidth);
        // this.cvHeight = Math.max(1080, window.outerHeight);

        this.tools = [
            {Type: GrSelect, mode: "Select", onEnter: () => {this.onSelectTool(true)}, onExit: () => {this.onSelectTool(false)}},
            {Type: BsPencil, mode: "Pencil"},
            {Type: BsCircle, mode: "Circle", shape: Circle},
            {Type: BsSquare, mode: "Rectangle", shape: Rectangle},
            {Type: RiEraserLine, mode: "Erase"},
            {Type: RiDeleteBin6Line, mode: "Delete", onEnter: () => {this.onSelectTool(true)}, onExit: () => {this.onSelectTool(false)}}
        ];

        //this.items = [];
        this.isConstructing = false;

        this.cleanSelection = true;
        this.lastSelected = null;

        this.undo = [];
        this.redo = [];

        //Used to store previous  
        this.oldAttrs = {};

        this.dummyRef = React.createRef();
    }

    getCurrentMode() {
        return this.tools[this.state.currentMode].mode;
    }
    
    isPencilMode() {
        return this.getCurrentMode() === "Pencil";
    }

    isSelectMode() {
        return this.getCurrentMode() === "Select";
    }

    //Eraser like in paint
    isEraseMode() {
        return this.getCurrentMode() === "Erase";
    }

    //Removes a whole shape
    isDeleteMode() 
    {
        return this.getCurrentMode() === "Delete";
    }

    paintMode() {
        return !this.isEraseMode() ? "brush" : "erase";
    }

    componentDidMount() {
        window.addEventListener('resize', this.windowResized);
        this.setState({canvasWidth: this.canvasWrap.clientWidth, canvasHeight: this.canvasWrap.clientHeight})
        addLine(this, this.stage, this.layer);
        //this.setState({isShapeSelected: false});
        this.onSelectTool(false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResized);
    }    

    onWindowResized() {
        this.setState({canvasWidth: this.canvasWrap.clientWidth, 
                       canvasHeight: this.canvasWrap.clientHeight})
    }

    // addItem(item) {
    //     console.log("Item added", item);
    //     this.items.push(item);
    // }

    removeItem(item) {
        
        // const itemAt = this.items.indexOf(item);
        
        // console.log(this.items);
        // //Should never be false
        // if (itemAt !== -1) {
        //     this.items.splice(itemAt, 1);
        // }
        // else {
        //     console.error("Something wrong happened. Trying to remove an already deleted item", item);
        // }

        const shapes = this.state.shapes;
        
        let removeAt = -1;
        
        shapes.forEach((it, index) => {
            if (it.ref._id === item._id) {
                removeAt = index;
            }
        });

        if (removeAt !== -1) {
            shapes.splice(removeAt, 1);
        }
        else {
            item.destroy();
        }

        this.setState({shapes: shapes});
        this.layer.batchDraw();
    }

    itemSelected (item) {

        //console.log("Touched", item);

        //Check for deletion
        if (this.isDeleteMode()) {
            this.removeItem(item);
            return;
        }

        if (!this.isSelectMode()) {
            return;
        }

        this.cleanSelection = false;
    
        if (this.lastSelected === item) return;
        
        this.lastSelected = item;

        this.setState({isShapeSelected: true}, () => {
            this.trRef.nodes([this.lastSelected]);
            this.layer.batchDraw();
        });
    }

    onMouseDown() {

        if (!this.isSelectMode()) {
            
            const shapeModes = ["Circle", "Rectangle"];

            if (shapeModes.indexOf(this.getCurrentMode()) !== -1) {
                const pos = this.stage.getPointerPosition();
                //Construct shape
                this.isConstructing = true;
                const Type = this.tools[this.state.currentMode].shape;

                //const dummy = <Type canvas={this} width={100} height={100} x={100} y={100}/>;
                const dummy = <Type
                                ref={this.dummyRef} 
                                canvas={this} 
                                x={pos.x} y={pos.y} stroke="#AFFFFF"/>;
                
                this.setState({dummyObject:dummy});
            }

            return;
        }

        if (this.cleanSelection) {
            this.setState({isShapeSelected: false});
            this.lastSelected = null;
        }

        this.cleanSelection = true;
    }

    onMouseMove() {
        if (this.isConstructing) {
            const pos = this.stage.getPointerPosition();
            
            const obj = this.dummyRef.current;
            const shapeType = this.getCurrentMode();

            const e = window.event;

            let dx = pos.x-obj.x();
            let dy = pos.y-obj.y();

            if (shapeType === "Circle") {

                if (e.shiftKey) {
                    const side = Math.min(Math.abs(dx), Math.abs(dy));
                    dx = Math.sign(dx)*side;
                    dy = Math.sign(dy)*side;
                }
            
                let offX = -dx*0.5;
                let offY = -dy*0.5;

                obj.offsetX(offX);
                obj.offsetY(offY);
                obj.width(Math.abs(dx));
                obj.height(Math.abs(dy));
            }
            else if (shapeType === "Rectangle") {

                if (e.shiftKey) {
                    const side = Math.min(Math.abs(dx), Math.abs(dy));
                    dx = Math.sign(dx)*side;
                    dy = Math.sign(dy)*side;
                }

                obj.width(dx);
                obj.height(dy);
            }

            this.layer.batchDraw();
        }
    }

    onMouseUp() {
        if (this.isConstructing) {
            this.isConstructing = false;
            
            //Save the state
            const attrs = this.dummyRef.current.attrs;
            
            attrs.typeID = this.getCurrentMode();
            //Store the ref
            //this.addItem(this.dummyRef.current);

            const shapes = this.state.shapes;

            // const shape = {ref: this.dummyRef, obj: this.state.dummyObject};
            const Type = this.tools[this.state.currentMode].shape;

            const shape = {attrs: attrs, Type: Type, ref: createRef(), key: this.dummyRef.current._id};
            
            shapes.push(shape);

            this.dummyRef = createRef();

            this.setState({shapes: shapes, dummyObject: null});/*, 
                           () => { 
                               //For some reason the attrs are getting restored to the original (when created)
                               //so we need to apply again the changes
                               shape.ref.current.attrs = attrs; this.dummyRef = createRef();  });*/
        }
    }

    onSelectTool(enabled) {
        
        this.layer.listening(enabled);

        this.layer.batchDraw();

        if (!enabled) {
            this.setState({isShapeSelected: false});
        }

        this.lastSelected = null;
    }

    addAction(action) {
        action.excecute();
        this.undo.push(action);
        this.redo = [];
        this.forceUpdate();
    }

    doUndo() {
        if (this.undo.length > 0) {
            const last = this.undo.pop();
        
            last.undo();

            //Create Redo entry
            this.redo.push(last);

            //recalculate box
            //For some reason the box is rotated after restoring to old state
            this.onMouseDown();
            this.itemSelected(last.target);
            this.cleanSelection = true;
            this.forceUpdate();
        }
    }

    doRedo() {
        if (this.redo.length > 0) {
            
            const last = this.redo.pop();

            //Create Undo entry
            last.redo();

            this.undo.push(last);
            
            //recalculate box
            //For some reason the box is rotated after restoring to old state
            this.onMouseDown();
            this.itemSelected(last.target);
            this.cleanSelection = true;
            this.forceUpdate();
        }
    }

    render() {

        //const iconSize = { x: 40, y: 40 };

        const toolsComponents = this.tools.map((tool, index) => {
            const {Type} = tool;
            return (<div key={index} className={`tool-wrapper ${index === this.state.currentMode ? "selected" : ""}`}>
                        <Type
                            onClick={() => { 
                                if (this.state.currentMode === index) return;
                                const prevIndex = this.state.currentMode;
                                this.setState({currentMode: index}, () => {
                                    const prevTool = this.tools[prevIndex];
                                    if (prevTool.onExit) prevTool.onExit();
                                    if (tool.onEnter) tool.onEnter();
                                });
                            }}/>
                    </div>);
        });

        const shapes = this.state.shapes.map((shape,index) => {
            let {Type, attrs, key } = shape;
            
            return <Type
                        key={key}
                        ref={(r)=>{ if (r) { shape.ref = r; if (attrs) { r.attrs = attrs; } } }}
                        onMouseDown={() => { this.itemSelected(shape.ref); }}
                        canvas={this} 
                        stroke="#AFFFFF"/>;
        });

        return (
            <>
            <div className='toolbar-header'>
            <IconContext.Provider  value={{ className: "tool-button", size: '2em', style:{}} }>
                {toolsComponents}
            </IconContext.Provider >
                {/* <button
                    disabled={this.undo.length === 0}
                    onClick={()=>{
                        this.doUndo();
                    }}
                    >Undo</button>
                    <button
                    disabled={this.redo.length === 0}
                    onClick={()=>{
                        this.doRedo();
                    }}
                    >Redo</button> */}
            </div>
            <div ref={(r) => (this.canvasWrap = r)} className='canvas-wrapper'>
                <Stage
                    className="canvas-container"
                    // style={{backgroundColor:red}}
                    width={this.state.canvasWidth}
                    height={this.state.canvasHeight}
                    ref={(ref) => (this.stage = ref)}
                    //onClick={()=>{console.log("Clicked")}}
                    onTouchStart={(e)=>{this.onMouseDown();}}
                    onTouchMove={(e)=>{this.onMouseMove();}}
                    onTouchEnd={()=>{this.onMouseUp();}}
                    onMouseDown={(e)=>{this.onMouseDown();}}
                    onMouseLeave={()=>{this.onMouseUp();}}
                    onMouseUp={()=>{this.onMouseUp();}}
                    onMouseMove={(e)=>{this.onMouseMove();}}
                >
                    <Layer
                        ref={(ref) => (this.layer = ref)}>
                        {shapes}
                        {this.state.isShapeSelected && 
                        <Transformer
                            onTransformStart={(ev) => { Object.assign(this.oldAttrs, ev.target.attrs); }}
                            onTransformEnd={(ev) => {
                                console.log(ev);
                                if (!equalObjects(this.oldAttrs, ev.target.attrs)) {
                                    this.addAction(new TransformAction(ev.target, this.oldAttrs)); 
                                }

                                this.oldAttrs = {};
                            }}
                            onMouseDown={()=>{ this.cleanSelection = false; /*To avoid unselecting when clicking out of the shape*/ }}
                            ref={(ref)=>{ this.trRef = ref; }}/>}
                        {this.state.dummyObject}
                    </Layer>
                </Stage>
            </div>
            </>
        );
    }
}

export default Canvas;