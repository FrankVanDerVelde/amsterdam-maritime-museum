const app = new PIXI.Application({
    transparent: true,
    autoResize: true,
    width: window.innerHeight,
    height: window.innerWidth,
    resolution: devicePixelRatio,
    autoDensity: true
});

const canvasDiv = document.getElementById("canvas-box");
canvasDiv.appendChild(app.view);

canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// amount of unique trees in the assets folder
const uniqueTrees = 5;

// Resize ability for canvas
window.addEventListener('resize', resize);

function resize() {
    app.renderer.resize(window.innerWidth, (window.innerHeight/100)*60);
}
resize();

function getRandomX() {
    min = Math.floor(0);
    max = Math.ceil(window.innerWidth);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomY() {
    min = Math.floor(0);
    max = Math.ceil(window.innerHeight / 2);
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

for (i = 0; i < treeCount; i++) {
    
    let sprite = PIXI.Sprite.from(`../assets/images/trees/tree${Math.floor(Math.random() * (6))}.png`);

    sprite.x = getRandomX();
    sprite.y = getRandomY();

    sprite.width = 70;
    sprite.height = 70;

    app.stage.addChild(sprite);
}

// A function to get the tree position, that considers the position and size of other elements to avoid clipping
function getTreePosition() {

}