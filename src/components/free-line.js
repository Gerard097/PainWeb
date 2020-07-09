import Konva from "konva"

export const addLine = (stage, layer, mode = "brush") => {
    let isPaint = false;
    let lastLine;
    stage.on("mousedown touchstart", function(e) {
        
        isPaint = true;
        let pos = stage.getPointerPosition();
        lastLine = new Konva.Line({
                stroke: mode === "brush" ? "red" : "white",
                strokeWidth: mode === "brush" ? 5 : 20,
                globalCompositeOperation:
                mode === "brush" ? "source-over" : "destination-out",
                points: [pos.x, pos.y],
                draggable: mode === "brush",
                listening: false,
                dragBoundFunc: (p) => { return p; },
                mousedown: () => { console.log("sadasds"); },
                onclick: (e) => { console.log(e); }
            });
        layer.add(lastLine);
        console.log(lastLine.attrs);
    });

    stage.on("mouseup touchend mouseleave", function() {
        isPaint = false;
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