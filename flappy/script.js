let GRAVITY = 0.01;
let JUMPSPEED = 2.0
let REFRESH_RATE = 1; 
let GAP_HEIGHT_MIN = 30
let GAP_HEIGHT_MAX = 40
let JUMP_INTERVAL = 100;  
let HORIZONTAL_SPEED = 2; 
let BARRIER_SPAN_RATE = 2000; 

let birdSpeed = 0.0;
let lastKeyPressTime = 0;
let lastBarrierId = 1;
let score = 0;

let gameIntervals = [];

document.addEventListener('DOMContentLoaded', function () {
    game_start()
});

function game_start() {
    document.getElementById('end-menu').style.display = 'none';
    deleteAllBarriers();
    document.getElementById('bird').style.top = "50%"
    gameIntervals.push(setInterval(addBarrier, BARRIER_SPAN_RATE));
    gameIntervals.push(setInterval(moveBarriers, HORIZONTAL_SPEED));
    gameIntervals.push(setInterval(detectCollisionWithBarrier, 100));
    gameIntervals.push(setInterval(function () { birdSpeed -= GRAVITY; }, REFRESH_RATE));
    gameIntervals.push(setInterval(updateBirdPosition, REFRESH_RATE));
    gameIntervals.push(setInterval(checkCollision, REFRESH_RATE));
    gameIntervals.push(setInterval(updateScore, REFRESH_RATE));
    gameIntervals.push(setInterval(setDirectionOfBird, REFRESH_RATE));

    function handleKeyPress(event) {
        let untilLastKeyPressTime = new Date().getTime() - lastKeyPressTime
        if (event.key == ' ' && untilLastKeyPressTime > JUMP_INTERVAL) {
            lastKeyPressTime = new Date().getTime();
            birdSpeed += JUMPSPEED; // Adjust the speed value as needed
        }
    }

    document.addEventListener('keydown', handleKeyPress);
    getRootWindow().addEventListener('keydown', handleKeyPress);

    birdSpeed = 0.0;
    lastKeyPressTime = 0;
    lastBarrierId = 1;
    score = 0;
}

function setDirectionOfBird() {
    bird = document.querySelector('#bird');
    let angle = birdSpeed * -30.0;
    if (angle > 90) angle = 90;
    else if (angle < -60) angle = -60;
    bird.style.transform = `rotate(${angle}deg)`;
}

function checkCollision() {
    if (detectCollisionWithBarrier() || detectCollisionWithScene()) {
        game_end();
    }
}

function getRootWindow() {
    let currentWindow = window;
    while (currentWindow.parent != currentWindow) {
        currentWindow = currentWindow.parent;
    }
    return currentWindow;
}

function deleteAllBarriers() {
    const barriers = document.querySelectorAll('.barrier');
    barriers.forEach(barrier => barrier.remove());
}

function updateBirdPosition() {
    bird = document.querySelector('#bird');
    let currentTop = parseFloat(window.getComputedStyle(bird).getPropertyValue('top'));
    bird.style.top = (currentTop - birdSpeed) + 'px';
}

// Create a function to add a barrier to the right of the scene
function addBarrier() {

    //Check is window is focused
    if (document.hidden) {
        return;
    }

    // Create a new barrier element
    const barrier = document.createElement('div');
    barrier.classList.add('barrier');
    barrier.id = `barrier_${lastBarrierId++}`;

    // Set the height of the barrier's child elements randomly
    const barrierTopHeight = getRandomNumber(20, 60);
    const barrierGap = getRandomNumber(GAP_HEIGHT_MIN, GAP_HEIGHT_MAX);
    const barrierBottomHeight = 100 - barrierTopHeight - barrierGap;
    // Set the height attribute of the barrier's child elements
    barrier.innerHTML = `
        <div class="barrier-top" style="height: ${barrierTopHeight}%;">
            <div class="barrier-tip"></div> 
        </div>
        <div class="barrier-bottom" style="height: ${barrierBottomHeight}%;">
            <div class="barrier-tip"></div> 
        </div>`;

    const scene = document.querySelector('#scene');
    const sceneWidth = scene.offsetWidth;
    barrier.style.left = `${sceneWidth}px`;
    scene.appendChild(barrier);
}

function updateScore() {
    bird = document.querySelector('#bird');
    barriers = document.getElementsByClassName('barrier')

    big_id = 0;
    for (let barrier of barriers) {
        if (barrier.getBoundingClientRect().right < bird.getBoundingClientRect().left) {
            barrier_id = parseInt(barrier.id.split('_')[1])
            if (score < barrier_id) {
                score = barrier_id;
            }
        }
        else {
            break;
        }
    }
    document.querySelector('#score').innerHTML = score;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function moveBarriers() {
    const barriers = document.querySelectorAll('.barrier');
    const moveAmount = 1;
    barriers.forEach(barrier => {
        const currentLeft = parseInt(barrier.style.left);
        const newLeft = currentLeft - moveAmount;
        if (newLeft < -barrier.offsetWidth) {
            barrier.remove();
        }
        else {
            barrier.style.left = `${newLeft}px`;
        }
    });
}

function detectCollisionWithBarrier() {
    const barriers = document.querySelectorAll('.barrier');
    const birdElement = document.querySelector('#bird');
    const birdRect = birdElement.getBoundingClientRect();

    for (let barrier of barriers) {
        const barrierTopElement = barrier.querySelector('.barrier-top');
        const barrierBottomElement = barrier.querySelector('.barrier-bottom');

        const barrierTopRect = barrierTopElement.getBoundingClientRect();
        const barrierBottomRect = barrierBottomElement.getBoundingClientRect();

        const isAtBarrier = birdRect.right > barrierTopRect.left && birdRect.left < barrierTopRect.right;
        const isAtGap = !(birdRect.top < barrierTopRect.bottom || birdRect.bottom > barrierBottomRect.top);

        if (isAtBarrier && !isAtGap) {
            return true;
        }
    }
    return false;
}

function detectCollisionWithScene() {
    const birdElement = document.querySelector('#bird');
    const birdRect = birdElement.getBoundingClientRect();

    const gameAreaElement = document.querySelector('#scene'); // replace with your game area element
    const gameAreaRect = gameAreaElement.getBoundingClientRect();

    return birdRect.top < gameAreaRect.top || birdRect.bottom > gameAreaRect.bottom;
}
function game_end() {
    document.getElementById('final-score').innerHTML = score;
    document.getElementById('end-menu').style.display = 'block';
    gameIntervals.forEach(interval => clearInterval(interval));

    score = 0;
    birdSpeed = 0;
    lastBarrierId = 0;
}
