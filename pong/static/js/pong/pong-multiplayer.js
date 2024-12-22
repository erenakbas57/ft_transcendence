export function PongMultiplayer() {
    const settingsPopup = document.getElementById("settings-popup");
    const startGameBtn = document.getElementById("start-game");
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const themeSelect = document.getElementById("theme");
    const roundsInput = document.getElementById("rounds");
    const paddleColorInput = document.getElementById("paddle-color");
    const player1NameInput = document.getElementById("player1-name");
    const player2NameInput = document.getElementById("player2-name");
    const player3NameInput = document.getElementById("player3-name");
    const player4NameInput = document.getElementById("player4-name");
    const resultPopup = document.getElementById("result-popup");
    const resultText = document.getElementById("result-text");
    const restartBtn = document.getElementById("restart");
    const quitBtn = document.getElementById("quit");

    let players = [];
    let ballX = canvas.width / 2 , ballY = canvas.height / 2 - 100;
    let ballSpeedX = 1.5, ballSpeedY = 1.5;
    const paddleHeight = 10, paddleWidth = 100;
    let player1Y = canvas.height / 2 - paddleWidth / 2; 
    let player2Y = canvas.height / 2 - paddleWidth / 2; 
    let player3X = canvas.width / 2 - paddleWidth / 2; 
    let player4X = canvas.width / 2 - paddleWidth / 2;
    let player1Score = 0, player2Score = 0, player3Score = 0, player4Score = 0;
    let maxRounds = 5;
    let gameOver = false;
    let gameInterval;

    let player1MovingUp = false, player1MovingDown = false;
    let player2MovingUp = false, player2MovingDown = false;
    let player3MovingLeft = false, player3MovingRight = false;
    let player4MovingLeft = false, player4MovingRight = false;

    startGameBtn.addEventListener("click", function () {
        const errorMessageDiv = document.getElementById("error-message");
        errorMessageDiv.style.display = "none";
        errorMessageDiv.textContent = "";
    
        const player1Name = player1NameInput.value.trim() || "Player 1";
        const player2Name = player2NameInput.value.trim() || "Player 2";
        const player3Name = player3NameInput.value.trim() || "Player 3";
        const player4Name = player4NameInput.value.trim() || "Player 4";
    
        if (player1Name.length > 10 || player2Name.length > 10 || player3Name.length > 10 || player4Name.length > 10) {
            errorMessageDiv.textContent = "Name must be less than 10 letters";
            errorMessageDiv.style.display = "block";
            return; 
        }
    
        const names = [player1Name, player2Name, player3Name, player4Name];
        if (new Set(names).size !== names.length) {
            errorMessageDiv.textContent = "Player names must be unique!";
            errorMessageDiv.style.display = "block";
            return; 
        }
    
        players = [
            { name: player1Name, controls: ["w", "s"] },
            { name: player2Name, controls: ["ArrowUp", "ArrowDown"] },
            { name: player3Name, controls: ["a", "d"] },
            { name: player4Name, controls: ["ArrowLeft", "ArrowRight"] }
        ];
    
        maxRounds = parseInt(roundsInput.value);
        applyTheme(themeSelect.value);
        settingsPopup.style.display = "none";
        canvas.style.display = "block";
    
        startGame();
    });
    
    
    function applyTheme(theme) {
        if (theme === "football")
            canvas.style.backgroundImage = "url('/static/assets/pong/1.jpg')";
        else if (theme === "basketball")
            canvas.style.backgroundImage = "url('/static/assets/pong/2.jpg')";
        else
            canvas.style.backgroundColor = "gray";
    }

    let lastPaddleHit;
    function update() {
    if (gameOver) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (player1MovingUp) player1Y = Math.max(player1Y - 5, 0);
    if (player1MovingDown) player1Y = Math.min(player1Y + 5, canvas.height - paddleWidth);

    if (player2MovingUp) player2Y = Math.max(player2Y - 5, 0);
    if (player2MovingDown) player2Y = Math.min(player2Y + 5, canvas.height - paddleWidth);

    if (player3MovingLeft) player3X = Math.max(player3X - 5, 0);
    if (player3MovingRight) player3X = Math.min(player3X + 5, canvas.width - paddleWidth);

    if (player4MovingLeft) player4X = Math.max(player4X - 5, 0);
    if (player4MovingRight) player4X = Math.min(player4X + 5, canvas.width - paddleWidth);

    if (ballY <= 0 || ballY >= canvas.height) ballSpeedY = -ballSpeedY;
    if (ballX <= 0 || ballX >= canvas.width) ballSpeedX = -ballSpeedX;

    if (ballX <= 20 && ballY > player1Y && ballY < player1Y + paddleWidth) {
        ballSpeedX = -ballSpeedX;
        ballX = 20; 
        lastPaddleHit = 'player1';
    }

    if (ballX >= canvas.width - 20 && ballY > player2Y && ballY < player2Y + paddleWidth) {
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width - 20;
        lastPaddleHit = 'player2';
    }

    if (ballY <= 20 && ballX > player3X && ballX < player3X + paddleWidth) {
        ballSpeedY = -ballSpeedY;
        ballY = 20; 
        lastPaddleHit = 'player3';
    }

    if (ballY >= canvas.height - 20 && ballX > player4X && ballX < player4X + paddleWidth) {
        ballSpeedY = -ballSpeedY;
        ballY = canvas.height - 20; 
        lastPaddleHit = 'player4';
    }

    if (ballX <= 0) {
        if (lastPaddleHit === 'player1') player1Score++;
        if (lastPaddleHit === 'player2') player2Score++;
        if (lastPaddleHit === 'player3') player3Score++;
        if (lastPaddleHit === 'player4') player4Score++;
    }

    if (ballX >= canvas.width) {
        if (lastPaddleHit === 'player1') player1Score++;
        if (lastPaddleHit === 'player2') player2Score++;
        if (lastPaddleHit === 'player3') player3Score++;
        if (lastPaddleHit === 'player4') player4Score++;
    }

    if (ballY <= 0) {
        if (lastPaddleHit === 'player1') player1Score++;
        if (lastPaddleHit === 'player2') player2Score++;
        if (lastPaddleHit === 'player3') player3Score++;
        if (lastPaddleHit === 'player4') player4Score++;
    }

    if (ballY >= canvas.height) {
        if (lastPaddleHit === 'player1') player1Score++;
        if (lastPaddleHit === 'player2') player2Score++;
        if (lastPaddleHit === 'player3') player3Score++;
        if (lastPaddleHit === 'player4') player4Score++;
    }

    if (player1Score >= maxRounds || player2Score >= maxRounds || player3Score >= maxRounds || player4Score >= maxRounds)
        endGame();
}


    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = paddleColorInput.value;
        ctx.fillRect(0, player1Y, 10, paddleWidth);
        ctx.fillRect(canvas.width - 10, player2Y, 10, paddleWidth); 
        ctx.fillRect(player3X, 0, paddleWidth, 10); 
        ctx.fillRect(player4X, canvas.height - 10, paddleWidth, 10);

        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();

        ctx.font = "20px Arial";
        ctx.fillStyle = "#FFF";

        if (players[0])
            ctx.fillText(`${players[0].name}: ${player1Score}`, 10, 30);

        if (players[2]) 
            ctx.fillText(`${players[2].name}: ${player3Score}`, canvas.width - 150, 30);

        if (players[1])
            ctx.fillText(`${players[1].name}: ${player2Score}`, canvas.width - 150, canvas.height - 20);

        if (players[3])
            ctx.fillText(`${players[3].name}: ${player4Score}`, 10, canvas.height - 20);
    }

    function endGame() {
        gameOver = true;
        let winners = [];
        if (player1Score >= maxRounds) winners.push(players[0]?.name || "Player 1");
        if (player2Score >= maxRounds) winners.push(players[1]?.name || "Player 2");
        if (player3Score >= maxRounds) winners.push(players[2]?.name || "Player 3");
        if (player4Score >= maxRounds) winners.push(players[3]?.name || "Player 4");
    
        if (winners.length > 1) {
            resultText.textContent = `${winners.join(" and ")} Won The Game!`;
        } else {
            resultText.textContent = `${winners[0]} Won The Game!`;
        }
        resultPopup.style.display = "flex";
    }    

    restartBtn.onclick = function () {
        resultPopup.style.display = 'none';
        settingsPopup.style.display = 'block';
        canvas.style.display = 'none';
    
        player1Score = 0;
        player2Score = 0;
        player3Score = 0;
        player4Score = 0;
    
        ballX = canvas.width / 2;
        ballY = canvas.height / 2 - 100;
        ballSpeedX = 1.5;
        ballSpeedY = 1.5;
    
        player1Y = canvas.height / 2 - paddleWidth / 2;
        player2Y = canvas.height / 2 - paddleWidth / 2;
        player3X = canvas.width / 2 - paddleWidth / 2;
        player4X = canvas.width / 2 - paddleWidth / 2;
        gameOver = false;
        
        lastPaddleHit = null;

        clearInterval(gameInterval);
        startGameBtn.disabled = false;
    };
    
    document.addEventListener("keydown", function (e) {
        if (e.key === "w") player1MovingUp = true;
        if (e.key === "s") player1MovingDown = true;
        if (e.key === "ArrowUp") player2MovingUp = true;
        if (e.key === "ArrowDown") player2MovingDown = true;
        if (e.key === "k") player3MovingLeft = true;
        if (e.key === "l") player3MovingRight = true;
        if (e.key === "v") player4MovingLeft = true;
        if (e.key === "b") player4MovingRight = true;
    });

    document.addEventListener("keyup", function (e) {
        if (e.key === "w") player1MovingUp = false;
        if (e.key === "s") player1MovingDown = false;
        if (e.key === "ArrowUp") player2MovingUp = false;
        if (e.key === "ArrowDown") player2MovingDown = false;
        if (e.key === "k") player3MovingLeft = false;
        if (e.key === "l") player3MovingRight = false;
        if (e.key === "v") player4MovingLeft = false;
        if (e.key === "b") player4MovingRight = false;
    });

    function startGame() {
        ballSpeedX = Math.random() > 0.5 ? 1.5 : -1.5;
        ballSpeedY = Math.random() > 0.5 ? 1.5 : -1.5;
    
        const initialBallSpeedX = ballSpeedX;
        const initialBallSpeedY = ballSpeedY;
    
        let speedIncreaseInterval = setInterval(() => {
            if (Math.abs(ballSpeedX) < Math.abs(initialBallSpeedX * 5)) {
                ballSpeedX *= 1.25;
            }
            if (Math.abs(ballSpeedY) < Math.abs(initialBallSpeedY * 5)) {
                ballSpeedY *= 1.25;
            }
        }, 5000);
    
        gameInterval = setInterval(function () {
            update();
            draw();
        }, 15);
    }
    
}
