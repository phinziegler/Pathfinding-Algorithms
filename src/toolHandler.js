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
    constructor(engine) {
        this.accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent');
        this.primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color1');
        this.engine = engine;
        this.activeTool = null;
        this.tools = Array.from(document.querySelectorAll("i"));
        this.tools.forEach(i => {
            i.addEventListener("click", () => {
                this.toolClick(i.id);
            })
        });
    }

    toolClick(id) {
        console.log(id);
        switch (id) {
            case "clear":           // 1
                // do something 
                break;
            case "erase":           // 2
                // do something 
                break;
            case "wall":            // 3
                // do something 
                break;
            case "start":           // 4
                // do something 
                break;
            case "goal":            // 5
                // do something 
                break;
            case "zoom-out":        // 6
                // do something 
                break;
            case "zoom-in":         // 7
                // do something 
                break;
            case "drag":            // 8
                // do something 
                break;
            case "search":           // 9
                // do something 
                break;
            default:
                console.error("Unimplemented tool '" + id + "' passed to toolClick()");
        }
    }
}