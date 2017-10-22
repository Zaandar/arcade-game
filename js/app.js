const numRows = 6;
const numCols = 5;
const rowOffset = 21.5;
const rowHeight = 83;
const columnWidth = 101;
const boardWidth = numCols * columnWidth;
const boardHeight = numRows * rowHeight;
let won = false;
let lost = false;
let deltaX = 0;
let deltaY = 0;
let allEnemies = [];
let grid = [];

// generate a random number within a given range
function generateRandomInRange(min, max) {
    let rand = Math.random() * (max - min) + min;
    return rand;
}

// Enemies our player must avoid
class Enemy {
    constructor(locX, locY) {

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';

        // the enemy's current location
        this.x = locX;
        this.y = locY;

        // random speed for each enemy
        this.speedMultiplier = generateRandomInRange(100, 200);
    }

    // Update the enemy's position
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // Multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        if (this.speedMultiplier != null) {
            this.x = this.x + (this.speedMultiplier * dt);
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Our player
class Player {
    constructor() {
        // default location for player
        this.initialX = 2 * columnWidth;
        this.initialY = (5 * rowHeight) - rowOffset;

        // the image for our player
        this.sprite = 'images/char-horn-girl.png';

        // the player's current location
        this.x = this.initialX;
        this.y = this.initialY;
    }

    // generate offset for each key press
    static handleInput(keyCode) {
        switch (keyCode) {
            case "left":
                deltaX = -columnWidth;
                deltaY = 0;
                break;
            case "right":
                deltaX = columnWidth;
                deltaY = 0;
                break;
            case "up":
                deltaX = 0;
                deltaY = -rowHeight;
                break;
            case "down":
                deltaX = 0;
                deltaY = rowHeight;
                break;
        }
    }

    update() {
        if (!won && !lost) {
            // if the player moved along x, calculate their new location
            if (deltaX !== 0) {
                let newX = this.x + deltaX;

                // if their new location is inside the board, set the
                // player's new location
                if (newX >= 0 && newX <= (boardWidth - columnWidth)) {
                    this.x = newX;
                }
            }

            // if the player moved along y, calculate their new location
            if (deltaY !== 0) {
                let newY = this.y + deltaY;

                // if their new location is inside the board, set the
                // player's new location
                if (newY >= (0 - rowHeight) && newY <= (boardHeight - rowHeight)) {
                    this.y = newY;
                }
            }

            checkForCollision();

            checkForWin();

            // reset to 0 to stop motion
            deltaX = 0;
            deltaY = 0;
        }
    }

    render() {
        /* additional images courtesy of https://pixabay.com. water-311139_640.png and
        cross-296507_640.png resized and renamed for convenience*/
        if (!won && !lost) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
        else if (won) {
            ctx.drawImage(Resources.get('images/water_splash.png'), player.x, player.y + 70);
        }
        else if (lost) {
            ctx.drawImage(Resources.get('images/red_x.png'), player.x, player.y + 70);
        }

    }
}

let player = new Player();

createEnemyRows();

// bugs are only on the concrete tiles
function createEnemyRows() {
    for (let row = 1; row < numRows - 2; row++) {
        let y = (row * rowHeight) - rowOffset;
        grid.push(y);
    }
}

// has player collided with enemy?
function checkForCollision() {
    if (player != null) {
        // go through all enemies and check the distances
        // (x and y) from the player. If too close => collision!
        allEnemies.forEach(function (enemy) {
            if ((Math.abs(player.x - enemy.x) < 60) &&
                (Math.abs(player.y - enemy.y) < 60)) {
                lost = true;

                /* sounds courtesy of http://www.noiseforfun.com */
                var audio = new Audio('sound/NFF-lose.wav');
                audio.play();

                // reset player/game
                setTimeout(resetPlayer, 700);
            }
        });
    }
}

function checkForWin() {
    // has player collided with enemy?
    if (player != null) {
        if (player.y < (rowHeight - rowOffset)) {
            // display splash image
            won = true;

            /* sounds courtesy of http://www.noiseforfun.com*/
            var audio = new Audio('sound/NFF-twinkle.wav');
            audio.play();

            // reset player/game
            setTimeout(resetPlayer, 1000);
        }
    }
}

function resetPlayer() {
    won = false;
    lost = false;
    player.x = player.initialX;
    player.y = player.initialY;
}

function createEnemy() {
    // pick a row to put the enemy on
    let row = Math.floor(generateRandomInRange(0, 3));

    // add enemy
    allEnemies.push(new Enemy(0, grid[row]));

    // clean up old bugs 
    if (allEnemies.length > 25) {
        allEnemies.shift();
    }
};

// generate an enemy every few fractions of a second
let seconds = generateRandomInRange(.5, .75) * 1000;
setInterval(function () {
    createEnemy();
}, seconds);

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    Player.handleInput(allowedKeys[e.keyCode]);
});
