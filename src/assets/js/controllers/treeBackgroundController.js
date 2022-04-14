/**
 * Controller for the calculator
 */

import { Controller } from "./controller.js";

export class TreeBackgroundController extends Controller {
    #treeBackgroundView;
    #canvasApp;
    // Sprite sheet with trees
    #treeSheet;
    // Sprite sheet with boats
    #boatSheet;
    #gridSquares = [];
    #baseTreeDimension = 70;
    // Division of the background in percentages
    #backgroundDivision = [60, 5, 35];

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
        const backgroundDivison = this.#backgroundDivision;
        
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
        const treeLoaderPromise = new Promise(function (myResolve, myReject) {
            try {
                PIXI.Loader.shared.add("assets/images/sprites/treespritesheet.json").load(myResolve);
            } catch {
                console.log('Error while loading spritesheet');
                myReject();
            }
        });
        await treeLoaderPromise;
        this.#treeSheet = PIXI.Loader.shared.resources["assets/images/sprites/treespritesheet.json"].spritesheet;


        
        const boatLoaderPromise = new Promise(function (myResolve, myReject) {
            try {
                PIXI.Loader.shared.add("assets/images/sprites/boatsheet.json").load(myResolve);
            } catch {
                console.log('Error while loading spritesheet');
                myReject();
            }
        });
        await boatLoaderPromise;
        this.#boatSheet = PIXI.Loader.shared.resources["assets/images/sprites/boatsheet.json"].spritesheet;

        // Append the canvas to the chosen div with the pixi app settings
        canvasDiv.appendChild(app.view);

        const canvas = app.view;

        // canvas.width = canvasDiv.offsetWidth;
        // canvas.height = canvasDiv.offsetHeight;
        const treeDimension = this.#baseTreeDimension;

        // Get the height of the tree area
        const treeAreaHeight = canvasDiv.offsetHeight * backgroundDivison[0] / 100;

        const xSquares = Math.floor(canvasDiv.offsetWidth / treeDimension)
        const ySquares = Math.floor(treeAreaHeight / treeDimension)


        for (let x = 0; x < xSquares; x++) {
            for (let y = 0; y < ySquares; y++) {
                this.#gridSquares.push({
                    xBaseCoordinate: x * treeDimension + (treeDimension / 2),
                    yBaseCoordinate: y * treeDimension + (treeDimension - 1 / 3) + (canvasDiv.offsetHeight - treeAreaHeight),
                    spriteReference: null,
                })
            }
        }

        const boatSheet = this.#boatSheet;
        function createBoats() {
            const boatArea = (canvasDiv.offsetHeight * (backgroundDivison[2] + (backgroundDivison[1] / 2))) / 100;
            // console.log(canvasDiv.offsetHeight);
            // console.log(canvasDiv.offsetHeight * (backgroundDivison[0]) / 100);
            // console.log(canvasDiv.offsetHeight * (backgroundDivison[1]) / 100);
            // console.log(canvasDiv.offsetHeight * (backgroundDivison[2]) / 100);

            // console.log(boatArea)
            let boatSprite = PIXI.Sprite.from(boatSheet.textures[`boat1.png`]);

            boatSprite.x = -60;
            boatSprite.y = boatArea;

            boatSprite.width = 60;
            boatSprite.height = 60;

            // Sets the sprites anchor to bottom, center
            boatSprite.anchor.set(0.5, 1); 

            app.stage.addChild(boatSprite);

            let boatSpriteCopy = PIXI.Sprite.from(boatSheet.textures[`boat1.png`]);

            boatSpriteCopy.x = -60;
            boatSpriteCopy.y = boatArea;

            boatSpriteCopy.width = 60;
            boatSpriteCopy.height = 60;

            // Sets the sprites anchor to bottom, center
            boatSpriteCopy.anchor.set(0.5, 1); 

            app.stage.addChild(boatSpriteCopy);

            let boatOneRunning = true;
            let boatTwoRunning = false;
            app.ticker.add((delta) => {
                
                // When the front of the boat touches the canvas edge
                if (Math.floor(boatSprite.x) == canvasDiv.offsetWidth - boatSprite.width / 2) {
                    boatTwoRunning = true;
                }
                
                if (Math.floor(boatSprite.x) == canvasDiv.offsetWidth + boatSprite.width / 2) {
                    boatOneRunning = false;
                    boatSprite.x = -60;
                }

                if (Math.floor(boatSpriteCopy.x) == canvasDiv.offsetWidth - boatSprite.width / 2) {
                    boatOneRunning = true;
                }
                
                if (Math.floor(boatSpriteCopy.x) == canvasDiv.offsetWidth + boatSprite.width / 2) {
                    boatTwoRunning = false;
                    boatSpriteCopy.x = -60;
                }


                if (boatOneRunning == true) {
                    boatSprite.x += 0.7 * delta;
                }
                
                if (boatTwoRunning == true) {
                    boatSpriteCopy.x += 0.7 * delta;
                }
            });
            
        }
        createBoats();

        // Resize ability for canvas
        window.addEventListener('resize', resize);

        function getCssValuePrefix() {
            var rtrnVal = ''; //default to standard syntax
            var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

            // Create a temporary DOM object for testing
            var dom = document.createElement('div');

            for (var i = 0; i < prefixes.length; i++) {
                // Attempt to set the style
                dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

                // Detect if the style was successfully set
                if (dom.style.background) {
                    rtrnVal = prefixes[i];
                }
            }

            dom = null;

            return rtrnVal;
        }

        function setBackGroundVisuals() {
            canvasDiv.style.backgroundImage = getCssValuePrefix() +  `linear-gradient(90deg, rgb(118, 193, 118) ${backgroundDivison[0]}%, #368d8d ${backgroundDivison[0]}%, cyan ${backgroundDivison[0] + backgroundDivison[1]}%, rgb(192, 245, 252) ${backgroundDivison[0] + backgroundDivison[1]}%, rgb(192, 245, 252) ${backgroundDivison[0] + backgroundDivison[1] + backgroundDivison[2]}%)`;
        }

        function resize() {
            // app.renderer.resize(window.innerWidth, (window.innerHeight / 100) * 60);
            app.renderer.resize(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
            setBackGroundVisuals()
        }
        resize();
        setBackGroundVisuals();

        this.#canvasApp = app;
    }

    async #createTrees() {
        let canvas = this.#canvasApp;
        const sheet = this.#treeSheet;
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
            let disabledTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == false);

            if (visibleTrees.length < totalTrees) {
                while (visibleTrees.length < totalTrees) {
                    // If disabled trees exist enable those first, else create a new one
                    if (disabledTrees > 0) {
                        disabledTrees[0].spriteReference.visible = true;
                    } else {
                        if (placementGrid.filter(gridObject => gridObject.spriteReference == null).length != 0) {
                            createTree();
                        } else {
                            break;
                        }
                        // createTree();
                    }
                    disabledTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == false);
                    visibleTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == true);
                }
            } else if (visibleTrees.length > totalTrees) {
                while (visibleTrees.length > totalTrees) {
                    visibleTrees[Math.floor(Math.random() * visibleTrees.length)].spriteReference.visible = false;
                    
                    // visibleTrees[treesArray.length - 1].destroy();
                    // visibleTrees.pop()

                    visibleTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == true)
                }
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
            const targetEmptySpace = emptyGridSpaces[Math.floor(Math.random() * emptyGridSpaces.length)];

            // Get the index of the selected space in the original array
            const getIndexOfSelectedSpace = (gridSpace) => gridSpace == targetEmptySpace;
               
            const gridSpaceIndex = placementGrid.findIndex(getIndexOfSelectedSpace);
            sprite.x = targetEmptySpace.xBaseCoordinate + Math.random() * (treeDimension / 2);
            sprite.y = targetEmptySpace.yBaseCoordinate + Math.random() * (treeDimension / 2);

            const min = Math.floor(treeDimension - ((treeDimension/100)*30));
            const max = Math.ceil(treeDimension + ((treeDimension/100)*30));
            const variableSize = Math.floor(Math.random() * (max - min + 1)) + min;

            sprite.width = variableSize;
            sprite.height = variableSize;

            // Sets the sprites anchor to bottom, center
            sprite.anchor.set(0.5, 1); 

            canvas.stage.addChild(sprite);

            // Add the reference to the sprite to an array
            placementGrid[gridSpaceIndex].spriteReference = sprite;
        }
    }
}