const numRows = 6;
const numCols = 5;
const rowOffset = 21.5;
const rowHeight = 83;
const columnWidth = 101;
const boardWidth = numCols * columnWidth;
const boardHeight = numRows * rowHeight;
let deltaX = 0;
let deltaY = 0;
let allEnemies = [];
let grid = [];

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
        this.x = locX;
        this.y = locY;
        this.speedMultiplier = generateRandomInRange(130, 200);
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
        this.sprite = 'images/char-horn-girl.png';

        this.x = 2 * columnWidth;
        this.y = (5 * rowHeight) - rowOffset;
    }

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
        if (deltaX !== 0) {
            let newX = this.x + deltaX;
            if (newX >= 0 && newX <= (boardWidth - columnWidth)) {
                this.x = newX;
            }
        }

        if (deltaY !== 0) {
            let newY = this.y + deltaY;
            if (newY >= (0 - rowHeight) && newY <= (boardHeight - rowHeight)) {
                this.y = newY;
            }
        }

        // reset to 0 to stop motion
        deltaX = 0;
        deltaY = 0;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

let player = new Player();

createEnemyRows();

function createEnemyRows() {
    for (let row = 1; row < numRows - 2; row++) {
        let y = (row * rowHeight) - rowOffset;
        grid.push(y);
    }
}

function createEnemy() {
    // pick a row to put the enemy on
    let row = Math.floor(generateRandomInRange(0, 3));

    // add enemy
    allEnemies.push(new Enemy(0, grid[row]));

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
