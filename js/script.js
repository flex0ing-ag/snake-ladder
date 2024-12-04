// Game constants and variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('../assets/music/food.mp3');
const gameOverSound = new Audio('../assets/music/gameover.mp3');
const moveSound = new Audio('../assets/music/move.mp3');
const musicSound = new Audio('../assets/music/music.mp3');
const hiscoreBox = document.getElementById('hiscoreBox');
const scoreBox = document.getElementById('scoreBox'); // Added reference to score box
let speed = 8;
let lastPaintTime = 0;
let score = 0;
let hiscoreval = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let treat = { x: 0, y: 0 };
let treatTimeout;
let treatActive = false;

//game loop = the game is painting something continuously 
//whenever we are rendering we use window animation 


// Game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Check if snake collides with itself or walls
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game over! Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        return;
    }

    // Check if snake eats the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "High Score: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        food = { x: Math.round(2 + 14 * Math.random()), y: Math.round(2 + 14 * Math.random()) };
    }

    // Check if snake eats the treat
    if (treatActive && snakeArr[0].x === treat.x && snakeArr[0].y === treat.y) {
        score += 5;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "High Score: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        removeTreat();
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Display snake and food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    // Display treat if active
    if (treatActive) {
        const treatElement = document.createElement('div');
        treatElement.style.gridRowStart = treat.y;
        treatElement.style.gridColumnStart = treat.x;
        treatElement.classList.add('treat');
        board.appendChild(treatElement);
    }
}

function spawnTreat() {
    if (treatActive) return;
    treat.x = Math.floor(Math.random() * 18) + 1;
    treat.y = Math.floor(Math.random() * 18) + 1;
    if (treat.x === food.x && treat.y === food.y) return spawnTreat();
    treatActive = true;
    treatTimeout = setTimeout(removeTreat, 5000);
}

function removeTreat() {
    treatActive = false;
    clearTimeout(treatTimeout);
}

setInterval(() => {
    if (!treatActive) spawnTreat();
}, Math.random() * 5000 + 3000); // Random interval 3-8 seconds

// Main logic
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "High Score: " + hiscoreval;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp": inputDir = { x: 0, y: -1 }; break;
        case "ArrowDown": inputDir = { x: 0, y: 1 }; break;
        case "ArrowLeft": inputDir = { x: -1, y: 0 }; break;
        case "ArrowRight": inputDir = { x: 1, y: 0 }; break;
    }
});
