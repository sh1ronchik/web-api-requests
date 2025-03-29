(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();const c=document.querySelector("#app"),v=c.querySelector("#searchInput"),d=c.querySelector("#cardList"),l=c.querySelector("#cardDetails"),g=c.querySelector("#loadingIndicator"),w=c.querySelector("#cardCount"),L=c.querySelector("#rarityFilter"),C=c.querySelector("#typeFilter");let u=[],o=[],h=null;function $(e){if(!e)return"";const t=e.toLowerCase();return t.includes("common")?"rarity-common":t.includes("uncommon")?"rarity-uncommon":t.includes("rare")&&!t.includes("mythic")?"rarity-rare":t.includes("mythic")?"rarity-mythic":t.includes("special")?"rarity-special":""}function p(e){e?g.classList.add("show"):g.classList.remove("show")}function y(){w.textContent=`${o.length} cards`}async function x(){try{p(!0);const e=[],t=new Set,n=5;for(let r=1;r<=n;r++){const a=await(await fetch(`https://api.magicthegathering.io/v1/cards?pageSize=100&page=${r}`)).json();if(!a.cards||a.cards.length===0)break;a.cards.forEach(i=>{i.name&&!t.has(i.name)&&i.imageUrl&&(t.add(i.name),e.push(i))}),r>1&&(u=[...e],o=[...e],f(o),y())}u=e,o=e,f(o),y()}catch(e){console.error("Error fetching cards:",e),d.innerHTML='<li class="card-item">Error loading cards. Please try again later.</li>'}finally{p(!1)}}function f(e){d.innerHTML="",e.forEach((t,n)=>{const r=document.createElement("li");r.classList.add("card-item"),r.style.setProperty("--index",n);const s=$(t.rarity);s&&r.classList.add(s),h===t.id&&r.classList.add("active"),r.innerHTML=`
      <div class="card-item-name">${t.name}</div>
      <div class="card-item-type">${t.type}</div>
      <div class="card-item-rarity">${t.rarity||"Unknown Rarity"}</div>
    `,r.addEventListener("click",()=>{document.querySelectorAll(".card-item").forEach(a=>{a.classList.remove("active")}),r.classList.add("active"),S(t),h=t.id}),d.appendChild(r)})}function S(e){l.classList.add("card-flip"),setTimeout(()=>{l.classList.remove("card-flip")},600),$(e.rarity);const t=e.manaCost?`<p class="card-text"><strong>Mana Cost:</strong> ${e.manaCost}</p>`:"",n=e.text?e.text.replace(/\n/g,"<br>"):"No card text available",r=e.flavor?`<p class="card-text" style="font-style: italic; color: #ccc;">"${e.flavor}"</p>`:"";l.innerHTML=`
    <div class="card-details-container">
      <div class="card-frame">
        <div class="card-inner">
          <div class="card-front">
            <div class="card-image-container">
              <img src="${e.imageUrl}" alt="${e.name}" class="card-image" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="card-info">
        <h2 class="card-name">${e.name}</h2>
        
        <div class="card-meta">
          <p class="card-text"><strong>Type:</strong> ${e.type}</p>
          <p class="card-text"><strong>Rarity:</strong> ${e.rarity}</p>
          <p class="card-text"><strong>Set:</strong> ${e.set}</p>
          ${t}
        </div>
        
        <p class="card-text"><strong>Card Text:</strong><br>${n}</p>
        ${r}
        
        ${e.power&&e.toughness?`<p class="card-text"><strong>Power/Toughness:</strong> ${e.power}/${e.toughness}</p>`:""}
        
        ${e.loyalty?`<p class="card-text"><strong>Loyalty:</strong> ${e.loyalty}</p>`:""}
        
        ${e.purchaseUrls?`<a href="${e.purchaseUrls.tcgplayer}" target="_blank" class="card-link">Buy on TCGPlayer</a>`:""}
      </div>
    </div>
  `,l.classList.add("show-card")}function m(){const e=v.value.toLowerCase(),t=L.value,n=C.value;o=u.filter(r=>{const s=r.name.toLowerCase().includes(e);let a=!0;t&&(a=r.rarity&&r.rarity.includes(t));const i=!n||r.type&&r.type.includes(n);return s&&a&&i}),f(o),y()}v.addEventListener("input",m);L.addEventListener("change",m);C.addEventListener("change",m);document.addEventListener("DOMContentLoaded",()=>{p(!0),l.innerHTML=`
    <div class="card-placeholder">
      <div class="card-placeholder-icon"></div>
      <p>Select a card to view details</p>
    </div>
  `,x(),document.querySelectorAll(".orb").forEach(t=>{t.style.animationDuration=`${20+Math.random()*10}s`})});
