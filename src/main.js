const app = document.querySelector('#app');
const searchInput = app.querySelector('#searchInput');
const cardList = app.querySelector('#cardList');
const cardDetails = app.querySelector('#cardDetails');

let cardsData = [];

async function fetchCards() {
  try {
    const response = await fetch('https://api.magicthegathering.io/v1/cards');
    const data = await response.json();
    cardsData = data.cards;
    displayCards(cardsData);
  } catch (error) {
    console.error('Error fetching cards:', error);
    cardList.innerHTML = `<li class="card-item">Error loading cards.</li>`;
  }
}

function displayCards(cards) {
  cardList.innerHTML = '';
  const cardNames = new Set();

  cards.forEach((card) => {
    if (!cardNames.has(card.name)) {
      cardNames.add(card.name);
      const li = document.createElement('li');
      li.classList.add('card-item');
      li.textContent = card.name;
      li.addEventListener('click', () => displayCardDetails(card));
      cardList.appendChild(li);
    }
  });
}

function displayCardDetails(card) {
  cardDetails.innerHTML = `
    <h2 class="card-name">${card.name}</h2>
    ${card.imageUrl ? `<img src="${card.imageUrl}" alt="${card.name}" class="card-image" />` : ''}
    <p class="card-text"><strong>Set:</strong> ${card.set}</p>
    <p class="card-text"><strong>Rarity:</strong> ${card.rarity}</p>
    <p class="card-text"><strong>Type:</strong> ${card.type}</p>
    <p class="card-text"><strong>Text:</strong> ${card.text}</p>
    ${card.purchaseUrls ? `<p class="card-text"><a href="${card.purchaseUrls.tcgplayer}" target="_blank" class="card-link">Buy on TCGPlayer</a></p>` : ''}
  `;
  cardDetails.classList.add('show');
}

searchInput.addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  const filteredCards = cardsData.filter((card) =>
    card.name.toLowerCase().includes(query)
  );
  displayCards(filteredCards);
});

// Initialize the app by fetching and displaying cards
fetchCards();
