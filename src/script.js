// IMPORTS
import { Coordinate } from "./coordinate.js";
import { Tile } from "./tile.js";
import { Render } from "./render.js";
import { ToolHandler } from "./toolHandler.js";

export { setTool };

//------------------------------------------------------------------------------------------------
let canvas = document.getElementById("canvas");
new ToolHandler();
let activeTool = null;
let tileArray = [];
let offset = new Coordinate(0, 0);
let render = new Render(canvas);
let offsetStart = null;
let tempOffset = new Coordinate(0, 0);
const rows = 100;
const cols = 100;
const size = 30;
//------------------------------------------------------------------------------------------------

// INITIALIZE
function init() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render = new Render(canvas);
    tileArray = constructTileArray(rows, cols);
}

// CONSTRUCT TILE ARRAY 
function constructTileArray(rows, columns) {
    let output = [];
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = new Tile(size, new Coordinate(c, r));
            row.push(tile);
        }
        output.push(row);
    }
    return output;
}
// GET MOUSE LOCATION FROM EVENT
function mouseLocation(e) {
    let rect = canvas.getBoundingClientRect();  // abs. size of element
    let scaleX = canvas.width / rect.width;         // relationship bitmap vs. element for X
    let scaleY = canvas.height / rect.height;       // relationship bitmap vs. element for Y

    let x = Math.floor((e.clientX - rect.left) * scaleX) + 1;
    let y = Math.floor((e.clientY - rect.top) * scaleY) + 1;
    return new Coordinate(x, y);
}

// SET TOOL
function setTool(id) {
    activeTool = id;
    console.log(id + " active tool");
}

// SET OFFSET-------------------------------------------------------------------------------------
function clampOffset(coordinate) {
    let overshoot = 0;

    let totalHeight = tileArray[0][0].getSize() * tileArray.length;
    let totalWidth = tileArray[0][0].getSize() * tileArray[0].length;

    if(coordinate.getX() + canvas.width > totalWidth) {
        coordinate.setX(totalWidth - canvas.width);
        overshoot++;
    }
    if(coordinate.getY() + canvas.height > totalWidth) {
        coordinate.setY(totalHeight - canvas.height);
        overshoot++;
    }
    if(coordinate.getY() < 0) {
        coordinate.setY(0);
        overshoot++;
    }
    if(coordinate.getX() < 0) {
        coordinate.setX(0);
        overshoot++;
    }

    // center
    if(totalWidth < canvas.width) {
        coordinate.setX(-(canvas.width / 2) + (totalWidth / 2));
        overshoot++;
    }
    if(totalHeight < canvas.height) {
        coordinate.setY(-(canvas.height / 2) + (totalHeight / 2));
        overshoot++;
    }

    if (overshoot > 0) {
        render.renderFrame(tileArray, coordinate);
    }

    return coordinate;
}
//------------------------------------------------------------------------------------------------

//////////////////
/// MOVE TILES ///
//////////////////--------------------------------------------------------------------------------

// MOUSE DOWN
canvas.addEventListener("mousedown", (e) => {
    offsetStart = mouseLocation(e);
});
canvas.addEventListener("mousemove", (e) => {
    if (offsetStart == null) {
        return;
    }
    doOffset(mouseLocation(e));
});
function doOffset(coordinate) {
    let changeX = offsetStart.getX() - coordinate.getX();   // so far
    let changeY = offsetStart.getY() - coordinate.getY();   // so far
    let totalX = offset.getX() + changeX;
    let totalY = offset.getY() + changeY;
    tempOffset = clampOffset(new Coordinate(totalX, totalY));
    render.renderFrame(tileArray, tempOffset);
}

// END MOUSE DOWN
canvas.addEventListener("mouseup", () => { endMouseDown(); });
canvas.addEventListener("mouseleave", () => { endMouseDown(); });
function endMouseDown() {
    offset = clampOffset(tempOffset);
    offsetStart = null;
}
//------------------------------------------------------------------------------------------------

// ZOOM IN AND OUT--------------------------------------------------------------------------------
document.addEventListener("keydown", (e) => {
    let upScaleRate = 1.25;
    let downScaleRate = 1 / upScaleRate;
    switch (e.key) {
        case "+":
            scaleTiles(upScaleRate);
            break;
        case "-":
            scaleTiles(downScaleRate);
            break;
    }
});
// scale all tiles, and adjust the offset such that board is scaled around its center
// NOTE: it turns out thats a shitty way to adjust the scale, it should be based on the center of the window instead
function scaleTiles(fac) {
    let oldHeight = tileArray[0][0].getSize() * tileArray.length;
    let oldWidth = tileArray[0][0].getSize() * tileArray[0].length;
    tileArray.forEach(row => {
        row.forEach(tile => {
            tile.size = tile.size * fac;
        })
    });
    let newHeight = tileArray[0][0].getSize() * tileArray.length;
    let newWidth = tileArray[0][0].getSize() * tileArray[0].length;
    let difX = newWidth - oldWidth;
    let difY = newHeight - oldHeight;

    offset = clampOffset(new Coordinate(offset.getX() + (difX / 2), offset.getY() + (difY / 2)));
    render.renderFrame(tileArray, offset);
}
//------------------------------------------------------------------------------------------------

// RESIZE ----------------------------------------------------------------------------------------
let timer;
window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(doResize, 200);
})

function doResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render = new Render(canvas);
    render.renderFrame(tileArray, offset);
}
//------------------------------------------------------------------------------------------------

// GET TILE FROM CLICK ---------------------------------------------------------------------------
canvas.addEventListener("click", (e) => {
    getTileFromClick(mouseLocation(e));
});

function getTileFromClick(coordinate) {
    let size = tileArray[0][0].getSize();
    let X = coordinate.getX();
    let Y = coordinate.getY();

    let n = Math.floor((Y + offset.getY()) / size);
    let r = Math.floor((X + offset.getX()) / size);
    let tile = tileArray[n][r];

    // COLOR CLICKED TILE
    tile.setColor("#F44");
    tile.setBorderColor("#911");
    render.drawTile(tile, offset);

    return tile;
}
//-----------------------------------------------------------------------------------------------

///////////////
/// RUNTIME ///
///////////////----------------------------------------------------------------------------------

init();
render.renderFrame(tileArray, new Coordinate(0, 0));
let lastTime = 0;
function loop(time) {
    let deltaTime = (time - lastTime / 1000);   // give change in time in seconds.
    lastTime = time;

    requestAnimationFrame(loop);
}

loop(0);
//------------------------------------------------------------------------------------------------


