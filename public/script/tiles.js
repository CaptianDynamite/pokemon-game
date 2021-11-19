function formatToFixed(number, digits) {
    let numberString = number.toString();
    //This method puts the onus on the caller to make sure that number will always have the
    //maximum (digits) number of digits or less.
    return "0".repeat(digits - numberString.length) + numberString;
}
function generateTileGrid(xDivs, yDivs, tileWidth, tileHeight, tileGrid) {
    let gameTiles = $(tileGrid);
    //Generate in rows, this is an arbitrary decision.
    let counter = 1;
    for (let y = 0; y < yDivs; y++) {
        for (let x = 0; x < xDivs; x++) {
            //Hacky code used to generate div elements to prove this can even work
            gameTiles.append(
                "<div class='tile' style='" +
                "width: " + tileWidth + "px; height: " + tileWidth + "px; " +
                "position: absolute; left: " + x * tileWidth + "px; " +
                "top: " + y * tileHeight + "px;'  class='game-tile'></div>"
            );
            counter++;
        }
    }
}