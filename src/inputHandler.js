export { InputHandler };
class InputHandler {
    constructor(engine) {

        canvas.addEventListener("click", (e) => {
            engine.getTileFromClick(engine.mouseLocation(e));
        });

        document.addEventListener("keydown", (e) => {
            let upScaleRate = 1.25;
            let downScaleRate = 1 / upScaleRate;
            switch (e.key) {
                case "+":
                    engine.scaleTiles(upScaleRate);
                    break;
                case "-":
                    engine.scaleTiles(downScaleRate);
                    break;
            }
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