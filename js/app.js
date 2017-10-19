const numRows = 6;
const numCols = 5;
const halfRowHeight = 21.5;
const rowHeight = 83;
const columnWidth = 101;
const boardWidth = numCols * columnWidth;
const boardHeight = numRows * rowHeight;
let deltaX = 0;
let deltaY = 0;

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
    this.x = this.x + (10 * dt);
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

        this.x = 2 * columnWidth;
        this.y = (5 * rowHeight) - halfRowHeight;
    }

    update(){
        let newX = this.x + deltaX;
        if (newX >= 0 && newX <= (boardWidth - columnWidth)) {
            this.x = newX;
        }

        let newY = this.y + deltaY;
        if (newY >= (0 - rowHeight) && newY <= (boardHeight - rowHeight)) {
            this.y = newY;
        }

        // reset to 0 to stop motion
        deltaX = 0;
        deltaY = 0;
    }

    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(keyCode){
        switch (keyCode){
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
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let player = new Player();
let allEnemies = [];

for (let row = 1; row <numRows-2; row++){
    for (let col = 0; col < numCols; col++) {

        let x = col * columnWidth;
        let y = (row * rowHeight) - halfRowHeight;

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
