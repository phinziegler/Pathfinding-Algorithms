/*
    1. clear: clear all tiles
    2. erase: erase a single tile
    3. wall: add a wall
    4. start: place a start location
    5. goal: place a goal location
    6. zoom-out: zoom out
    7. zoom-in: zoom in
    8. drag: drag viewport
    9. start: begin search + animation
*/
export { ToolHandler };
import { setTool } from "./script.js";
class ToolHandler {
    constructor() {
        this.accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent');
        this.primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color1');
        this.activeTool = null;
        this.tools = Array.from(document.querySelectorAll("i"));
        this.tools.forEach(i => {
            i.addEventListener("click", () => {
                console.log(i.id);
                this.toolClick(i.id);
            })
        });
    }

    toolClick(id) {
        setTool(id);
    }
}