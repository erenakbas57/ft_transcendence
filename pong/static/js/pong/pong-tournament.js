export function PongTournament() {
    const settingsPopup = document.getElementById("settings-popup");
    const themeSelect = document.getElementById("theme");
    const roundsInput = document.getElementById("rounds");
    const player1Input = document.getElementById("player1");
    const player2Input = document.getElementById("player2");
    const player3Input = document.getElementById("player3");
    const player4Input = document.getElementById("player4");
    const NextPopup = document.getElementById("next-popup");

    const matchPopup = document.getElementById("match-popup");
    const startMatch = document.getElementById("start-game");

    const resultPopup = document.getElementById("result-popup");
    const resultText = document.getElementById("result-text");
    const scoreText = document.getElementById("score-text");
    const nextMatch = document.getElementById("next-match");
    const nextMatchBtn = document.getElementById("next-match-btn");

    const exitPopup = document.getElementById("exit-popup");
    const finalResultText = document.getElementById("final-result-text");
    const restartBtn = document.getElementById("restart");

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const warning = document.getElementById('warning');

    let ballX = canvas.width / 2, ballY = canvas.height / 2;
    let ballSpeedX = 3, ballSpeedY = 3;
    const paddleHeight = 100, paddleWidth = 10;
    let player1Y = canvas.height / 2 - paddleHeight / 2;
    let player2Y = canvas.height / 2 - paddleHeight / 2;

    let playerRScore = 0, playerLScore = 0;

    let firstMatchWinner = "";
    let secondMatchWinner = "";
    let finalMatchWinner = "";
    let totalMatch = 0;

    let maxRounds = 5;
    let theme = "default";
    let gameOver = false;

    let player1MovingUp = false;
    let player1MovingDown = false;
    let player2MovingUp = false;
    let player2MovingDown = false;

    let gameInterval;
    const players = [
        player1Input.value.trim(),
        player2Input.value.trim(),
        player3Input.value.trim(),
        player4Input.value.trim()
    ];

    function checkDuplicates(players) {
        let i = 0;
        for (let i = 0; i < players.length; i++) {
            if (players[i] == "") {
                warning.style.display = "block";
                warning.textContent = "Please fill all the fields!";
                return 1;
            }
        }
        while (i < players.length) {
            let j = i + 1;
            while (j < players.length) {
                if (players[i] == players[j]) {
                    warning.style.display = "block";
                    warning.textContent = "Players username must be unique!";
                    return 1;
                }
                j++;
            }
            i++;
        }
    }

    NextPopup.onclick = function () {
        const roundsValue = parseInt(roundsInput.value);
        maxRounds = roundsValue;
        theme = themeSelect.value;
        const speedValue = parseInt(document.getElementById("speed").value);
        ballSpeedX = ballSpeedY = 3 * speedValue; 
        applyTheme(theme);
        
        players[0] = player1Input.value.trim();
        players[1] = player2Input.value.trim();
        players[2] = player3Input.value.trim();
        players[3] = player4Input.value.trim();
        checkDuplicates(players);
        if (checkDuplicates(players) == 1)
            return;

        shuffle(players);
        document.getElementById("first-match-player1").textContent = players[0];
        document.getElementById("first-match-player2").textContent = players[1];
        document.getElementById("second-match-player1").textContent = players[2];
        document.getElementById("second-match-player2").textContent = players[3];
        settingsPopup.style.display = "none";
        matchPopup.style.display = "block";
    };

    startMatch.onclick = function () {
        matchPopup.style.display = "none";
        canvas.style.display = "block";
        startGame();
    };

    nextMatchBtn.onclick = function () {
        resultPopup.style.display = "none";
        canvas.style.display = "block";
        playerRScore = 0;
        playerLScore = 0;
        startGame();
    };

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function applyTheme(theme) {
        if (theme === "football") {
            canvas.style.backgroundImage = "url('/static/assets/pong/1.jpg')";
            canvas.style.backgroundSize = "cover";
            canvas.style.backgroundPosition = "center";
        }
        else if (theme === "basketball") {
            canvas.style.backgroundImage = "url('/static/assets/pong/2.jpg')";
            canvas.style.backgroundSize = "cover";
            canvas.style.backgroundPosition = "center";
        }
        else
            canvas.style.backgroundColor = "gray";
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
            playerRScore++;
            resetBall();
        }
        else if (ballX >= canvas.width) {
            playerLScore++;
            resetBall();
        }
        if ((playerLScore >= maxRounds || playerRScore >= maxRounds) || (playerLScore >= 5 || playerRScore >= 5)) {
            totalMatch++;
            if (totalMatch >= 3)
                endGame();
            else
                nextGame();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.fillRect(0, player1Y, paddleWidth, paddleHeight); 
        ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight); 

        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        ctx.font = "20px Arial";
        if (totalMatch == 0) {
            ctx.fillText(`${players[0]}: ${playerLScore}`, 50, 30);
            ctx.fillText(`${players[1]}: ${playerLScore}`, canvas.width - 100, 30);
        }
        else if (totalMatch == 1) {
            ctx.fillText(`${players[2]}: ${playerLScore}`, 50, 30);
            ctx.fillText(`${players[3]}: ${playerRScore}`, canvas.width - 100, 30);
        }
        else if (totalMatch == 2) {
            ctx.fillText(`${firstMatchWinner}: ${playerLScore}`, 50, 30);
            ctx.fillText(`${secondMatchWinner}: ${playerRScore}`, canvas.width - 100, 30);
        }
    }

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }

    function nextGame() {
        gameOver = true;
        clearInterval(gameInterval);
        resultPopup.style.display = "block";
        if (totalMatch == 1) {
            scoreText.textContent = `${players[0]}: ${playerLScore} - ${players[1]}: ${playerRScore}`;
            nextMatch.textContent = `${players[2]} vs ${players[3]}`;
            if (playerLScore > playerRScore) {
                resultText.textContent = `${players[0]} Wins!`;

                firstMatchWinner = players[0];
            }
            else {
                resultText.textContent = `${players[1]} Wins!`;
                firstMatchWinner = players[1];
            }
        }
        else if (totalMatch == 2) {
            scoreText.textContent = `${players[2]}: ${playerLScore} - ${players[3]}: ${playerRScore}`;

            if (playerLScore > playerRScore) {
                resultText.textContent = `${players[2]} Wins!`;
                secondMatchWinner = players[2];
            }
            else {
                resultText.textContent = `${players[3]} Wins!`;
                secondMatchWinner = players[3];
            }
            nextMatch.textContent = `${firstMatchWinner} vs ${secondMatchWinner}`;
        }
    }

    function endGame() {
        gameOver = true;
        clearInterval(gameInterval);
        const winner = playerLScore > playerRScore ? `${firstMatchWinner} won the tournaments!` : `${secondMatchWinner} won the tournaments!`;
        finalResultText.textContent = winner;
        exitPopup.style.display = "flex";
    }

    restartBtn.onclick = function () {
        exitPopup.style.display = "none";
        settingsPopup.style.display = "block";
        canvas.style.display = "none";
    
        player1Input.value = "";
        player2Input.value = "";
        player3Input.value = "";
        player4Input.value = "";
        players[0] = "";
        players[1] = "";
        players[2] = "";
        players[3] = "";
    
        playerLScore = 0;
        playerRScore = 0;
        totalMatch = 0;
        firstMatchWinner = "";
        secondMatchWinner = "";
    
        warning.style.display = "none";
        roundsInput.value = 1; 
        maxRounds = 1;  
    
        themeSelect.value = "default";
        document.getElementById("speed").value = "1";
    };
    
    function startGame() {
        gameOver = false;
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