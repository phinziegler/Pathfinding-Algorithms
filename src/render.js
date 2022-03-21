export { Render };
class Render {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    renderFrame(tileArray, offset) {
        this.fillCanvas("black");    // not necessary if you prevent from offsetting beyond bounds
        this.drawVisibleTiles(tileArray, offset);
    }

    fillCanvas(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0,0, this.width, this.height);
    }

    // drawTiles(tileArray, offset) {
    //     tileArray.forEach(row => {
    //         row.forEach(tile => {
    //             tile.draw(this.ctx, offset);
    //         })
    //     });
    // }

    drawVisibleTiles(tileArray, offset) {
        let drawn = 0;
        let size = tileArray[0][0].getSize();

        let windowHeight = window.innerHeight;
        let windowWidth = window.innerWidth;

        // Cutoff Top
        let t = Math.floor(offset.getY() / size); // dont render the first r rows
        if (t < 0) {
            t = 0;
        }
        // Cutoff Bottom
        let tileFloor = (size * tileArray.length) - offset.getY();
        let b = Math.floor((tileFloor - windowHeight) / size);
        if (b < 0) {
            b = 0;
        }
        // Cutoff Left
        let l = Math.floor(offset.getX() / size);
        if (l < 0) {
            l = 0;
        }
        // Cutoff Right
        let tileRight = (size * tileArray[0].length) - offset.getX();
        let r = Math.floor((tileRight - windowWidth) / size);
        if (r < 0) {
            r = 0;
        }

        for(let row = t; row < tileArray.length - b; row++) {
            for(let col = l; col < tileArray[row].length - r; col++) {
                drawn++;
                tileArray[row][col].draw(this.ctx, offset);
            }
        }
        // console.log("drew " + drawn + " tiles.");
    }
}

