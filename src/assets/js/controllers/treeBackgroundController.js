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
        const uniqueTrees = 5;

        // The offset from the edges of the screen in pixels
        const offSet = 50;

        function getRandomX() {
            const min = Math.floor(0) + offSet;
            const max = Math.ceil(window.innerWidth) - offSet;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getRandomY() {
            const min = Math.floor(0) + offSet;
            const max = Math.ceil(window.innerHeight / 2);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const verbruikInput = this.#treeBackgroundView.querySelector("#verbruik");
        const afstandInput = this.#treeBackgroundView.querySelector("#afstand");

        let canvas = this.#canvasApp;

        console.log('tree function')
        console.log(this.#textureSheet);

        let test = new PIXI.Sprite();
        test.x = getRandomX();
        test.y = getRandomY();
    
        test.width = 70;
        test.height = 70;

        canvas.stage.addChild(test);
    
        verbruikInput.addEventListener("change", createTrees);
        afstandInput.addEventListener("change", createTrees);

        function createTrees() {
            let treeCount = verbruikInput.value + afstandInput.value;

            for (let i = 0; i < treeCount; i++) {
                let sprite = PIXI.Sprite.from(sheet.textures[`tree${Math.floor(Math.random() * (6))}.png`]);
    
                sprite.x = getRandomX();
                sprite.y = getRandomY();
    
                sprite.width = 70;
                sprite.height = 70;
    
                canvas.stage.addChild(sprite);
            }
        }
            // console.log(verbruikInput.value);
            let treeCount = 35;
            // for (let i = 0; i < treeCount; i++) {

            //     let sprite = PIXI.Sprite.from(`assets/images/trees/tree${Math.floor(Math.random() * (6))}.png`);
    
            //     sprite.x = getRandomX();
            //     sprite.y = getRandomY();
    
            //     sprite.width = 70;
            //     sprite.height = 70;
    
            //     this.#canvasApp.stage.addChild(sprite);
            // }
                
        // setInterval(function () {
        //     console.log('test')
        //     let sprite = PIXI.Sprite.from(`../assets/images/trees/tree${Math.floor(Math.random() * (6))}.png`);

        //     sprite.x = getRandomX();
        //     sprite.y = getRandomY();

        //     sprite.width = 70;
        //     sprite.height = 70;

        //     this.#canvasApp.stage.addChild(sprite);
        // }, 1000);

        // A function to get the tree position, that considers the position and size of other elements to avoid clipping
        function getTreePosition() {

        }
    }


}