function onDocumentLoad() {
    // Create a barrier every 2 seconds
    setInterval(addBarrier, 2000);
    // Call the moveBarriers function periodically
    setInterval(moveBarriers, 100); // Adjust the interval as needed
    setInterval(detectCollision, 1); // Adjust the interval as needed
}

// Create a function to add a barrier to the right of the scene
function addBarrier() {
    // Create a new barrier element
    const barrier = document.createElement('div');
    barrier.classList.add('barrier');

    // Set the height of the barrier's child elements randomly
    const barrierTopHeight = getRandomNumber(20, 60);
    const barrierGap = getRandomNumber(10, 20);
    const barrierBottomHeight = 100 - barrierTopHeight - barrierGap;
    // Set the height attribute of the barrier's child elements
    barrier.innerHTML = `
        <div class="barrier-top" style="height: ${barrierTopHeight}%;"></div>
        <div class="barrier-bottom" style="height: ${barrierBottomHeight}%;"></div>`;

    // Append the barrier to the scene
    const scene = document.querySelector('#scene');
    const sceneWidth = scene.offsetWidth;
    barrier.style.left = `${sceneWidth}px`;
    scene.appendChild(barrier);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Move all barriers to the left by a certain amount
function moveBarriers() {
    const barriers = document.querySelectorAll('.barrier');
    const moveAmount = 10; // Adjust this value to change the amount of movement

    barriers.forEach(barrier => {
        const currentLeft = parseInt(barrier.style.left);
        barrier.style.left = `${currentLeft - moveAmount}px`;
    });
}

function detectCollision() {
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
            alert('Game Over!');
        }
    }
}