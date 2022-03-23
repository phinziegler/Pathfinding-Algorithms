import { Queue } from "./queue.js";

export { Search };
class Search {
    constructor(engine, render) {
        this.engine = engine;
        this.render = render;
        // this.tileArray = engine.getTileArray();

        this.startTiles = [];
        this.getStartTiles(engine.getTileArray());

        this.goalTiles = [];
        this.getGoalTiles(engine.getTileArray());
    }

    getStartTiles(tileArray) {
        tileArray.forEach(row => {
            row.forEach(tile => {
                if (tile.isStart()) {
                    this.startTiles.push(tile);
                }
            });
        });
    }

    getGoalTiles(tileArray) {
        tileArray.forEach(row => {
            row.forEach(tile => {
                if (tile.isGoal()) {
                    this.goalTiles.push(tile);
                }
            });
        });
    }

    clearNeighbors(tileArray) {
        for(let r = 0; r < tileArray.length; r++) {
            for(let c = 0; c < tileArray[r].length; c++) {
                let tile = tileArray[r][c];
                tile.setNeighbors([]);
            }
        }
    }

    generateNeighbors(tileArray) {  // CANNOT HAVE A NEIGHBOR THAT IS A START TILE
        for(let r = 0; r < tileArray.length; r++) {
            for(let c = 0; c < tileArray[r].length; c++) {
                let tile = tileArray[r][c];
                tile.setParent(null);
                let neighbors = [];

                if(r > 0 && !tileArray[r - 1][c].isStart()) {
                    neighbors.push(tileArray[r - 1][c]);
                }
                if(r < tileArray.length - 1 && !tileArray[r + 1][c].isStart()) {
                    neighbors.push(tileArray[r + 1][c]);
                }
                if(c > 0 && !tileArray[r][c - 1].isStart()) {
                    neighbors.push(tileArray[r][c - 1]);
                }
                if(c < tileArray[r].length - 1 && !tileArray[r][c + 1].isStart()) {
                    neighbors.push(tileArray[r][c + 1]);
                }
                // this.shuffleArray(neighbors);   // nicer aesthetic i guess
                tile.setNeighbors(neighbors);
            }
        }
    }
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    // BREADTH FIRST SEARCH
    breadthFirst(tileArray) {

        if(this.startTiles == null || this.goalTiles == null) {
            console.log("complete, no solution");
            return;
        }
        this.generateNeighbors(tileArray);

        let frontier = new Queue();
        let visited = [];
        visited.concat(this.startTiles);

        this.startTiles.forEach(tile => {
            frontier.enqueue(tile);
        });

        while(!frontier.isEmpty()) {
            let v = frontier.dequeue();
            visited.push(v);
            if(v.isGoal()) {
                this.colorVisited(visited);
                this.colorFrontier(frontier);
                this.colorPath(v);
                console.log("found solution");
                return;                                      // IF YOU RETURN HERE, YOU ONLY REVEAL THE SOLUTION TO THE NEAREST GOAL
            }
            v.getNeighbors().forEach(neighborTile => {
                if(!neighborTile.isWall() && !visited.includes(neighborTile)) {     
                    // dont know runtime of includes(), if its O(1) then this is good, if it is O(n) need a different solution
                    frontier.enqueue(neighborTile);
                    neighborTile.setParent(v);
                    visited.push(neighborTile);
                }
            });
        }

        console.log("complete");
    }


    // THESE SHOULD BE MOVED TO RENDER.JS
    colorPath(tile) {
        let current = tile.getParent();
        // let color = this.render.randomColor();
        while(current.getParent() != null) {
            // console.log(current.id);
            current.doColored("yellow");
            this.render.drawTile(current, this.engine.getOffset());
            current = current.getParent();
        }
    }
    colorFrontier(frontier) {
        let color = "#FBB";
        frontier.forEach(tile => {
            tile.doColored(color);
            this.render.drawTile(tile, this.engine.getOffset());
        });
    }
    colorVisited(visited) {
        let color = "#CCC";
        visited.forEach(tile => {
            tile.doColored(color);
            this.render.drawTile(tile, this.engine.getOffset());
        });
    }

}