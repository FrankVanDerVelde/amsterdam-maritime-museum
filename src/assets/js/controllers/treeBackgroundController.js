/**
 * Controller for the calculator
 */

import { Controller } from "./controller.js";

export class TreeBackgroundController extends Controller {
    #treeBackgroundView;
    #canvasApp;
    #textureSheet;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#treeBackgroundView = await super.loadHtmlIntoContent("html_views/treeCanvas.html");

        await this.#setUpCanvas();
        // await this.#createTrees();
        await this.#createTrees();
    }

     async #setUpCanvas() {
        // Get the div that will hold the canvas
        const canvasDiv = this.#treeBackgroundView.querySelector("#canvas-box");

        // Setup the pixi app
        const app = new PIXI.Application({
            transparent: true,
            autoResize: true,
            width: canvasDiv.offsetWidth,
            height: canvasDiv.offsetHeight,
            resolution: devicePixelRatio,
            autoDensity: true
        });
            
        // Promise to make sure the spritesheet is loaded before putting it into #textureSheet.
        const spriteSheetLoaderPromise = new Promise(function(myResolve, myReject) {
            try {
                PIXI.Loader.shared.add("assets/images/trees/treespritesheet.json").load(myResolve);
            } catch {
                console.log('Error while loading spritesheet');
                myReject();
            }
        });
        await spriteSheetLoaderPromise;
        this.#textureSheet = PIXI.Loader.shared.resources["assets/images/trees/treespritesheet.json"].spritesheet;

        // Append the canvas to the chosen div with the pixi app settings
        canvasDiv.appendChild(app.view);

        const canvas = app.view;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Resize ability for canvas
        window.addEventListener('resize', resize);

        function resize() {
            // app.renderer.resize(window.innerWidth, (window.innerHeight / 100) * 60);
            app.renderer.resize(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
        }
        resize();

        this.#canvasApp = app;
    }

    async #createTrees() {
        const sheet = this.#textureSheet;
        // amount of unique trees in the assets folder
        const uniqueTreeAssets = 5;
        // The offset from the edges of the screen in pixels
        const offSet = 50;
        // Total amount of tree's that should be on the screen
        let totalTrees = 0;
        // The array that hold all the tree specials
        const treesArray = [];

        function getRandomX() {
            const min = Math.floor(0) + offSet;
            const max = Math.ceil(canvas.renderer.width) - offSet;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getRandomY() {
            const min = Math.floor(0) + offSet;
            const max = Math.ceil(canvas.renderer.height) - offSet;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const verbruikInput = this.#treeBackgroundView.querySelector("#verbruik");
        const afstandInput = this.#treeBackgroundView.querySelector("#afstand");

        let canvas = this.#canvasApp;
    
        verbruikInput.addEventListener("change", function() { 
            totalTrees = parseInt(verbruikInput.value) + parseInt(afstandInput.value);
            updateTrees();
        });

        afstandInput.addEventListener("change", function() {
            totalTrees = parseInt(verbruikInput.value) + parseInt(afstandInput.value);
            updateTrees();
        });

        function updateTrees() {
            if (treesArray.length < totalTrees) {
                while (treesArray.length < totalTrees) {
                    createTree()
                }
            } else if (treesArray.length > totalTrees) {
                while (treesArray.length > totalTrees) {
                    treesArray[treesArray.length - 1].destroy();
                    treesArray.pop()
                }
            }
        }

        function createTree() {
                let sprite = PIXI.Sprite.from(sheet.textures[`tree${Math.floor(Math.random() * (uniqueTreeAssets - 1))}.png`]);

                let position;

                treesArray.length < 15 ? position = {x: getRandomX(), y: getRandomY()} : position = getEmptyPosition(canvas.renderer.height, canvas.renderer.width);
                // if (treesArray.length < 15) {
                //     position = {x: getRandomX(), y: getRandomY()}
                //     console.log(treesArray[0])
                //     while (treesArray.every(tree => {
                //         console.log('looping')
                //         return (position.x > tree.x + 70 || position.x < tree.x - 70) && (position.y > tree.y + 70 || position.y < tree.y - 70)}) == false)
                //         {
                //         position = {x: getRandomX(), y: getRandomY()}
                //     }
                // } else {
                //     position = getEmptyPosition(canvas.renderer.height, canvas.renderer.width);
                // }

                console.log(position);
    
                sprite.x = position.x;
                sprite.y = position.y;
    
                sprite.width = 70;
                sprite.height = 70;
    
                canvas.stage.addChild(sprite);
                
                // Add the reference to the sprite to an array
                treesArray.push(sprite);
        }
        
        // A function to get the tree position, that considers the position and size of other elements to avoid clipping
        function getEmptyPosition(canvasHeight, canvasWidth) {
                const gridWidth = 48; // We will caculate gridHeight based on window size 48

                const cellSize = window.innerWidth / gridWidth;
                const gridHeight = Math.ceil(canvasHeight / cellSize); // calculate gridHeight
    
                // cache border coords array since it's never changed
                console.log(gridWidth, gridHeight)
                const borderCoords = getBorderCoords(gridWidth, gridHeight);

                const start = new Date();
    
                // Perform a BFS from all stars to find distance of each rect from closest star
                // After BFS visitedCoords will be an array of all grid rect, with distance-from-star (weight) sorted in ascending order
                console.log(borderCoords);
    
                var bfsFrontier = borderCoords.concat(
                    getGridCoordinateOfTrees(treesArray, cellSize).map(coord => ({ ...coord, weight: 0 }))
                );
    
                var visitedCoords = [...bfsFrontier];
    
                while (bfsFrontier.length > 0) {
                    const current = bfsFrontier.shift();
                    const neighbors = getNeighbors(current, gridWidth, gridHeight);
 
                    for (let neighbor of neighbors) {
                        if (visitedCoords.findIndex(weightedCoord => coordsEqual(weightedCoord, neighbor)) === -1) {
                            visitedCoords.push(neighbor);
                            bfsFrontier.push(neighbor);
                        }
                    }
                }
    
                const emptiestCoord = visitedCoords[visitedCoords.length - 1];
                const emptiestPosition = {
                    x: (emptiestCoord.x + 0.5) * cellSize,
                    y: (emptiestCoord.y + 0.5) * cellSize
                }
                console.log(emptiestPosition);
                return emptiestPosition;
            }
    
            const getBorderCoords = (gridWidth, gridHeight) => {
                var borderCoords = [];
                for (var x = 0; x < gridWidth; x++) {
                    for (var y = 0; y < gridHeight; y++) {
                        if (x === 0 || y === 0 || x === gridWidth - 1 || y === gridHeight - 1) borderCoords.push({ x, y, weight: 0 })
                    }
                }
    
                return borderCoords;
            }
    
            // Convert star position to grid coordinate and filter out duplicates
            const getGridCoordinateOfTrees = (trees, cellSize) => trees.map(tree => (
                {
                x: Math.floor(tree.x / cellSize),
                y: Math.floor(tree.y / cellSize)
            }
            )
            )
    
            const uniqueCoord = (arr) => arr.filter((candidate, index) => arr.findIndex(item => coordsEqual(item, candidate)) === index);
    
            const coordsEqual = (coord1, coord2) => coord1.x === coord2.x && coord1.y === coord2.y;
    
            const getNeighbors = (weightedCoord, gridWidth, gridHeight) => {
                var result = [];
                if (weightedCoord.x > 0) result.push({ x: weightedCoord.x - 1, y: weightedCoord.y, weight: weightedCoord.weight + 1 })
                if (weightedCoord.x < gridWidth - 1) result.push({ x: weightedCoord.x + 1, y: weightedCoord.y, weight: weightedCoord.weight + 1 })
    
                if (weightedCoord.y > 0) result.push({ x: weightedCoord.x, y: weightedCoord.y - 1, weight: weightedCoord.weight + 1 })
                if (weightedCoord.y < gridHeight - 1) result.push({ x: weightedCoord.x, y: weightedCoord.y + 1, weight: weightedCoord.weight + 1 })
    
                return result;
            
        }
    }


}