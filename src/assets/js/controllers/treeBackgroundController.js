/**
 * Controller for the calculator
 */

import { Controller } from "./controller.js";
import decorative_sprites from "../../json/decorative-sprites.js"
import {calculatorRepository} from "../repositories/calculatorRepository.js";


export class TreeBackgroundController extends Controller {
    // The view that holds the html for the tree background
    #calculatorRepository;

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

    #pixiTreeContainer = new PIXI.Container();

    // Number of trees
    #treeCount;
    
    constructor() {
        super();

        this.#calculatorRepository = new calculatorRepository();

        this.#setupView();

    }

    async #setupView() {
        this.#treeBackgroundView = await super.loadHtmlIntoContent("html_views/treeCanvas.html");

        await this.#setUpCanvas();
        await this.#manageTrees();
        const chosenVehicle = localStorage.getItem('chosenVehicle');

        if (chosenVehicle === 'car') {
            console.log(await this.#calculatorRepository.getCarbonEmissionForCar());

        } else if (chosenVehicle ==='train'){
            console.log(await this.#calculatorRepository.getCarbonEmissionForTrain());

        } else if (chosenVehicle === 'bike'){
            console.log(await this.#calculatorRepository.getCarbonEmissionForBike());

        } else if (chosenVehicle === 'bus'){
            console.log(await this.#calculatorRepository.getCarbonEmissionForBus());

        } else if (chosenVehicle === 'tram'){
            console.log(await this.#calculatorRepository.getCarbonEmissionForTram());

        } else if (chosenVehicle === 'walking'){
            console.log(await this.#calculatorRepository.getCarbonEmissionForWalking());

        }




        console.log(await this.#calculatorRepository.getCarbonEmissionForBus());


        // console.log(await this.#calculatorRepository.getCarbonEmissionForVehicle());

    }

    async #setUpCanvas() {
        const backgroundDivison = this.#backgroundDivision;

        // Get the div that will hold the canvas
        const canvasDiv = this.#treeBackgroundView.querySelector("#canvas-box");

        this.#treeBackgroundView.parentElement.classList.add('tree-app');

        // Setup the pixi app
        const app = new PIXI.Application({
            transparent: true,
            autoResize: true,
            width: canvasDiv.offsetWidth,
            height: canvasDiv.offsetHeight,
            resolution: devicePixelRatio,
            autoDensity: true
        });

        this.#canvasApp = app;

        // Function that has a promise to load the spritesheets
        async function loadSpriteSheet(spritesheetname) {
            const link = `assets/images/sprites/${spritesheetname}.json`;
            const loaderPromise = new Promise(function (myResolve, myReject) {
                try {
                    PIXI.Loader.shared.add(link).load(myResolve);
                } catch {
                    console.log(`Error while loading spritesheet: ${spritesheetname}`);
                    myReject();
                }
            })
            await loaderPromise;
            return PIXI.Loader.shared.resources[link].spritesheet;
        }

        this.#treeSheet = await loadSpriteSheet('treespritesheet');
        this.#boatSheet = await loadSpriteSheet('boatspritesheet');
        this.#cloudSheet = await loadSpriteSheet('cloudsspritesheet');

        // Append the canvas to the chosen div with the pixi app settings
        canvasDiv.appendChild(app.view);

        const canvas = app.view;
        
        this.#pixiTreeContainer.sortableChildren = true;
        app.stage.addChild(this.#pixiTreeContainer);

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
                    row: y
                })
            }
        }  

        const boatSheet = this.#boatSheet;
        const boatArea = (canvasDiv.offsetHeight * (backgroundDivison[2] + (backgroundDivison[1] / 2))) / 100;

        let boatSprites = decorative_sprites.boats;
        let xPositive = canvasDiv.offsetWidth;
        let xNegative = 0;
        boatSprites = boatSprites.map(boat => {
            boat.direction = Math.round(Math.random()) ? 'right' : 'left';
            if (boat.direction == 'right') {
                xNegative -= boat.width - 10;
                boat.basePosX = xNegative;
            } else {
                xPositive += (boat.width + 10);
                boat.basePosX = xPositive;
            }
            boat.basePosY = boatArea;
            return boat;
        })
        
        // const boatArea = (canvasDiv.offsetHeight * (backgroundDivison[2] + (backgroundDivison[1] / 2))) / 100;
        const cloudSheet = this.#cloudSheet;
        // The canvas area for the sky
        const cloudArea = canvasDiv.offsetHeight * backgroundDivison[2] / 100;
        let cloudSprites = decorative_sprites.clouds;
        const cloudDirection = Math.round(Math.random()) ? 'right' : 'left';
        cloudSprites = cloudSprites.map(cloud => {
            cloud.direction = cloudDirection;
            if (cloudDirection == 'right') {
                xNegative -= cloud.width - -(Math.random() * (canvas.offsetWidth / (cloudSprites.length * 2)));
                cloud.basePosX = xNegative;
            } else {
                xPositive += cloud.width + 10 + (Math.random() * (canvas.offsetWidth / (cloudSprites.length * 2)));
                cloud.basePosX = xPositive;
            }
            // Minimum height will be 10% of available height
            const minYPos = cloudArea * 0.25;
            const maxYPos = cloudArea / 2;
            // Maximum height will be a third of the available space
            cloud.basePosY = Math.random() * (maxYPos - minYPos) + minYPos;
            return cloud;
        })

        const boatSpriteReferences = this.#createSideScrollingSprites(boatSprites, boatSheet)
        const cloudSpriteReferences = this.#createSideScrollingSprites(cloudSprites, cloudSheet)

         // update y pos
            window.addEventListener('resize', () => {
                // const newCloudArea = canvasDiv.offsetHeight * backgroundDivison[2] / 100;
                const newBoatArea = (canvasDiv.offsetHeight * (backgroundDivison[2] + (backgroundDivison[1] / 2))) / 100;
                boatSpriteReferences.forEach(boatObject => {
                    boatObject.sprite.y = newBoatArea;
                    boatObject.sprite_copy.y = newBoatArea;
                });
    
                // cloudSpriteReferences.forEach(cloud => {
    
                // })
            });

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

        function resize() {
            // Resize canvas
            app.renderer.resize(canvasDiv.offsetWidth, window.innerHeight);

            // Redraw background
            canvasDiv.style.backgroundImage = getCssValuePrefix() + `linear-gradient(90deg, rgb(118, 193, 118) ${backgroundDivison[0]}%, #368d8d ${backgroundDivison[0]}%, cyan ${backgroundDivison[0] + backgroundDivison[1]}%, rgb(192, 245, 252) ${backgroundDivison[0] + backgroundDivison[1]}%, rgb(192, 245, 252) ${backgroundDivison[0] + backgroundDivison[1] + backgroundDivison[2]}%)`;
        }
        resize();
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
        
        spriteObject.zIndex && (sprite.zIndex = spriteObject.zIndex);
        
        // Sets the sprites anchor to bottom, center
        sprite.anchor.set(0.5, 1);

        return sprite;
    }

    #createSideScrollingSprites(spritesArray, sheet) {
        const createBasicSprite = this.#createBasicSprite;
        const app = this.#canvasApp;
        const canvasDiv = this.#treeBackgroundView.querySelector("#canvas-box");

        const spritesObjectArray = [];

        spritesArray.forEach(spriteObject => {
            const originalSprite = createBasicSprite(spriteObject, sheet);
            const spriteCopy = createBasicSprite(spriteObject, sheet);

            spritesObjectArray.push({"sprite": originalSprite, "sprite_copy": spriteCopy})

            spriteCopy.visible = false;

            app.stage.addChild(originalSprite);
            app.stage.addChild(spriteCopy);

            let spriteOneActive = true;
            let spriteTwoActive = false;

            let speed = spriteObject.speed ? spriteObject.speed : 1;

            app.ticker.add((delta) => {
                // Note: The sprites x pos is when checking is in the middle of the image
                const leavingScreenPos = spriteObject.direction == 'right' ? canvasDiv.offsetWidth - originalSprite.width / 2 : originalSprite.width / 2;
                const fullyLeftScreenPos = spriteObject.direction == 'right' ? canvasDiv.offsetWidth + originalSprite.width / 2 : -(originalSprite.width / 2);
                const offScreenStartPos = spriteObject.direction == 'right' ? -spriteObject.width : canvasDiv.offsetWidth + spriteObject.width;
                let movementChange = spriteObject.direction == 'right' ? speed : -(speed);
                movementChange = parseFloat(movementChange.toFixed(2));
                
                // console.log(canvasDiv.offsetWidth)
               
                [originalSprite, spriteCopy].forEach(sprite => {
                    if (Math.floor(sprite.x) == leavingScreenPos) {
                        spriteTwoActive = true;
                    }

                    // When the sprite touches the edge of the screen with it's back
                    if (Math.floor(sprite.x) == fullyLeftScreenPos) {
                        spriteOneActive = false;
                        originalSprite.x = offScreenStartPos;
                    }
                });

                [spriteOneActive, spriteTwoActive].forEach(spriteState => {
                    if (spriteState == true) {
                        originalSprite.x += movementChange;
                    }
                });

                // if (Math.floor(originalSprite.x) == leavingScreenPos) {
                //     spriteCopy.x = offScreenStartPos;
                //     spriteCopy.visible = true;
                //     spriteTwoActive = true;
                // }

                // if (Math.floor(originalSprite.x) == fullyLeftScreenPos) {
                //     spriteOneActive = false;
                //     originalSprite.visible = false;
                // }

                // if (Math.floor(spriteCopy.x) == leavingScreenPos) {
                //     originalSprite.x = offScreenStartPos;
                //     originalSprite.visible = true;
                //     spriteOneActive = true;
                // }

                // if (Math.floor(spriteCopy.x) == fullyLeftScreenPos) {
                //     spriteTwoActive = false;
                //     spriteCopy.visible = true;
                // }
                
                // if (spriteOneActive == true) {
                //     originalSprite.x += movementChange;
                // }

                // if (spriteTwoActive == true) {
                //     spriteCopy.x += movementChange;
                // }

            });

        });

        return spritesObjectArray;
    }

    async #manageTrees() {
        const canvas = this.#canvasApp;
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

        const treeContainer = this.#pixiTreeContainer;

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

        // const verbruikInput = this.#treeBackgroundView.querySelector("#verbruik");
        // const afstandInput = this.#treeBackgroundView.querySelector("#afstand");

        // verbruikInput.addEventListener("change", function () {
        //     totalTrees = parseInt(verbruikInput.value) + parseInt(afstandInput.value);
        //     updateTrees();
        // });

        // afstandInput.addEventListener("change", function () {
        //     totalTrees = parseInt(verbruikInput.value) + parseInt(afstandInput.value);
        //     updateTrees();
        // });

        totalTrees = Math.round(this.#treeCount.trees.day);
        updateTrees();

        function updateTrees() {
            // Filter for visible sprites by checking grid spaces without a sprite reference and then ones with visible sprites
            let visibleTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == true);
            let disabledTrees = placementGrid.filter(gridObject => gridObject.spriteReference != null && gridObject.spriteReference.visible == false);

            if (visibleTrees.length < totalTrees) {
                while (visibleTrees.length < totalTrees) {
                    // If disabled trees exist enable those first, else create a new one
                    if (disabledTrees.length > 0) {
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
                    basePosY: targetEmptySpace.yBaseCoordinate + Math.random() * (treeDimension / 2),
                    zIndex: targetEmptySpace.row
                }, treeSheet
            );

            treeContainer.addChild(sprite);

            // Add the reference to the sprite to an array
            placementGrid[gridSpaceIndex].spriteReference = sprite;


        }
    }
}
