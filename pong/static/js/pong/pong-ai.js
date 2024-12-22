export function PongAI()
{
    const settingsPopup = document.getElementById('settings-popup');
    const username = settingsPopup.dataset.user;
    const startGameBtn = document.getElementById('start-game');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const themeSelect = document.getElementById('theme');
    const roundsInput = document.getElementById('rounds');
    const paddleColorInput = document.getElementById('paddle-color');
    const speedSelect = document.getElementById('speed');
    const resultPopup = document.getElementById('result-popup');
    const resultText = document.getElementById('result-text');
    const scoreText = document.getElementById('score-text');
    const restartBtn = document.getElementById('restart');

    let ballX = canvas.width / 2, ballY = canvas.height / 2;
    let ballSpeedX = 3, ballSpeedY = 3;
    const paddleHeight = 100, paddleWidth = 10;
    let player1Y = canvas.height / 2 - paddleHeight / 2;
    let aiY = canvas.height / 2 - paddleHeight / 2;
    let playerScore = 0, aiScore = 0;
    let maxRounds = 5;
    let theme = 'default';
    let gameOver = false;
    let playerMovingUp = false;
    let playerMovingDown = false;
    let gameInterval;
    let startTime;
    let gameSpeed = 1; 
    let speedIncreaseInterval;
    

    if (!scoreText) return;

    startGameBtn.onclick = function () {
        const roundsValue = parseInt(roundsInput.value);
        maxRounds = roundsValue;
        theme = themeSelect.value;
        gameSpeed = parseFloat(speedSelect.value);
        applyTheme(theme);
        settingsPopup.style.display = 'none';
        canvas.style.display = 'block';
        startGame();
    };

    function applyTheme(theme) {
        if (theme == 'football') {
            canvas.style.backgroundImage = "url('/static/assets/pong/1.jpg')";
            canvas.style.backgroundSize = 'cover';
            canvas.style.backgroundRepeat = 'center';
            canvas.style.backgroundPosition = 'center';
        }
        else if (theme == 'basketball') {
            canvas.style.backgroundImage = "url('/static/assets/pong/2.jpg')";
            canvas.style.backgroundSize = 'cover';
            canvas.style.backgroundRepeat = 'center';
            canvas.style.backgroundPosition = 'center';
        }
        else
            canvas.style.backgroundColor = 'darkgreen';
    }

    function startGame() {
        startTime = new Date();
        gameOver = false;
        playerScore = 0;
        aiScore = 0;

        speedIncreaseInterval = setInterval(() => {
            gameSpeed *= 1.25; 
        }, 5000); 

        gameInterval = setInterval(() => {
            if (!gameOver) {
                update();
                draw();
            }
        }, 15);
    }

    function update() {
        if (gameOver) return;
    
        ballX += ballSpeedX * gameSpeed;
        ballY += ballSpeedY * gameSpeed;
    
        if (playerMovingUp) player1Y = Math.max(player1Y - 5 * gameSpeed, 0);
        if (playerMovingDown) player1Y = Math.min(player1Y + 5 * gameSpeed, canvas.height - paddleHeight);
    
        if (ballY <= 0 || ballY >= canvas.height)
            ballSpeedY = -ballSpeedY;
    
        if (ballX <= paddleWidth && ballY >= player1Y && ballY <= player1Y + paddleHeight)
            ballSpeedX = -ballSpeedX;
    
        if (ballX >= canvas.width - paddleWidth && ballY >= aiY && ballY <= aiY + paddleHeight)
            ballSpeedX = -ballSpeedX;
    
        if (ballX <= 0) {
            aiScore++;
            resetBall();
        }
        else if (ballX >= canvas.width) {
            playerScore++;
            resetBall();
        }
    
        if (playerScore >= maxRounds || aiScore >= maxRounds)
            endGame();
    
        const aiCenter = aiY + paddleHeight / 2;
        
        if (ballX >= canvas.width / 2)
        {
            let randomError = Math.random(); 
            const aiSpeed = 3 * gameSpeed; 
            if (randomError < 0.1)
                aiY += Math.random() > 0.5 ? 1 : -1;
            else
            {
                if (ballY > aiCenter + 20)
                    aiY = Math.min(aiY + aiSpeed, canvas.height - paddleHeight);
                else if (ballY < aiCenter - 20)
                    aiY = Math.max(aiY - aiSpeed, 0);
            }
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = paddleColorInput.value;
        ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.font = '20px Arial';
        ctx.fillText(`${username}: ${playerScore}`, 50, 30);
        ctx.fillText(`AI: ${aiScore}`, canvas.width - 100, 30);
    }

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = ballSpeedY; 
        gameOver = true; 
    }

    function endGame() {
        gameOver = true;
        clearInterval(gameInterval);
        clearInterval(speedIncreaseInterval); 
        const winner = playerScore > aiScore ? `${username} Wins!` : 'AI Wins!';
        resultText.textContent = winner;
        scoreText.textContent = `${username}: ${playerScore} - AI: ${aiScore}`;
        resultPopup.style.display = 'flex';
        const endTime = new Date();
        const gameDuration = (endTime - startTime) / 1000;
        const gameResult = {username: username, player_score: playerScore, ai_score: aiScore, duration: gameDuration};
        
        fetch('/pong-game-save/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify(gameResult),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Game result saved:', data);
            })
            .catch(error => {
                console.error('Error saving game result:', error);
            });
    }

    restartBtn.onclick = function () {
        resultPopup.style.display = 'none';
        settingsPopup.style.display = 'block';
        canvas.style.display = 'none';
        ballSpeedX = 3;
        ballSpeedY = 3;
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') playerMovingUp = true;
        if (e.key === 'ArrowDown') playerMovingDown = true;
        if (e.key === 'w') playerMovingUp = true;
        if (e.key === 's') playerMovingDown = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp') playerMovingUp = false;
        if (e.key === 'ArrowDown') playerMovingDown = false;
        if (e.key === 'w') playerMovingUp = false;
        if (e.key === 's') playerMovingDown = false;
    });
}
