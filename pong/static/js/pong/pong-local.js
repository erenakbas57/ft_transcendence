export function PongLocal() {
    const settingsPopup = document.getElementById("settings-popup");
    const startGameBtn = document.getElementById("start-game");
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const themeSelect = document.getElementById("theme");
    let player1Input;
    let player2Input;

    const roundsInput = document.getElementById("rounds");
    const paddleColorInput = document.getElementById("paddle-color");
    const resultPopup = document.getElementById("result-popup");
    const resultText = document.getElementById("result-text");
    const restartBtn = document.getElementById("restart");

    let ballX = canvas.width / 2, ballY = canvas.height / 2;
    let ballSpeedX = 3, ballSpeedY = 3;
    const paddleHeight = 100, paddleWidth = 10;
    let player1Y = canvas.height / 2 - paddleHeight / 2;
    let player2Y = canvas.height / 2 - paddleHeight / 2;
    let player1Score = 0, player2Score = 0;
    let maxRounds = 5;
    let theme = "default";
    let gameOver = false;

    let player1MovingUp = false;  
    let player1MovingDown = false;
    let player2MovingUp = false;
    let player2MovingDown = false;

    let gameInterval;

    startGameBtn.addEventListener('click', function () {
        player1Input = document.getElementById("player1").value.trim();
        player2Input = document.getElementById("player2").value.trim();

        // Eğer isim girilmemişse, varsayılan isimleri kullan
        if (!player1Input) player1Input = "Player 1";
        if (!player2Input) player2Input = "Player 2";

        const roundsValue = parseInt(roundsInput.value);
        maxRounds = roundsValue;
        theme = themeSelect.value;
        applyTheme(theme);
        settingsPopup.style.display = "none";
        canvas.style.display = "block";
        startGame();
    });

    function applyTheme(theme) {
        if (theme === "football") {
            canvas.style.backgroundImage = "url('/static/assets/pong/1.jpg')";
            canvas.style.backgroundSize = "cover";
            canvas.style.backgroundPosition = "center";
        } else if (theme === "basketball") {
            canvas.style.backgroundImage = "url('/static/assets/pong/2.jpg')";
            canvas.style.backgroundSize = "cover";
            canvas.style.backgroundPosition = "center";
        } else {
            canvas.style.backgroundColor = "grey";
        }
    }

    function update() {
        if (gameOver) return;

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (player1MovingUp) player1Y = Math.max(player1Y - 5, 0);
        if (player1MovingDown) player1Y = Math.min(player1Y + 5, canvas.height - paddleHeight);
        if (player2MovingUp) player2Y = Math.max(player2Y - 5, 0);
        if (player2MovingDown) player2Y = Math.min(player2Y + 5, canvas.height - paddleHeight);

        if (ballY <= 0 || ballY >= canvas.height) 
            ballSpeedY = -ballSpeedY;
        if (ballX <= paddleWidth && ballY >= player1Y && ballY <= player1Y + paddleHeight) 
            ballSpeedX = -ballSpeedX;
        if (ballX >= canvas.width - paddleWidth && ballY >= player2Y && ballY <= player2Y + paddleHeight) 
            ballSpeedX = -ballSpeedX;

        if (ballX <= 0) {
            player2Score++;
            resetBall();
        } else if (ballX >= canvas.width) {
            player1Score++;
            resetBall();
        }

        if (player1Score >= maxRounds || player2Score >= maxRounds) 
            endGame();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = paddleColorInput.value;
        ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);  
        ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);  

        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        ctx.font = "20px Arial";
        ctx.fillText(`${player1Input}: ${player1Score}`, 50, 30);
        ctx.fillText(`${player2Input}: ${player2Score}`, canvas.width - 100, 30);
    }

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }

    function endGame() {
        gameOver = true;
        clearInterval(gameInterval);
        const winner = player1Score > player2Score ? `${player1Input} Wins!` : `${player2Input} Wins!`;
        resultText.textContent = winner;
        document.getElementById("score-text").textContent = `${player1Input}: ${player1Score} - ${player2Input}: ${player2Score}`;
        resultPopup.style.display = "flex";
    }

    restartBtn.addEventListener('click', function () {
        resultPopup.style.display = "none";
        settingsPopup.style.display = "block";
        canvas.style.display = "none";
        
        // Oyun başladığında sıfırlanacak isimler
        player1Input = "";
        player2Input = "";
    });

    function startGame() {
        gameOver = false;
        player1Score = 0;
        player2Score = 0;

        gameInterval = setInterval(() => {
            if (!gameOver) {
                update();
                draw();
            }
        }, 16);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") player2MovingUp = true;
        if (e.key === "ArrowDown") player2MovingDown = true;
        if (e.key === "w") player1MovingUp = true;
        if (e.key === "s") player1MovingDown = true;
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowUp") player2MovingUp = false;
        if (e.key === "ArrowDown") player2MovingDown = false;
        if (e.key === "w") player1MovingUp = false;
        if (e.key === "s") player1MovingDown = false;
    });
}
