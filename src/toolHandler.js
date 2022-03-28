import { Search } from "./searches.js";

/*
    1. clear: clear all tiles
    2. erase: erase a single tile
    3. wall: add a wall
    4. start: place a start location
    5. goal: place a goal location
    6. zoom-out: zoom out
    7. zoom-in: zoom in
    8. drag: drag viewport
    9. search: begin search + animation
*/
export { ToolHandler };
class ToolHandler {
    constructor(engine, render) {
        this.accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent');
        this.primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color1');
        this.terniaryColor = getComputedStyle(document.documentElement).getPropertyValue('--terniary');

        this.render = render;
        this.engine = engine;


        // Add CLICK event handler to all tools.
        this.tools = Array.from(document.querySelectorAll("i"));
        this.tools.forEach(i => {
            i.addEventListener("click", () => {
                this.toolClick(i.id);
            })
        });
        this.activeTool = null;

        // Default active tool
        this.makeActive("drag");

        // How many times has the play button been pressed.
        this.anims = 0;

        // SPEED
        this.speedElem = document.getElementById("speed");
        this.speedElem.addEventListener("change", (e) => {
            this.render.setSpeed(this.getRenderSpeed());
        });
        this.render.setSpeed(this.getRenderSpeed());

        // Algorithm Switcher
        this.algoElem = document.getElementById("algorithm");

    }

    // set the render objects speed value.
    getRenderSpeed() {
        if (parseFloat(this.speedElem.value) <= 0) {
            this.speedElem.value = "0.0";
        }

        let outspeed = parseFloat(this.speedElem.value) * 60;
        return outspeed;
    }

    // What to do when a tool is clicked.
    toolClick(id) {
        switch (id) {
            case "clear":           // 1
                console.log("here");
                this.clearTiles();
                break;

            case "search":          // 9
                this.render.abortAnim();
                this.clearColoredTiles();
                let searchElem = document.getElementById("search");
                searchElem.classList.toggle("fa-stop-circle");
                if (this.anims % 2 == 0) {
                    let search = new Search(this.engine, this.render);
                    switch (this.algoElem.value) {
                        case "breadthFirst":
                            search.breadthFirst(this.engine.getTileArray());
                            break;
                        case "depthFirst":
                            search.depthFirst(this.engine.getTileArray());
                            break;
                        case "bestFirst":
                            // search.breadthFirst(this.engine.getTileArray());
                            break;
                        case "aStar":
                            // search.depthFirst(this.engine.getTileArray());
                            break;
                    }
                }
                this.anims++;
                break;

            case "erase":           // 2
                this.makeActive(id);
                break;
            case "wall":            // 3
                this.makeActive(id);
                break;
            case "start":           // 4
                this.makeActive(id);
                break;
            case "goal":            // 5
                this.makeActive(id);
                break;
            case "zoom-out":        // 6
                this.engine.zoomOut();
                break;
            case "zoom-in":         // 7
                this.engine.zoomIn();
                break;
            case "drag":            // 8
                this.makeActive(id);
                break;
        }
    }

    // Set an active tool for the engine to use.
    makeActive(id) {
        if (this.activeTool != null) {
            this.activeTool.classList.toggle("activeTool");
        }
        this.activeTool = document.getElementById(id);
        this.activeTool.classList.toggle("activeTool");
        this.engine.setTool(id);
    }

    // Clear All tiles of their color/type.
    clearTiles() {
        this.engine.getTileArray().forEach(row => {
            row.forEach(tile => {
                tile.doClear();
                this.render.drawTile(tile, this.engine.getOffset());
            });
        });
    }

    // Clears tiles without deleted starting and ending points.
    clearColoredTiles() {
        this.engine.getTileArray().forEach(row => {
            row.forEach(tile => {
                if (tile.isColored()) {
                    tile.doClear();
                }
                this.render.drawTile(tile, this.engine.getOffset());
            });
        });
    }
}