import { Coordinate } from "./coordinate.js";

export { Tile };
class Tile {
    constructor(size, coordinate) {
        this.size = size;
        this.coordinate = coordinate;
        this.color = "white";
        this.borderColor = "#777";
    }
    getSize() {
        return this.size;
    }
    setSize(s) {
        this.size = s;
    }
    setColor(color) {
        this.color = color;
    }
    setBorderColor(color) {
        this.borderColor = color;
    }

    draw(ctx, offset) {
        const X = this.coordinate.getX();
        const Y = this.coordinate.getY();
        const offX = offset.getX();
        const offY = offset.getY();

        let ul = new Coordinate((X * this.size) - offX, (Y * this.size) - offY);                            // upper left
        // let ur = new Coordinate((X * this.size) + this.size + offX, (Y * this.size) + offY);                // uppder right
        // let dl = new Coordinate((X * this.size) + offX, (Y * this.size) + this.size + offY);                // down left
        // let dr = new Coordinate((X * this.size) + this.size + offX, (Y * this.size) + this.size + offY);    // down right
        ctx.fillStyle = this.borderColor;
        ctx.fillRect(ul.getX(), ul.getY(), this.size, this.size);
        ctx.fillStyle = this.color;
        const inneroffset = 1; // can scale with some function of size?
        ctx.fillRect(ul.getX() + inneroffset, ul.getY() + inneroffset, this.size - (inneroffset), this.size - (inneroffset));
    }
}