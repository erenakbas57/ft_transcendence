const additionalChoices = [
  { name: 'oracle', imgSrc: '../../../static/assets/rps/oracle.png' },
  { name: 'architect', imgSrc: '../../../static/assets/rps/architect.png' }
];

let playerScore = 0;
let aiScore = 0;
let startTime;
const rules = {
  basic: {
    choices: ['code', 'red', 'blue'],
    outcomes: {
      red: { wins: ['blue'], loses: ['code'] },
      code: { wins: ['red'], loses: ['blue'] },
      blue: { wins: ['code'], loses: ['red'] }
    }
  },
  ultimate: {
    choices: ['red', 'code', 'blue', 'oracle', 'architect'],
    outcomes: {
      red: { wins: ['architect', 'blue'], loses: ['oracle', 'code'] },
      code: { wins: ['red', 'oracle'], loses: ['blue', 'architect'] },
      blue: { wins: ['code', 'architect'], loses: ['red', 'oracle'] },
      oracle: { wins: ['blue', 'red'], loses: ['architect', 'code'] },
      architect: { wins: ['code', 'oracle'], loses: ['red', 'blue'] }
    }
  }
};

function getGameSettings()
{
  const maxScore = parseInt(localStorage.getItem('maxScore'), 10) || 0;
  const mode = localStorage.getItem('mode') || '1';
  return { maxScore, mode };
}

function startGame(event)
{
  event.preventDefault();
  startTime = new Date();

  const maxScore = document.getElementById('score').value;
  const mode = document.getElementById('mode').value;

  localStorage.setItem('maxScore', maxScore);
  localStorage.setItem('mode', mode);
  console.log("maxScore: ", maxScore);
  console.log("mode: ", mode);

  const choicesContainer = document.getElementById('choices');
  choicesContainer.innerHTML = '';
  const defaultChoices = rules.basic.choices.concat(
    mode === '2' ? additionalChoices.map(choice => choice.name) : []
  );

    defaultChoices.forEach(choice => {
    const col = document.createElement('div');
    col.classList.add('col-4', 'col-sm-4', 'col-md-2');
    const button = document.createElement('button');
    button.classList.add('btn');
    button.setAttribute('onclick', `makeChoice('${choice}')`);
    const img = document.createElement('img');
    img.src = `../../../static/assets/rps/${choice}.png`;
    img.alt = choice;
    img.classList.add('img-fluid');
    button.appendChild(img);
    const text = document.createElement('p');
    text.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
    col.appendChild(button);
    col.appendChild(text);
    choicesContainer.appendChild(col);
  });
  document.getElementById('start-container').classList.add('d-none');
  document.getElementById('game-container').classList.remove('d-none');
}

function makeChoice(playerChoice)
{
  const { maxScore, mode } = getGameSettings();
  const selectedRules = mode === '2' ? rules.ultimate : rules.basic;
  document.getElementById('resultText').innerHTML = ''; 
  document.getElementById('userChoice').innerHTML = '';
  document.getElementById('aiChoice').innerHTML = '';
  document.getElementById('choices').classList.add('d-none');
  document.getElementById('result').classList.remove('d-none');

  const aiChoice = selectedRules.choices[Math.floor(Math.random() * selectedRules.choices.length)];

  document.getElementById('userChoice').innerHTML = `<img src="../../../static/assets/rps/${playerChoice}.png" alt="${playerChoice}" width="120">`;
  // document.getElementById('aiChoice').innerHTML = '';

  setTimeout(() => {
    document.getElementById('aiChoice').innerHTML = `<img src="../../../static/assets/rps/${aiChoice}.png" alt="${aiChoice}" width="120">`;

  const resultText = document.getElementById('resultText');

  if (selectedRules.outcomes[playerChoice].wins.includes(aiChoice))
    {
      resultText.innerHTML = "You win!";
      playerScore++;
      document.getElementById('playerScore').textContent = playerScore;
    }
    else if (selectedRules.outcomes[aiChoice].wins.includes(playerChoice))
    {
      resultText.innerHTML = "You lose!";
      aiScore++;
      document.getElementById('aiScore').textContent = aiScore;
    }
    else
    resultText.innerHTML = "It's a draw!";

    if (playerScore >= maxScore || aiScore >= maxScore)
    {
      setTimeout(() => {
        resetGame();
      }, 500);
    }
    else
    {
      setTimeout(() => {
        document.getElementById('choices').classList.remove('d-none');
        document.getElementById('result').classList.add('d-none');
      }, 2000);
    }
  }, 1000);
}

function resetGame()
{
  const endTime = new Date();
  const gameDuration = (endTime - startTime) / 1000;
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('aiScore').textContent = aiScore;
  document.getElementById('resultText').textContent = 'Make your move!';
  document.getElementById('userChoice').innerHTML = '';
  document.getElementById('aiChoice').innerHTML = '';
  document.getElementById('game-container').classList.add('d-none');
  
  var exitResult = document.getElementById('exitResult');
  if (playerScore >= aiScore)
    exitResult.textContent = "You Win!";
  else
    exitResult.textContent = "You Lose!";

  const username = '{{ user.username }}';
  const gameResult = {
    username: username,
    player_score: playerScore,
    ai_score: aiScore,
    duration: gameDuration, 
  };

  fetch('/rps-game-save/', {
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
  playerScore = 0;
  aiScore = 0;
  const exitPopup = document.getElementById('exit');
  exitPopup.style.display = 'flex';
}

function restartGame()
{
  playerScore = 0;
  aiScore = 0;
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('aiScore').textContent = playerScore;
  document.getElementById('resultText').textContent = '';
  document.getElementById('userChoice').innerHTML = '';
  document.getElementById('aiChoice').innerHTML = '';
  document.getElementById('choices').classList.remove('d-none');
  document.getElementById('result').classList.add('d-none');
  const exitPopup = document.getElementById('exit');
  exitPopup.style.display = 'none';
  document.getElementById('start-container').classList.remove('d-none');
  document.getElementById('game-container').classList.add('d-none');
}
