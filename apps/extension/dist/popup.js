(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))g(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&g(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function g(e){if(e.ep)return;e.ep=!0;const a=o(e);fetch(e.href,a)}})();const r=document.querySelector("#status"),c=document.querySelector("#ui-toggle"),h=document.querySelector("#brand-icon"),l="opentargetui:v1:settings",b={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0},f={target:'<svg class="icon lucide lucide-target" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'};function u(t){return t.replace("<svg",'<svg aria-hidden="true" focusable="false"')}function s(t){return chrome.runtime.getURL(t.replace(/^\//,""))}const p=document.createElement("style");p.textContent=`
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
`;document.head.appendChild(p);h.innerHTML=u(f.target);document.querySelectorAll("[data-icon]").forEach(t=>{const n=t.dataset.icon;t.innerHTML=u(f[n])});async function y(){const[t]=await chrome.tabs.query({active:!0,currentWindow:!0});return t}async function v(){const t=await chrome.storage.local.get(l);return{...b,...t[l],enabled:!1}}async function S(t){await chrome.storage.local.set({[l]:{...t,enabled:!1}})}function m(t){r&&(r.textContent=t?"UI enabled on this tab":"UI hidden by default"),c&&(c.classList.toggle("primary",!t),c.innerHTML=t?'<span class="button-icon" data-icon="target"></span><span>Hide UI</span>':'<span class="button-icon" data-icon="target"></span><span>Show UI</span>'),document.querySelectorAll("[data-icon]").forEach(n=>{const o=n.dataset.icon;n.innerHTML=u(f[o])})}async function d(t,n={}){const o=await y();if(!o?.id)throw new Error("No active tab");return await chrome.tabs.sendMessage(o.id,{source:"opentargetui-popup",type:t,...n})}async function T(){const t=await y();if(!t?.id)throw new Error("No active tab");return t.id}async function w(){try{return await d("get-state").then(t=>({enabled:!!t?.enabled}))}catch{return{enabled:!1}}}async function E(){const t=await T();try{await chrome.tabs.sendMessage(t,{source:"opentargetui-popup",type:"get-state"});return}catch{await chrome.scripting.executeScript({target:{tabId:t},files:["content.js"]})}}async function L(t,n={}){return await E(),d(t,n)}c?.addEventListener("click",async()=>{try{const t=await v(),n=await w(),o={...t,enabled:!n.enabled};if(await S(t),m(o.enabled),o.enabled){await L("set-enabled",{enabled:!0});return}await d("set-enabled",{enabled:!1}).catch(()=>{})}catch{r&&(r.textContent="Reload the page, then try again")}});w().then(t=>m(t.enabled)).catch(()=>{r&&(r.textContent="Settings unavailable")});
//# sourceMappingURL=popup.js.map
