function formatToFixed(number, digits) {
    let numberString = number.toString();
    //This method puts the onus on the caller to make sure that number will always have the
    //maximum (digits) number of digits or less.
    return "0".repeat(digits - numberString.length) + numberString;
}
function generateTileGrid(xDivs, yDivs, windowWidth, windowHeight) {
    let deltaX = windowWidth / xDivs;
    let deltaY = windowHeight / yDivs;
    let gameTiles = $("#game-tiles");
    //Generate in rows, this is an arbitrary decision.
    for (let y = 0; y < yDivs; y++) {
        for (let x = 0; x < xDivs; x++) {
            //Use the fact that RGB values are 256^3
            let randomColor = Math.floor(Math.random() * 16777215).toString(16);
            //Hacky code used to generate div elements to prove this can even work
            gameTiles.append(
                "<div id='" + formatToFixed(x) + formatToFixed(y) + "'" +
                " style='background-color: #" + randomColor + "; " +
                "width: " + deltaX + "px; height: " + deltaY + "px; " +
                "position: absolute; left: " + x * deltaX + "px; " +
                "top: " + y * deltaY + "px;'  class='game-tile'></div>"
            );
        }
    }
}

let windowHeight = $(document).height();
let windowWidth = $(document).width();

//The choice of 64 and 36 is arbitrary
generateTileGrid(64, 36, windowWidth, windowHeight);
$("#game-tiles").animate({ left: "100%" }, 4000).animate({left: "0%"}, 3000).animate({top: "100%"}, 2000).animate({top: "0%"}, 1000);