(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))v(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&v(u)}).observe(document,{childList:!0,subtree:!0});function o(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function v(r){if(r.ep)return;r.ep=!0;const a=o(r);fetch(r.href,a)}})();const e=document.querySelector("#status"),s=document.querySelector("#ui-toggle"),f=document.querySelector("#toggle"),T=document.querySelector("#copy"),L=document.querySelector("#capture-structure"),d=document.querySelector("#clear-structure"),l=document.querySelector("#reference-status"),k=document.querySelector("#brand-icon"),g="opentargetui:v1:settings",y="opentargetui:v1:structure-reference",R={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0},p={copy:'<svg class="icon lucide lucide-copy" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',target:'<svg class="icon lucide lucide-target" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'};function h(t){return t.replace("<svg",'<svg aria-hidden="true" focusable="false"')}function i(t){return chrome.runtime.getURL(t.replace(/^\//,""))}const x=document.createElement("style");x.textContent=`
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src: url("${i("fonts/geist-latin-400-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 500;
    src: url("${i("fonts/geist-latin-500-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 600;
    src: url("${i("fonts/geist-latin-600-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 700;
    src: url("${i("fonts/geist-latin-700-normal.woff2")}") format("woff2");
  }
`;document.head.appendChild(x);k.innerHTML=h(p.target);document.querySelectorAll("[data-icon]").forEach(t=>{const n=t.dataset.icon;t.innerHTML=h(p[n])});async function C(){const[t]=await chrome.tabs.query({active:!0,currentWindow:!0});return t}async function q(){const t=await chrome.storage.local.get(g);return{...R,...t[g],enabled:!1}}async function U(t){await chrome.storage.local.set({[g]:{...t,enabled:!1}})}async function E(){return(await chrome.storage.local.get(y))[y]??null}async function I(){await chrome.storage.local.remove(y)}function w(t){e&&(e.textContent=t?"UI enabled on this tab":"UI hidden by default"),s&&(s.classList.toggle("primary",!t),s.innerHTML=t?'<span class="button-icon" data-icon="target"></span><span>Hide UI</span>':'<span class="button-icon" data-icon="target"></span><span>Show UI</span>'),f&&(f.disabled=!t),document.querySelectorAll("[data-icon]").forEach(n=>{const o=n.dataset.icon;n.innerHTML=h(p[o])})}function m(t){let n="reference page";if(t)try{n=new URL(t.url).hostname}catch{n=t.url}l&&(l.textContent=t?`Structure saved from ${n}`:"No structure reference saved"),d&&(d.disabled=!t)}async function b(t,n={}){const o=await C();if(!o?.id)throw new Error("No active tab");return await chrome.tabs.sendMessage(o.id,{source:"opentargetui-popup",type:t,...n})}async function N(){const t=await C();if(!t?.id)throw new Error("No active tab");return t.id}async function S(){try{return await b("get-state").then(t=>({enabled:!!t?.enabled}))}catch{return{enabled:!1}}}async function M(){const t=await N();try{await chrome.tabs.sendMessage(t,{source:"opentargetui-popup",type:"get-state"});return}catch{await chrome.scripting.executeScript({target:{tabId:t},files:["content.js"]})}}async function c(t,n={}){return await M(),b(t,n)}s?.addEventListener("click",async()=>{try{const t=await q(),n=await S(),o={...t,enabled:!n.enabled};if(await U(t),w(o.enabled),o.enabled){await c("set-enabled",{enabled:!0});return}await b("set-enabled",{enabled:!1}).catch(()=>{})}catch{e&&(e.textContent="Reload the page, then try again")}});f?.addEventListener("click",async()=>{try{(await S()).enabled||w(!0),await c("set-enabled",{enabled:!0}),await c("toggle-selection"),e&&(e.textContent="Annotation mode toggled")}catch{e&&(e.textContent="Reload the page, then try again")}});L?.addEventListener("click",async()=>{try{const t=await c("capture-structure-reference");m(t?.reference??await E()),e&&(e.textContent="Structure reference captured")}catch{e&&(e.textContent="Reload the page, then try again")}});d?.addEventListener("click",async()=>{try{await I(),m(null),e&&(e.textContent="Structure reference cleared")}catch{e&&(e.textContent="Could not clear reference")}});T?.addEventListener("click",async()=>{try{const t=await c("copy-feedback");if(!t?.ok||!t.text){e&&(e.textContent="No changes to copy");return}await navigator.clipboard.writeText(t.text),e&&(e.textContent="Request copied")}catch{e&&(e.textContent="No content script on this page")}});S().then(t=>w(t.enabled)).catch(()=>{e&&(e.textContent="Settings unavailable")});E().then(m).catch(()=>{l&&(l.textContent="Reference unavailable")});
//# sourceMappingURL=popup.js.map
