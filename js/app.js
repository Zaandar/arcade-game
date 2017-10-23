const NUM_ROWS = 6;
const NUM_COLS = 5;
const ROW_OFFSET = 21.5;
const ROW_HEIGHT = 83;
const COLUMN_WIDTH = 101;
const BOARD_WIDTH = NUM_COLS * COLUMN_WIDTH;
const BOARD_HEIGHT = NUM_ROWS * ROW_HEIGHT;

// default location for player
const INITIAL_PLAYER_X = 2 * COLUMN_WIDTH;
const INITIAL_PLAYER_Y = (5 * ROW_HEIGHT) - ROW_OFFSET;

let won = false;
let lost = false;
let deltaX = 0;
let deltaY = 0;
let allEnemies = [];
let grid = [];


// generate a random number within a given range
function generateRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

class GameEntity{
    constructor(locX, locY, image){
        // The image/sprite for our entity, this uses
        // a helper we've provided to easily load images
        this.sprite = image;

        // the entity's current location
        this.x = locX;
        this.y = locY;
    }

    // Update the enemy's position
    // Parameter: dt, a time delta between ticks
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    update(dt){
        throw new Error('Function must be implemented in inherited class');
    };

    // Draw the enemy on the screen, required method for game
    render(){
        throw new Error('Function must be implemented in inherited class');
    };
}

// Enemies our player must avoid
class Enemy extends GameEntity{
    constructor(locX, locY, image) {
        super(locX, locY, image);

        // random speed for each enemy
        this.speedMultiplier = generateRandomInRange(100, 200);
    }

    update(dt) {
        if (this.speedMultiplier !== null) {
            this.x = this.x + (this.speedMultiplier * dt);
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Our player
class Player extends GameEntity{
    constructor(image) {
        super(INITIAL_PLAYER_X, INITIAL_PLAYER_Y, image);
    }

    update() {
        if (!won && !lost) {
            // if the player moved along x, calculate their new location
            if (deltaX !== 0) {
                let newX = this.x + deltaX;

                // if their new location is inside the board, set the
                // player's new location
                if (newX >= 0 && newX <= (BOARD_WIDTH - COLUMN_WIDTH)) {
                    this.x = newX;
                }
            }

            // if the player moved along y, calculate their new location
            if (deltaY !== 0) {
                let newY = this.y + deltaY;

                // if their new location is inside the board, set the
                // player's new location
                if (newY >= (0 - ROW_HEIGHT) && newY <= (BOARD_HEIGHT - ROW_HEIGHT)) {
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
        cross-296507_640.png re-sized and renamed for convenience*/
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

    // generate offset for each key press
    static handleInput(keyCode) {
        switch (keyCode) {
            case "left":
                deltaX = -COLUMN_WIDTH;
                deltaY = 0;
                break;
            case "right":
                deltaX = COLUMN_WIDTH;
                deltaY = 0;
                break;
            case "up":
                deltaX = 0;
                deltaY = -ROW_HEIGHT;
                break;
            case "down":
                deltaX = 0;
                deltaY = ROW_HEIGHT;
                break;
        }
    }
}

let player = new Player('images/char-horn-girl.png');

createEnemyRows();

// bugs are only on the concrete tiles
function createEnemyRows() {
    for (let row = 1; row < NUM_ROWS - 2; row++) {
        let y = (row * ROW_HEIGHT) - ROW_OFFSET;
        grid.push(y);
    }
}

// has player collided with enemy?
function checkForCollision() {
    if (player !== null) {
        // go through all enemies and check the distances
        // (x and y) from the player. If too close => collision!
        allEnemies.forEach(function (enemy) {
            if ((Math.abs(player.x - enemy.x) < 60) &&
                (Math.abs(player.y - enemy.y) < 60)) {
                lost = true;

                /* sounds courtesy of http://www.noiseforfun.com */
                let audio = new Audio('sound/NFF-lose.wav');
                audio.play();

                // reset player/game
                setTimeout(resetPlayer, 700);
            }
        });
    }
}

function checkForWin() {
    // has player collided with enemy?
    if (player !== null) {
        if (player.y < (ROW_HEIGHT - ROW_OFFSET)) {
            // display splash image
            won = true;

            /* sounds courtesy of http://www.noiseforfun.com*/
            let audio = new Audio('sound/NFF-twinkle.wav');
            audio.play();

            // reset player/game
            setTimeout(resetPlayer, 1000);
        }
    }
}

function resetPlayer() {
    won = false;
    lost = false;
    player.x = INITIAL_PLAYER_X;
    player.y = INITIAL_PLAYER_Y;
}

function createEnemy() {
    // pick a row to put the enemy on
    let row = Math.floor(generateRandomInRange(0, 3));

    // add enemy
    allEnemies.push(new Enemy(0, grid[row], 'images/enemy-bug.png'));

    // clean up old bugs
    if (allEnemies.length > 25) {
        allEnemies.shift();
    }
}

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
