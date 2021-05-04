let blackjackGame = {
  'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
  'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
  'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
  'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': 1},
  'wins': 0,
  'losses': 0,
  'draws': 0,
  'isStand': false,
  'turnsOver': false,
}

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
  if (blackjackGame['isStand'] === false) {
  let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame['cards'][randomIndex];
1}

function showCard(card, activePlayer) {
  if(activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
    cardImage.src = `images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
  }
}

function blackjackDeal() {
  if(blackjackGame['turnsOver'] === false) {
    return;
  }
  blackjackGame['isStand'] = false;
  let yourImages = document.querySelector('#your-box').querySelectorAll('img');
  yourImages.forEach(img => {
    img.remove();
  });

  let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
  dealerImages.forEach(img => {
    img.remove();
  });

  YOU['score'] = 0;
  DEALER['score'] = 0;
  document.querySelector('#your-blackjack-result').textContent = 0;
  document.querySelector('#your-blackjack-result').style.color = '#ffffff';  

  document.querySelector('#dealer-blackjack-result').textContent = 0;
  document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';
  
  document.querySelector('#blackjack-result').textContent = 'Let\'s Play';
  document.querySelector('#blackjack-result').style.color = 'black';
  blackjackGame['turnsOver'] = false;
}

function updateScore(card, activePlayer) {
  // If A is the card, add 11 if adding it keeps num below 21 else add 1
  if (card == 'A') {
    if (activePlayer['score'] + 11 <= 21 ) {
      activePlayer['score'] += 11;
      return;
    }
  }
  activePlayer['score'] += blackjackGame['cardsMap'][card];
}

function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';  
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';  
  } else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
  blackjackGame['isStand'] = true;

  while(DEALER['score'] < 16 && blackjackGame['isStand']) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }

  blackjackGame['turnsOver'] = true;
  let winner = computeWinner();
  showResult(winner);
}

// compute winner and return who just won
function computeWinner() {
  let winner;

  if (YOU['score'] <= 21) {
    // condition: higher score than the dealer or when the dealer busts but you're 21 or under
    if (YOU['score'] > DEALER['score'] || DEALER['score'] >21 ) {
      blackjackGame['wins']++;
      winner = YOU;
    } else if (YOU['score'] < DEALER['score']) {
      blackjackGame['losses']++;
      winner = DEALER;
    } else if (YOU['score'] === DEALER['score']) {
      blackjackGame['draws']++;
    }
  } else if (YOU['score'] > 21 && DEALER['score'] <=21) {
    blackjackGame['losses']++;
    winner = DEALER;
  } else if (YOU['score'] >21 && DEALER['score'] > 21) {
    blackjackGame['draws']++;
  }
  console.log(blackjackGame);
  return winner;
}

function showResult(winner) {
  let message, messageColor;

  if (blackjackGame['turnsOver'] === false) {
    return;
  }

  if (winner === YOU) {
    document.querySelector('#wins').textContent = blackjackGame['wins'];
    message = 'You won!';
    messageColor = 'green';
    winSound.play();
  } else if (winner === DEALER) {
    document.querySelector('#losses').textContent = blackjackGame['losses'];
    message = 'You lost!';
    messageColor = 'red';
    lossSound.play();
  } else {
    document.querySelector('#draws').textContent = blackjackGame['draws'];
    message = 'You drew!';
    color = 'black';
  }
  document.querySelector('#blackjack-result').textContent = message;
  document.querySelector('#blackjack-result').style.color = messageColor;
}
