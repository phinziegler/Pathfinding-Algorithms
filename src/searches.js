import { Queue } from "./queue.js";

export { Search };
class Search {
    constructor(engine, render, speed) {
        this.engine = engine;
        this.render = render;
        // this.tileArray = engine.getTileArray();

        this.startTiles = [];
        this.getStartTiles(engine.getTileArray());

        this.goalTiles = [];
        this.getGoalTiles(engine.getTileArray());

        this.frontierFrames = [];   // contains the frontier at each step
        this.visitedFrames = [];    // contains the visited tiles at each step
        this.solutionFrames = [];   // contains the solutions at each step
        this.activeFrames = [];

        this.speed = speed; // in terms of 'state frames per second'
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
        let solutionTiles = [];
        
        visited.concat(this.startTiles);

        this.startTiles.forEach(tile => {
            frontier.enqueue(tile);
        });

        while(!frontier.isEmpty()) {

            let v = frontier.dequeue();
            visited.push(v);
            this.activeFrames.push(v);

            if(v.isGoal()) {
                console.log("found solution");

                solutionTiles.push(v);
                if(solutionTiles.length == this.goalTiles.length) {
                    this.populateFrames(frontier.toArray(), visited, solutionTiles);
                    this.render.animateSearch(this.frontierFrames, this.visitedFrames, this.solutionFrames, this.activeFrames, this.engine, this.speed);
                    return;
                }
                // return;  // IF YOU RETURN HERE, YOU ONLY REVEAL THE SOLUTION TO THE NEAREST GOAL
            }
            v.getNeighbors().forEach(neighborTile => {
                if(!neighborTile.isWall() && !visited.includes(neighborTile)) {     
                    // dont know runtime of includes(), if its O(1) then this is good, if it is O(n) need a different solution
                    frontier.enqueue(neighborTile);
                    neighborTile.setParent(v);
                    visited.push(neighborTile);
                }
            });


            this.populateFrames(frontier.toArray(), visited, solutionTiles);
        }
        console.log("complete");
        this.render.animateSearch(this.frontierFrames, this.visitedFrames, this.solutionFrames, this.activeFrames, this.engine, this.speed);
        return;
    }

    populateFrames(frontier, visited, solutionTiles) {

        let frontierRow = [].concat(frontier);
        let visitedRow = [].concat(visited);
        let solutionTilesRow = [].concat(solutionTiles);

        this.frontierFrames.push(frontierRow);
        this.visitedFrames.push(visitedRow);
        this.solutionFrames.push(solutionTilesRow);
    }

}