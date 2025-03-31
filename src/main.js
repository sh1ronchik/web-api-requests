// DOM Elements
const app = document.querySelector("#app")
const searchInput = app.querySelector("#searchInput")
const cardGrid = app.querySelector("#cardGrid")
const cardViewer = app.querySelector("#cardViewer")
const loadingIndicator = app.querySelector("#loadingIndicator")
const cardCount = app.querySelector("#cardCount")
const rarityFilter = app.querySelector("#rarityFilter")
const typeFilter = app.querySelector("#typeFilter")
const sortFilter = app.querySelector("#sortFilter")
const cardModal = app.querySelector("#cardModal")
const cardModalContent = app.querySelector("#cardModalContent")
const cardModalClose = app.querySelector(".card-modal-close")
const loadMoreBtn = app.querySelector("#loadMoreBtn")

// State
let cardsData = []
let filteredCards = []
let displayedCards = []
let selectedCardId = null
let isLoading = false
let currentPage = 1
const cardsPerPage = 20

// Helper Functions
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

function getRarityColor(rarity) {
  if (!rarity) return "var(--common-color)"

  const rarityLower = rarity.toLowerCase()

  if (rarityLower.includes("common")) return "var(--common-color)"
  if (rarityLower.includes("uncommon")) return "var(--uncommon-color)"
  if (rarityLower.includes("rare") && !rarityLower.includes("mythic")) return "var(--rare-color)"
  if (rarityLower.includes("mythic")) return "var(--mythic-color)"
  if (rarityLower.includes("special")) return "var(--special-color)"

  return "var(--common-color)"
}

function getCardFrameStyle(card) {
  if (!card.colors || card.colors.length === 0) {
    return "var(--colorless-frame)"
  }

  if (card.colors.length > 1) {
    return "var(--multicolor-frame)"
  }

  const color = card.colors[0].toLowerCase()

  switch (color) {
    case "white":
      return "var(--white-frame)"
    case "blue":
      return "var(--blue-frame)"
    case "black":
      return "var(--black-frame)"
    case "red":
      return "var(--red-frame)"
    case "green":
      return "var(--green-frame)"
    default:
      return "var(--colorless-frame)"
  }
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

function createParticles() {
  const particlesContainer = document.querySelector(".particles-container")
  const particleCount = 30

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div")
    particle.classList.add("particle")

    const size = Math.random() * 5 + 2
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 10
    const colorIndex = Math.floor(Math.random() * 5)
    const colors = [
      "var(--white-mana)",
      "var(--blue-mana)",
      "var(--black-mana)",
      "var(--red-mana)",
      "var(--green-mana)",
    ]

    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${Math.random() * 100}%`
    particle.style.bottom = `-${size}px`
    particle.style.backgroundColor = colors[colorIndex]
    particle.style.opacity = "0"
    particle.style.borderRadius = "50%"
    particle.style.position = "absolute"
    particle.style.boxShadow = `0 0 ${size * 2}px ${colors[colorIndex]}`
    particle.style.animation = `particle-float ${duration}s linear ${delay}s infinite`

    particlesContainer.appendChild(particle)
  }
}

// Parse mana cost into HTML with symbols
function parseManaSymbols(manaCost) {
  if (!manaCost) return ""

  // Replace mana symbols with styled spans
  return manaCost.replace(/\{([^}]+)\}/g, (match, symbol) => {
    const symbolLower = symbol.toLowerCase()
    let colorClass = ""

    if (symbolLower === "w") colorClass = "mana-w-icon"
    else if (symbolLower === "u") colorClass = "mana-u-icon"
    else if (symbolLower === "b") colorClass = "mana-b-icon"
    else if (symbolLower === "r") colorClass = "mana-r-icon"
    else if (symbolLower === "g") colorClass = "mana-g-icon"
    else colorClass = "mana-c-icon"

    return `<span class="mana-symbol-icon ${colorClass}" title="${symbol}"></span>`
  })
}

// API Functions
async function fetchCards() {
  try {
    setLoading(true)

    const uniqueCards = []
    const cardNames = new Set()
    const totalPages = 5

    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(`https://api.magicthegathering.io/v1/cards?pageSize=100&page=${page}`)
      const data = await response.json()

      if (!data.cards || data.cards.length === 0) {
        break
      }

      data.cards.forEach((card) => {
        if (card.name && !cardNames.has(card.name) && card.imageUrl) {
          cardNames.add(card.name)
          uniqueCards.push(card)
        }
      })

      if (page > 1) {
        cardsData = [...uniqueCards]
        filteredCards = [...uniqueCards]
        sortCards()
        loadMoreCards()
        updateCardCount()
      }
    }

    cardsData = uniqueCards
    filteredCards = uniqueCards

    sortCards()
    loadMoreCards(true)
    updateCardCount()
  } catch (error) {
    console.error("Error fetching cards:", error)
    cardGrid.innerHTML = `<div class="error-message">Error loading cards. Please try again later.</div>`
  } finally {
    setLoading(false)
  }
}

// UI Functions
function displayCards(cards) {
  cardGrid.innerHTML = ""

  cards.forEach((card, index) => {
    const cardElement = document.createElement("div")
    cardElement.classList.add("card-item")
    cardElement.dataset.cardId = card.id
    cardElement.style.setProperty("--index", index)

    const rarityClass = getRarityClass(card.rarity)
    const rarityColor = getRarityColor(card.rarity)

    cardElement.innerHTML = `
      <div class="card-image-container">
        <img src="${card.imageUrl}" alt="${card.name}" class="card-image" loading="lazy" />
      </div>
      <div class="card-overlay">
        <div class="card-name">${card.name}</div>
        <div class="card-type">${card.type}</div>
        <div class="card-rarity">
          <span class="card-rarity-indicator" style="background-color: ${rarityColor}"></span>
          ${card.rarity || "Unknown"}
        </div>
      </div>
    `

    cardElement.addEventListener("click", () => {
      document.querySelectorAll(".card-item").forEach((item) => {
        item.classList.remove("selected")
      })
      cardElement.classList.add("selected")

      displayCardDetails(card)
      selectedCardId = card.id
    })

    cardGrid.appendChild(cardElement)
  })

  // Add entrance animations
  setTimeout(() => {
    document.querySelectorAll(".card-item").forEach((card, index) => {
      card.style.animation = `fadeIn 0.5s ease-out ${index * 0.03}s both`
    })
  }, 100)
}

function loadMoreCards(reset = false) {
  if (reset) {
    displayedCards = []
    currentPage = 1
  }

  const startIndex = (currentPage - 1) * cardsPerPage
  const endIndex = startIndex + cardsPerPage
  const newCards = filteredCards.slice(startIndex, endIndex)

  displayedCards = [...displayedCards, ...newCards]
  displayCards(displayedCards)

  // Hide load more button if all cards are displayed
  if (displayedCards.length >= filteredCards.length) {
    loadMoreBtn.style.display = "none"
  } else {
    loadMoreBtn.style.display = "block"
  }

  currentPage++
}

function displayCardDetails(card) {
  const frameStyle = getCardFrameStyle(card)
  const rarityColor = getRarityColor(card.rarity)

  // Process card text with mana symbols
  const cardText = card.text
    ? card.text.replace(/\n/g, "<br>").replace(/\{([^}]+)\}/g, (match, symbol) => {
        const symbolLower = symbol.toLowerCase()
        let colorClass = ""

        if (symbolLower === "w") colorClass = "mana-w-icon"
        else if (symbolLower === "u") colorClass = "mana-u-icon"
        else if (symbolLower === "b") colorClass = "mana-b-icon"
        else if (symbolLower === "r") colorClass = "mana-r-icon"
        else if (symbolLower === "g") colorClass = "mana-g-icon"
        else colorClass = "mana-c-icon"

        return `<span class="mana-symbol-icon ${colorClass}" title="${symbol}"></span>`
      })
    : "No card text available"

  const flavorText = card.flavor ? `<div class="card-flavor-text">${card.flavor}</div>` : ""

  // Create meta items
  let metaItems = ""

  if (card.manaCost) {
    metaItems += `
      <div class="card-meta-item">
        <div class="card-meta-label">Mana Cost</div>
        <div class="card-meta-value">${parseManaSymbols(card.manaCost)}</div>
      </div>
    `
  }

  if (card.rarity) {
    metaItems += `
      <div class="card-meta-item">
        <div class="card-meta-label">Rarity</div>
        <div class="card-meta-value" style="color: ${rarityColor}">${card.rarity}</div>
      </div>
    `
  }

  if (card.set) {
    metaItems += `
      <div class="card-meta-item">
        <div class="card-meta-label">Set</div>
        <div class="card-meta-value">${card.setName} (${card.set})</div>
      </div>
    `
  }

  if (card.power && card.toughness) {
    metaItems += `
      <div class="card-meta-item">
        <div class="card-meta-label">Power/Toughness</div>
        <div class="card-meta-value">${card.power}/${card.toughness}</div>
      </div>
    `
  }

  if (card.loyalty) {
    metaItems += `
      <div class="card-meta-item">
        <div class="card-meta-label">Loyalty</div>
        <div class="card-meta-value">${card.loyalty}</div>
      </div>
    `
  }

  if (card.artist) {
    metaItems += `
      <div class="card-meta-item">
        <div class="card-meta-label">Artist</div>
        <div class="card-meta-value">${card.artist}</div>
      </div>
    `
  }

  // Create action buttons
  let actionButtons = `
    <button class="card-action-button" onclick="openCardModal('${card.id}')">
      <svg class="card-action-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 3h6v6M14 10l6-6M9 21H3v-6M10 14l-6 6"/>
      </svg>
      View Full Size
    </button>
  `

  if (card.purchaseUrls && card.purchaseUrls.tcgplayer) {
    actionButtons += `
      <a href="${card.purchaseUrls.tcgplayer}" target="_blank" class="card-action-button">
        <svg class="card-action-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 2 1.61h9.72a2 2 0 0 2-1.61L23 6H6"/>
        </svg>
        Buy on TCGPlayer
      </a>
    `
  }

  // Create the enhanced card showcase
  cardViewer.innerHTML = `
    <div class="card-detail-container">
      <div class="card-detail-header">
        <div class="card-detail-bg" style="background-image: url(${card.imageUrl})"></div>
        <div class="card-detail-title">
          <h1 class="card-name-display" style="color: ${rarityColor}">${card.name}</h1>
          <div class="card-type-display">${card.type}</div>
        </div>
      </div>
      
      <div class="card-detail-body">
        <div class="card-detail-image-wrapper">
          <div class="card-detail-image">
            <div class="card-frame-3d">
              <div class="card-frame-inner" style="background: ${frameStyle}">
                <img src="${card.imageUrl}" alt="${card.name}" class="card-frame-img" />
              </div>
              <div class="card-frame-glow"></div>
            </div>
          </div>
        </div>
        
        <div class="card-detail-info">
          <div class="card-info-section">
            <h3>Card Text</h3>
            <div class="card-text-content">${cardText}</div>
            ${flavorText}
          </div>
          
          <div class="card-info-section">
            <h3>Card Details</h3>
            <div class="card-meta-grid">
              ${metaItems}
            </div>
          </div>
          
          <div class="card-info-section">
            <h3>Actions</h3>
            <div class="card-actions">
              ${actionButtons}
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  // Add floating animation to the card
  const cardFrame = cardViewer.querySelector(".card-frame-3d")
  if (cardFrame) {
    cardFrame.style.animation = "floatCard 5s ease-in-out infinite"
  }

  // Add hover effect for card text
  const cardTextContent = cardViewer.querySelector(".card-text-content")
  if (cardTextContent) {
    cardTextContent.addEventListener("mouseover", () => {
      cardTextContent.style.transform = "scale(1.02)"
      cardTextContent.style.transition = "transform 0.3s ease"
    })

    cardTextContent.addEventListener("mouseout", () => {
      cardTextContent.style.transform = "scale(1)"
    })
  }

  // Add hover effects to card info sections
  const infoSections = cardViewer.querySelectorAll(".card-info-section")
  infoSections.forEach((section) => {
    section.addEventListener("mouseenter", () => {
      section.style.borderLeftWidth = "5px"
    })

    section.addEventListener("mouseleave", () => {
      section.style.borderLeftWidth = "3px"
    })
  })
}

function openCardModal(cardId) {
  const card = cardsData.find((c) => c.id === cardId)

  if (!card) return

  const frameStyle = getCardFrameStyle(card)

  cardModalContent.innerHTML = `
    <div class="modal-card-container">
      <img src="${card.imageUrl}" alt="${card.name}" style="max-width: 100%; max-height: 80vh; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);" />
      <h2 style="margin-top: 1.5rem; text-align: center; font-family: 'Beleren', 'Garamond', serif; color: var(--gold-accent);">${card.name}</h2>
    </div>
  `

  // Add entrance animation
  const modalCard = cardModalContent.querySelector(".modal-card-container")
  modalCard.style.opacity = "0"
  modalCard.style.transform = "scale(0.9) translateY(20px)"
  modalCard.style.transition = "opacity 0.5s ease, transform 0.5s ease"

  cardModal.classList.add("show")
  document.body.style.overflow = "hidden"

  setTimeout(() => {
    modalCard.style.opacity = "1"
    modalCard.style.transform = "scale(1) translateY(0)"
  }, 50)
}

function closeCardModal() {
  const modalCard = cardModalContent.querySelector(".modal-card-container")

  if (modalCard) {
    modalCard.style.opacity = "0"
    modalCard.style.transform = "scale(0.9) translateY(20px)"

    setTimeout(() => {
      cardModal.classList.remove("show")
      document.body.style.overflow = ""
    }, 300)
  } else {
    cardModal.classList.remove("show")
    document.body.style.overflow = ""
  }
}

function sortCards() {
  const sortBy = sortFilter.value

  filteredCards.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "type":
        return a.type.localeCompare(b.type)
      case "rarity":
        const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3, "Mythic Rare": 4, Special: 5 }
        return (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0)
      case "cmc":
        return (a.cmc || 0) - (b.cmc || 0)
      default:
        return a.name.localeCompare(b.name)
    }
  })

  loadMoreCards(true)
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

  sortCards()
  updateCardCount()
}

// Event Listeners
searchInput.addEventListener("input", filterCards)
rarityFilter.addEventListener("change", filterCards)
typeFilter.addEventListener("change", filterCards)
sortFilter.addEventListener("change", sortCards)
loadMoreBtn.addEventListener("click", () => loadMoreCards())
cardModalClose.addEventListener("click", closeCardModal)

// Close modal when clicking outside content
cardModal.addEventListener("click", (e) => {
  if (e.target === cardModal) {
    closeCardModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cardModal.classList.contains("show")) {
    closeCardModal()
  }
})

// Make openCardModal available globally
window.openCardModal = openCardModal

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  setLoading(true)

  cardViewer.innerHTML = `
    <div class="card-viewer-placeholder">
      <div class="card-placeholder-icon"></div>
      <p>Select a card to view details</p>
    </div>
  `

  createParticles()
  fetchCards()

  // Add scroll animation for card grid
  const cardGridContainer = document.querySelector(".card-grid-container")
  if (cardGridContainer) {
    cardGridContainer.addEventListener("scroll", () => {
      const cards = document.querySelectorAll(".card-item")
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0

        if (isVisible) {
          card.style.opacity = "1"
          card.style.transform = "translateY(0)"
        }
      })
    })
  }
})

