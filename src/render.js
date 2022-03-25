
export { Render };
class Render {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.offset;
        this.endAnimation = false;
        this.animating = false;
    }

    canAnim(bool) {
        this.endAnimation = !bool;
        // this.canAnim = bool;
    }
    endAnim() {
        return this.endAnimation;
    }

    isAnimating(bool) {
        this.animating = bool;
    }

    abortAnim() {
        console.log("abort");
        console.log("in the middle of anim? " + this.animating);

        if(this.animating == true) {
            this.endAnimation = true;
        }
        console.log("endAnim? " + this.endAnimation);
    }

    // abortAnim() {
    //     this.endAnimation = false;
    // }

    renderFrame(tileArray, offset) {
        this.fillCanvas("black");    // not necessary if you prevent from offsetting beyond bounds
        this.drawVisibleTiles(tileArray, offset);
        this.offset = offset;
    }

    fillCanvas(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0,0, this.width, this.height);
    }

    drawTile(tile, offset) {
        tile.draw(this.ctx, offset);
        this.offset = offset;
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
        this.offset = offset;
    }

    randomColor() {
        let hue = (Math.random() * 40) + 25;
        let sat = 100;
        let light = 50 + (Math.random() * 20);
        let col = "#" + this.hslToHex(hue, sat, light);
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


    colorBoard(frontier, visited, solutionTiles, active, offset, engine) {

        // console.log(solutionTiles);
        this.colorVisited(visited, offset);
        this.colorFrontier(frontier, offset);
        solutionTiles.forEach(tile => {
            this.colorPath(tile, offset);
        });
        this.colorActive(active, offset);
        this.renderFrame(engine.getTileArray(), offset);
    }

    colorPath(tile, offset) {
        let current = tile.getParent();
        // let color = this.render.randomColor();
        while(current.getParent() != null) {
            current.doColored("yellow");
            // this.drawTile(current, offset);
            current = current.getParent();
        }
    }
    colorFrontier(frontier, offset) {
        // console.log(frontier);
        let color = "#FBB";
        frontier.forEach(tile => {
            tile.doColored(color);
            // this.drawTile(tile, offset);
        });
    }
    colorVisited(visited, offset) {
        let color = "#CCC";
        visited.forEach(tile => {
            // console.log(tile.constructor.name)
            tile.doColored(color);
            // this.drawTile(tile, offset);
        });
    }
    colorActive(active, offset) {
        let color = "#BBF";
        active.doColored(color);
    }
        

    animateSearch(frontierFrames, visitedFrames, solutionFrames, activeFrames, engine, speed) {
        let render = this;

        let msPerFrame = 1000 / speed;  // speed is FPS
        let me = this;
        let iterations = frontierFrames.length;

        let startTime;
        let totalTime;
        let i = 0;
        animate();

        function animate(time) {
            // console.log(render.endAnim());
            if(render.endAnim()) {
                console.log("ending anim");
                render.isAnimating(false);
                render.canAnim(true);
                return;
            }

            if(render.endAnim()) {
                console.log("magically entered this location");
            }

            render.isAnimating(true);

            if(startTime == undefined) {
                startTime = time;
            }
            totalTime = time - startTime;

            if(i >= iterations) {
                me.colorBoard(frontierFrames[iterations - 1], visitedFrames[iterations - 1], solutionFrames[iterations - 1], activeFrames[iterations - 1], engine.getOffset(), engine);
                render.isAnimating(false);
                render.canAnim(true);
                return;
            }
            
            if(totalTime >= msPerFrame) {
                me.colorBoard(frontierFrames[Math.floor(i)], visitedFrames[Math.floor(i)], solutionFrames[Math.floor(i)], activeFrames[Math.floor(i)], engine.getOffset(), engine);
                i = i + (totalTime / msPerFrame);       // if total time overshoots msPerFrame by double, then i should increase by 2
                totalTime = 0;
                startTime = undefined;
            }
            requestAnimationFrame(animate);
        }
    }
}

