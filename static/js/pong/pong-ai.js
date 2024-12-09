// window.onload = function () {
//     const popup = document.getElementById('popup');
//     const canvas = document.getElementById('gameCanvas');
//     const ctx = canvas.getContext('2d');
//     const startBtn = document.getElementById('start-game');
//     const themeSelect = document.getElementById('theme');
//     const roundsInput = document.getElementById('rounds');
//     const restartBtn = document.getElementById('restart');
//     const quitBtn = document.getElementById('quit');
//     const resultPopup = document.getElementById('result-popup');
//     const resultText = document.getElementById('result-text');

//     let ballX = canvas.width / 2, ballY = canvas.height / 2;
//     let ballSpeedX = 3, ballSpeedY = 3;
//     const paddleHeight = 100, paddleWidth = 10;
//     let player1Y = canvas.height / 2 - paddleHeight / 2;
//     let aiY = canvas.height / 2 - paddleHeight / 2;
//     let playerScore = 0, aiScore = 0;
//     let maxRounds;
//     let gameOver = false; 

//     // Start Game
//     startBtn.onclick = function () {
//         maxRounds = parseInt(roundsInput.value);
//         setTheme(themeSelect.value);
//         popup.style.display = 'none';
//         canvas.style.display = 'block';
//         startGame();
//     };

//     // Theme Handling
//     function setTheme(theme) {
//         if (theme === 'football') {
//             canvas.style.backgroundImage = "url('{% static 'assets/pong/1.jpg' %}')"; // Football Theme Image
//         } else if (theme === 'basketball') {
//             canvas.style.backgroundImage = "url('{% static 'assets/pong/2.jpg' %}')"; // Basketball Theme Image
//         } else {
//             canvas.style.backgroundColor = '#000'; // Default Black
//         }
//     }

//     // Game Logic
//     function update() {
//         if (gameOver) return; 

//         // Ball Movement
//         ballX += ballSpeedX;
//         ballY += ballSpeedY;

//         // Bounce off Top/Bottom Walls
//         if (ballY <= 0 || ballY >= canvas.height) {
//             ballSpeedY = -ballSpeedY;
//         }

//         // Paddle Collision
//         if (
//             ballX <= paddleWidth &&
//             ballY >= player1Y &&
//             ballY <= player1Y + paddleHeight
//         ) {
//             ballSpeedX = -ballSpeedX;
//         }
//         if (
//             ballX >= canvas.width - paddleWidth &&
//             ballY >= aiY &&
//             ballY <= aiY + paddleHeight
//         ) {
//             ballSpeedX = -ballSpeedX;
//         }

//         // AI Movement
//         if (aiY + paddleHeight / 2 < ballY) aiY += 3;
//         if (aiY + paddleHeight / 2 > ballY) aiY -= 3;

//         // Scoring
//         if (ballX <= 0) {
//             aiScore++;
//             resetBall();
//         } else if (ballX >= canvas.width) {
//             playerScore++;
//             resetBall();
//         }

//         if (playerScore >= maxRounds || aiScore >= maxRounds) {
//             endGame();
//         }
//     }

//     function resetBall() {
//         ballX = canvas.width / 2;
//         ballY = canvas.height / 2;
//         ballSpeedX = -ballSpeedX;
//     }

//     function draw() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         // Draw Paddles
//         ctx.fillStyle = 'white';
//         ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
//         ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

//         // Draw Ball
//         ctx.beginPath();
//         ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
//         ctx.fillStyle = 'white';
//         ctx.fill();

//         // Draw Scores
//         ctx.font = '20px Arial';
//         ctx.fillText(`Player: ${playerScore}`, 50, 30);
//         ctx.fillText(`AI: ${aiScore}`, canvas.width - 100, 30);
//     }

//     function gameLoop() {
//         update();
//         draw();
//         if (!gameOver) {
//             requestAnimationFrame(gameLoop); 
//         }
//     }

//     function endGame() {
//         gameOver = true; 
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.font = '30px Arial';
//         ctx.fillStyle = 'white';
//         const winner = playerScore > aiScore ? 'Player Wins!' : 'AI Wins!';
//         resultText.textContent = winner;
//         resultPopup.style.display = 'block'; 
//     }

//     // Player Movement
//     document.addEventListener('keydown', (e) => {
//         if (e.key === 'ArrowUp' && player1Y > 0) player1Y -= 20;
//         if (e.key === 'ArrowDown' && player1Y < canvas.height - paddleHeight) player1Y += 20;
//     });

//     // Restart or Quit
//     restartBtn.onclick = () => {
//         playerScore = aiScore = 0;
//         gameOver = false;
//         resultPopup.style.display = 'none';
//         canvas.style.display = 'block';
//         startGame();
//     };

//     quitBtn.onclick = () => {
//         resultPopup.style.display = 'none';
//         popup.style.display = 'block';
//     };
// };
