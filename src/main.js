const app = document.querySelector("#app")
const searchInput = app.querySelector("#searchInput")
const cardList = app.querySelector("#cardList")
const cardDetails = app.querySelector("#cardDetails")
const loadingIndicator = app.querySelector("#loadingIndicator")
const cardCount = app.querySelector("#cardCount")
const rarityFilter = app.querySelector("#rarityFilter")
const typeFilter = app.querySelector("#typeFilter")

let cardsData = []
let filteredCards = []
let selectedCardId = null
let isLoading = false

function getRarityClass(rarity) {
  if (!rarity) return ""

  const rarityLower = rarity.toLowerCase()

  if (rarityLower.includes("common")) return "rarity-common"
  if (rarityLower.includes("uncommon")) return "rarity-uncommon"
  if (rarityLower.includes("rare") && !rarityLower.includes("mythic")) return "rarity-rare"
  if (rarityLower.includes("mythic")) return "rarity-mythic"
  if (rarityLower.includes("special")) return "rarity-special"

  return ""
}

function setLoading(loading) {
  isLoading = loading
  if (loading) {
    loadingIndicator.classList.add("show")
  } else {
    loadingIndicator.classList.remove("show")
  }
}

function updateCardCount() {
  cardCount.textContent = `${filteredCards.length} cards`
}

async function fetchCards() {
  try {
    setLoading(true);
    
    const uniqueCards = [];
    const cardNames = new Set();
    const totalPages = 5; // Fetch 5 pages for a total of up to 500 cards
    
    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(`https://api.magicthegathering.io/v1/cards?pageSize=100&page=${page}`);
      const data = await response.json();
      
      if (!data.cards || data.cards.length === 0) {
        break;
      }
      
      data.cards.forEach(card => {
        if (card.name && !cardNames.has(card.name) && card.imageUrl) {
          cardNames.add(card.name);
          uniqueCards.push(card);
        }
      });
      
      if (page > 1) {
        cardsData = [...uniqueCards];
        filteredCards = [...uniqueCards];
        displayCards(filteredCards);
        updateCardCount();
      }
    }
    
    cardsData = uniqueCards;
    filteredCards = uniqueCards;
    
    displayCards(filteredCards);
    updateCardCount();
    
    console.log(`Loaded ${uniqueCards.length} unique cards with images`);
    
  } catch (error) {
    console.error('Error fetching cards:', error);
    cardList.innerHTML = `<li class="card-item">Error loading cards. Please try again later.</li>`;
  } finally {
    setLoading(false);
  }
}

function displayCards(cards) {
  cardList.innerHTML = ""

  cards.forEach((card, index) => {
    const li = document.createElement("li")
    li.classList.add("card-item")
    li.style.setProperty("--index", index)

    const rarityClass = getRarityClass(card.rarity)
    if (rarityClass) {
      li.classList.add(rarityClass)
    }

    if (selectedCardId === card.id) {
      li.classList.add("active")
    }

    li.innerHTML = `
      <div class="card-item-name">${card.name}</div>
      <div class="card-item-type">${card.type}</div>
      <div class="card-item-rarity">${card.rarity || "Unknown Rarity"}</div>
    `

    li.addEventListener("click", () => {
      document.querySelectorAll(".card-item").forEach((item) => {
        item.classList.remove("active")
      })

      li.classList.add("active")

      displayCardDetails(card)
      selectedCardId = card.id
    })

    cardList.appendChild(li)
  })
}

function displayCardDetails(card) {
  cardDetails.classList.add("card-flip")

  setTimeout(() => {
    cardDetails.classList.remove("card-flip")
  }, 600)

  const rarityClass = getRarityClass(card.rarity)
  let borderColor = "var(--accent-color)"

  switch (rarityClass) {
    case "rarity-common":
      borderColor = "var(--common-color)"
      break
    case "rarity-uncommon":
      borderColor = "var(--uncommon-color)"
      break
    case "rarity-rare":
      borderColor = "var(--rare-color)"
      break
    case "rarity-mythic":
      borderColor = "var(--mythic-color)"
      break
    case "rarity-special":
      borderColor = "var(--special-color)"
      break
  }

  const manaCost = card.manaCost ? `<p class="card-text"><strong>Mana Cost:</strong> ${card.manaCost}</p>` : ""

  const cardText = card.text ? card.text.replace(/\n/g, "<br>") : "No card text available"

  const flavorText = card.flavor
    ? `<p class="card-text" style="font-style: italic; color: #ccc;">"${card.flavor}"</p>`
    : ""

  cardDetails.innerHTML = `
    <div class="card-frame">
      <div class="card-inner">
        <div class="card-front">
          <div class="card-image-container">
            <img src="${card.imageUrl}" alt="${card.name}" class="card-image" />
          </div>
        </div>
      </div>
    </div>
    
    <div class="card-info">
      <h2 class="card-name">${card.name}</h2>
      
      <div class="card-meta">
        <p class="card-text"><strong>Type:</strong> ${card.type}</p>
        <p class="card-text"><strong>Rarity:</strong> ${card.rarity}</p>
        <p class="card-text"><strong>Set:</strong> ${card.set}</p>
        ${manaCost}
      </div>
      
      <p class="card-text"><strong>Card Text:</strong><br>${cardText}</p>
      ${flavorText}
      
      ${
        card.power && card.toughness
          ? `<p class="card-text"><strong>Power/Toughness:</strong> ${card.power}/${card.toughness}</p>`
          : ""
      }
      
      ${card.loyalty ? `<p class="card-text"><strong>Loyalty:</strong> ${card.loyalty}</p>` : ""}
      
      ${
        card.purchaseUrls
          ? `<a href="${card.purchaseUrls.tcgplayer}" target="_blank" class="card-link">Buy on TCGPlayer</a>`
          : ""
      }
    </div>
  `

  cardDetails.classList.add("show-card")
}

function filterCards() {
  const searchTerm = searchInput.value.toLowerCase()
  const rarityValue = rarityFilter.value
  const typeValue = typeFilter.value

  filteredCards = cardsData.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm)

    let matchesRarity = true
    if (rarityValue) {
      matchesRarity = card.rarity && card.rarity.includes(rarityValue)
    }

    const matchesType = !typeValue || (card.type && card.type.includes(typeValue))

    return matchesSearch && matchesRarity && matchesType
  })

  displayCards(filteredCards)
  updateCardCount()
}

searchInput.addEventListener("input", filterCards)
rarityFilter.addEventListener("change", filterCards)
typeFilter.addEventListener("change", filterCards)

document.addEventListener("DOMContentLoaded", () => {
  setLoading(true)

  cardDetails.innerHTML = `
    <div class="card-placeholder">
      <div class="card-placeholder-icon"></div>
      <p>Select a card to view details</p>
    </div>
  `

  fetchCards()

  const orbs = document.querySelectorAll(".orb")
  orbs.forEach((orb) => {
    orb.style.animationDuration = `${20 + Math.random() * 10}s`
  })
})
