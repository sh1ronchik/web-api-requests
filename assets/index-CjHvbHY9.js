(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=s(o);fetch(o.href,a)}})();const n=document.querySelector("#app"),$=n.querySelector("#searchInput"),v=n.querySelector("#cardGrid"),m=n.querySelector("#cardViewer"),L=n.querySelector("#loadingIndicator"),E=n.querySelector("#cardCount"),b=n.querySelector("#rarityFilter"),M=n.querySelector("#typeFilter"),x=n.querySelector("#sortFilter"),d=n.querySelector("#cardModal"),k=n.querySelector("#cardModalContent"),q=n.querySelector(".card-modal-close");let u=[],c=[];function T(e){if(!e)return"";const t=e.toLowerCase();return t.includes("common")?"rarity-common":t.includes("uncommon")?"rarity-uncommon":t.includes("rare")&&!t.includes("mythic")?"rarity-rare":t.includes("mythic")?"rarity-mythic":t.includes("special")?"rarity-special":""}function S(e){if(!e)return"var(--common-color)";const t=e.toLowerCase();return t.includes("common")?"var(--common-color)":t.includes("uncommon")?"var(--uncommon-color)":t.includes("rare")&&!t.includes("mythic")?"var(--rare-color)":t.includes("mythic")?"var(--mythic-color)":t.includes("special")?"var(--special-color)":"var(--common-color)"}function P(e){if(!e.colors||e.colors.length===0)return"var(--colorless-frame)";if(e.colors.length>1)return"var(--multicolor-frame)";switch(e.colors[0].toLowerCase()){case"white":return"var(--white-frame)";case"blue":return"var(--blue-frame)";case"black":return"var(--black-frame)";case"red":return"var(--red-frame)";case"green":return"var(--green-frame)";default:return"var(--colorless-frame)"}}function y(e){e?L.classList.add("show"):L.classList.remove("show")}function f(){E.textContent=`${c.length} cards`}function F(){const e=document.querySelector(".particles-container"),t=30;for(let s=0;s<t;s++){const r=document.createElement("div");r.classList.add("particle");const o=Math.random()*5+2,a=Math.random()*20+10,i=Math.random()*10,l=Math.floor(Math.random()*5),C=["var(--white-mana)","var(--blue-mana)","var(--black-mana)","var(--red-mana)","var(--green-mana)"];r.style.width=`${o}px`,r.style.height=`${o}px`,r.style.left=`${Math.random()*100}%`,r.style.bottom=`-${o}px`,r.style.backgroundColor=C[l],r.style.opacity="0",r.style.borderRadius="50%",r.style.position="absolute",r.style.boxShadow=`0 0 ${o*2}px ${C[l]}`,r.style.animation=`particle-float ${a}s linear ${i}s infinite`,e.appendChild(r)}}async function U(){try{y(!0);const e=[],t=new Set,s=5;for(let r=1;r<=s;r++){const a=await(await fetch(`https://api.magicthegathering.io/v1/cards?pageSize=100&page=${r}`)).json();if(!a.cards||a.cards.length===0)break;a.cards.forEach(i=>{i.name&&!t.has(i.name)&&i.imageUrl&&(t.add(i.name),e.push(i))}),r>1&&(u=[...e],c=[...e],h(c),f())}u=e,c=e,g(),h(c),f()}catch(e){console.error("Error fetching cards:",e),v.innerHTML='<div class="error-message">Error loading cards. Please try again later.</div>'}finally{y(!1)}}function h(e){v.innerHTML="",e.forEach((t,s)=>{const r=document.createElement("div");r.classList.add("card-item"),r.style.setProperty("--index",s),T(t.rarity);const o=S(t.rarity);r.innerHTML=`
      <div class="card-image-container">
        <img src="${t.imageUrl}" alt="${t.name}" class="card-image" loading="lazy" />
      </div>
      <div class="card-overlay">
        <div class="card-name">${t.name}</div>
        <div class="card-type">${t.type}</div>
        <div class="card-rarity">
          <span class="card-rarity-indicator" style="background-color: ${o}"></span>
          ${t.rarity||"Unknown"}
        </div>
      </div>
    `,r.addEventListener("click",()=>{I(t),t.id,m.scrollIntoView({behavior:"smooth"})}),v.appendChild(r)})}function I(e){const t=P(e),s=S(e.rarity),r=e.text?e.text.replace(/\n/g,"<br>"):"No card text available",o=e.flavor?`<div class="card-flavor-text">${e.flavor}</div>`:"";let a="";e.manaCost&&(a+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Mana Cost</div>
        <div class="card-meta-value">${e.manaCost}</div>
      </div>
    `),e.rarity&&(a+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Rarity</div>
        <div class="card-meta-value">${e.rarity}</div>
      </div>
    `),e.set&&(a+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Set</div>
        <div class="card-meta-value">${e.setName} (${e.set})</div>
      </div>
    `),e.power&&e.toughness&&(a+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Power/Toughness</div>
        <div class="card-meta-value">${e.power}/${e.toughness}</div>
      </div>
    `),e.loyalty&&(a+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Loyalty</div>
        <div class="card-meta-value">${e.loyalty}</div>
      </div>
    `),e.artist&&(a+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Artist</div>
        <div class="card-meta-value">${e.artist}</div>
      </div>
    `);let i=`
    <button class="card-action-button" onclick="openCardModal('${e.id}')">
      <svg class="card-action-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 3h6v6M14 10l6-6M9 21H3v-6M10 14l-6 6"/>
      </svg>
      View Full Size
    </button>
  `;e.purchaseUrls&&e.purchaseUrls.tcgplayer&&(i+=`
      <a href="${e.purchaseUrls.tcgplayer}" target="_blank" class="card-action-button">
        <svg class="card-action-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        Buy on TCGPlayer
      </a>
    `),m.innerHTML=`
    <div class="card-showcase">
      <div class="card-showcase-header">
        <div class="card-showcase-bg" style="background-image: url(${e.imageUrl})"></div>
        <div class="card-showcase-title">
          <h1 class="card-name-display" style="color: ${s}">${e.name}</h1>
          <div class="card-type-display">${e.type}</div>
        </div>
      </div>
      
      <div class="card-showcase-content">
        <div class="card-showcase-image">
          <div class="card-frame-3d">
            <div class="card-frame-inner" style="background: ${t}">
              <img src="${e.imageUrl}" alt="${e.name}" class="card-frame-img" />
            </div>
            <div class="card-frame-glow"></div>
          </div>
        </div>
        
        <div class="card-showcase-info">
          <div class="card-info-section">
            <h3>Card Text</h3>
            <div class="card-text-content">${r}</div>
            ${o}
          </div>
          
          <div class="card-info-section">
            <h3>Card Details</h3>
            <div class="card-meta-grid">
              ${a}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;const l=m.querySelector(".card-frame-3d");l&&(l.style.animation="floatCard 5s ease-in-out infinite")}function H(e){const t=u.find(s=>s.id===e);t&&(k.innerHTML=`
    <img src="${t.imageUrl}" alt="${t.name}" style="max-width: 100%; max-height: 80vh; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);" />
    <h2 style="margin-top: 1.5rem; text-align: center; font-family: 'Beleren', 'Garamond', serif; color: var(--gold-accent);">${t.name}</h2>
  `,d.classList.add("show"),document.body.style.overflow="hidden")}function p(){d.classList.remove("show"),document.body.style.overflow=""}function g(){const e=x.value;c.sort((t,s)=>{switch(e){case"name":return t.name.localeCompare(s.name);case"type":return t.type.localeCompare(s.type);case"rarity":const r={Common:1,Uncommon:2,Rare:3,"Mythic Rare":4,Special:5};return(r[t.rarity]||0)-(r[s.rarity]||0);case"cmc":return(t.cmc||0)-(s.cmc||0);default:return t.name.localeCompare(s.name)}}),h(c)}function w(){const e=$.value.toLowerCase(),t=b.value,s=M.value;c=u.filter(r=>{const o=r.name.toLowerCase().includes(e);let a=!0;t&&(a=r.rarity&&r.rarity.includes(t));const i=!s||r.type&&r.type.includes(s);return o&&a&&i}),g(),f()}$.addEventListener("input",w);b.addEventListener("change",w);M.addEventListener("change",w);x.addEventListener("change",g);q.addEventListener("click",p);d.addEventListener("click",e=>{e.target===d&&p()});document.addEventListener("keydown",e=>{e.key==="Escape"&&d.classList.contains("show")&&p()});window.openCardModal=H;document.addEventListener("DOMContentLoaded",()=>{y(!0),m.innerHTML=`
    <div class="card-viewer-placeholder">
      <div class="card-placeholder-icon"></div>
      <p>Select a card to view details</p>
    </div>
  `,F(),U();const e=document.querySelector(".mana-pentagram"),t=document.querySelectorAll(".mana-icon");e&&(e.addEventListener("mouseover",()=>{t.forEach((s,r)=>{setTimeout(()=>{s.style.transform=s.classList.contains("mana-white")?"translateX(-50%) scale(1.2)":"scale(1.2)"},r*100)})}),e.addEventListener("mouseout",()=>{t.forEach(s=>{s.style.transform=s.classList.contains("mana-white")?"translateX(-50%)":""})}))});
