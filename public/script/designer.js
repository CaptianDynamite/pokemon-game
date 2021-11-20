function boundingTileCoordsTop(coord, xOffset, yOffset) {
    let left = coord.x - (coord.x % 16) + xOffset;
    let top = coord.y - (coord.y % 16) + yOffset;
    return {left, top};
}
function boundingTileCoordsBottom(coord, xOffset, yOffset) {
    let right = coord.x + (16 - (coord.x % 16)) + xOffset;
    let bottom = coord.y + (16 - (coord.y % 16)) + yOffset;
    return {right, bottom};
}
function drawPreview(topLeftCoords, bottomRightCoords) {
    let width = bottomRightCoords.right - topLeftCoords.left;
    let height = bottomRightCoords.bottom - topLeftCoords.top;
    $("#selection-box").css({
        left: topLeftCoords.left + "px",
        top: topLeftCoords.top + "px",
        width: width + "px",
        height: height + "px"
    });
}
function applyToRectangle(topLeftTileElement, callback) {
    const startTilePosition = topLeftTileElement.tilePosition;
    const horizFootprint = Math.floor((bottomCoords.right - topCoords.left) / 16);
    const vertFootprint = Math.floor((bottomCoords.bottom - topCoords.top) / 16);
    const vertEnd = Math.min(tiles.length, startTilePosition.vert + vertFootprint);
    const horizEnd = Math.min(tiles[0].length, startTilePosition.horiz + horizFootprint);
    for (let y = startTilePosition.vert; y < vertEnd; y++) {
        for (let x = startTilePosition.horiz; x < horizEnd; x++) {
            callback({
                tile: tiles[y][x],
                rectanglePosX: x - startTilePosition.horiz,
                rectanglePosY: y - startTilePosition.vert
            });
        }
    }
}
function generateTileSetCoords(current) {
    return {
        x: current.rectanglePosX * 16 + topCoords.left,
        y: current.rectanglePosY * 16 + topCoords.top
    };
}
function mouseOverHandler(event) {
    const tile = event.data.tile;
    applyToRectangle(tile, function (current) {
        const tileSetCoords = generateTileSetCoords(current);
        const layer = (additiveMode) ? current.tile.elementPosition : currentLayer;
        current.tile.ghostDisplay("/images/tileset-outside.png", tileSetCoords, layer);
    });
}
function mouseOutHandler(event) {
    const tile = event.data.tile;
    applyToRectangle(tile,function (current) {
        const layer = (additiveMode) ? current.tile.elementPosition : currentLayer;
        current.tile.removeGhostDisplay(layer);
    });
}
function clickHandler(event) {
    const tile = event.data.tile;
    if (event.shiftKey && event.button === 0) {
        if (additiveMode) {
            alert("Deleting sprites in additive mode currently not supported");
        } else {
            tile.setSprite("/images/empty-transparent.png", {x: 0, y: 0}, currentLayer);
        }
    } else if (event.button === 0) {
        applyToRectangle(tile, function (current) {
            const tileSetCoords = generateTileSetCoords(current);
            if (additiveMode) {
                current.tile.addLayer("/images/tileset-outside.png", tileSetCoords);
            } else {
                current.tile.setSprite("/images/tileset-outside.png", tileSetCoords, currentLayer);
            }
        });
    }
}
function registerTileHandlers() {
    tiles.forEach(function (row) {
        row.forEach(function (tile) {
            tile.element.on('mouseover', {tile}, mouseOverHandler)
                .on('mouseout', {tile}, mouseOutHandler)
                .on('click', {tile}, clickHandler);
        });
    });
}

let topCoords = {};
let bottomCoords = {};
let tiles = [];
let layers = 0;
let currentLayer = 0;
let additiveMode = false;

$("#level-editor").on('keyup', function (event) {
    //Keypress is between '0' (keycode 48) and '9' (keycode 57)
    let keyCode = event.keyCode;
    if (keyCode >= 48 && keyCode <= 57) {
        const number = keyCode - 48;
        //This is a valid layer index
        if (number < layers) {
            additiveMode = false;
            currentLayer = number;
            $("#layer-number-display").text(currentLayer);
        }
    }
    //a for additive mode
    if (keyCode === 65) {
        additiveMode = true;
        $("#layer-number-display").text("Additive mode");
    }
});
$("#tile-set").on('click', function (event) {
    let clickCoord = {x: event.offsetX, y: event.offsetY};
    let xOffset = (event.ctrlKey) ? 8 : 0;
    let yOffset = (event.ctrlKey) ? 8 : 0;
    if (!event.shiftKey && event.button === 0) {
        topCoords = boundingTileCoordsTop(clickCoord, xOffset, yOffset);
    }
    bottomCoords = boundingTileCoordsBottom(clickCoord, xOffset, yOffset);
    drawPreview(topCoords, bottomCoords);
});
$("#tile-dimension-form").on('submit', function (event) {
    const values = event.target.elements;
    const width = values.width.value;
    const height = values.height.value;
    layers = values.layers.value;
    tiles = generateEmptyTileGrid(width, height, 16, 16, "#level-tiles", layers);
    registerTileHandlers();
    return false;
});
