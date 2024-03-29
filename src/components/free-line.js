import Konva from "konva"

export const addLine = (canvas, stage, layer) => {
    let isPaint = false;
    let lastLine;
    stage.on("mousedown touchstart", function(e) {
        
        if (!canvas.isPencilMode() && !canvas.isEraseMode()) {
            return;
        } 
        
        const mode = canvas.paintMode();

        isPaint = true;

        let pos = stage.getPointerPosition();
        
        lastLine = new Konva.Line({
                typeID: "FreeLine",
                stroke: mode === "brush" ? canvas.state.fillColor : "#f5f5f5",
                strokeWidth: mode === "brush" ? 5 : 20,
                globalCompositeOperation:
                mode === "brush" ? "source-over" : "destination-out",
                points: [pos.x, pos.y],
                draggable: mode === "brush"                
        });
        
        const line = lastLine;

        if (mode === "brush")
            lastLine.on('touchstart mousedown', () => { canvas.itemSelected(line); });
        
        layer.add(lastLine);
    });

    stage.on("mouseup touchend mouseleave", function() {
        isPaint = false;
        // const mode = canvas.paintMode();
        // if (lastLine && mode === "brush") {
        //     canvas.addItem(lastLine);
        // }
        lastLine = null;
    });

    stage.on("mousemove touchmove", function() {
        if (!isPaint) {
            return;
        }
        const pos = stage.getPointerPosition();
        let newPoints = lastLine.points().concat([pos.x, pos.y]);
        lastLine.points(newPoints);
        layer.batchDraw();
    });


};