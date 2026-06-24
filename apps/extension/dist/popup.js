(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))g(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&g(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function g(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const r=document.querySelector("#status"),c=document.querySelector("#ui-toggle"),h=document.querySelector("#brand-icon"),l="opentargetui:v1:settings",b={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,hideMarkers:!1,blockPageInteractions:!0},f={target:'<svg class="icon lucide lucide-target" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'};function d(t){return t.replace("<svg",'<svg aria-hidden="true" focusable="false"')}function s(t){return chrome.runtime.getURL(t.replace(/^\//,""))}const p=document.createElement("style");p.textContent=`
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src: url("${s("fonts/geist-latin-400-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 500;
    src: url("${s("fonts/geist-latin-500-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 600;
    src: url("${s("fonts/geist-latin-600-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 700;
    src: url("${s("fonts/geist-latin-700-normal.woff2")}") format("woff2");
  }
`;document.head.appendChild(p);h.innerHTML=d(f.target);document.querySelectorAll("[data-icon]").forEach(t=>{const e=t.dataset.icon;t.innerHTML=d(f[e])});async function y(){const[t]=await chrome.tabs.query({active:!0,currentWindow:!0});return t}async function S(){const t=await chrome.storage.local.get(l),{copyOnAdd:e,...a}=t[l]??{};return{...b,...a,enabled:!1}}async function v(t){const{copyOnAdd:e,...a}=t;await chrome.storage.local.set({[l]:{...a,enabled:!1}})}function m(t){r&&(r.textContent=t?"UI enabled on this tab":"UI hidden by default"),c&&(c.classList.toggle("primary",!t),c.innerHTML=t?'<span class="button-icon" data-icon="target"></span><span>Hide UI</span>':'<span class="button-icon" data-icon="target"></span><span>Show UI</span>'),document.querySelectorAll("[data-icon]").forEach(e=>{const a=e.dataset.icon;e.innerHTML=d(f[a])})}async function u(t,e={}){const a=await y();if(!a?.id)throw new Error("No active tab");return await chrome.tabs.sendMessage(a.id,{source:"opentargetui-popup",type:t,...e})}async function T(){const t=await y();if(!t?.id)throw new Error("No active tab");return t.id}async function w(){try{return await u("get-state").then(t=>({enabled:!!t?.enabled}))}catch{return{enabled:!1}}}async function E(){const t=await T();try{await chrome.tabs.sendMessage(t,{source:"opentargetui-popup",type:"get-state"});return}catch{await chrome.scripting.executeScript({target:{tabId:t},files:["content.js"]})}}async function L(t,e={}){return await E(),u(t,e)}c?.addEventListener("click",async()=>{try{const t=await S(),e=await w(),a={...t,enabled:!e.enabled};if(await v(t),m(a.enabled),a.enabled){await L("set-enabled",{enabled:!0});return}await u("set-enabled",{enabled:!1}).catch(()=>{})}catch{r&&(r.textContent="Reload the page, then try again")}});w().then(t=>m(t.enabled)).catch(()=>{r&&(r.textContent="Settings unavailable")});
//# sourceMappingURL=popup.js.map
