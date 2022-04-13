/**
 * Controller for the calculator
 */

import { Controller } from "./controller.js";

export class TreeBackgroundController extends Controller {
    #treeBackgroundView;
    #canvasApp;
    #textureSheet;
    #gridSquares = [];
    #baseTreeDimension = 70;

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
        const spriteSheetLoaderPromise = new Promise(function (myResolve, myReject) {
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

        // canvas.width = canvasDiv.offsetWidth;
        // canvas.height = canvasDiv.offsetHeight;
        const treeDimension = this.#baseTreeDimension;

        const xSquares = Math.floor(canvasDiv.offsetWidth / treeDimension)
        const ySquares = Math.floor(canvasDiv.offsetHeight / treeDimension)

        for (let x = 0; x < xSquares; x++) {
            for (let y = 0; y < ySquares; y++) {
                this.#gridSquares.push({
                    xBaseCoordinate: x * treeDimension + treeDimension,
                    yBaseCoordinate: y * treeDimension - treeDimension,
                    spriteReference: null,
                })
            }
        }
        console.log(this.#gridSquares);

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
        let canvas = this.#canvasApp;
        const sheet = this.#textureSheet;
        const treeDimension = this.#baseTreeDimension;
        const placementGrid = this.#gridSquares;
        // amount of unique trees in the assets folder
        const uniqueTreeAssets = 5;
        // The offset from the edges of the screen in pixels
        const offSet = treeDimension / 2;
        // Total amount of tree's that should be on the screen
        let totalTrees = 0;
        // The array that hold all the tree sprites

        function getRandomX() {
            const min = Math.floor(0);
            const max = Math.ceil(canvas.renderer.width / 2.5) + offSet;
            console.log('x', min, max)
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getRandomY() {
            const min = Math.floor(0) - offSet;
            const max = Math.ceil(canvas.renderer.height / 2.5);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const verbruikInput = this.#treeBackgroundView.querySelector("#verbruik");
        const afstandInput = this.#treeBackgroundView.querySelector("#afstand");

        verbruikInput.addEventListener("change", function () {
            totalTrees = parseInt(verbruikInput.value) + parseInt(afstandInput.value);
            updateTrees();
        });

        afstandInput.addEventListener("change", function () {
            totalTrees = parseInt(verbruikInput.value) + parseInt(afstandInput.value);
            updateTrees();
        });

        function updateTrees() {
            // Filter for visible sprites by checking grid spaces without a sprite reference and then ones with visible sprites
            let visibleTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == true);
            if (visibleTrees.length < totalTrees) {
                while (visibleTrees.length < totalTrees) {
                    createTree();
                    visibleTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == true)
                }
            } else if (visibleTrees.length > totalTrees) {
                // while (visibleTrees.length > totalTrees) {
                //     visibleTrees[treesArray.length - 1].destroy();
                //     visibleTrees.pop()
                // }
            }
        }

        
        function createTree() {
            let sprite = PIXI.Sprite.from(sheet.textures[`tree${Math.floor(Math.random() * (uniqueTreeAssets - 1))}.png`]);
            
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

            // Check for all the possible empty grid spaces
            const emptyGridSpaces = placementGrid.filter(gridObject => gridObject.spriteReference == null);

            // Randomly choose a random grid space to use
            const targetEmptySpace = emptyGridSpaces[Math.floor(Math.random() * placementGrid.length)];
            console.log(targetEmptySpace);

            // Get the index of the selected space in the original array
            const getIndexOfSelectedSpace = (gridSpace) => gridSpace.xBaseCoordinate == targetEmptySpace.xBaseCoordinate && gridSpace.yBaseCoordinate == targetEmptySpace.yBaseCoordinate;
            console.log(placementGrid);
            const gridSpaceIndex = placementGrid.findIndex(getIndexOfSelectedSpace);
            

            sprite.x = targetEmptySpace.xBaseCoordinate + Math.random() * (treeDimension / 2);
            sprite.y = targetEmptySpace.yBaseCoordinate + Math.random() * (treeDimension / 2);

            const min = Math.floor(treeDimension - ((treeDimension/100)*30));
            const max = Math.ceil(treeDimension + ((treeDimension/100)*30));
            const variableSize = Math.floor(Math.random() * (max - min + 1)) + min;

            sprite.width = variableSize;
            sprite.height = variableSize;

            // Sets the sprites anchor to bottom, center
            sprite.anchor.set(0.5, 0); 

            canvas.stage.addChild(sprite);

            // Add the reference to the sprite to an array
            placementGrid[gridSpaceIndex].spriteReference = sprite;
        }
    }
}