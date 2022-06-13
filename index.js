let unitLength = document.getElementById("zoom");
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let colorChange = document.querySelector(`#chosen-color`);
let rulesText1 = document.getElementById("rules-text1");
let rulesText2 = document.getElementById("rules-text2");
let rulesText3 = document.getElementById("rules-text3");
let fr = document.getElementById("frameRate");
let randomButton = document.querySelector(`#random`);


function setup() {
    /* Set the canvas to be under the element #canvas*/
    let canvas = createCanvas(windowWidth, windowHeight - 100);
    canvas.parent(document.querySelector('#canvas'));

    /*Calculate the number of columns and rows */
    columns = floor(windowWidth);
    rows = floor(windowHeight - 100);

    // set the frameRate
    // frameRate(fr.value); // Attempt to refresh at starting FPS


    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard
}

/**
* Initialize/reset the board state
*/
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            // if (rd == false) {
            currentBoard[i][j] = {
                //Objects
                alive: false,
                color: colorChange.value,
                //array save nextBoard color?

            };
            nextBoard[i][j] = {
                alive: false,
                color: boxColor(i, j),

            };
        }
    }
}


function draw() {
    columns = floor(width / 10);
    rows = floor(height / 10);

    frameRate(frame());
    background(255);
    generate();

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j].alive) {
                fill(boxColor(i, j));
            } else {
                fill(255);
            }
            stroke(strokeColor);
            rect(i * zoom(), j * zoom(), zoom(), zoom());
        }
    }
}

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight - 100);
// }

function boxColor(x, y) {
    return currentBoard[x][y].color
}

function inputRules1() {
    return rulesText1.value
}

function inputRules2() {
    return rulesText2.value
}

function inputRules3() {
    return rulesText3.value
}

function outputNextColor() {
    return nextBoard[x][y].color
}

function frame() {
    return parseInt(fr.value)
}

function zoom() {
    return parseInt(unitLength.value)
}

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    let neighborsX = (x + i + columns) % columns;
                    let neighborsY = (y + j + rows) % rows
                    if (currentBoard[neighborsX][neighborsY].alive) {
                        neighbors = neighbors + 1
                    }
                }
            }

            // Rules of Life
            if (currentBoard[x][y].alive == true && neighbors < inputRules1()) {
                // Die of Loneliness
                nextBoard[x][y].alive = false;
                // nextBoard[x][y].color = 255;
            } else if (currentBoard[x][y].alive == true && neighbors > inputRules2()) {
                // Die of Overpopulation
                nextBoard[x][y].alive = false;
                // nextBoard[x][y].color = 255;
            } else if (currentBoard[x][y].alive == false && neighbors == inputRules3()) {
                // New life due to Reproduction
                nextBoard[x][y].alive = true;
                nextBoard[x][y].color = currentBoard[x][y].color;
            } else {
                // Stasis
                nextBoard[x][y].alive = currentBoard[x][y].alive;
                // nextBoard[x][y].color = currentBoard[x][y].color;

            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}


/**
 * When mouse is pressed
 */
function mousePressed() {
    noLoop();
    mouseDragged();
}

/**
 * When mouse is released
 */
// function mouseReleased() {
//     loop();
// }

/**
 * When mouse is dragged
 */
function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > zoom() * columns || mouseY > zoom() * rows) {
        return;
    }
    const x = Math.floor(mouseX / zoom());
    const y = Math.floor(mouseY / zoom());
    currentBoard[x][y].alive = true;
    currentBoard[x][y].color = colorChange.value;
    nextBoard[x][y].color = colorChange.value;
    fill(boxColor(x, y));
    stroke(strokeColor);
    rect(x * zoom(), y * zoom(), zoom(), zoom());
}

//<-------------------Click Events-------------->


// const clickEvents = document.querySelectorAll('.controlButton > button')
// for (const clickEvent of clickEvents) {
//     clickEvent.addEventListener('click', function() {

document.querySelector('#reset-game')
    .addEventListener('click', function () {
        init();
        loop();
    });

document.querySelector('#play')
    .addEventListener('click', function () {
        loop();
    });
document.querySelector('#stop')
    .addEventListener('click', function () {
        noLoop();
    });
document.querySelector('#next')
    .addEventListener('click', function () {
        loop();
        noLoop();
        loop();
        noLoop();
    });

document.querySelector('#zoom')
    .addEventListener('click', function () {
        loop();
    });

document.querySelector("#random").addEventListener("click", function () {
    loop();
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = {
                alive: Math.random() > 0.5 ? true : false,
                color: colorChange.value,
            }

        }
    }
});