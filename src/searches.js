import { Queue } from "./dataStructures/queue.js";

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

        this.frontierFrames = [];   // contains the frontier at each step
        this.visitedFrames = [];    // contains the visited tiles at each step
        this.solutionFrames = [];   // contains the solutions at each step
        this.activeFrames = [];
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
        // Dont do anything if there are no start tiles
        if(this.startTiles.length == 0) {
            console.log("No start position.");
            return;
        }

        // Find the neighbors of each tile.
        this.generateNeighbors(tileArray);
        
        // Create frontier and visited list
        let frontier = new Queue();
        let visited = new Set();
        
        // Populate visited
        this.startTiles.forEach(tile => {
            visited.add(tile);
        });
        this.startTiles.forEach(tile => {
            frontier.enqueue(tile);
        });

        let solutionTiles = [];         // used for render

        while(!frontier.isEmpty()) {
            let v = frontier.dequeue();
            this.activeFrames.push(v);  // for render

            if(v.isGoal()) {
                console.log("found solution");

                solutionTiles.push(v);

                // end?
                if(solutionTiles.length == this.goalTiles.length) {
                    this.populateFrames(frontier.toArray(), visited, solutionTiles);        // for render
                    this.render.animateSearch(this.frontierFrames, this.visitedFrames, this.solutionFrames, this.activeFrames, this.engine, "breadthFirst");    // for render
                    return;
                }
                // return;  // IF YOU RETURN HERE, YOU ONLY REVEAL THE SOLUTION TO THE NEAREST GOAL
            }
            v.getNeighbors().forEach(neighborTile => {
                if(!neighborTile.isWall() && !visited.has(neighborTile)) {     
                    frontier.enqueue(neighborTile);
                    visited.add(neighborTile);
                    neighborTile.setParent(v);      // used to track the path taken to that tile.
                }
            });

            this.populateFrames(frontier.toArray(), visited, solutionTiles);
        }
        console.log("complete");
        this.render.animateSearch(this.frontierFrames, this.visitedFrames, this.solutionFrames, this.activeFrames, this.engine, "breadthFirst");
        return;
    }

    /* DEPTH FIRST
    1. Start by putting any one of the graph's vertices on top of a stack.
    2. Take the top item of the stack and add it to the visited list.
    3. Create a list of that vertex's adjacent nodes. Add the ones which aren't in the visited list to the top of the stack.
    4. Keep repeating steps 2 and 3 until the stack is empty. */
    depthFirst(tileArray) {
        if(this.startTiles.length == 0) {
            console.log("No start position.");
            return;
        }

        let stack = []; // use push() and pop() --> this is the frontier
        let visited = new Set();

        this.generateNeighbors(tileArray);

        this.startTiles.forEach(tile => {
            visited.add(tile);
        });
        this.startTiles.forEach(tile => {
            stack.push(tile);
        });

        let solutionTiles = [];

        while(stack.length > 0) {
            // console.log("here1");

            let v = stack.pop();
            visited.add(v);

            this.activeFrames.push(v);

            if(v.isGoal()) {
                console.log("found solution");
                solutionTiles.push(v);

                // End?
                if(solutionTiles.length == this.goalTiles.length) {
                    this.populateFrames(stack, visited, solutionTiles);        // for render
                    this.render.animateSearch(this.frontierFrames, this.visitedFrames, this.solutionFrames, this.activeFrames, this.engine, "depthFirst");    // for render
                    return;
                }
            }

            // console.log(v.getNeighbors());
            v.getNeighbors().forEach(neighborTile => {
                if(!neighborTile.isWall() && !visited.has(neighborTile)) {   

                    stack.push(neighborTile);
                    // console.log("here2");
                    // visited.add(neighborTile);
                    neighborTile.setParent(v);      // used to track the path taken to that tile.
                }
            });

            this.populateFrames(stack, visited, solutionTiles);
        }
        console.log("complete");
        this.render.animateSearch(this.frontierFrames, this.visitedFrames, this.solutionFrames, this.activeFrames, this.engine, "depthFirst");
        return;
    }

    // Create render frames
    populateFrames(frontier, visited, solutionTiles) {
        let frontierRow = [].concat(frontier);
        let visitedRow = Array.from(visited);
        let solutionTilesRow = [].concat(solutionTiles);

        this.frontierFrames.push(frontierRow);
        this.visitedFrames.push(visitedRow);
        this.solutionFrames.push(solutionTilesRow);
    }

    aStar(tileArray) {
         // Dont do anything if there are no start tiles
         if(this.startTiles.length == 0) {
            console.log("No start position.");
            return;
        }

        // Find the neighbors of each tile.
        this.generateNeighbors(tileArray);
        
        // Create frontier and visited list
        let frontier = new Queue();
        let visited = new Set();
        
        // Populate visited
        this.startTiles.forEach(tile => {
            visited.add(tile);
        });
        this.startTiles.forEach(tile => {
            frontier.enqueue(tile);
        });
    }

    heuristic(tile) {

    }

}