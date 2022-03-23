import { Engine } from "./engine.js";
import { InputHandler } from "./inputHandler.js";
import { LinkedList } from "./linkedList.js";
import { Render } from "./render.js";
import { ToolHandler } from "./toolHandler.js";


let canvas = document.getElementById("canvas");
const rows = 100;
const cols = 100;
const size = 30;

let render = new Render(canvas);
let engine = new Engine(canvas, rows, cols, size, render);
new ToolHandler(engine, render);
new InputHandler(engine, render);

engine.init();

// WINDOW EVENT
let timer;
window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(doResize, 200);
});
function doResize() {
    engine.doResize();
}

//For some reason this makes the canvas more smooth
function loop() {
    requestAnimationFrame(loop);
}
loop();
