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
    cardList.innerHTML = `<li>Error loading cards.</li>`;
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
    <p class="card-text"><strong>Set:</strong> ${card.setName}</p>
    <p class="card-text"><strong>Type:</strong> ${card.type}</p>
    <p class="card-text"><strong>Rarity:</strong> ${card.rarity}</p>
    <p class="card-text"><strong>Mana Cost:</strong> ${card.manaCost || 'N/A'}</p>
    <p class="card-text"><strong>Text:</strong> ${card.text || 'N/A'}</p>
    <p class="card-text"><strong>Flavor:</strong> ${card.flavor || 'N/A'}</p>
    <p class="card-text"><strong>Power/Toughness:</strong> ${card.power ? `${card.power}/${card.toughness}` : 'N/A'}</p>
    <p class="card-text"><strong>Artist:</strong> ${card.artist}</p>
    <p><a href="${card.imageUrl}" target="_blank" class="card-link">View Card Image</a></p>
  `;
}

searchInput.addEventListener('input', function () {
  const filter = searchInput.value.toLowerCase();
  const filteredCards = cardsData.filter((card) =>
    card.name.toLowerCase().includes(filter)
  );
  displayCards(filteredCards);
});

fetchCards();
