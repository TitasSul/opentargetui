(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function d(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(t){if(t.ep)return;t.ep=!0;const o=d(t);fetch(t.href,o)}})();const r=document.querySelector("#status"),y=document.querySelector("#toggle"),g=document.querySelector("#copy"),p=document.querySelector("#brand-icon"),a={copy:'<svg class="icon lucide lucide-copy" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',target:'<svg class="icon lucide lucide-target" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'};function l(e){return e.replace("<svg",'<svg aria-hidden="true" focusable="false"')}function c(e){return chrome.runtime.getURL(e.replace(/^\//,""))}const f=document.createElement("style");f.textContent=`
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src: url("${c("fonts/geist-latin-400-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 500;
    src: url("${c("fonts/geist-latin-500-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 600;
    src: url("${c("fonts/geist-latin-600-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 700;
    src: url("${c("fonts/geist-latin-700-normal.woff2")}") format("woff2");
  }
`;document.head.appendChild(f);p.innerHTML=l(a.target);document.querySelectorAll("[data-icon]").forEach(e=>{const n=e.dataset.icon;e.innerHTML=l(a[n])});async function m(){const[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return e}async function u(e){const n=await m();if(!n?.id)throw new Error("No active tab");return await chrome.tabs.sendMessage(n.id,{source:"opentargetui-popup",type:e})}y?.addEventListener("click",async()=>{try{await u("toggle-selection"),r&&(r.textContent="Annotation mode toggled")}catch{r&&(r.textContent="Reload the page, then try again")}});g?.addEventListener("click",async()=>{try{const e=await u("copy-feedback");r&&(r.textContent=e?.copied===!1?"No changes to copy":"Request copied")}catch{r&&(r.textContent="No content script on this page")}});
//# sourceMappingURL=popup.js.map
