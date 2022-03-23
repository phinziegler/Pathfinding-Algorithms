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

    drawTile(tile, offset) {
        tile.draw(this.ctx, offset);
    }

    drawVisibleTiles(tileArray, offset) {
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

        let drawn = 0;
        // Draw Tiles
        for(let row = t; row < tileArray.length - b; row++) {
            for(let col = l; col < tileArray[row].length - r; col++) {
                tileArray[row][col].draw(this.ctx, offset);
                // drawn++;
            }
        }
        // console.log(drawn + " tiles drawn");
    }

    randomColor() {
        let hue = (Math.random() * 40) + 25;
        let sat = 100;
        let light = 50 + (Math.random() * 20);
        let col = "#" + this.hslToHex(hue, sat, light);
        // console.log(col);
        return col;
    }
    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
        };
        const result = `${f(0)}${f(8)}${f(4)}`;
        return result;
    }
}

