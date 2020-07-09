import React, {Component} from 'react'

import {Stage, Layer, Transformer} from 'react-konva'

import {addLine} from './free-line'

import '../styles/canvas.css'

class Canvas extends Component 
{
    constructor(props) {
        super(props);
        this.userStrokeStyle = '#EE92C2';

        this.state = {
            line: null
        }

        this.child = null;
    }

    componentDidMount() {
        //console.log(this.stage);      
        window.addEventListener('resize', this.windowResized);
        addLine(this.stage, this.layer);
        
        setTimeout(()=>{this.layer.children.each((c)=>{ this.child = c; }); this.trRef.setNodes([this.child]); this.layer.batchDraw();  }, 3000);

        //console.log
        //this.trRef.setNode(this.child);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResized);
    }    

    render() {
        return (
            <div ref={(r) => (this.x = r)} className='canvas-wrapper'>
            <Stage
                width={800}
                height={800}
                ref={(ref) => (this.stage = ref)}
            >
                <Layer
                    ref={(ref) => (this.layer = ref)}>
                    <Transformer ref={(ref)=>{ this.trRef = ref; }}/>
                </Layer>
            </Stage>
            </div>
        );
    }
}

export default Canvas;