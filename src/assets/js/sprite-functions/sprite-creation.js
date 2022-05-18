export function createBasicSprite(spriteObject, sheet) {
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
    if (spriteObject.direction && spriteObject.direction === 'left') {
        sprite.scale.x = -sprite.scale.x;
    }

    spriteObject.zIndex && (sprite.zIndex = spriteObject.zIndex);

    // Sets the sprites anchor to bottom, center
    sprite.anchor.set(0.5, 1);

    return sprite;
}

export function createSideScrollingSprites(spritesArray, sheet, canvasApp, canvasWidth) {
    const spritesObjectArray = [];

    spritesArray.forEach(spriteObject => {
        const originalSprite = createBasicSprite(spriteObject, sheet);
        const spriteCopy = createBasicSprite(spriteObject, sheet);

        spritesObjectArray.push({ "sprite": originalSprite, "sprite_copy": spriteCopy })

        spriteCopy.visible = false;

        canvasApp.stage.addChild(originalSprite);
        canvasApp.stage.addChild(spriteCopy);

        let spriteOneActive = true;
        let spriteTwoActive = false;

        let speed = spriteObject.speed ? spriteObject.speed : 1;

        canvasApp.ticker.add((delta) => {
            // Note: The sprites x pos is when checking is in the middle of the image
            const leavingScreenPos = spriteObject.direction === 'right' ? canvasWidth - originalSprite.width / 2 : originalSprite.width / 2;
            const fullyLeftScreenPos = spriteObject.direction === 'right' ? canvasWidth + originalSprite.width / 2 : -(originalSprite.width / 2);
            const offScreenStartPos = spriteObject.direction === 'right' ? -spriteObject.width : canvasWidth + spriteObject.width;
            let movementChange = spriteObject.direction === 'right' ? speed : -(speed);
            movementChange = parseFloat(movementChange.toFixed(2));

            // console.log(canvasDiv.offsetWidth)

            [originalSprite, spriteCopy].forEach(sprite => {
                if (Math.floor(sprite.x) === leavingScreenPos) {
                    spriteTwoActive = true;
                }

                // When the sprite touches the edge of the screen with it's back
                if (Math.floor(sprite.x) === fullyLeftScreenPos) {
                    spriteOneActive = false;
                    originalSprite.x = offScreenStartPos;
                }
            });

            [spriteOneActive, spriteTwoActive].forEach(spriteState => {
                if (spriteState === true) {
                    originalSprite.x += movementChange;
                }
            });

        });

    });

    return spritesObjectArray;
}