// script.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const scoreDisplay = document.getElementById('score');

    canvas.width = 320;
    canvas.height = 480;

    let bird = { x: 50, y: canvas.height / 2, width: 30, height: 30, gravity: 0.5, lift: -10, velocity: 0 };
    let pipes = [];
    let score = 0;
    let gameInterval;
    let isPaused = false;

    startButton.addEventListener('click', startGame);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            bird.velocity = bird.lift;
        }
    });

    function startGame() {
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        scoreDisplay.textContent = `Score: 0`;
        startButton.style.display = 'none';
        gameInterval = setInterval(gameLoop, 20);
    }

    function gameLoop() {
        if (!isPaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBird();
            handlePipes();
            checkCollisions();
            updateScore();
            applyGravity();
        }
    }

    function drawBird() {
        ctx.fillStyle = '#ff0';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }

    function handlePipes() {
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 150) {
            let pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 100; // Increased minimum height
            pipes.push({
                x: canvas.width,
                width: 40,
                height: pipeHeight,
                gap: 200, // Increased gap size
                speed: 1 // Slower pipe speed
            });
        }

        pipes.forEach(pipe => {
            pipe.x -= pipe.speed;
            ctx.fillStyle = '#0f0';
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.height);
            ctx.fillRect(pipe.x, pipe.height + pipe.gap, pipe.width, canvas.height - pipe.height - pipe.gap);
        });

        pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
    }

    function checkCollisions() {
        pipes.forEach(pipe => {
            if (
                bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipe.gap)
            ) {
                endGame();
            }
        });

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            endGame();
        }
    }

    function updateScore() {
        pipes.forEach(pipe => {
            if (pipe.x + pipe.width === bird.x) {
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            }
        });
    }

    function applyGravity() {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        if (bird.y + bird.height > canvas.height) {
            bird.y = canvas.height - bird.height;
            bird.velocity = 0;
        }
        if (bird.y < 0) {
            bird.y = 0;
            bird.velocity = 0;
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        startButton.style.display = 'block';
        alert(`Game Over! Your Score: ${score}`);
    }
});
