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
    $("#current-tile-display").css({
        backgroundImage: "url(/images/tileset-outside.png)",
        backgroundPositionX: -topLeftCoords.left,
        backgroundPositionY: -topLeftCoords.top,
        width: width + "px",
        height: height + "px"
    });
}
function registerTileHandlers() {
    $(".tile").on('mouseover', function (event) {
        $(this).css({
            backgroundImage: "url(/images/tileset-outside.png)",
            backgroundPositionX: -topCoords.left,
            backgroundPositionY: -topCoords.top,
        });
    }).on('mouseout', function (event) {
        $(this).css( {
            backgroundImage: null,
            backgroundPositionX: 0,
            backgroundPositionY: 0,
        });
    });
}

let initialSelect = false;
let topCoords = {};

$("#tile-set").on('click', function (event) {
    let clickCoord = {x: event.offsetX, y: event.offsetY};
    let xOffset = (event.ctrlKey) ? 8 : 0;
    let yOffset = (event.ctrlKey) ? 8 : 0;
    if (initialSelect && event.shiftKey) {
        let leftPress = false;
        let bottomCoords = boundingTileCoordsBottom(clickCoord, xOffset, yOffset);
        drawPreview(topCoords, bottomCoords);
    } else {
        initialSelect = true;
        topCoords = boundingTileCoordsTop(clickCoord, xOffset, yOffset);
        let bottomCoords = boundingTileCoordsBottom(clickCoord, xOffset, yOffset);
        drawPreview(topCoords, bottomCoords);
    }
});
$("#tile-dimension-form").on('submit', function (event) {
    let width = event.target.elements.width.value;
    let height = event.target.elements.height.value;
    generateTileGrid(width, height, 16, 16, "#level-tiles");
    registerTileHandlers();
    return false;
});
