export class PongGame {
    constructor(user1Name, user2Name, paddleColor, maxScore, gameOverModal) {
        this.user1Name = user1Name;
        this.user2Name = user2Name;
        this.paddleColor = paddleColor;
        this.maxScore = maxScore;
        this.gameOverModal = gameOverModal;

        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');

        // Paddle özellikleri
        this.paddleWidth = 10;
        this.paddleHeight = 80;
        this.leftPaddleY = this.canvas.height / 2 - this.paddleHeight / 2;
        this.rightPaddleY = this.canvas.height / 2 - this.paddleHeight / 2;
        this.paddleSpeed = 5;

        // Top özellikleri
        this.ballX = this.canvas.width / 2;
        this.ballY = this.canvas.height / 2;
        this.ballRadius = 8;
        this.ballSpeedX = 4;
        this.ballSpeedY = 4;

        // Skorlar
        this.leftScore = 0;
        this.rightScore = 0;

        // Kullanıcı kontrolleri
        this.keys = {};

        // Oyunu başlatma
        this.isRunning = false;
    }

    start() {
        this.addEventListeners();
        this.gameLoop();
    }

    addEventListeners() {
        // Tuş dinleyicileri
        document.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    drawCanvas() {
        // Canvas'ı temizle
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Ortadaki çizgi
        this.context.strokeStyle = '#ddd';
        this.context.setLineDash([5, 5]);
        this.context.beginPath();
        this.context.moveTo(this.canvas.width / 2, 0);
        this.context.lineTo(this.canvas.width / 2, this.canvas.height);
        this.context.stroke();
        this.context.setLineDash([]);

        // Paddle'ları çiz
        this.context.fillStyle = this.paddleColor;
        this.context.fillRect(10, this.leftPaddleY, this.paddleWidth, this.paddleHeight);
        this.context.fillRect(this.canvas.width - this.paddleWidth - 10, this.rightPaddleY, this.paddleWidth, this.paddleHeight);

        // Topu çiz
        this.context.beginPath();
        this.context.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
        this.context.fillStyle = '#ff5722';
        this.context.fill();
        this.context.closePath();
    }

    movePaddles() {
        // Sol paddle: W ve S
        if (this.keys['w'] && this.leftPaddleY > 0) {
            this.leftPaddleY -= this.paddleSpeed;
        }
        if (this.keys['s'] && this.leftPaddleY < this.canvas.height - this.paddleHeight) {
            this.leftPaddleY += this.paddleSpeed;
        }

        // Sağ paddle: Yukarı ve Aşağı Ok
        if (this.keys['ArrowUp'] && this.rightPaddleY > 0) {
            this.rightPaddleY -= this.paddleSpeed;
        }
        if (this.keys['ArrowDown'] && this.rightPaddleY < this.canvas.height - this.paddleHeight) {
            this.rightPaddleY += this.paddleSpeed;
        }
    }

    moveBall() {
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;

        // Yukarı/aşağı kenarlara çarpma
        if (this.ballY - this.ballRadius <= 0 || this.ballY + this.ballRadius >= this.canvas.height) {
            this.ballSpeedY = -this.ballSpeedY;
        }

        // Paddle'lara çarpma
        if (
            this.ballX - this.ballRadius <= 20 &&
            this.ballY >= this.leftPaddleY &&
            this.ballY <= this.leftPaddleY + this.paddleHeight
        ) {
            this.ballSpeedX = -this.ballSpeedX;
        }

        if (
            this.ballX + this.ballRadius >= this.canvas.width - 20 &&
            this.ballY >= this.rightPaddleY &&
            this.ballY <= this.rightPaddleY + this.paddleHeight
        ) {
            this.ballSpeedX = -this.ballSpeedX;
        }

        // Sol kenara çarpma (sağ oyuncu puan kazanır)
        if (this.ballX - this.ballRadius <= 0) {
            this.rightScore++;
            document.getElementById('right-score').innerText = this.rightScore;
            this.resetBall();
        }

        // Sağ kenara çarpma (sol oyuncu puan kazanır)
        if (this.ballX + this.ballRadius >= this.canvas.width) {
            this.leftScore++;
            document.getElementById('left-score').innerText = this.leftScore;
            this.resetBall();
        }
    }

    resetBall() {
        this.ballX = this.canvas.width / 2;
        this.ballY = this.canvas.height / 2;
        this.ballSpeedX = -this.ballSpeedX;
        this.ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;
    }

    checkGameOver() {
        if (this.leftScore >= this.maxScore || this.rightScore >= this.maxScore) {
            this.isRunning = false;
            const winner =
                this.leftScore >= this.maxScore ? this.user1Name : this.user2Name;
            document.getElementById('finalMessage').innerText = `${winner} wins! 🎉`;
            this.gameOverModal.show();
        }
    }

    gameLoop() {
        if (this.isRunning) {
            this.movePaddles();
            this.moveBall();
            this.checkGameOver();
            this.drawCanvas();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}
