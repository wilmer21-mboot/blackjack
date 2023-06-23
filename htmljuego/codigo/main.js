// Card values and suits
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['♠', '♣', '♥', '♦'];

// Create a deck of cards
let deck = [];

// Players' hands
let playerHand = [];
let dealerHand = [];

// Points
let playerPoints = 0;
let dealerPoints = 0;

// DOM elements
const playerCardsElement = document.getElementById('player-cards');
const dealerCardsElement = document.getElementById('dealer-cards');
const playerPointsElement = document.getElementById('player-points');
const dealerPointsElement = document.getElementById('dealer-points');
const hitButton = document.getElementById('hit');
const standButton = document.getElementById('stand');
const dealButton = document.getElementById('deal');
const messageElement = document.getElementById('message');

// Initialize the game
function init() {
  // Create a new deck of cards
  deck = createDeck();

  // Shuffle the deck
  shuffleDeck(deck);

  // Clear the hands
  playerHand = [];
  dealerHand = [];

  // Deal initial cards
  playerHand.push(dealCard());
  dealerHand.push(dealCard());
  playerHand.push(dealCard());
  dealerHand.push(dealCard());

  // Calculate initial points
  playerPoints = calculatePoints(playerHand);
  dealerPoints = calculatePoints(dealerHand);

  // Render the cards and points
  renderCards();
  renderPoints();

  // Disable buttons
  hitButton.disabled = false;
  standButton.disabled = false;
  dealButton.disabled = true;

  // Clear the message
  messageElement.textContent = '';
}

// Create a deck of cards
function createDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

// Shuffle the deck using Fisher-Yates algorithm
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Deal a card from the deck
function dealCard() {
  return deck.pop();
}

// Calculate the points in a hand
function calculatePoints(hand) {
  let points = 0;
  let hasAce = false;

  for (let card of hand) {
    points += getCardValue(card);
    if (card.value === 'A') {
      hasAce = true;
    }
  }

  if (hasAce && points + 10 <= 21) {
    points += 10;
  }

  return points;
}

// Get the numerical value of a card
function getCardValue(card) {
  if (card.value === 'A') return 1;
  if (card.value === 'J' || card.value === 'Q' || card.value === 'K') return 10;
  return parseInt(card.value);
}

// Render the cards on the screen
function renderCards() {
  playerCardsElement.innerHTML = '';
  dealerCardsElement.innerHTML = '';

  for (let card of playerHand) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.textContent = card.suit + card.value;
    playerCardsElement.appendChild(cardElement);
  }

  for (let card of dealerHand) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.textContent = card.suit + card.value;
    dealerCardsElement.appendChild(cardElement);
  }
}

// Render the points on the screen
function renderPoints() {
  playerPointsElement.textContent = `Points: ${playerPoints}`;
  dealerPointsElement.textContent = `Points: ${dealerPoints}`;
}

// Check if the player or dealer has blackjack
function checkBlackjack() {
  if (playerPoints === 21 && dealerPoints === 21) {
    messageElement.textContent = 'Empate';
    endGame();
  } else if (playerPoints === 21) {
    messageElement.textContent = 'Jugador obtuvo un blackjack!';
    endGame();
  } else if (dealerPoints === 21) {
    messageElement.textContent = 'Sistema obtuvo un blackjack!';
    endGame();
  }
}

// Check if the player or dealer has busted
function checkBust() {
  if (playerPoints > 21) {
    messageElement.textContent = 'Jugador se excedió! Sistema gana.';
    endGame();
  } else if (dealerPoints > 21) {
    messageElement.textContent = 'Sistema se excedió! Jugador gana.';
    endGame();
  }
}

// Player hits
function playerHit() {
  playerHand.push(dealCard());
  playerPoints = calculatePoints(playerHand);
  renderCards();
  renderPoints();
  checkBust();
}

// Player stands
function playerStand() {
  while (dealerPoints < 17) {
    dealerHand.push(dealCard());
    dealerPoints = calculatePoints(dealerHand);
  }
  renderCards();
  renderPoints();
  checkBust();
  checkWinner();
}

// Check the winner of the game
function checkWinner() {
  if (playerPoints > dealerPoints) {
    messageElement.textContent = 'Jugador gana!';
  } else if (playerPoints < dealerPoints) {
    messageElement.textContent = 'Sistema gana!';
  } else {
    messageElement.textContent = 'Hubo un Empate.';
  }
  endGame();
}

// End the game and disable buttons
function endGame() {
  hitButton.disabled = true;
  standButton.disabled = true;
  dealButton.disabled = false;
}

// Event listeners
hitButton.addEventListener('click', playerHit);
standButton.addEventListener('click', playerStand);
dealButton.addEventListener('click', init);

// Initialize the game
init();
