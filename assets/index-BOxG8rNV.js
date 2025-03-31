(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();const n=document.querySelector("#app"),P=n.querySelector("#searchInput"),L=n.querySelector("#cardGrid"),p=n.querySelector("#cardViewer"),k=n.querySelector("#loadingIndicator"),O=n.querySelector("#cardCount"),I=n.querySelector("#rarityFilter"),F=n.querySelector("#typeFilter"),U=n.querySelector("#sortFilter"),m=n.querySelector("#cardModal"),b=n.querySelector("#cardModalContent"),R=n.querySelector(".card-modal-close"),$=n.querySelector("#loadMoreBtn");let h=[],d=[],f=[],C=1;const T=20;function A(e){if(!e)return"";const t=e.toLowerCase();return t.includes("common")?"rarity-common":t.includes("uncommon")?"rarity-uncommon":t.includes("rare")&&!t.includes("mythic")?"rarity-rare":t.includes("mythic")?"rarity-mythic":t.includes("special")?"rarity-special":""}function B(e){if(!e)return"var(--common-color)";const t=e.toLowerCase();return t.includes("common")?"var(--common-color)":t.includes("uncommon")?"var(--uncommon-color)":t.includes("rare")&&!t.includes("mythic")?"var(--rare-color)":t.includes("mythic")?"var(--mythic-color)":t.includes("special")?"var(--special-color)":"var(--common-color)"}function H(e){if(!e.colors||e.colors.length===0)return"var(--colorless-frame)";if(e.colors.length>1)return"var(--multicolor-frame)";switch(e.colors[0].toLowerCase()){case"white":return"var(--white-frame)";case"blue":return"var(--blue-frame)";case"black":return"var(--black-frame)";case"red":return"var(--red-frame)";case"green":return"var(--green-frame)";default:return"var(--colorless-frame)"}}function x(e){e?k.classList.add("show"):k.classList.remove("show")}function S(){O.textContent=`${d.length} cards`}function V(){const e=document.querySelector(".particles-container"),t=30;for(let r=0;r<t;r++){const a=document.createElement("div");a.classList.add("particle");const s=Math.random()*5+2,o=Math.random()*20+10,i=Math.random()*10,u=Math.floor(Math.random()*5),c=["var(--white-mana)","var(--blue-mana)","var(--black-mana)","var(--red-mana)","var(--green-mana)"];a.style.width=`${s}px`,a.style.height=`${s}px`,a.style.left=`${Math.random()*100}%`,a.style.bottom=`-${s}px`,a.style.backgroundColor=c[u],a.style.opacity="0",a.style.borderRadius="50%",a.style.position="absolute",a.style.boxShadow=`0 0 ${s*2}px ${c[u]}`,a.style.animation=`particle-float ${o}s linear ${i}s infinite`,e.appendChild(a)}}function N(e){return e?e.replace(/\{([^}]+)\}/g,(t,r)=>{const a=r.toLowerCase();let s="";return a==="w"?s="mana-w-icon":a==="u"?s="mana-u-icon":a==="b"?s="mana-b-icon":a==="r"?s="mana-r-icon":a==="g"?s="mana-g-icon":s="mana-c-icon",`<span class="mana-symbol-icon ${s}" title="${r}"></span>`}):""}async function G(){try{x(!0);const e=[],t=new Set,r=5;for(let a=1;a<=r;a++){const o=await(await fetch(`https://api.magicthegathering.io/v1/cards?pageSize=100&page=${a}`)).json();if(!o.cards||o.cards.length===0)break;o.cards.forEach(i=>{i.name&&!t.has(i.name)&&i.imageUrl&&(t.add(i.name),e.push(i))}),a>1&&(h=[...e],d=[...e],w(),g(),S())}h=e,d=e,w(),g(!0),S()}catch(e){console.error("Error fetching cards:",e),L.innerHTML='<div class="error-message">Error loading cards. Please try again later.</div>'}finally{x(!1)}}function z(e){L.innerHTML="",e.forEach((t,r)=>{const a=document.createElement("div");a.classList.add("card-item"),a.dataset.cardId=t.id,a.style.setProperty("--index",r),A(t.rarity);const s=B(t.rarity);a.innerHTML=`
      <div class="card-image-container">
        <img src="${t.imageUrl}" alt="${t.name}" class="card-image" loading="lazy" />
      </div>
      <div class="card-overlay">
        <div class="card-name">${t.name}</div>
        <div class="card-type">${t.type}</div>
        <div class="card-rarity">
          <span class="card-rarity-indicator" style="background-color: ${s}"></span>
          ${t.rarity||"Unknown"}
        </div>
      </div>
    `,a.addEventListener("click",()=>{document.querySelectorAll(".card-item").forEach(o=>{o.classList.remove("selected")}),a.classList.add("selected"),D(t),t.id}),L.appendChild(a)}),setTimeout(()=>{document.querySelectorAll(".card-item").forEach((t,r)=>{t.style.animation=`fadeIn 0.5s ease-out ${r*.03}s both`})},100)}function g(e=!1){e&&(f=[],C=1);const t=(C-1)*T,r=t+T,a=d.slice(t,r);f=[...f,...a],z(f),f.length>=d.length?$.style.display="none":$.style.display="block",C++}function D(e){const t=H(e),r=B(e.rarity),a=e.text?e.text.replace(/\n/g,"<br>").replace(/\{([^}]+)\}/g,(v,q)=>{const y=q.toLowerCase();let l="";return y==="w"?l="mana-w-icon":y==="u"?l="mana-u-icon":y==="b"?l="mana-b-icon":y==="r"?l="mana-r-icon":y==="g"?l="mana-g-icon":l="mana-c-icon",`<span class="mana-symbol-icon ${l}" title="${q}"></span>`}):"No card text available",s=e.flavor?`<div class="card-flavor-text">${e.flavor}</div>`:"";let o="";e.manaCost&&(o+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Mana Cost</div>
        <div class="card-meta-value">${N(e.manaCost)}</div>
      </div>
    `),e.rarity&&(o+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Rarity</div>
        <div class="card-meta-value" style="color: ${r}">${e.rarity}</div>
      </div>
    `),e.set&&(o+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Set</div>
        <div class="card-meta-value">${e.setName} (${e.set})</div>
      </div>
    `),e.power&&e.toughness&&(o+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Power/Toughness</div>
        <div class="card-meta-value">${e.power}/${e.toughness}</div>
      </div>
    `),e.loyalty&&(o+=`
      <div class="card-meta-item">
        <div class="card-meta-label">Loyalty</div>
        <div class="card-meta-value">${e.loyalty}</div>
      </div>
    `),e.artist&&(o+=`
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
          <path d="M1 1h4l2.68 13.39a2 2 0 0 2 1.61h9.72a2 2 0 0 2-1.61L23 6H6"/>
        </svg>
        Buy on TCGPlayer
      </a>
    `),p.innerHTML=`
    <div class="card-detail-container">
      <div class="card-detail-header">
        <div class="card-detail-bg" style="background-image: url(${e.imageUrl})"></div>
        <div class="card-detail-title">
          <h1 class="card-name-display" style="color: ${r}">${e.name}</h1>
          <div class="card-type-display">${e.type}</div>
        </div>
      </div>
      
      <div class="card-detail-body">
        <div class="card-detail-image-wrapper">
          <div class="card-detail-image">
            <div class="card-frame-3d">
              <div class="card-frame-inner" style="background: ${t}">
                <img src="${e.imageUrl}" alt="${e.name}" class="card-frame-img" />
              </div>
              <div class="card-frame-glow"></div>
            </div>
          </div>
        </div>
        
        <div class="card-detail-info">
          <div class="card-info-section">
            <h3>Card Text</h3>
            <div class="card-text-content">${a}</div>
            ${s}
          </div>
          
          <div class="card-info-section">
            <h3>Card Details</h3>
            <div class="card-meta-grid">
              ${o}
            </div>
          </div>
          
          <div class="card-info-section">
            <h3>Actions</h3>
            <div class="card-actions">
              ${i}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;const u=p.querySelector(".card-frame-3d");u&&(u.style.animation="floatCard 5s ease-in-out infinite");const c=p.querySelector(".card-text-content");c&&(c.addEventListener("mouseover",()=>{c.style.transform="scale(1.02)",c.style.transition="transform 0.3s ease"}),c.addEventListener("mouseout",()=>{c.style.transform="scale(1)"})),p.querySelectorAll(".card-info-section").forEach(v=>{v.addEventListener("mouseenter",()=>{v.style.borderLeftWidth="5px"}),v.addEventListener("mouseleave",()=>{v.style.borderLeftWidth="3px"})})}function Y(e){const t=h.find(a=>a.id===e);if(!t)return;H(t),b.innerHTML=`
    <div class="modal-card-container">
      <img src="${t.imageUrl}" alt="${t.name}" style="max-width: 100%; max-height: 80vh; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);" />
      <h2 style="margin-top: 1.5rem; text-align: center; font-family: 'Beleren', 'Garamond', serif; color: var(--gold-accent);">${t.name}</h2>
    </div>
  `;const r=b.querySelector(".modal-card-container");r.style.opacity="0",r.style.transform="scale(0.9) translateY(20px)",r.style.transition="opacity 0.5s ease, transform 0.5s ease",m.classList.add("show"),document.body.style.overflow="hidden",setTimeout(()=>{r.style.opacity="1",r.style.transform="scale(1) translateY(0)"},50)}function M(){const e=b.querySelector(".modal-card-container");e?(e.style.opacity="0",e.style.transform="scale(0.9) translateY(20px)",setTimeout(()=>{m.classList.remove("show"),document.body.style.overflow=""},300)):(m.classList.remove("show"),document.body.style.overflow="")}function w(){const e=U.value;d.sort((t,r)=>{switch(e){case"name":return t.name.localeCompare(r.name);case"type":return t.type.localeCompare(r.type);case"rarity":const a={Common:1,Uncommon:2,Rare:3,"Mythic Rare":4,Special:5};return(a[t.rarity]||0)-(a[r.rarity]||0);case"cmc":return(t.cmc||0)-(r.cmc||0);default:return t.name.localeCompare(r.name)}}),g(!0)}function E(){const e=P.value.toLowerCase(),t=I.value,r=F.value;d=h.filter(a=>{const s=a.name.toLowerCase().includes(e);let o=!0;t&&(o=a.rarity&&a.rarity.includes(t));const i=!r||a.type&&a.type.includes(r);return s&&o&&i}),w(),S()}P.addEventListener("input",E);I.addEventListener("change",E);F.addEventListener("change",E);U.addEventListener("change",w);$.addEventListener("click",()=>g());R.addEventListener("click",M);m.addEventListener("click",e=>{e.target===m&&M()});document.addEventListener("keydown",e=>{e.key==="Escape"&&m.classList.contains("show")&&M()});window.openCardModal=Y;document.addEventListener("DOMContentLoaded",()=>{x(!0),p.innerHTML=`
    <div class="card-viewer-placeholder">
      <div class="card-placeholder-icon"></div>
      <p>Select a card to view details</p>
    </div>
  `,V(),G();const e=document.querySelector(".card-grid-container");e&&e.addEventListener("scroll",()=>{document.querySelectorAll(".card-item").forEach(r=>{const a=r.getBoundingClientRect();a.top<window.innerHeight&&a.bottom>0&&(r.style.opacity="1",r.style.transform="translateY(0)")})})});
