/**
 * Controller for the calculator
 */

import { Controller } from "./controller.js";

export class TreeBackgroundController extends Controller {
    #createTreeBackgroundView;
    #canvasApp;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#createTreeBackgroundView = await super.loadHtmlIntoContent("html_views/treeCanvas.html");

        await this.#setUpCanvas();
        await this.#createTrees();
    }

    async #setUpCanvas() {
        const app = new PIXI.Application({
            transparent: true,
            autoResize: true,
            width: window.innerHeight,
            height: window.innerWidth,
            resolution: devicePixelRatio,
            autoDensity: true
        });

        const canvasDiv = document.getElementById("canvas-box");
        console.log(canvasDiv)
        canvasDiv.appendChild(app.view);

        const canvas = app.view;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Resize ability for canvas
        window.addEventListener('resize', resize);

        function resize() {
            app.renderer.resize(window.innerWidth, (window.innerHeight / 100) * 60);
        }
        resize();

        this.#canvasApp = app;
    }

    async #createTrees() {
        // amount of unique trees in the assets folder
        const uniqueTrees = 5;

        function getRandomX() {
            const min = Math.floor(0);
            const max = Math.ceil(window.innerWidth);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getRandomY() {
            const min = Math.floor(0);
            const max = Math.ceil(window.innerHeight / 2);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let treeCount = 35;
        // setInterval(function () {
        //     let sprite = PIXI.Sprite.from(`../assets/images/trees/tree${Math.floor(Math.random() * (6))}.png`);

        //     sprite.x = getRandomX();
        //     sprite.y = getRandomY();

        //     sprite.width = 70;
        //     sprite.height = 70;

        //     app.stage.addChild(sprite);
        // }, 1000);

        for (let i = 0; i < treeCount; i++) {

            let sprite = PIXI.Sprite.from(`assets/images/trees/tree${Math.floor(Math.random() * (6))}.png`);

            sprite.x = getRandomX();
            sprite.y = getRandomY();

            sprite.width = 70;
            sprite.height = 70;

            this.#canvasApp.stage.addChild(sprite);
        }

        // A function to get the tree position, that considers the position and size of other elements to avoid clipping
        function getTreePosition() {

        }
    }


}