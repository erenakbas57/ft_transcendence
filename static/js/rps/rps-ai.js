window.addEventListener('load', () => setTimeout(() => document.body.classList.remove('preload'), 200));

const getElement = (selector) => document.querySelector(selector);

let gameStartTime;
var urlParams = new URLSearchParams(window.location.search);

// Skor değeri URL parametrelerinden alınıyor, ancak formdan alınan değeri kullanacağız
var maxGameScore = urlParams.get('score') || 3; // Eğer URL parametrelerinde score yoksa, varsayılan olarak 3 kullan

// Formdan 'score' değerini al
const scoreInput = document.getElementById('score');
if (scoreInput) {
    maxGameScore = parseInt(scoreInput.value);  // Formdan alınan değeri maxGameScore'a aktar
}

const actionButtons = document.querySelectorAll(".choiceButton");
const gameArea = getElement(".gameArea");
const resultArea = getElement(".resultArea");
const resultItems = document.querySelectorAll(".choiceResults");
const playAgainButton = getElement(".playAgain");

const playerScoreElement = getElement(".playerScore");
const aiScoreElement = getElement(".aiScore");

const username = document.querySelector('.container-top').dataset.username;
const iconBasePath = document.querySelector('.container-top').dataset.iconpath;
const cookie = document.cookie.split('; ').find(row => row.startsWith('selectedLanguage='));
const selectedLanguage = cookie ? cookie.split('=')[1] : 'en';

const translationswin = { 'tr': 'Kazandınız', 'en': 'You Won', 'rs': 'Ты выиграл' };
const translationslose = { 'tr': 'Kaybettiniz', 'en': 'You Lost', 'rs': 'ты проиграл' };

const gameMoves = [
    { name: "paper", defeats: "rock" },
    { name: "scissors", defeats: "paper" },
    { name: "rock", defeats: "scissors" }];

actionButtons.forEach(button => button.addEventListener("click", function() {
    if (!gameStartTime) gameStartTime = new Date();
    const choiceName = button.getAttribute("data-choice");
    const choice = gameMoves.find(gameMove => gameMove.name === choiceName);
    startRound(choice);
}));

function startRound(choice) {
    const filteredChoices = gameMoves.filter(choice => choice.name !== choice); // Exclude player's choice
    const randomIndex = Math.floor(Math.random() * filteredChoices.length);
    const aichoice = filteredChoices[randomIndex];
    const results = [choice, aichoice];
    showRoundResults(results);
    showWinner(results);
}

function showRoundResults(results) {
    resultItems.forEach((resultItem, idx) => {
        setTimeout(() => {
            resultItem.innerHTML = `<div class="choice ${results[idx].name}">
                                      <img src="${iconBasePath}icon-${results[idx].name}.svg" alt="${results[idx].name}" />
                                  </div>`;
        }, idx * 1000);
    });
    gameArea.classList.toggle("hidden");
    resultArea.classList.toggle("hidden");
}

function showWinner(results) {
    setTimeout(() => {
        const winner = isWinner(results);

        switch (winner) {
            case "user":
                updateScore(1, results[0].name);
                if (!resultItems[0].classList.contains("winner")) resultItems[0].classList.add("winner");
                break;
            case "ai":
                updateScore(-1, results[1].name);
                if (!resultItems[1].classList.contains("winner")) resultItems[1].classList.add("winner");
                break;
        }

        const maxScoreReached = [playerScoreElement, aiScoreElement].some(scoreElement =>
            parseInt(scoreElement.innerText) === maxGameScore
        );

        if (maxScoreReached) {
            showGameOverScreen();
        } else {
            setTimeout(resetGame, 2000);
        }
    }, 1000);
}

function resetGame() {
    resultItems.forEach(resultItem => {
        resultItem.innerHTML = "";
        resultItem.classList.remove("winner");
    });
    [gameArea, resultArea].forEach(area => area.classList.toggle("hidden"));
    actionButtons.forEach(btn => btn.disabled = false);
}

function showGameOverScreen() {
    resultArea.classList.toggle("showWinner");
    const winnerText = (selectedLanguage && selectedLanguage in translationswin && playerScoreElement.innerText == maxGameScore) 
        ? translationswin[selectedLanguage] 
        : translationslose[selectedLanguage] || translationslose['en'];
    document.getElementById('winnerText').innerText = winnerText;
    const isWin = (playerScoreElement.innerText == maxGameScore);
    const winnerInfo = isWin ? [username, "CatrixAI"] : ["CatrixAI", username];
    const scoreInfo = isWin ? [parseInt(playerScoreElement.innerText), parseInt(aiScoreElement.innerText)] : [parseInt(aiScoreElement.innerText), parseInt(playerScoreElement.innerText)];
    const colorInfo = isWin ? ['green', 'rgba(11, 22, 8, 0.8)'] : ['red', 'rgba(20, 5, 5, 0.8)'];
    saveGame(winnerInfo[0], winnerInfo[1], scoreInfo[0], scoreInfo[1], gameStartTime);
    document.getElementById('winnerText').style.color = colorInfo[0];
    document.getElementById('gameOverScreen').style.backgroundColor = colorInfo[1];
    document.getElementById('gameOverScreen').style.display = 'block';
}

document.getElementById('restartButton').addEventListener('click', resetGameRPS);
document.getElementById('exitButton').addEventListener('click', exitGame);

function resetGameRPS() {
    document.getElementById('gameOverScreen').style.display = 'none';
    [playerScoreElement, aiScoreElement].forEach(scoreElement => scoreElement.innerText = 0);
    playAgain();
}

function exitGame() {
    window.history.back(); // Navigate back to the previous page
}

function isWinner(results) {
    const [player1, player2] = [results[0].name, results[1].name];
    if (player1 === player2) return "draw";
    return results[0].defeats === results[1].name ? "user" : "ai";
}

function updateScore(point) {
    const scoreElement = point > 0 ? playerScoreElement : aiScoreElement;
    scoreElement.innerText = parseInt(scoreElement.innerText) + Math.abs(point);
}

function playAgain() {
    [gameArea, resultArea].forEach(area => area.classList.toggle("hidden"));
    resultItems.forEach(resultItem => {
        resultItem.innerHTML = "";
        resultItem.classList.remove("winner");
    });
    resultArea.classList.toggle("showWinner");
}

playAgainButton.addEventListener("click", function() {
    [gameArea, resultArea].forEach(area => area.classList.toggle("hidden"));
    resultItems.forEach(resultItem => {
        resultItem.innerHTML = "";
        resultItem.classList.remove("winner");
    });
    resultArea.classList.toggle("showWinner");
});

function saveGame(winner, loser, winnerscore, loserscore, start_time) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const finish_time = new Date();
    const data = {
        game: "rps",
        winner,
        loser,
        winnerscore,
        loserscore,
        start_time,
        finish_time
    };
    fetch('/update_winner/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network request failed.');
        return response.json();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
