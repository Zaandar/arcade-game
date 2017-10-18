const numRows = 6;
const numCols = 5;

// Enemies our player must avoid
var Enemy = function(LocX, LocY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = LocX;
    this.y = LocY;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // console.log("time delta: " + dt);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player{
    constructor(){
        this.sprite = 'images/char-horn-girl.png';
    }

    update(){}

    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(){}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let halfRowHeight = 21.5;
let bottomOfRow = 83;
let columnWidth = 101;

let row1x = 0 * columnWidth;
let row1y = (0 * bottomOfRow) - halfRowHeight;

let row2x = 1 * columnWidth;
let row2y = (1 * bottomOfRow) - halfRowHeight;

let row3x = 2 * columnWidth;
let row3y = (2 * bottomOfRow) - halfRowHeight;

let row4x = 3 * columnWidth;
let row4y = (3 * bottomOfRow) - halfRowHeight;

let row5x = 4 * columnWidth;
let row5y = (4 * bottomOfRow) - halfRowHeight;

let player = new Player();
let allEnemies = [];

for (let row = 1; row <numRows-2; row++){
    for (let col = 0; col < numCols; col++) {

        let x = col * columnWidth;
        let y = (row * bottomOfRow) - halfRowHeight;

        allEnemies.push(new Enemy(x, y));
    }
}

console.log(allEnemies);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
