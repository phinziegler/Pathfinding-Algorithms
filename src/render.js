import Coordinate from "./coordinate";

export default class Render {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    RenderFrame(tileArray, offset) {
        this.fillCanvas("white");
        this.drawTiles(tileArray, offset);
    }

    fillCanvas(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0,0, this.width, this.height);
    }

    drawTiles(tileArray, offset) {
        tileArray.array.forEach(e => {
            e.draw(this.ctx);
        });
    }
}

