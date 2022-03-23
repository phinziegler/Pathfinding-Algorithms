import { Coordinate } from "./coordinate.js";

export { Tile };
class Tile {
    constructor(size, coordinate, id) {
        this.size = size;
        this.coordinate = coordinate;

        this.id = id;

        this.color = "white";
        this.borderColor = "#777";

        this.wall = false;
        this.start = false;
        this.goal = false;
        this.clear = true;
        this.colored = false;

        this.clearCols = ["white", "#777"];
        this.startCols = ["#4A4", "#252"];
        this.goalCols = ["#A44", "#522"];
        this.wallCols = ["#666", "#333"];

        this.neighbors = [];

        this.parent = null;
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
    setNeighbors(neighbors) {
        this.neighbors = neighbors;
    }
    getNeighbors() {
        return this.neighbors;
    }
    setParent(parent) {
        this.parent = parent;
    }
    getParent() {
        return this.parent;
    }


    isWall() {
        return this.wall;
    }
    isClear() {
        return this.clear;
    }
    isStart() {
        return this.start;
    }
    isGoal() {
        return this.goal;
    }
    isColored() {
        return this.colored;
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
        this.colored = false;

        this.color = this.clearCols[0];
        this.borderColor = this.clearCols[1];
    }

    doWall() {
        this.wall = true;
        this.start = false;
        this.goal = false;
        this.clear = false;
        this.colored = false;

        this.color = this.wallCols[0];
        this.borderColor = this.wallCols[1];
    }

    doStart() {
        this.wall = false;
        this.start = true;
        this.goal = false;
        this.clear = false;
        this.colored = false;

        this.color = this.startCols[0];
        this.borderColor = this.startCols[1];
    }

    doGoal() {
        this.wall = false;
        this.start = false;
        this.goal = true;
        this.clear = false;
        this.colored = false;

        this.color = this.goalCols[0];
        this.borderColor = this.goalCols[1];
    }

    doColored(color) {
        if(!this.isClear()) {
            return;
        }
        this.colored = true;
        this.color = color;
        this.borderColor = "grey";
    }
}