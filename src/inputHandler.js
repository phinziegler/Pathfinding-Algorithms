export { InputHandler };
class InputHandler {
    constructor(engine) {

        canvas.addEventListener("click", (e) => {
            engine.getTileFromClick(engine.mouseLocation(e));
        });

        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "+":
                    engine.zoomIn();
                    break;
                case "-":
                    engine.zoomOut();
                    break;
            }
        });

        canvas.addEventListener("wheel", (e) => {
            if(e.wheelDelta > 0) {
                engine.zoomIn();
                return;
            }
            engine.zoomOut();
        });

        canvas.addEventListener("mousedown", (e) => {
            engine.handleMouseDown(e);
        });
        canvas.addEventListener("mousemove", (e) => {
            engine.handleMouseMove(e);
        });

        canvas.addEventListener("mouseup", () => { engine.endMouseDown(); });
        canvas.addEventListener("mouseleave", () => { engine.endMouseDown(); });
    }
}