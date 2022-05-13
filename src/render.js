
export { Render };
class Render {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.endAnimation = false;
        this.animating = false;

        this.speed = parseFloat(document.getElementById("speed").value);
    }

    // Determines the speed that animations occur ---------
    setSpeed(speed) {
        this.speed = speed;
    }
    getSpeed() {
        return this.speed;
    }
    // ----------------------------------------------------

    // Handle Early Exit on animation ------------------------------------
    canAnim(bool) {
        this.endAnimation = !bool;
    }
    endAnim() {
        return this.endAnimation;
    }
    isAnimating(bool) {
        this.animating = bool;
    }
    abortAnim() {
        if(this.animating == true) {
            this.endAnimation = true;
        }
    }
    // -------------------------------------------------------------------
    
    // DRAW TILES AND FRAMES ------------------------------------------------------------------------------------
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
    // --------------------------------------------------------------------------------------------------------


    // HELPERS FOR ANIMATE ------------------------------------------------------------------------------------
    colorBoard(frontier, visited, solutionTiles, active, engine, pattern) {
        switch(pattern) {
            case "breadthFirst":
                this.colorVisited(visited);
                this.colorFrontier(frontier);
                break;
            case "depthFirst":
                this.colorFrontier(frontier);
                this.colorVisited(visited);
                break;
            case "aStar":
                this.colorVisited(visited);
                this.colorFrontier(frontier);
                break;
        }
        solutionTiles.forEach(tile => {
            this.colorPath(tile);
        });
        this.colorActive(active);
        this.renderFrame(engine.getTileArray(), engine.getOffset());
    }
    colorPath(tile) {
        let current = tile.getParent();
        while(current.getParent() != null) {
            current.doColored("yellow");
            current = current.getParent();
        }
    }
    colorFrontier(frontier) {
        let color = "#FBB";
        frontier.forEach(tile => {
            tile.doColored(color);
        });
    }
    colorVisited(visited) {
        let color = "#CCC";
        visited.forEach(tile => {
            tile.doColored(color);
        });
    }
    colorActive(active) {
        let color = "#BBF";
        active.doColored(color);
    }
    // ---------------------------------------------------------------------------------------------------
        
    // ANIMATE SEARCH FRAMES
    animateSearch(frontierFrames, visitedFrames, solutionFrames, activeFrames, engine, pattern) {
        let render = this;
        let iterations = frontierFrames.length;

        let startTime;
        let totalTime;
        let i = 0;
        let msPerFrame;
        let speed = render.getSpeed();
        animate();

        // ANIMATION LOOP
        function animate(time) {
            // Detect Speed Change
            if(render.getSpeed() != speed) {
                totalTime = 0;
                startTime = undefined;
                speed = render.getSpeed();
            }
            speed = render.getSpeed();
            msPerFrame = 1000 / speed;
            
            // End Animation Early
            if(render.endAnim()) {
                render.isAnimating(false);
                render.canAnim(true);
                return;
            }
            render.isAnimating(true);

            // Occurs on new frame.
            if(startTime == undefined) {
                startTime = time;
            }
            totalTime = time - startTime;

            // Final Frame
            if(i >= iterations) {
                render.colorBoard(frontierFrames[iterations - 1], visitedFrames[iterations - 1], solutionFrames[iterations - 1], activeFrames[iterations - 1], engine, pattern);
                render.isAnimating(false);
                render.canAnim(true);
                return;
            }
            
            // Render the next frame.
            if(totalTime >= msPerFrame) {
                render.colorBoard(frontierFrames[Math.floor(i)], visitedFrames[Math.floor(i)], solutionFrames[Math.floor(i)], activeFrames[Math.floor(i)], engine, pattern);
                i = i + (totalTime / msPerFrame);       // if total time overshoots msPerFrame by double, then i should increase by 2
                totalTime = 0;
                startTime = undefined;
            }

            requestAnimationFrame(animate);
        }
    }
}

