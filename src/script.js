
import Coordinate from "./coordinate.js";
import Tile from "./tile.js";
import Render from "./render.js";

let canvas;
let tileArray = [];

function init() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tileArray = constructTileArray(100, 100);
}

function constructTileArray(rows, columns) {
    let output = [];
    for(let r = 0; i < rows; r++) {
        let row = [];
        for(let c = 0; c < columns; c++) {
            let tile = new Tile(20, new Coordinate(c, r));  // edit the 20
            row.push(tile);
        }
        output.push(row);
    }
    return output;
}


// // EVENT HANDLING
// $(window).on("resize", () => {
//     canvas.width = $(window).width();
//     canvas.height = $(window).height();
//     console.log("here");
// });

init();

const render = new Render(canvas);
let lastTime = 0;
function loop(time) {
    let deltaTime = (time - lastTime / 1000);   // give change in time in seconds.
    lastTime = time;

    render.renderFrame(tileArray);

    requestAnimationFrame(loop);
}
// loop(0);

    
