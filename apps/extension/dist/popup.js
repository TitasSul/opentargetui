(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))h(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&h(l)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function h(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();const o=document.querySelector("#status"),s=document.querySelector("#ui-toggle"),f=document.querySelector("#toggle"),b=document.querySelector("#copy"),v=document.querySelector("#brand-icon"),d="opentargetui:v1:settings",x={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0},u={copy:'<svg class="icon lucide lucide-copy" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',target:'<svg class="icon lucide lucide-target" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'};function g(t){return t.replace("<svg",'<svg aria-hidden="true" focusable="false"')}function c(t){return chrome.runtime.getURL(t.replace(/^\//,""))}const m=document.createElement("style");m.textContent=`
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
`;document.head.appendChild(m);v.innerHTML=g(u.target);document.querySelectorAll("[data-icon]").forEach(t=>{const e=t.dataset.icon;t.innerHTML=g(u[e])});async function S(){const[t]=await chrome.tabs.query({active:!0,currentWindow:!0});return t}async function p(){const t=await chrome.storage.local.get(d);return{...x,...t[d]}}async function w(t){await chrome.storage.local.set({[d]:t})}function y(t){o&&(o.textContent=t?"UI enabled on this tab":"UI hidden by default"),s&&(s.classList.toggle("primary",!t),s.innerHTML=t?'<span class="button-icon" data-icon="target"></span><span>Hide UI</span>':'<span class="button-icon" data-icon="target"></span><span>Show UI</span>'),f&&(f.disabled=!t),document.querySelectorAll("[data-icon]").forEach(e=>{const a=e.dataset.icon;e.innerHTML=g(u[a])})}async function i(t,e={}){const a=await S();if(!a?.id)throw new Error("No active tab");return await chrome.tabs.sendMessage(a.id,{source:"opentargetui-popup",type:t,...e})}s?.addEventListener("click",async()=>{try{const t=await p(),e={...t,enabled:!t.enabled};await w(e),y(e.enabled),await i("set-enabled",{enabled:e.enabled})}catch{o&&(o.textContent="Reload the page, then try again")}});f?.addEventListener("click",async()=>{try{const t=await p();if(!t.enabled){const e={...t,enabled:!0};await w(e),y(!0),await i("set-enabled",{enabled:!0})}await i("toggle-selection"),o&&(o.textContent="Annotation mode toggled")}catch{o&&(o.textContent="Reload the page, then try again")}});b?.addEventListener("click",async()=>{try{const t=await i("copy-feedback");o&&(o.textContent=t?.copied===!1?"No changes to copy":"Request copied")}catch{o&&(o.textContent="No content script on this page")}});p().then(t=>y(t.enabled)).catch(()=>{o&&(o.textContent="Settings unavailable")});
//# sourceMappingURL=popup.js.map
