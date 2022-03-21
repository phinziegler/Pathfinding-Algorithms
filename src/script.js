
import { Coordinate } from "./coordinate.js";
import { Tile } from "./tile.js";
import { Render } from "./render.js";

let canvas = document.getElementById("canvas");
let tileArray = [];
let offset = new Coordinate(0,0);
let render = new Render(canvas);
let offsetStart = null;
let tempOffset = null;
const n = 500;
const size = 30;

function init() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render = new Render(canvas);
    tileArray = constructTileArray(n, n);
}

function constructTileArray(rows, columns) {
    let output = [];
    for(let r = 0; r < rows; r++) {
        let row = [];
        for(let c = 0; c < columns; c++) {
            let tile = new Tile(size, new Coordinate(c, r));
            row.push(tile);
        }
        output.push(row);
    }
    return output;
}

function mouseLocation(e) {
    let rect = canvas.getBoundingClientRect();  // abs. size of element
    let scaleX = canvas.width / rect.width;         // relationship bitmap vs. element for X
    let scaleY = canvas.height / rect.height;       // relationship bitmap vs. element for Y

    let x = Math.floor((e.clientX - rect.left) * scaleX) + 1;
    let y = Math.floor((e.clientY - rect.top) * scaleY) + 1;
    return new Coordinate(x, y);
}

//////////////////
/// MOVE TILES ///
//////////////////

canvas.addEventListener("mousedown", (e) => {
    offsetStart = mouseLocation(e);
});

canvas.addEventListener("mousemove", (e) => {
    if(offsetStart == null) {
        return;
    }
    doOffset(mouseLocation(e));
});

canvas.addEventListener("mouseup", (e) => {
    offsetStart = null;
    offset = tempOffset;
});

function doOffset(coordinate) {
    if(coordinate == null) {
        render.renderFrame(tileArray, tempOffset);
        requestAnimationFrame(doOffset);
        return;
    }
    let changeX = offsetStart.getX() - coordinate.getX();   // so far
    let changeY = offsetStart.getY() - coordinate.getY();   // so far
    let totalX = offset.getX() + changeX;
    let totalY = offset.getY() + changeY;
    tempOffset = new Coordinate(totalX, totalY);
    
    render.renderFrame(tileArray, new Coordinate(totalX, totalY));
}

////////////////////////////////////////////////////////////////////////////

document.addEventListener

init();

render.renderFrame(tileArray, new Coordinate(0,0));
let lastTime = 0;
function loop(time) {
    let deltaTime = (time - lastTime / 1000);   // give change in time in seconds.
    lastTime = time;

    requestAnimationFrame(loop);
}

loop(0);

    
