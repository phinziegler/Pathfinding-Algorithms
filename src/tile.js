import { Coordinate } from "./coordinate.js";

export { Tile };
class Tile {
    constructor(size, coordinate) {
        this.size = size;
        this.coordinate = coordinate;

        this.color = "white";
        this.borderColor = "#777";

        this.wall = false;
        this.start = false;
        this.goal = false;
        this.clear = true;

        this.clearCols = ["white","#777"];
        this.startCols = ["#4A4", "#252"];
        this.goalCols = ["#A44", "#522"];
        this.wallCols = ["#666", "#333"];

        // this.clear();
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
        const inneroffset = 2; // can scale with some function of size?
        ctx.fillRect(ul.getX() + (inneroffset / 2), ul.getY() + (inneroffset / 2), this.size - (inneroffset), this.size - (inneroffset));
    }

    doClear() {
        this.wall = false;
        this.start = false;
        this.goal = false;
        this.clear = true;

        this.color = this.clearCols[0];
        this.borderColor = this.clearCols[1];
    }

    doWall() {
        this.wall = true;
        this.start = false;
        this.goal = false;
        this.clear = false;

        this.color = this.wallCols[0];
        this.borderColor = this.wallCols[1];
    }

    doStart() {
        this.wall = false;
        this.start = true;
        this.goal = false;
        this.clear = false;

        this.color = this.startCols[0];
        this.borderColor = this.startCols[1];
    }

    doGoal() {
        this.wall = false;
        this.start = false;
        this.goal = true;
        this.clear = false;

        this.color = this.goalCols[0];
        this.borderColor = this.goalCols[1];
    }
}