import { Queue } from "./dataStructures/queue.js";
import { PriorityQueue } from "./dataStructures/priorityQueue.js";

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
        for (let r = 0; r < tileArray.length; r++) {
            for (let c = 0; c < tileArray[r].length; c++) {
                let tile = tileArray[r][c];
                tile.setNeighbors([]);
            }
        }
    }

    generateNeighbors(tileArray) {  // CANNOT HAVE A NEIGHBOR THAT IS A START TILE
        for (let r = 0; r < tileArray.length; r++) {
            for (let c = 0; c < tileArray[r].length; c++) {
                let tile = tileArray[r][c];
                tile.setParent(null);
                let neighbors = [];

                if (r > 0 && !tileArray[r - 1][c].isStart()) {
                    neighbors.push(tileArray[r - 1][c]);
                }
                if (r < tileArray.length - 1 && !tileArray[r + 1][c].isStart()) {
                    neighbors.push(tileArray[r + 1][c]);
                }
                if (c > 0 && !tileArray[r][c - 1].isStart()) {
                    neighbors.push(tileArray[r][c - 1]);
                }
                if (c < tileArray[r].length - 1 && !tileArray[r][c + 1].isStart()) {
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
        if (this.startTiles.length == 0) {
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

        while (!frontier.isEmpty()) {
            let v = frontier.dequeue();
            this.activeFrames.push(v);  // for render

            if (v.isGoal()) {
                console.log("found solution");

                solutionTiles.push(v);
                this.populateFrames(frontier.toArray(), visited, solutionTiles);        // for render
                this.render.animateSearch(this.frontierFrames, this.visitedFrames, this.solutionFrames, this.activeFrames, this.engine, "breadthFirst");    // for render
                return;
                // return;  // IF YOU RETURN HERE, YOU ONLY REVEAL THE SOLUTION TO THE NEAREST GOAL
            }
            v.getNeighbors().forEach(neighborTile => {
                if (!neighborTile.isWall() && !visited.has(neighborTile)) {
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
        if (this.startTiles.length == 0) {
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

        while (stack.length > 0) {
            let v = stack.pop();
            visited.add(v);

            this.activeFrames.push(v);

            if (v.isGoal()) {
                console.log("found solution");
                solutionTiles.push(v);

                this.populateFrames(stack, visited, solutionTiles);        // for render
                this.render.animateSearch(this.frontierFrames, this.visitedFrames, this.solutionFrames, this.activeFrames, this.engine, "depthFirst");    // for render
                return;
            }

            v.getNeighbors().forEach(neighborTile => {
                if (!neighborTile.isWall() && !visited.has(neighborTile)) {

                    stack.push(neighborTile);
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


    /*  A* SEARCH  */
    aStar(tileArray) {
        // Dont do anything if there are no start tiles
        if (this.startTiles.length == 0) {
            console.log("No start position.");
            return;
        }

        // animation data
        let solutionTiles = [];     // for rendering
        let visited = [];           // for rendering

        // Lookup table for tile g and h costs.
        let costs = this.generateCostLookup(tileArray);
        function lookup(tile) {
            return costs[tile.getCoordinates().getX()][tile.getCoordinates().getY()];
        }

        // Find the neighbors of each tile.
        this.generateNeighbors(tileArray);

        // Create frontier --> uses a priority queue and a parallel Set. The addOpen function adds an element to both.
        let openQueue = new PriorityQueue(tile => {
            let info = lookup(tile);
            let value = info.gCost + info.hCost;
            return value;
        }, "min");
        let openSet = new Set();    // I'm gobbling memory but its faster for contains()
        function addOpen(element) {
            openSet.add(element);
            openQueue.enqueue(element);
        }

        // Initialize the search using the start tiles.
        this.startTiles.forEach(tile => {
            addOpen(tile);
            visited.push(tile);
            let tileCost = lookup(tile);
            tileCost.gCost = 0;
        });

        while (!openQueue.isEmpty()) {

            // grab lowest fCost item, and remove it from OPEN
            let current = openQueue.dequeue();
            openSet.delete(current);
            this.activeFrames.push(current);
            visited.push(current);

            // lookup the cost values of the item
            let currCost = lookup(current);

            // check if you found the solution
            if (current.isGoal()) {
                console.log("Found Solution");
                solutionTiles.push(current);

                this.populateFrames(openQueue.toArray(), visited, solutionTiles);
                this.render.animateSearch(this.frontierFrames, this.visitedFrames, this.solutionFrames, this.activeFrames, this.engine, "aStar");


                return;
            }


            // for ever neighbor tile of current...
            current.getNeighbors().forEach(neighbor => {
                if (!neighbor.isWall()) {                   // first of all, check that the neighbor is not a wall. If it is not a wall....
                    let neighborCost = lookup(neighbor);

                    let gGuess = currCost.gCost + 1;
                    if (gGuess < neighborCost.gCost) {      // if true, you have found a shorter path to this node.
                        neighbor.setParent(current);
                        neighborCost.gCost = gGuess;

                        if (!openSet.has(neighbor)) {
                            addOpen(neighbor);
                        }
                    }
                }
            });
            this.populateFrames(openQueue.toArray(), visited, solutionTiles);
        }
        this.render.animateSearch(this.frontierFrames, this.visitedFrames, this.solutionFrames, this.activeFrames, this.engine, "aStar");
        console.log("complete");
    }

    // Generate a lookup table for the tile costs, used by A*
    generateCostLookup(tileArray) {
        let table = [];
        for (let r = 0; r < tileArray.length; r++) {         // for each row
            let row = [];
            for (let c = 0; c < tileArray[r].length; c++) {  // for each col

                let g = Infinity;
                if(tileArray[c][r].isStart()) {
                    g = 0;
                }

                let tableObject = {
                    tile: tileArray[c][r],
                    gCost: g,
                    hCost: this.heuristic(tileArray[c][r]),
                }
                row.push(tableObject);
            }
            table.push(row);
        }
        return table;
    }

    // Manhattan Distance Heuristic used by A*
    heuristic(tile) {
        let min = Infinity;
        let coords1 = tile.getCoordinates();
        let x1 = coords1.getX();
        let y1 = coords1.getY();

        this.goalTiles.forEach(goal => {
            let coords2 = goal.getCoordinates();
            let x2 = coords2.getX();
            let y2 = coords2.getY();

            let val = Math.abs(x2 - x1) + Math.abs(y2 - y1);

            if (val < min) {
                min = val;
            }
        });

        return min;
    }

}