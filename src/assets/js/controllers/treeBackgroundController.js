/**
 * Controller for the calculator
 */

import { Controller } from "./controller.js";
import decorative_sprites from "../../json/decorative-sprites.js"
import { calculatorRepository } from "../repositories/calculatorRepository.js";
import { NetworkManager } from "../framework/utils/networkManager.js";

import { createBasicSprite, createSideScrollingSprites } from "../sprite-functions/sprite-creation.js";
import { getCssValuePrefix } from "../modules/gradientPrefix.js";
import { NSDialogWorker } from "../Workers/NSDialogWorker.js";
import {ResultNavbarWorker} from "../Workers/ResultNavbarWorker.js";

export class TreeBackgroundController extends Controller {
    #calculatorRepository;

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
    // Sprite sheet with dead trees
    #deadTreeSheet;
    // This array holds the coordinates of the grid scares and their contents
    #gridSquares = [];
    // The base dimension for trees
    #baseTreeDimension = 70;
    // Division of the background in percentages
    #backgroundDivision = [60, 5, 35];

    #pixiTreeContainer = new PIXI.Container();

    #nsDialogWorker = new NSDialogWorker();

    #resultNavbarWorker = new ResultNavbarWorker();

    // Number of trees
    #treeCount;

    #networkManager;

    #app;

    constructor(app) {
        super();

        this.#app = app;
        this.#calculatorRepository = new calculatorRepository();

        // this.#setupView().then();

        this.#networkManager = new NetworkManager();

        this.#setupView().then();
    }

    async #setupView() {
        const html = await super.loadHtmlIntoContent("html_views/treeCanvas.html");
        this.#treeBackgroundView = html;

        await this.#setUpCanvas();
        this.#setupNSPopup();

        this.#resultNavbarWorker.setup(this.#app, this.#treeBackgroundView);
        const chosenVehicle = localStorage.getItem('chosenVehicle');

        let result;
        const iconCode = this.#getFontAwesomeIconForVehicle(chosenVehicle);
        let vehicleNameDutch;

        switch (chosenVehicle) {
            case 'car':
                vehicleNameDutch = 'auto';
                break;
            case 'train':
                vehicleNameDutch = 'trein';
                break;
            case 'bike':
                vehicleNameDutch = 'fiets';
                break;
            case 'bus':
                vehicleNameDutch = 'bus';
                break;
            case 'tram':
                vehicleNameDutch = 'tram';
                break;
            case 'walk':
                vehicleNameDutch = 'lopend';
                break;
            default:
                break;
        }

        if (chosenVehicle === 'car') {
            result = await this.#calculatorRepository.getCarbonEmissionForCar();
        } else {
            result = await this.#calculatorRepository.getCarbonEmissionForVehicle();
        }

        console.log(result);

        // Set the amount of trees then manage tree sprites
        this.#treeCount = result.trees;

        // Set values of first travel submissions
        html.querySelector('#emissions').innerHTML = Math.round(result.CO2);
        html.querySelector('#distance').innerText = `${localStorage.getItem('usersDistanceToMuseum')} KM`;
        html.querySelector('#vehicle-name').innerHTML = vehicleNameDutch.capitalize();

        // Set vehicle icon
        html.querySelector('#vehicle-icon').setAttribute("class", `fa-solid ${iconCode}`);

        // The on click that will handle thew new emissions
        console.log(this.#treeBackgroundView.querySelectorAll('.vehicle-suggestion-option'));
        this.#treeBackgroundView.querySelectorAll('.vehicle-suggestion-option').forEach(option => {
            console.log(option);
            const newVehicle = option.dataset.vehicle;
            option.onclick = this.#handleVehicleSuggestionClicked.bind(this, option, newVehicle);
        })
        await this.#manageTrees();
    }

    #getFontAwesomeIconForVehicle(chosenVehicle) {
        switch (chosenVehicle) {
            case 'car':
                return 'fa-car'
            case 'train':
                return 'fa-train'
            case 'bike':
                return 'fa-bicycle';
            case 'bus':
                return 'fa-bus';
            case 'tram':
                return 'fa-train-tram';
            case 'walk':
                return 'fa-person-walking';
        }
    }

    async #handleVehicleSuggestionClicked(element, newVehicle) {
        console.log(element, newVehicle);

        this.#unselectVehicleOption();
        element.classList.add('active');

        let result;
        let chosenFuel = localStorage.getItem('fuel') ?? 'diesel';
        let usersDistanceToMuseum = localStorage.getItem('usersDistanceToMuseum');

        switch (newVehicle) {
            case 'car':
                result = await this.#networkManager.doRequest(`/calculator/car?car=${chosenFuel}&distance=${usersDistanceToMuseum}`, "GET");
                break;
            case 'train':
                this.#nsDialogWorker.showNSDialog();
            default: // train option should fallthrough
                result = await this.#networkManager.doRequest(`/calculator/${newVehicle}?${newVehicle}=${newVehicle}&distance=${usersDistanceToMuseum}`, "GET");
        }

        this.#treeCount = result.trees;

        this.#treeBackgroundView.querySelector('#new-emissions').innerHTML = Math.round(result.CO2);

        const iconCode = this.#getFontAwesomeIconForVehicle(newVehicle);
        this.#treeBackgroundView.querySelector('#new-chosen-vehicle').setAttribute("class", `fa-solid ${iconCode}`);
        this.#treeBackgroundView.querySelector('#new-result-container').classList.remove('hidden');

        // Run tree management to update
        await this.#manageTrees();
    }

    #unselectVehicleOption() {
        this.#getCurrentlySelectedSuggestedVehicle()?.classList.remove('active');
    }

    #getCurrentlySelectedSuggestedVehicle() {
        return this.#treeBackgroundView.querySelector('.active');
    }

    async #setUpCanvas() {
        const backgroundDivison = this.#backgroundDivision;

        // Get the div that will hold the canvas
        const canvasDiv = this.#treeBackgroundView.querySelector("#canvas-box");
        const navBar = this.#treeBackgroundView.querySelector('#nav-bar')

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
                } catch (e) {
                    console.log(`Error while loading spritesheet: ${spritesheetname}`);
                    console.error(e);
                    myReject();
                }
            })
            await loaderPromise;
            return PIXI.Loader.shared.resources[link].spritesheet;
        }

        this.#treeSheet = await loadSpriteSheet('treespritesheet');
        this.#boatSheet = await loadSpriteSheet('boatspritesheet');
        this.#cloudSheet = await loadSpriteSheet('cloudsspritesheet');
        this.#deadTreeSheet = await loadSpriteSheet('deadtreespritesheet');

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

        const treeSheet = this.#treeSheet;
        const deadTreeSheet = this.#deadTreeSheet;

        const treeContainer = this.#pixiTreeContainer;
        for (let x = 0; x < xSquares; x++) {
            for (let y = 0; y < ySquares; y++) {
                const uniqueTreeAssets = 5;
                const baseXpos = x * treeDimension + (treeDimension / 2);
                const baseYpos = y * treeDimension + (treeDimension - 1 / 3) + (canvasDiv.offsetHeight - treeAreaHeight);

                const min = Math.floor(treeDimension - ((treeDimension / 100) * 30));
                const max = Math.ceil(treeDimension + ((treeDimension / 100) * 30));
                const variableSize = Math.floor(Math.random() * (max - treeDimension + 1)) + min;

                const tree = createBasicSprite(
                    {
                        width: variableSize,
                        height: variableSize,
                        img: `tree${Math.floor(Math.random() * (uniqueTreeAssets - 1))}.png`,
                        basePosX: baseXpos + Math.random() * (treeDimension / 2),
                        basePosY: baseYpos + Math.random() * (treeDimension / 2),
                        zIndex: y
                    }, treeSheet
                );

                const deadTreeMax = Math.ceil(treeDimension + ((treeDimension / 100) * 30));
                const deadTreevariableSize = Math.floor(Math.random() * (deadTreeMax - treeDimension + 1)) + treeDimension;

                const deadTree = createBasicSprite(
                    {
                        width: deadTreevariableSize,
                        height: deadTreevariableSize,
                        img: `deadtree${Math.floor(Math.random() * (uniqueTreeAssets - 1))}.png`,
                        basePosX: baseXpos + Math.random() * (treeDimension / 2),
                        basePosY: baseYpos + Math.random() * (treeDimension / 2),
                        zIndex: y
                    }, deadTreeSheet
                );

                deadTree.visible = false;

                treeContainer.addChild(tree);
                treeContainer.addChild(deadTree);

                this.#gridSquares.push({
                    xBaseCoordinate: baseXpos,
                    yBaseCoordinate: baseYpos,
                    treeSprite: tree,
                    deadTreeSprite: deadTree,
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
            if (boat.direction === 'right') {
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
            if (cloudDirection === 'right') {
                xNegative -= cloud.width - -(Math.random() * (canvas.offsetWidth / (cloudSprites.length * 5)));
                cloud.basePosX = xNegative;
            } else {
                xPositive += cloud.width + 10 + (Math.random() * (canvas.offsetWidth / (cloudSprites.length * 5)));
                cloud.basePosX = xPositive;
            }
            // Minimum height will be 25% of available height and half of the navbar height
            const minYPos = (cloudArea * 0.25) + (navBar.offsetHeight);
            const maxYPos = cloudArea / 2;
            // Maximum height will be a third of the available space
            cloud.basePosY = Math.random() * (maxYPos - minYPos) + minYPos;
            return cloud;
        })

        const boatSpriteReferences = createSideScrollingSprites(boatSprites, boatSheet, app, canvasDiv.offsetWidth);
        const cloudSpriteReferences = createSideScrollingSprites(cloudSprites, cloudSheet, app, canvasDiv.offsetWidth);

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

        

        function resize() {
            // Resize canvas
            app.renderer.resize(canvasDiv.offsetWidth, window.innerHeight);

            // Redraw background
            canvasDiv.style.backgroundImage = getCssValuePrefix() + `linear-gradient(90deg, rgb(118, 193, 118) ${backgroundDivison[0]}%, #368d8d ${backgroundDivison[0]}%, cyan ${backgroundDivison[0] + backgroundDivison[1]}%, rgb(192, 245, 252) ${backgroundDivison[0] + backgroundDivison[1]}%, rgb(192, 245, 252) ${backgroundDivison[0] + backgroundDivison[1] + backgroundDivison[2]}%)`;
        }
        resize();
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

        totalTrees = Math.round(this.#treeCount.day);
        updateTrees();

        function updateTrees() {
            // Filter for visible sprites by checking grid spaces without a sprite reference and then ones with visible sprites
            let visibleTrees = placementGrid.filter(gridObject => gridObject.deadTreeSprite.visible === true);
            let disabledTrees = placementGrid.filter(gridObject => gridObject.treeSprite.visible === true);

            if (visibleTrees.length < totalTrees) {
                while (visibleTrees.length < totalTrees) {
                    const randomPosToToggle = Math.floor(Math.random() * disabledTrees.length);
                    disabledTrees[randomPosToToggle].deadTreeSprite.visible = true;
                    disabledTrees[randomPosToToggle].treeSprite.visible = false;

                    visibleTrees = placementGrid.filter(gridObject => gridObject.deadTreeSprite.visible === true);
                    disabledTrees = placementGrid.filter(gridObject => gridObject.treeSprite.visible === true);
                }
            } else {
                while (visibleTrees.length > totalTrees) {
                    const randomPosToToggle = Math.floor(Math.random() * visibleTrees.length);
                    visibleTrees[randomPosToToggle].deadTreeSprite.visible = false;
                    visibleTrees[randomPosToToggle].treeSprite.visible = true;

                    visibleTrees = placementGrid.filter(gridObject => gridObject.deadTreeSprite.visible === true);
                    disabledTrees = placementGrid.filter(gridObject => gridObject.treeSprite.visible === true);
                }
            }
        }
    }

    #setupNSPopup() {
        this.#nsDialogWorker.setView(this.#treeBackgroundView);
        this.#nsDialogWorker.setup();
    }
}
