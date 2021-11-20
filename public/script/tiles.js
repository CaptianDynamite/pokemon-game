class Tile {
    constructor(displayCoords, dimensions, tileSets, tileSetsCoords, tileGrid) {
        let layers = Tile.#tileGenerator(displayCoords, dimensions, tileSets, tileSetsCoords, tileGrid);
        this.element = layers[layers.length - 1];
        this.layers = layers;
        this.displayCoords = {
            x: displayCoords.x,
            y: displayCoords.y
        };
        this.dimensions = {
            width: dimensions.width,
            height: dimensions.height,
            layers: dimensions.layers
        };
        //For top-tile
        tileSets.push("/images/empty-transparent.png");
        tileSetsCoords.push({ x: 0, y: 0 });

        this.sprites = Tile.#generateSprites(tileSets, tileSetsCoords);
    }

    get tilePosition() {
        return {
            horiz: Math.floor(this.displayCoords.x / this.dimensions.width),
            vert: Math.floor(this.displayCoords.y / this.dimensions.height)
        };
    }

    get elementPosition() {
        return this.layers.length - 1;
    }

    ghostDisplay(tileSet, tileSetCoords, layer) {
        Tile.#setBackground(this.layers[layer], tileSet, tileSetCoords);
    }
    removeGhostDisplay(layer) {
        const sprite = this.sprites[layer];
        Tile.#setBackground(this.layers[layer], sprite.tileSet, {
            x: sprite.tileSetX,
            y: sprite.tileSetY
        });
    }

    setSprite(tileSet, tileSetCoords, layer) {
        this.sprites[layer] = {
            tileSet,
            tileSetX: tileSetCoords.x,
            tileSetY: tileSetCoords.y
        }
        Tile.#setBackground(this.layers[layer], tileSet, tileSetCoords);
    }

    addLayer(tileSet, tileSetCoords) {
        const newSprite = {
            tileSet,
            tileSetX: tileSetCoords.x,
            tileSetY: tileSetCoords.y
        }
        this.sprites.push(newSprite);
        this.element.before("<div class='tile'></div>");
        const layer = this.element.prev();
        Tile.#setDisplayPosition(layer, this.displayCoords);
        Tile.#setDisplayDimensions(layer, this.dimensions);
        Tile.#setBackground(layer, tileSet, tileSetCoords);
        //Insert into the position before the top-tile
        this.layers.splice(this.layers.length - 2, 0, layer);
    }

    static #generateSprites(tileSets, tileSetsCoords) {
        let sprites = [];
        for (let i = 0 ; i < tileSets.length; i++) {
            sprites.push({
                tileSet: tileSets[i],
                tileSetX: tileSetsCoords[i].x,
                tileSetY: tileSetsCoords[i].y
            });
        }
        return sprites;
    }

    static #setBackground(layer, tileSet, tileSetCoords) {
        layer.css({
            backgroundImage: "url(" + tileSet + ")",
            backgroundPositionX: -tileSetCoords.x + "px",
            backgroundPositionY: -tileSetCoords.y + "px"
        });
    }
    static #setDisplayPosition(layer, displayCoords) {
        layer.css({
            position: "absolute",
            left: displayCoords.x + "px",
            top: displayCoords.y + "px"
        });
    }
    static #setDisplayDimensions(layer, dimensions) {
        layer.css({
            width: dimensions.width + "px",
            height: dimensions.height + "px"
        });
    }

    static #tileGenerator(displayCoords, dimensions, tileSets, tileSetsCoords, tileGrid) {
        let layers = [];
        for (let i = 0; i < dimensions.layers; i++) {
            tileGrid.append("<div class='tile'></div>");
            let layer = tileGrid.children().last();
            Tile.#setDisplayPosition(layer, displayCoords);
            Tile.#setDisplayDimensions(layer, dimensions);
            Tile.#setBackground(layer, tileSets[i], tileSetsCoords[i]);
            layers.push(layer);
        }
        tileGrid.append("<div class='tile-top'></div>");
        let tileTop = tileGrid.children().last();
        Tile.#setDisplayPosition(tileTop, displayCoords);
        Tile.#setDisplayDimensions(tileTop, dimensions);
        Tile.#setBackground(tileTop, "/images/empty-transparent.png", {x: 0, y: 0});
        layers.push(tileTop);
        return layers;
    }
}

function formatToFixed(number, digits) {
    const numberString = number.toString();
    //This method puts the onus on the caller to make sure that number will always have the
    //maximum (digits) number of digits or less.
    return "0".repeat(digits - numberString.length) + numberString;
}
function generateEmptyTileGrid(xDivs, yDivs, tileWidth, tileHeight, tileGrid, layers= 1) {
    const gridHandle = $(tileGrid);
    gridHandle.css({
        width: tileWidth * xDivs,
        height: tileHeight * yDivs
    });
    let tiles = [];
    //Generate tiles row by row
    for (let y = 0; y < yDivs; y++) {
        let row = [];
        for (let x = 0; x < xDivs; x++) {
            const displayCoords = { x: x * tileWidth, y: y * tileHeight };
            //Layers are handled by each tile
            const dimensions = { width: tileWidth, height: tileHeight, layers };
            let tileSets = [];
            let tileSetsCoords = [];
            for (let i = 0; i < layers; i++) {
                if (i === 0) {
                    tileSets.push("/images/empty-white.png");
                } else {
                    tileSets.push("/images/empty-transparent.png");
                }
                tileSetsCoords.push({ x: 0, y: 0 });
            }
            row.push(new Tile(displayCoords, dimensions, tileSets, tileSetsCoords, gridHandle));
        }
        tiles.push(row);
    }
    // Return the tiles to the caller for further actions.
    return tiles;
}