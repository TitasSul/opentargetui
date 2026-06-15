(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))v(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&v(u)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function v(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const t=document.querySelector("#status"),s=document.querySelector("#ui-toggle"),f=document.querySelector("#toggle"),E=document.querySelector("#copy"),L=document.querySelector("#capture-structure"),d=document.querySelector("#clear-structure"),l=document.querySelector("#reference-status"),T=document.querySelector("#brand-icon"),g="opentargetui:v1:settings",y="opentargetui:v1:structure-reference",k={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0},p={copy:'<svg class="icon lucide lucide-copy" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',target:'<svg class="icon lucide lucide-target" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'};function h(e){return e.replace("<svg",'<svg aria-hidden="true" focusable="false"')}function i(e){return chrome.runtime.getURL(e.replace(/^\//,""))}const S=document.createElement("style");S.textContent=`
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
`;document.head.appendChild(S);T.innerHTML=h(p.target);document.querySelectorAll("[data-icon]").forEach(e=>{const n=e.dataset.icon;e.innerHTML=h(p[n])});async function R(){const[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return e}async function m(){const e=await chrome.storage.local.get(g);return{...k,...e[g]}}async function x(e){await chrome.storage.local.set({[g]:e})}async function C(){return(await chrome.storage.local.get(y))[y]??null}async function q(){await chrome.storage.local.remove(y)}function w(e){t&&(t.textContent=e?"UI enabled on this tab":"UI hidden by default"),s&&(s.classList.toggle("primary",!e),s.innerHTML=e?'<span class="button-icon" data-icon="target"></span><span>Hide UI</span>':'<span class="button-icon" data-icon="target"></span><span>Show UI</span>'),f&&(f.disabled=!e),document.querySelectorAll("[data-icon]").forEach(n=>{const a=n.dataset.icon;n.innerHTML=h(p[a])})}function b(e){let n="reference page";if(e)try{n=new URL(e.url).hostname}catch{n=e.url}l&&(l.textContent=e?`Structure saved from ${n}`:"No structure reference saved"),d&&(d.disabled=!e)}async function c(e,n={}){const a=await R();if(!a?.id)throw new Error("No active tab");return await chrome.tabs.sendMessage(a.id,{source:"opentargetui-popup",type:e,...n})}s?.addEventListener("click",async()=>{try{const e=await m(),n={...e,enabled:!e.enabled};await x(n),w(n.enabled),await c("set-enabled",{enabled:n.enabled})}catch{t&&(t.textContent="Reload the page, then try again")}});f?.addEventListener("click",async()=>{try{const e=await m();if(!e.enabled){const n={...e,enabled:!0};await x(n),w(!0),await c("set-enabled",{enabled:!0})}await c("toggle-selection"),t&&(t.textContent="Annotation mode toggled")}catch{t&&(t.textContent="Reload the page, then try again")}});L?.addEventListener("click",async()=>{try{const e=await c("capture-structure-reference");b(e?.reference??await C()),t&&(t.textContent="Structure reference captured")}catch{t&&(t.textContent="Reload the page, then try again")}});d?.addEventListener("click",async()=>{try{await q(),b(null),t&&(t.textContent="Structure reference cleared")}catch{t&&(t.textContent="Could not clear reference")}});E?.addEventListener("click",async()=>{try{const e=await c("copy-feedback");if(!e?.ok||!e.text){t&&(t.textContent="No changes to copy");return}await navigator.clipboard.writeText(e.text),t&&(t.textContent="Request copied")}catch{t&&(t.textContent="No content script on this page")}});m().then(e=>w(e.enabled)).catch(()=>{t&&(t.textContent="Settings unavailable")});C().then(b).catch(()=>{l&&(l.textContent="Reference unavailable")});
//# sourceMappingURL=popup.js.map
