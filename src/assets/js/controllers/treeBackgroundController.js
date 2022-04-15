/**
 * Controller for the calculator
 */

import { Controller } from "./controller.js";
import decorative_sprites from "../../json/decorative-sprites.json" assert { type: "json" }

export class TreeBackgroundController extends Controller {
    // The view that holds the html for the tree background
    #treeBackgroundView;
    // The canvas app 
    #canvasApp;
    // Sprite sheet with trees
    #treeSheet;
    // Sprite sheet with boats
    #boatSheet;
    // Sprite sheet with the boats
    #cloudSheet;
    // This array holds the coordinates of the grid scares and their contents
    #gridSquares = [];
    // The base dimension for trees
    #baseTreeDimension = 70;
    // Division of the background in percentages
    #backgroundDivision = [60, 5, 35];

    constructor() {
        super();

        this.#setupView();
    }

    #createBasicSprite(spriteObject, sheet) {
        const sprite = PIXI.Sprite.from(sheet.textures[spriteObject.img]);

        if (!spriteObject.height || spriteObject.height === 'auto') {
            const sizePercentageOfOriginalImage = (spriteObject.width * 100) / sprite.width;
            sprite.height = Math.floor((sprite.height * sizePercentageOfOriginalImage) / 100);
        } else {
            sprite.height = spriteObject.height;
        }

        sprite.x = spriteObject.basePosX;
        sprite.y = spriteObject.basePosY;

        sprite.width = spriteObject.width;

        // If the sprite is going in the opposite direction flip it
        if (spriteObject.direction && spriteObject.direction == 'left') {
            sprite.scale.x = -sprite.scale.x;
        }

        // Sets the sprites anchor to bottom, center
        sprite.anchor.set(0.5, 1);

        return sprite;
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
                PIXI.Loader.shared.add("assets/images/sprites/boatspritesheet.json").load(myResolve);
            } catch {
                console.log('Error while loading spritesheet');
                myReject();
            }
        });
        await boatLoaderPromise;
        this.#boatSheet = PIXI.Loader.shared.resources["assets/images/sprites/boatspritesheet.json"].spritesheet;

        const cloudLoaderPromise = new Promise(function (myResolve, myReject) {
            try {
                PIXI.Loader.shared.add("assets/images/sprites/cloudsspritesheet.json").load(myResolve);
            } catch {
                console.log('Error while loading spritesheet');
                myReject();
            }
        });
        await cloudLoaderPromise;
        this.#cloudSheet = PIXI.Loader.shared.resources["assets/images/sprites/cloudsspritesheet.json"].spritesheet;

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

        const createBasicSprite = this.#createBasicSprite;

        function createSideScrollingSprites(spritesArray, sheet) {
            spritesArray.forEach(spriteObject => {
                const sprite = createBasicSprite(spriteObject, sheet);
                const spriteCopy = createBasicSprite(spriteObject, sheet);

                app.stage.addChild(sprite);
                app.stage.addChild(spriteCopy);

                let spriteOneActive = true;
                let spriteTwoActive = false;
                app.ticker.add((delta) => {
                    if (spriteObject.direction == 'right') {
                        // When the front of the boat touches the canvas edge
                        if (Math.floor(sprite.x) == canvasDiv.offsetWidth - sprite.width / 2) {
                            spriteTwoActive = true;
                        }

                        if (Math.floor(sprite.x) == canvasDiv.offsetWidth + sprite.width / 2) {
                            spriteOneActive = false;
                            sprite.x = -spriteObject.width;
                        }

                        if (Math.floor(spriteCopy.x) == canvasDiv.offsetWidth - sprite.width / 2) {
                            spriteOneActive = true;
                        }

                        if (Math.floor(spriteCopy.x) == canvasDiv.offsetWidth + sprite.width / 2) {
                            spriteTwoActive = false;
                            spriteCopy.x = -spriteObject.width;
                        }


                        if (spriteOneActive == true) {
                            sprite.x += 1 * delta;
                        }

                        if (spriteTwoActive == true) {
                            spriteCopy.x += 1 * delta;
                        }
                    } else {
                        // When the front of the boat touches the canvas edge
                        if (Math.floor(sprite.x) == sprite.width / 2) {
                            spriteTwoActive = true;
                        }

                        if (Math.floor(sprite.x) == -(sprite.width / 2)) {
                            spriteOneActive = false;
                            sprite.x = canvasDiv.offsetWidth + spriteObject.width;
                        }

                        if (Math.floor(spriteCopy.x) == sprite.width / 2) {
                            spriteOneActive = true;
                        }

                        if (Math.floor(spriteCopy.x) == -(sprite.width / 2)) {
                            spriteTwoActive = false;
                            spriteCopy.x = canvasDiv.offsetWidth + spriteObject.width;
                        }

                        if (spriteOneActive == true) {
                            sprite.x -= 1 * delta;
                        }

                        if (spriteTwoActive == true) {
                            spriteCopy.x -= 1 * delta;
                        }
                    }
                });
            });
        }

        const boatSheet = this.#boatSheet;
        const boatArea = (canvasDiv.offsetHeight * (backgroundDivison[2] + (backgroundDivison[1] / 2))) / 100;

        let boatSprites = decorative_sprites.boats;
        let xPositive = canvasDiv.offsetWidth;
        let xNegative = 0;
        boatSprites = boatSprites.map(boat => {
            boat.direction = Math.round(Math.random()) ? 'right' : 'left';
            if (boat.direction == 'right') {
                console.log(boat.width)
                xNegative -= boat.width - 10;
                boat.basePosX = xNegative;
            } else {
                xPositive += (boat.width + 10);
                boat.basePosX = xPositive;
            }
            boat.basePosY = boatArea;
            return boat;
        })


        const cloudSheet = this.#cloudSheet;
        const cloudArea = 100;
        let cloudSprites = decorative_sprites.clouds;
        const cloudDirection = Math.round(Math.random()) ? 'right' : 'left';
        cloudSprites = cloudSprites.map(cloud => {
            cloud.direction = cloudDirection;
            if (cloudDirection == 'right') {
                xPositive += cloud.width + 10;
                cloud.basePosX = xPositive;
            } else {
                xNegative -= cloud.width - 10;
                cloud.basePosX = xNegative;
            }
            cloud.basePosY = cloudArea;
            return cloud;
        })

        // {
        //     width: 60,
        //     height: 60,
        //     img: 'cloud1.png',
        //     basePosX: -60,
        //     basePosY: cloudArea
        // }

        console.log(boatSprites, cloudSprites)

        createSideScrollingSprites(boatSprites, boatSheet)
        createSideScrollingSprites(cloudSprites, cloudSheet)


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
            canvasDiv.style.backgroundImage = getCssValuePrefix() + `linear-gradient(90deg, rgb(118, 193, 118) ${backgroundDivison[0]}%, #368d8d ${backgroundDivison[0]}%, cyan ${backgroundDivison[0] + backgroundDivison[1]}%, rgb(192, 245, 252) ${backgroundDivison[0] + backgroundDivison[1]}%, rgb(192, 245, 252) ${backgroundDivison[0] + backgroundDivison[1] + backgroundDivison[2]}%)`;
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
        const treeSheet = this.#treeSheet;
        const treeDimension = this.#baseTreeDimension;
        const placementGrid = this.#gridSquares;
        // amount of unique trees in the assets folder
        const uniqueTreeAssets = 5;
        // The offset from the edges of the screen in pixels
        const offSet = treeDimension / 2;
        // Total amount of tree's that should be on the screen
        let totalTrees = 0;
        // The array that hold all the tree sprites

        const createBasicSprite = this.#createBasicSprite;

        function getRandomX() {
            const min = Math.floor(0);
            const max = Math.ceil(canvas.renderer.width / 2.5) + offSet;
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
                    }
                    disabledTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == false);
                    visibleTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == true);
                }
            } else if (visibleTrees.length > totalTrees) {
                while (visibleTrees.length > totalTrees) {
                    visibleTrees[Math.floor(Math.random() * visibleTrees.length)].spriteReference.visible = false;
                    visibleTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == true)
                }
            }
        }

        function createTree() {
            // Check for all the possible empty grid spaces
            const emptyGridSpaces = placementGrid.filter(gridObject => gridObject.spriteReference == null);

            // Randomly choose a random grid space to use
            const targetEmptySpace = emptyGridSpaces[Math.floor(Math.random() * emptyGridSpaces.length)];

            // Get the index of the selected space in the original array
            const getIndexOfSelectedSpace = (gridSpace) => gridSpace == targetEmptySpace;
            const gridSpaceIndex = placementGrid.findIndex(getIndexOfSelectedSpace);

            const min = Math.floor(treeDimension - ((treeDimension / 100) * 30));
            const max = Math.ceil(treeDimension + ((treeDimension / 100) * 30));
            const variableSize = Math.floor(Math.random() * (max - min + 1)) + min;

            const sprite = createBasicSprite(
                {
                    width: variableSize,
                    height: variableSize,
                    img: `tree${Math.floor(Math.random() * (uniqueTreeAssets - 1))}.png`,
                    basePosX: targetEmptySpace.xBaseCoordinate + Math.random() * (treeDimension / 2),
                    basePosY: targetEmptySpace.yBaseCoordinate + Math.random() * (treeDimension / 2)
                }, treeSheet
            );

            canvas.stage.addChild(sprite);

            // Add the reference to the sprite to an array
            placementGrid[gridSpaceIndex].spriteReference = sprite;
        }
    }
}