// IMPORTS
import { Coordinate } from "./coordinate.js";
import { Tile } from "./tile.js";
import { Render } from "./render.js";

export { Engine };
class Engine {
    constructor(canvas, rows, cols, size, render) {
        this.canvas = canvas;
        this.tileArray = [];
        this.activeTool;
        this.tileArray = this.constructTileArray(rows, cols, size);
        this.offset = new Coordinate(0, 0);
        this.offsetStart = null;
        this.tempOffset = new Coordinate(0, 0);
        this.render = render;
        this.oldPollLocation;
        this.mouseDown = false;

        this.painting = false;
    }

    // INITIALIZE
    init() {
        this.doResize();

        let height = this.tileArray[0][0].getSize() * this.tileArray.length;
        let width = this.tileArray[0][0].getSize() * this.tileArray[0].length;
        this.offset = this.clampOffset(new Coordinate((width / 2) - (this.canvas.width / 2), (height / 2) - (this.canvas.height / 2)));
        this.tempOffset = this.offset;
        this.render.renderFrame(this.tileArray, this.offset);
    }

    // GET TILE ARRAY
    getTileArray() {
        return this.tileArray;
    }

    getOffset() {
        if(this.tempOffset.getX() != this.offset.getX() && this.tempOffset.getX() != this.offset.getY()) {
            return this.tempOffset;
        }
        return this.offset;
    }

    // CONSTRUCT TILE ARRAY 
    constructTileArray(rows, columns, size) {
        let output = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < columns; c++) {
                let tile = new Tile(size, new Coordinate(c, r), (r + "," + c));
                row.push(tile);
            }
            output.push(row);
        }
        return output;
    }

    // GET MOUSE LOCATION FROM EVENT
    mouseLocation(e) {
        let rect = canvas.getBoundingClientRect();      // abs. size of element
        let scaleX = canvas.width / rect.width;         // relationship bitmap vs. element for X
        let scaleY = canvas.height / rect.height;       // relationship bitmap vs. element for Y

        let x = Math.floor((e.clientX - rect.left) * scaleX) + 1;
        let y = Math.floor((e.clientY - rect.top) * scaleY) + 1;
        return new Coordinate(x, y);
    }

    // SET TOOL
    setTool(id) {
        this.activeTool = id;
    }

    // SET OFFSET-------------------------------------------------------------------------------------
    clampOffset(coordinate) {
        let overshoot = 0;

        let totalHeight = this.tileArray[0][0].getSize() * this.tileArray.length;
        let totalWidth = this.tileArray[0][0].getSize() * this.tileArray[0].length;

        if (coordinate.getX() + canvas.width > totalWidth) {
            coordinate.setX(totalWidth - canvas.width);
            overshoot++;
        }
        if (coordinate.getY() + canvas.height > totalWidth) {
            coordinate.setY(totalHeight - canvas.height);
            overshoot++;
        }
        if (coordinate.getY() < 0) {
            coordinate.setY(0);
            overshoot++;
        }
        if (coordinate.getX() < 0) {
            coordinate.setX(0);
            overshoot++;
        }

        // center
        if (totalWidth < canvas.width) {
            coordinate.setX(-(canvas.width / 2) + (totalWidth / 2));
            overshoot++;
        }
        if (totalHeight < canvas.height) {
            coordinate.setY(-(canvas.height / 2) + (totalHeight / 2));
            overshoot++;
        }

        if (overshoot > 0) {
            this.render.renderFrame(this.tileArray, coordinate);
        }
        return coordinate;
    }
    //------------------------------------------------------------------------------------------------

    //////////////////
    /// MOVE TILES ///
    //////////////////--------------------------------------------------------------------------------

    // MOUSE DOWN
    handleMouseDown(e) {
        let coords = this.mouseLocation(e);
        let tile = this.getTileFromClick(coords);
        this.oldPollLocation = coords;
        this.mouseDown = true;

        // NOTE: the repetition of the paint choices is bad code, should use another method.
        switch (this.activeTool) {
            case "drag":
                this.offsetStart = coords;
                this.painting = false;
                break;
            case "wall":
                if(tile == undefined) {
                    this.endMouseDown();
                    return;
                }
                tile.doWall();
                this.render.drawTile(tile, this.offset);
                this.painting = true;
                break;
            case "start":
                if(tile == undefined) {
                    this.endMouseDown();
                    return;
                }
                tile.doStart();
                this.render.drawTile(tile, this.offset);
                this.painting = true;
                break;
            case "goal":
                if(tile == undefined) {
                    this.endMouseDown();
                    return;
                }
                tile.doGoal();
                this.render.drawTile(tile, this.offset);
                this.painting = true;
                break;
            case "erase":
                if(tile == undefined) {
                    this.endMouseDown();
                    return;
                }
                tile.doClear();
                this.render.drawTile(tile, this.offset);
                this.painting = true;
                break;
        }


    }
    // MOUSEMOVE (following mousedown)
    handleMouseMove(e) {
        if(this.mouseDown == false) {
            return;
        }
        let coords = this.mouseLocation(e);
        if(this.painting) {
            let interpolation = this.interpolateMouseMove(this.oldPollLocation, coords);
            interpolation.forEach(pos => {
                this.performMouseMove(pos);
            });
        }
        else {
            this.performMouseMove(coords);
        }
        this.oldPollLocation = coords;
    }

    interpolateMouseMove(old, current) {
        let oldx = old.getX();
        let oldy = old.getY();
        let currx = current.getX();
        let curry = current.getY();

        let rise = curry - oldy;
        let run = currx - oldx;

        let distance = Math.sqrt((currx - oldx)**2 + (curry - oldy)**2);
        // let tileSize = this.tileArray[0][0].getSize();

        let toInterp = (Math.floor(distance)) + 1;

        let output = [];
        for(let i = 1; i < toInterp; i++) {
            let x = (i * (run / toInterp)) + oldx;
            let y = (i * (rise / toInterp)) + oldy;
            output.push(new Coordinate(x, y));
        }
        // console.log(toInterp);

        return output;
    }

    performMouseMove(coords) {
        let tile = this.getTileFromClick(coords);
        switch (this.activeTool) {
            case "drag":
                if (this.offsetStart == null) {
                    return;
                }
                this.doOffset(coords);
                break;
            case "wall":
                if (this.painting == false) {
                    return;
                }
                tile.doWall();
                this.render.drawTile(tile, this.offset);
                break;
            case "start":
                if (this.painting == false) {
                    return;
                }
                tile.doStart();
                this.render.drawTile(tile, this.offset);
                break;
            case "goal":
                if (this.painting == false) {
                    return;
                }
                tile.doGoal();
                this.render.drawTile(tile, this.offset);
                break;
            case "erase":
                if (this.painting == false) {
                    return;
                }
                tile.doClear();
                this.render.drawTile(tile, this.offset);
                break;
        }
    }
    doOffset(coordinate) {
        let changeX = this.offsetStart.getX() - coordinate.getX();   // so far
        let changeY = this.offsetStart.getY() - coordinate.getY();   // so far
        let totalX = this.offset.getX() + changeX;
        let totalY = this.offset.getY() + changeY;
        this.tempOffset = this.clampOffset(new Coordinate(totalX, totalY));
        this.render.renderFrame(this.tileArray, this.tempOffset);
    }

    // END MOUSE DOWN
    endMouseDown() {
        if(this.activeTool == "drag") {
            this.offset = this.clampOffset(this.tempOffset);
            this.offsetStart = null;
        }
        this.mouseDown = false;
        this.painting = false;
    }
    //------------------------------------------------------------------------------------------------

    // ZOOM IN AND OUT--------------------------------------------------------------------------------
    zoomIn() {
        let upScaleRate = 1.25;
        // let downScaleRate = 1 / upScaleRate;
        this.scaleTiles(upScaleRate);
    }
    zoomOut() {
        let upScaleRate = 1.25;
        let downScaleRate = 1 / upScaleRate;
        this.scaleTiles(downScaleRate);
    }
    // scale all tiles, and adjust the offset such that board is scaled around its center
    // NOTE: it turns out thats a shitty way to adjust the scale, it should be based on the center of the window instead
    scaleTiles(fac) {
        let oldHeight = this.tileArray[0][0].getSize() * this.tileArray.length;
        let oldWidth = this.tileArray[0][0].getSize() * this.tileArray[0].length;
        this.tileArray.forEach(row => {
            row.forEach(tile => {
                tile.size = tile.size * fac;
            })
        });
        let newHeight = this.tileArray[0][0].getSize() * this.tileArray.length;
        let newWidth = this.tileArray[0][0].getSize() * this.tileArray[0].length;
        let difX = newWidth - oldWidth;
        let difY = newHeight - oldHeight;

        this.offset = this.clampOffset(new Coordinate(this.offset.getX() + (difX / 2), this.offset.getY() + (difY / 2)));
        this.render.renderFrame(this.tileArray, this.offset);
    }
    //------------------------------------------------------------------------------------------------

    // RESIZE ----------------------------------------------------------------------------------------
    doResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.render = new Render(canvas);
        this.render.renderFrame(this.tileArray, this.offset);
        this.offset = this.clampOffset(this.offset);
    }
    //------------------------------------------------------------------------------------------------

    // GET TILE FROM CLICK ---------------------------------------------------------------------------
    getTileFromClick(coordinate) {
        let size = this.tileArray[0][0].getSize();
        let X = coordinate.getX();
        let Y = coordinate.getY();

        let n = Math.floor((Y + this.offset.getY()) / size);
        let r = Math.floor((X + this.offset.getX()) / size);

        let tile = this.tileArray[n][r];

        return tile;
    }

    // COLOR A TILE
    colorTile(tile, color, border) {
        tile.setColor(color);
        tile.setBorderColor(border);
        this.render.drawTile(tile, this.offset);
    }

}