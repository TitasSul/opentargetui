const he="opentargetui:v1";function De(e){const t=new URL(e);return`${he}:page:${t.origin}${t.pathname}`}function qe(e){const t=new URL(e);return`${he}:session:${t.origin}${t.pathname}`}function ge(){return`${he}:settings`}const pt=/(?:^|[-_])(?:[a-f0-9]{6,}|css|sc|module|chakra|mui|mantine|emotion)(?:[-_]|$)/i;function Ue(e){return globalThis.CSS&&typeof globalThis.CSS.escape=="function"?globalThis.CSS.escape(e):e.replace(/[^a-zA-Z0-9_-]/g,t=>`\\${t}`)}function de(e,t){try{return t.querySelectorAll(e).length===1}catch{return!1}}function ft(e){return Array.from(e.classList).filter(t=>t.length>=2&&!pt.test(t)).slice(0,3).map(t=>`.${Ue(t)}`)}function ht(e){const t=e.tagName.toLowerCase();let n=1,o=e.previousElementSibling;for(;o;)o.tagName.toLowerCase()===t&&(n+=1),o=o.previousElementSibling;return`${t}:nth-of-type(${n})`}function gt(e){const t=e.tagName.toLowerCase(),n=(e.textContent??"").replace(/\s+/g," ").trim(),o=e.getAttribute("aria-label")?.trim(),i=e.getAttribute("alt")?.trim();if((t==="button"||t==="a")&&n)return`${t}[${n.slice(0,48)}]`;if(o)return`${t}[aria-label="${o.slice(0,48)}"]`;if(i)return`${t}[alt="${i.slice(0,48)}"]`;if(/^h[1-6]$/.test(t)&&n)return`${t}[${n.slice(0,48)}]`;const s=e.id?`#${e.id}`:"",c=Array.from(e.classList).slice(0,2).join(".");return`${t}${s}${c?`.${c}`:""}`}function mt(e,t=document){const n=e.tagName.toLowerCase();if(e.id){const i=`#${Ue(e.id)}`;if(de(i,t))return i}const o=ft(e).join("");if(o){const i=`${n}${o}`;if(de(i,t))return i}return ht(e)}function Fe(e,t=document){const n=[];let o=e;for(;o&&o.nodeType===Node.ELEMENT_NODE;){const i=mt(o,t);n.unshift(i);const s=n.join(" > ");if(de(s,t))return s;if(o.tagName.toLowerCase()==="body")break;o=o.parentElement}return n.join(" > ")}function He(e){const t=[],n=e.getAttribute("role"),o=e.getAttribute("aria-label"),i=e.getAttribute("aria-expanded"),s=e.getAttribute("aria-pressed"),c=e.hasAttribute("disabled")||e.getAttribute("aria-disabled")==="true";return n&&t.push(`role=${n}`),o&&t.push(`aria-label="${o}"`),i!==null&&t.push(`aria-expanded=${i}`),s!==null&&t.push(`aria-pressed=${s}`),c&&t.push("disabled=true"),t.join("; ")}function Ye(e,t=240){const n=(e.textContent||e.parentElement?.textContent||"").replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}...`:n}function bt(e){const t=getComputedStyle(e);return["display","position","width","height","margin","padding","font-size","font-family","font-weight","line-height","color","background-color","border","border-radius","box-shadow","z-index"].map(o=>`${o}: ${t.getPropertyValue(o)};`).filter(o=>!o.endsWith(": ;")).join(`
`)}function b(e,t){return t==null||t===""?null:`**${e}:** ${String(t)}`}function Xe(e){if(!e.boundingBox)return null;const t=e.boundingBox;return`${Math.round(t.x)}px, ${Math.round(t.y)}px (${Math.round(t.width)}x${Math.round(t.height)}px)`}function Oe(e){return`${Math.round(e.x)}px, ${Math.round(e.y)}px (${Math.round(e.width)}x${Math.round(e.height)}px)`}function Re(e,t){return t?`**${e}:**

\`\`\`
${t.trim()}
\`\`\``:null}function N(e){const t=e.trim();return t?t.includes("`")?`\`\` ${t} \`\``:`\`${t}\``:""}function vt(e){return`"${e.replace(/\s+/g," ").trim()}"`}function xt(e){return[...new Set(e.map(t=>t?.trim()).filter(Boolean))]}function wt(e,t){const n=e.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);return n.length===0?[`${t+1}. Change the selected target`]:[`${t+1}. ${n[0]}`,...n.slice(1).map(o=>`   ${o}`)]}function yt(e,t,n,o){const i=[...wt(e.comment,t),`   - Target: ${N(e.elementPath)}`,e.element?`   - Element: ${N(e.element)}`:null,o&&e.url?`   - URL: ${N(e.url)}`:null,e.selectedText?`   - Selected text: ${vt(e.selectedText)}`:null,e.rearrange?`   - Move from: ${N(Oe(e.rearrange.originalRect))}`:null,e.rearrange?`   - Move to: ${N(Oe(e.rearrange.currentRect))}`:null].filter(Boolean);if(n==="compact"||n==="standard"||(i.push(...[b("Position",Xe(e)),b("Classes",e.cssClasses),b("Accessibility",e.accessibility),b("Nearby Text",e.nearbyText)].filter(Boolean).map(c=>`   - ${c}`)),n==="detailed"))return i.join(`
`);const s=e.thread?.length?e.thread.map(c=>`     - ${c.role}: ${c.content}`).join(`
`):void 0;return i.push(...[b("Fixed/Sticky",e.isFixed),b("Full DOM Path",e.fullPath),e.computedStyles?`**Computed Styles:**

\`\`\`
${e.computedStyles.trim()}
\`\`\``:null,s?`**Thread:**
${s}`:null].filter(Boolean).map(c=>`   - ${c}`)),i.join(`
`)}function kt(e,t){const n=t.detail??"standard",o=t.includeHeader??!0,i=[...e].sort(($,O)=>$.timestamp-O.timestamp);if(i.length===0)return"No annotations captured.";const s=xt(i.map($=>$.url)),c=s.length===1?s[0]:void 0,E=s.length>1;return`${o?`${["Implement these UI changes in one pass. Verify each target against the current DOM before editing.",c?`Page: ${N(c)}`:null].filter(Boolean).join(`
`)}

`:""}${i.map(($,O)=>yt($,O,n,E)).join(`

`)}`}function $t(e,t,n){if(n==="compact")return[`- **#${t+1} ${e.elementPath}**`,e.selectedText?`  - Selected text: "${e.selectedText}"`:null,`  - Feedback: ${e.comment}`].filter(Boolean).join(`
`);const o=[`## Annotation #${t+1}`,b("Element",e.element),b("Path",e.elementPath),b("URL",e.url),b("Selected Text",e.selectedText?`"${e.selectedText}"`:void 0),b("Feedback",e.comment)].filter(Boolean);if(n==="standard")return o.join(`

`);const i=[...o,b("Position",Xe(e)),b("Classes",e.cssClasses),b("Accessibility",e.accessibility),b("Nearby Text",e.nearbyText)].filter(Boolean);if(n==="detailed")return i.join(`

`);const s=e.thread?.length?e.thread.map(c=>`- ${c.role}: ${c.content}`).join(`
`):void 0;return[...i,b("Fixed/Sticky",e.isFixed),b("Full DOM Path",e.fullPath),Re("Computed Styles",e.computedStyles),Re("Thread",s)].filter(Boolean).join(`

`)}function Ct(e,t={}){if(t.mode==="change-request")return kt(e,t);const n=t.detail??"standard",o=[...e].sort((i,s)=>i.timestamp-s.timestamp);return o.length===0?"No annotations captured.":o.map((i,s)=>$t(i,s,n)).join(`

`)}const St=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-check"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M20 6 9 17l-5-5" />
</svg>
`,Et=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-clipboard-list"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  <path d="M12 11h4" />
  <path d="M12 16h4" />
  <path d="M8 11h.01" />
  <path d="M8 16h.01" />
</svg>
`,Lt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-copy"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
</svg>
`,Mt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-eye"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
  <circle cx="12" cy="12" r="3" />
</svg>
`,Pt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-eye-off"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
  <path d="m2 2 20 20" />
</svg>
`,Tt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-maximize-2"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M15 3h6v6" />
  <path d="m21 3-7 7" />
  <path d="m3 21 7-7" />
  <path d="M9 21H3v-6" />
</svg>
`,It=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-message-square"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
</svg>
`,At=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-mouse-pointer-2"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
</svg>
`,Bt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-panel-right-close"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect width="18" height="18" x="3" y="3" rx="2" />
  <path d="M15 3v18" />
  <path d="m8 9 3 3-3 3" />
</svg>
`,Ot=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-pause"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect x="14" y="3" width="5" height="18" rx="1" />
  <rect x="5" y="3" width="5" height="18" rx="1" />
</svg>
`,Rt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-play"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
</svg>
`,jt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-server"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
  <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
  <line x1="6" x2="6.01" y1="6" y2="6" />
  <line x1="6" x2="6.01" y1="18" y2="18" />
</svg>
`,zt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-settings"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
  <circle cx="12" cy="12" r="3" />
</svg>
`,Nt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-target"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <circle cx="12" cy="12" r="10" />
  <circle cx="12" cy="12" r="6" />
  <circle cx="12" cy="12" r="2" />
</svg>
`,Dt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-trash"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  <path d="M3 6h18" />
  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
</svg>
`,qt=`<!-- @license lucide-static v1.18.0 - ISC -->
<svg
  class="lucide lucide-x"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M18 6 6 18" />
  <path d="m6 6 12 12" />
</svg>
`,_e="opentargetui-root",je="opentargetui-pause-style",z={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,hideMarkers:!1,blockPageInteractions:!0},Ut={check:St,clipboardList:Et,copy:Lt,eye:Mt,eyeOff:Pt,maximize:Tt,message:It,mousePointer:At,panelClose:Bt,pause:Ot,play:Rt,server:jt,settings:zt,target:Nt,trash:Dt,x:qt};function l(e){return Ut[e].replace(/<!--[\s\S]*?-->\s*/g,"").replace("<svg",'<svg aria-hidden="true" focusable="false"').replace('class="lucide','class="otu-icon lucide')}function Z(e){return typeof chrome<"u"&&chrome.runtime?.getURL?chrome.runtime.getURL(e.replace(/^\//,"")):e}function Ft(){return`
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src: url("${Z("fonts/geist-latin-400-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 500;
      src: url("${Z("fonts/geist-latin-500-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 600;
      src: url("${Z("fonts/geist-latin-600-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 700;
      src: url("${Z("fonts/geist-latin-700-normal.woff2")}") format("woff2");
    }
  `}let r={...z},f=[],x=!1,w=!1,F=!0,R=!1,H=null,T=null,A=null,_=null,C=null,k=null,S=null,me=0,U=null,ee=!1,ue=!1,pe=[],W=!1,re=!1,te=!1,j="local",Ge=null,le=0,Q=null;const ze=document.getElementById(_e);ze&&ze.remove();const h=document.createElement("div");h.id=_e;h.setAttribute("data-opentargetui","root");h.setAttribute("popover","manual");h.style.all="initial";h.style.position="fixed";h.style.inset="0";h.style.zIndex="2147483647";h.style.pointerEvents="none";h.style.margin="0";h.style.border="0";h.style.padding="0";h.style.background="transparent";const P=h.attachShadow({mode:"open"});document.documentElement.appendChild(h);const ne=document.createElement("style");ne.textContent=`
  ${Ft()}

  :host {
    --otu-bg: #10100e;
    --otu-panel: rgba(18, 18, 16, 0.97);
    --otu-soft: #1c1b18;
    --otu-button: #171713;
    --otu-button-hover: #22221e;
    --otu-field: #0d0d0b;
    --otu-ink: #f4f2ea;
    --otu-muted: #aaa598;
    --otu-line: rgba(244, 242, 234, 0.14);
    --otu-accent: ${z.markerColor};
    --otu-accent-ink: #061916;
    --otu-danger: #ff6b5f;
    --otu-shadow: 0 18px 56px rgba(0, 0, 0, 0.44);
    all: initial;
    color-scheme: dark;
    font-family: "Geist", "Satoshi", "Aptos", ui-sans-serif, sans-serif;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    font-family: "Geist", "Satoshi", "Aptos", ui-sans-serif, sans-serif;
  }

  .otu-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    stroke-width: 2.2;
  }

  .hover-frame {
    position: fixed;
    z-index: 10;
    display: none;
    pointer-events: none;
    border: 1.5px solid var(--otu-accent);
    border-radius: 4px;
    background: color-mix(in srgb, var(--otu-accent) 10%, transparent);
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.08);
  }

  .marker-layer {
    position: fixed;
    inset: 0;
    z-index: 20;
    pointer-events: none;
  }

  .marker {
    position: fixed;
    width: 26px;
    height: 26px;
    transform: translate(-50%, -50%);
    border: 2px solid var(--otu-bg);
    border-radius: 999px;
    background: var(--otu-accent);
    color: var(--otu-accent-ink);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.38);
    font: 700 11px/1 "Geist", "Aptos", ui-sans-serif, sans-serif;
    display: grid;
    place-items: center;
    pointer-events: auto;
    cursor: pointer;
  }

  .marker[data-status="resolved"] {
    opacity: 0.46;
    filter: saturate(0.4);
  }

  .toolbar {
    position: fixed;
    z-index: 50;
    right: 18px;
    bottom: 18px;
    width: min(360px, calc(100vw - 28px));
    pointer-events: auto;
    display: grid;
    gap: 10px;
    padding: 12px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-panel);
    color: var(--otu-ink);
    box-shadow: var(--otu-shadow);
    backdrop-filter: blur(16px);
  }

  .toolbar.dragging {
    cursor: grabbing;
  }

  .toolbar.collapsed {
    width: auto;
    min-width: 0;
    padding: 8px;
  }

  .toolbar-header,
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
  }

  .toolbar-header {
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .toolbar.dragging .toolbar-header,
  .toolbar.dragging .collapsed-button {
    cursor: grabbing;
  }

  .toolbar-header .icon-button {
    cursor: pointer;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
  }

  .brand-mark {
    width: 30px;
    height: 30px;
    border: 1px solid color-mix(in srgb, var(--otu-accent) 42%, var(--otu-line));
    border-radius: 8px;
    background: color-mix(in srgb, var(--otu-accent) 12%, var(--otu-bg));
    color: var(--otu-accent);
    display: grid;
    place-items: center;
  }

  .brand-name {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .brand-title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0;
    color: var(--otu-ink);
    white-space: nowrap;
  }

  .brand-meta {
    color: var(--otu-muted);
    font-size: 11px;
    white-space: nowrap;
  }

  button,
  select,
  textarea,
  input {
    font: inherit;
  }

  button {
    -webkit-font-smoothing: antialiased;
  }

  .primary-actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .utility-actions {
    display: grid;
    grid-template-columns: repeat(4, 36px);
    gap: 6px;
  }

  .action-button,
  .icon-button {
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-button);
    color: var(--otu-ink);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    position: relative;
  }

  .action-button {
    min-width: 0;
    min-height: 38px;
    padding: 0 12px;
  }

  .action-button span {
    min-width: 0;
    white-space: nowrap;
  }

  .icon-button {
    width: 36px;
    height: 34px;
    padding: 0;
  }

  .action-button:hover,
  .icon-button:hover,
  .collapsed-button:hover,
  .action-button.active,
  .icon-button.active {
    border-color: color-mix(in srgb, var(--otu-accent) 58%, var(--otu-line));
    background: color-mix(in srgb, var(--otu-accent) 12%, var(--otu-button-hover));
    color: var(--otu-accent);
  }

  .action-button.primary {
    border-color: color-mix(in srgb, var(--otu-accent) 66%, var(--otu-line));
    background: var(--otu-accent);
    color: var(--otu-accent-ink);
  }

  .action-button.primary:hover,
  .action-button.primary.active {
    background: color-mix(in srgb, var(--otu-accent) 82%, var(--otu-ink));
    color: var(--otu-accent-ink);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.46;
  }

  button:disabled:hover {
    border-color: var(--otu-line);
    background: var(--otu-button);
    color: var(--otu-ink);
  }

  .icon-button.danger:hover {
    border-color: var(--otu-danger);
    background: color-mix(in srgb, var(--otu-danger) 14%, var(--otu-button));
    color: var(--otu-danger);
  }

  .collapsed-button {
    height: 38px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-panel);
    color: var(--otu-ink);
    box-shadow: var(--otu-shadow);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    font-size: 12px;
    font-weight: 700;
    position: relative;
    touch-action: none;
    user-select: none;
  }

  .icon-button[data-tooltip]::after,
  .collapsed-button[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    right: 0;
    bottom: calc(100% + 8px);
    max-width: 180px;
    white-space: nowrap;
    padding: 6px 8px;
    border: 1px solid var(--otu-line);
    border-radius: 7px;
    background: var(--otu-field);
    color: var(--otu-ink);
    font-size: 11px;
    font-weight: 650;
    opacity: 0;
    pointer-events: none;
    transform: translateY(4px);
    transition: opacity 120ms ease, transform 120ms ease;
  }

  .icon-button[data-tooltip]:hover::after,
  .collapsed-button[data-tooltip]:hover::after {
    opacity: 1;
    transform: translateY(0);
  }

  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--otu-muted);
    font-size: 11px;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .status-pill.warn {
    color: var(--otu-danger);
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--otu-muted);
  }

  .dot.on {
    background: var(--otu-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--otu-accent) 18%, transparent);
  }

  .panel {
    position: fixed;
    z-index: 40;
    pointer-events: auto;
    width: min(360px, calc(100vw - 28px));
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-panel);
    color: var(--otu-ink);
    box-shadow: var(--otu-shadow);
    backdrop-filter: blur(18px);
  }

  .composer {
    display: none;
    padding: 12px;
    gap: 10px;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .composer.open {
    display: grid;
  }

  .composer.dragging {
    cursor: grabbing;
  }

  .composer textarea,
  .composer button,
  .composer input,
  .composer select {
    cursor: auto;
    touch-action: auto;
    user-select: auto;
  }

  .composer textarea {
    cursor: text;
  }

  .target-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--otu-muted);
    font-size: 11px;
  }

  .target-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .panel-title {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    font-size: 13px;
    font-weight: 700;
    color: var(--otu-ink);
  }

  .target-card {
    display: grid;
    gap: 3px;
    padding: 9px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-soft);
  }

  .target-card strong {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--otu-ink);
    font-size: 12px;
  }

  .target-card span {
    color: var(--otu-muted);
    font-size: 11px;
  }

  textarea {
    width: 100%;
    min-height: 94px;
    resize: vertical;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    padding: 10px;
    background: var(--otu-field);
    color: var(--otu-ink);
    outline: none;
    line-height: 1.42;
    font-size: 13px;
  }

  textarea::placeholder,
  input::placeholder {
    color: color-mix(in srgb, var(--otu-muted) 78%, transparent);
  }

  .composer[data-mode="create"] textarea {
    min-height: 132px;
  }

  .composer[data-mode="create"] .button-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .composer[data-mode="create"] .command {
    min-height: 38px;
  }

  textarea:focus,
  select:focus,
  input:focus {
    border-color: var(--otu-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--otu-accent) 14%, transparent);
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  select,
  input {
    min-height: 36px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    padding: 0 8px;
    background: var(--otu-field);
    color: var(--otu-ink);
    outline: none;
    font-size: 12px;
  }

  .form-field {
    display: grid;
    gap: 5px;
    color: var(--otu-muted);
    font-size: 11px;
  }

  .button-row {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .command {
    min-height: 34px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    padding: 0 12px;
    background: var(--otu-button);
    color: var(--otu-ink);
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
  }

  .command.primary {
    border-color: color-mix(in srgb, var(--otu-accent) 74%, var(--otu-ink));
    background: var(--otu-accent);
    color: var(--otu-accent-ink);
  }

  .command.danger {
    color: var(--otu-danger);
  }

  .settings {
    display: none;
    right: 18px;
    bottom: 108px;
    padding: 12px;
    gap: 10px;
  }

  .settings.open {
    display: grid;
  }

  .batch {
    display: none;
    right: 18px;
    bottom: 108px;
    width: min(420px, calc(100vw - 28px));
    padding: 12px;
    gap: 10px;
  }

  .batch.open {
    display: grid;
  }

  .batch-summary {
    color: var(--otu-muted);
    font-size: 11px;
    line-height: 1.45;
  }

  .batch-list {
    display: grid;
    gap: 8px;
    max-height: min(390px, calc(100vh - 248px));
    overflow: auto;
    padding-right: 2px;
  }

  .batch-item {
    display: grid;
    gap: 8px;
    min-height: 92px;
    padding: 10px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-button);
  }

  .batch-item-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
  }

  .batch-index {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: var(--otu-accent);
    color: var(--otu-accent-ink);
    display: grid;
    place-items: center;
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
  }

  .batch-comment {
    min-width: 0;
    color: var(--otu-ink);
    font-size: 12px;
    font-weight: 650;
    line-height: 1.35;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .batch-target {
    min-width: 0;
    color: var(--otu-muted);
    font-size: 11px;
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .batch-item-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .batch-item-actions .icon-button {
    width: 32px;
    height: 30px;
  }

  .batch-empty {
    display: grid;
    gap: 6px;
    min-height: 128px;
    place-items: center;
    text-align: center;
    padding: 18px;
    border: 1px dashed var(--otu-line);
    border-radius: 8px;
    background: var(--otu-soft);
    color: var(--otu-muted);
    font-size: 12px;
    line-height: 1.45;
  }

  .batch-empty strong {
    color: var(--otu-ink);
    font-size: 13px;
  }

  .settings h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .setting-grid {
    display: grid;
    gap: 8px;
  }

  label.setting {
    display: grid;
    gap: 5px;
    color: var(--otu-muted);
    font-size: 11px;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--otu-ink);
    padding: 9px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-button);
  }

  .toggle-copy {
    display: grid;
    gap: 2px;
  }

  .toggle-copy strong {
    font-size: 12px;
    font-weight: 700;
    color: var(--otu-ink);
  }

  .toggle-copy small {
    font-size: 11px;
    color: var(--otu-muted);
  }

  .toggle-row input {
    width: 18px;
    height: 18px;
    accent-color: var(--otu-accent);
  }

  .sync-health {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 9px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-soft);
    color: var(--otu-muted);
    font-size: 11px;
  }

  .sync-health strong {
    color: var(--otu-ink);
    font-size: 12px;
  }

  .toast {
    position: fixed;
    z-index: 60;
    left: 50%;
    bottom: 22px;
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
    pointer-events: none;
    padding: 9px 12px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-field);
    color: var(--otu-ink);
    font-size: 11px;
    transition: opacity 160ms ease, transform 160ms ease;
  }

  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .kbd {
    border: 1px solid var(--otu-line);
    border-radius: 5px;
    padding: 1px 5px;
    color: var(--otu-muted);
    font-size: 10px;
  }

  @media (max-width: 520px) {
    .toolbar {
      right: 10px;
      left: 10px;
      bottom: 10px;
      min-width: 0;
    }

    .utility-actions {
      grid-template-columns: repeat(4, minmax(32px, 1fr));
    }

    .batch,
    .settings {
      right: 10px;
      left: 10px;
      bottom: 104px;
      width: auto;
    }
  }
`;P.appendChild(ne);const I=document.createElement("div");I.className="hover-frame";P.appendChild(I);const D=document.createElement("div");D.className="marker-layer";P.appendChild(D);const u=document.createElement("div");u.className="toolbar";P.appendChild(u);const a=document.createElement("div");a.className="panel composer";P.appendChild(a);const p=document.createElement("div");p.className="panel batch";P.appendChild(p);const v=document.createElement("div");v.className="panel settings";P.appendChild(v);const G=document.createElement("div");G.className="toast";P.appendChild(G);function Ve(){if(W)return!1;try{return typeof chrome<"u"&&!!chrome.runtime?.id&&!!chrome.storage?.local}catch(e){return ae(e)&&(W=!0),!1}}async function ce(e,t){if(!Ve())return t;try{return(await chrome.storage.local.get(e))[e]??t}catch(n){return ae(n)?W=!0:console.warn("[OpenTarget UI] Storage read failed",n),t}}async function be(e,t){if(Ve())try{await chrome.storage.local.set({[e]:t})}catch(n){ae(n)?W=!0:console.warn("[OpenTarget UI] Storage write failed",n)}}async function ve(){const{copyOnAdd:e,...t}=r;await be(ge(),{...t,enabled:!1})}function xe(e){return e.trim().replace(/\/+$/,"")||z.serverUrl}function m(e){G.textContent=e,G.classList.add("show"),window.setTimeout(()=>G.classList.remove("show"),1600)}function ae(e){return e instanceof Error&&/extension context invalidated/i.test(e.message)}function Ht(e){return e instanceof TypeError&&/failed to fetch/i.test(e.message)}function we(){re=!1,te=!1,Ee(r.syncEnabled?"connected":"local")}function ye(e,t){se(),re=!0,Ee(r.syncEnabled?"offline":"local"),te||(te=!0,m(t),e&&!Ht(e)&&console.warn("[OpenTarget UI] Server sync failed",e))}function K(e){re||e().catch(t=>ye(t,"Saved locally; server unavailable"))}function Y(e){return e.composedPath().includes(h)||e.composedPath().includes(P)}function We(e){if(!r.enabled||Y(e))return null;const t=P.elementFromPoint(e.clientX,e.clientY);return t instanceof Element?t.closest("button, input, textarea, select, .toolbar, .panel, .marker"):null}function Ke(e){e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation()}function Je(e){e instanceof HTMLElement&&e.focus()}function ke(e){const t=We(e);if(t){if(Ke(e),e.type==="pointerdown"){Q=t.closest("button"),Je(t);return}if(e.type==="pointerup"){const n=t.closest("button");n&&n===Q&&n.click(),Q=null;return}e.type==="pointercancel"&&(Q=null)}}function $e(e){const t=We(e);t&&(Ke(e),e.type==="mousedown"&&Je(t))}function Ce(){ne.textContent=ne.textContent?.replace(/--otu-accent: #[0-9a-fA-F]{6};/,`--otu-accent: ${r.markerColor};`)??""}function Se(){try{return h.matches(":popover-open")}catch{return!1}}function Yt(){const e=h;if(!(typeof e.showPopover!="function"||Se()))try{e.showPopover()}catch{}}function Xt(){const e=h;if(typeof e.showPopover=="function")try{Se()&&e.hidePopover?.(),e.showPopover()}catch{}}function Ze(){!r.enabled||le||(le=window.requestAnimationFrame(()=>{le=0,Xt()}))}function _t(){const e=h;if(!(typeof e.hidePopover!="function"||!Se()))try{e.hidePopover()}catch{}}function Gt(e){if(e){h.style.display="block",Yt();return}_t(),h.style.display="none"}function Qe(){return r.syncEnabled?j==="connecting"?"Connecting":j==="connected"?"Server connected":j==="offline"?"Server unavailable":"Sync enabled":"Local only"}function Vt(){return j==="offline"?" warn":""}function Wt(){d(),v.classList.contains("open")&&L(!0)}function Ee(e){j!==e&&(j=e,Wt())}const Kt=new MutationObserver(e=>{if(!r.enabled)return;e.some(n=>{const o=n.target;return o instanceof Element&&(o===h||o.closest("[data-opentargetui]"))?!1:n.type==="childList"||n.attributeName==="open"})&&Ze()});Kt.observe(document.documentElement,{attributes:!0,attributeFilter:["open"],childList:!0,subtree:!0});document.addEventListener("toggle",e=>{if(!r.enabled)return;const t=e.target;t instanceof Element&&t.closest("[data-opentargetui]")||Ze()},!0);function Le(){return f.filter(e=>e.status!=="dismissed"&&e.status!=="resolved")}function Jt(){const e=Le().length;return`${e} ${e===1?"note":"notes"}`}function V(){return me>Date.now()}function Me(){me=0,U!==null&&(window.clearTimeout(U),U=null)}function Zt(){me=Date.now()+3200,U!==null&&window.clearTimeout(U),U=window.setTimeout(()=>{Me(),d(),p.classList.contains("open")&&g(!0)},3200)}function Qt(e,t="Untitled change"){return e.replace(/\s+/g," ").trim()||t}function J(e,t,n,o,i=10){const s=Math.max(i,window.innerWidth-n-i),c=Math.max(i,window.innerHeight-o-i);return{left:Math.min(Math.max(e,i),s),top:Math.min(Math.max(t,i),c)}}function en(){const e=u.getBoundingClientRect(),t=e.width||Math.min(360,window.innerWidth-28),n=e.height||180;return J(window.innerWidth-t-18,window.innerHeight-n-18,t,n)}function Pe(e,t){e.style.left=`${t.left}px`,e.style.top=`${t.top}px`,e.style.right="auto",e.style.bottom="auto"}function et(){const e=u.getBoundingClientRect(),t=e.width||Math.min(360,window.innerWidth-28),n=e.height||180,o=r.uiPosition?J(r.uiPosition.left,r.uiPosition.top,t,n):en();Pe(u,o),tt()}function oe(e){if(!e.classList.contains("open"))return;const t=u.getBoundingClientRect(),n=e.getBoundingClientRect(),o=10,i=n.width||360,s=n.height||240,c=t.right-i;let E=t.top-s-o;E<10&&(E=t.bottom+o),Pe(e,J(c,E,i,s))}function tt(){oe(p),oe(v)}function fe(e){return e.charAt(0).toUpperCase()+e.slice(1)}function tn(e){return{fix:"Fix issue",change:"Change design",question:"Ask question",approve:"Approve"}[e]}function d(){if(!r.enabled){u.innerHTML="";return}u.className=`toolbar${F?" collapsed":""}`,F?u.innerHTML=`
      <button class="collapsed-button" data-action="expand" aria-label="Open OpenTarget UI" data-tooltip="Open OpenTarget UI">
        ${l("target")}
        <span>OpenTarget</span>
      </button>
    `:u.innerHTML=`
      <div class="toolbar-header">
        <div class="brand">
          <div class="brand-mark">${l("target")}</div>
          <div class="brand-name">
            <div class="brand-title">OpenTarget UI</div>
            <div class="brand-meta">${Jt()} on this page</div>
          </div>
        </div>
        <button class="icon-button" data-action="collapse" aria-label="Collapse toolbar" data-tooltip="Collapse toolbar">
          ${l("panelClose")}
        </button>
      </div>
      <div class="primary-actions">
        <button class="action-button primary ${x?"active":""}" data-action="select" aria-label="Annotate page">
          ${l("mousePointer")}
          <span>${x?"Annotating":"Annotate"}</span>
        </button>
        <button class="action-button ${w?"active":""}" data-action="move" aria-label="Move an element">
          ${l("maximize")}
          <span>${w?S?"Place":"Select":"Move"}</span>
        </button>
        <button class="action-button ${p.classList.contains("open")?"active":""}" data-action="batch" aria-label="Review annotation batch">
          ${l("clipboardList")}
          <span>Review</span>
        </button>
      </div>
      <div class="utility-actions" aria-label="OpenTarget UI utilities">
        <button class="icon-button ${r.hideMarkers?"active":""}" data-action="hide" aria-label="${r.hideMarkers?"Show markers":"Hide markers"}" data-tooltip="${r.hideMarkers?"Show markers":"Hide markers"}">
          ${r.hideMarkers?l("eye"):l("eyeOff")}
        </button>
        <button class="icon-button ${R?"active":""}" data-action="pause" aria-label="${R?"Resume page motion":"Pause page motion"}" data-tooltip="${R?"Resume motion":"Pause motion"}">
          ${l(R?"play":"pause")}
        </button>
        <button class="icon-button" data-action="settings" aria-label="Open settings" data-tooltip="Settings">
          ${l("settings")}
        </button>
        <button class="icon-button danger ${V()?"active":""}" data-action="clear" aria-label="${V()?"Confirm clear annotations":"Clear annotations"}" data-tooltip="${V()?"Click again to clear":"Clear annotations"}">
          ${l("trash")}
        </button>
      </div>
      <div class="status-row">
        <span class="status-pill"><span class="dot ${x||w?"on":""}"></span>${x?"Click a target":w?S?"Click destination":"Click item to move":"Ready"}</span>
        <span class="status-pill${Vt()}">${l("server")} ${Qe()}</span>
      </div>
    `,u.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",t=>{if(ee){ee=!1,t.preventDefault(),t.stopPropagation();return}nt(e.dataset.action??"")})}),et()}function y(){if(D.innerHTML="",!r.enabled){D.style.display="none";return}D.style.display=r.hideMarkers?"none":"block",f.forEach((e,t)=>{if(e.status==="dismissed")return;const n=document.createElement("button");n.className="marker",n.type="button",n.dataset.id=e.id,n.dataset.status=e.status??"pending",n.textContent=String(t+1),n.title=e.comment,n.style.left=`${e.x}%`,n.style.top=`${e.isFixed?e.y:e.y-window.scrollY}px`,n.style.setProperty("--otu-accent",r.markerColor),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),rt(e.id)}),D.appendChild(n)})}function g(e=!1){if(p.className=`panel batch${e?" open":""}`,!e){p.innerHTML="";return}const t=Le(),n=V();p.innerHTML=`
    <div class="panel-header">
      <h2 class="panel-title">${l("clipboardList")} Review batch</h2>
      <button class="icon-button" data-batch-close aria-label="Close batch manager" data-tooltip="Close">
        ${l("x")}
      </button>
    </div>
    <div class="batch-summary">
      ${t.length>0?`${t.length} ${t.length===1?"change":"changes"} ready for the copied request.`:"No changes in this page batch yet."}
    </div>
    ${t.length>0?`<div class="batch-list">
            ${t.map((o,i)=>`
                  <article class="batch-item">
                    <div class="batch-item-header">
                      <span class="batch-index">${i+1}</span>
                      <div class="batch-comment">${q(Qt(o.comment))}</div>
                      <div class="batch-item-actions">
                        <button class="icon-button" data-batch-edit="${q(o.id)}" aria-label="Edit change ${i+1}" data-tooltip="Edit">
                          ${l("message")}
                        </button>
                        <button class="icon-button danger" data-batch-delete="${q(o.id)}" aria-label="Delete change ${i+1}" data-tooltip="Delete">
                          ${l("trash")}
                        </button>
                      </div>
                    </div>
                    <div class="batch-target">${q(o.kind==="rearrange"?`Move: ${o.elementPath}`:o.elementPath)}</div>
                  </article>
                `).join("")}
          </div>`:`<div class="batch-empty">
            <strong>Nothing to send</strong>
            <span>Click Annotate or Move, then add a change to build the request.</span>
          </div>`}
    <div class="button-row">
      <button class="command danger" data-batch-clear ${t.length===0?"disabled":""}>${l("trash")} ${n?"Confirm clear":"Clear all"}</button>
    </div>
  `,p.querySelector("[data-batch-close]")?.addEventListener("click",()=>{g(!1),d()}),p.querySelector("[data-batch-clear]")?.addEventListener("click",()=>{nt("clear")}),p.querySelectorAll("[data-batch-edit]").forEach(o=>{o.addEventListener("click",()=>{g(!1),d(),rt(o.dataset.batchEdit??"")})}),p.querySelectorAll("[data-batch-delete]").forEach(o=>{o.addEventListener("click",()=>{ot(o.dataset.batchDelete??"")})}),oe(p)}function L(e=!1){v.className=`panel settings${e?" open":""}`,v.innerHTML=`
    <div class="panel-header">
      <h2 class="panel-title">${l("settings")} Settings</h2>
      <button class="icon-button" data-settings-close aria-label="Close settings" data-tooltip="Close settings">
        ${l("x")}
      </button>
    </div>
    <div class="setting-grid">
      <label class="setting">
        Output detail
        <select id="otu-output-detail">
          ${["compact","standard","detailed","forensic"].map(t=>`<option value="${t}" ${r.outputDetail===t?"selected":""}>${fe(t)}</option>`).join("")}
        </select>
      </label>
      <label class="setting">
        Marker colour
        <input id="otu-marker-color" type="color" value="${r.markerColor}" />
      </label>
      <label class="setting">
        Server URL
        <input id="otu-server-url" type="url" value="${r.serverUrl}" />
      </label>
      <label class="toggle-row">
        <span class="toggle-copy">
          <strong>Sync to local server</strong>
          <small>Send notes to the MCP bridge.</small>
        </span>
        <input id="otu-sync" type="checkbox" ${r.syncEnabled?"checked":""} />
      </label>
      <div class="sync-health">
        <span>${l("server")} <strong>${Qe()}</strong></span>
        ${r.syncEnabled&&j==="offline"?'<button class="command" data-sync-retry>Retry</button>':""}
      </div>
      <label class="toggle-row">
        <span class="toggle-copy">
          <strong>Block page clicks while annotating</strong>
          <small>Prevents accidental page actions.</small>
        </span>
        <input id="otu-block" type="checkbox" ${r.blockPageInteractions?"checked":""} />
      </label>
    </div>
    <div class="button-row">
      <button class="command" data-settings-close>${l("x")} Close</button>
      <button class="command primary" data-settings-save>${l("check")} Save settings</button>
    </div>
  `,v.querySelector("[data-settings-close]")?.addEventListener("click",()=>{L(!1)}),v.querySelector("[data-sync-retry]")?.addEventListener("click",()=>{ie()}),v.querySelector("[data-settings-save]")?.addEventListener("click",async()=>{const t=v.querySelector("#otu-output-detail")?.value,n=v.querySelector("#otu-marker-color")?.value||r.markerColor,o=xe(v.querySelector("#otu-server-url")?.value||r.serverUrl),i=!!v.querySelector("#otu-sync")?.checked,s=!!v.querySelector("#otu-block")?.checked;r={...r,outputDetail:t,markerColor:n,serverUrl:o,syncEnabled:i,blockPageInteractions:s},await ve(),Ce(),d(),y(),L(!1),r.syncEnabled?ie():(se(),we()),m("Settings saved")}),oe(v)}async function nt(e){if(r.enabled){if(e==="expand"){F=!1,d();return}if(e==="collapse"){F=!0,x=!1,w=!1,S=null,M(),g(!1),L(!1),d();return}if(e==="select"){x=!x,w=!1,S=null,g(!1),L(!1),d(),m(x?"Click or select text to annotate":"Targeting off");return}if(e==="move"){w=!w,S=null,x=!1,M(),g(!1),L(!1),d(),m(w?"Click the item to move":"Move mode off");return}if(e==="batch"){const t=!p.classList.contains("open");L(!1),g(t),d();return}if(e==="hide"){r={...r,hideMarkers:!r.hideMarkers},await ve(),d(),y();return}if(e==="pause"){R?yn():wn(),d();return}if(e==="clear"){if(Le().length===0){Me(),d(),p.classList.contains("open")&&g(!0),m("No annotations to clear");return}if(!V()){Zt(),d(),p.classList.contains("open")&&g(!0),m("Click clear again to delete notes");return}await nn();return}e==="settings"&&(g(!1),L(!v.classList.contains("open")))}}async function nn(){const e=f;f=[],Me(),await B(),d(),y(),p.classList.contains("open")&&g(!0),m("Annotations cleared"),r.syncEnabled&&e.forEach(t=>K(()=>dt(t.id)))}async function ot(e){!e||!f.find(n=>n.id===e)||(f=f.filter(n=>n.id!==e),await B(),d(),y(),p.classList.contains("open")&&g(!0),T===e&&M(),m("Annotation deleted"),r.syncEnabled&&K(()=>dt(e)))}function on(e){let t=e;for(;t&&t!==document.documentElement;){const n=getComputedStyle(t).position;if(n==="fixed"||n==="sticky")return!0;t=t.parentElement}return!1}function rn(e,t,n,o){const i=e.rect,s=on(e.element),c=i.left+i.width/2,E=i.top+i.height/2,X=Fe(e.element),$=Date.now(),O={id:`otu_${$.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:t,elementPath:X,timestamp:$,x:Math.max(0,Math.min(100,c/Math.max(window.innerWidth,1)*100)),y:s?E:E+window.scrollY,element:e.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:{x:i.left+window.scrollX,y:i.top+window.scrollY,width:i.width,height:i.height},cssClasses:Array.from(e.element.classList).join(" "),computedStyles:bt(e.element),accessibility:He(e.element),nearbyText:Ye(e.element),isFixed:s,fullPath:X,intent:n,severity:o,kind:"feedback",status:"pending",thread:[]};return e.selectedText&&(O.selectedText=e.selectedText),A&&(O.sessionId=A),O}function an(e){return{x:e.left+window.scrollX,y:e.top+window.scrollY,width:e.width,height:e.height}}function sn(e,t,n){const o=Date.now(),i=Math.max(e.rect.width,1),s=Math.max(e.rect.height,1),c={x:t+window.scrollX-i/2,y:n+window.scrollY-s/2,width:i,height:s},E=c.x-window.scrollX+i/2,X=c.y-window.scrollY+s/2,$={id:`otu_${o.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:`Move ${e.label} to the pointed position`,elementPath:e.path,timestamp:o,x:Math.max(0,Math.min(100,E/Math.max(window.innerWidth,1)*100)),y:X+window.scrollY,element:e.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:c,cssClasses:Array.from(e.element.classList).join(" "),accessibility:He(e.element),nearbyText:Ye(e.element),isFixed:!1,fullPath:e.path,intent:"change",severity:"important",kind:"rearrange",rearrange:{selector:e.path,label:e.label,tagName:e.element.tagName.toLowerCase(),originalRect:an(e.rect),currentRect:c},status:"pending",thread:[]};return A&&($.sessionId=A),$}function it(e){H=e,T=null,a.className="panel composer open",a.dataset.mode="create",a.style.left=`${Math.min(e.clientX+12,window.innerWidth-376)}px`,a.style.top=`${Math.min(e.clientY+12,window.innerHeight-260)}px`,a.innerHTML=`
    <textarea id="otu-comment" placeholder="Type the change for this target"></textarea>
    <div class="button-row">
      <button class="command" data-merge>${l("message")} Merge</button>
      <button class="command primary" data-copy>${l("copy")} Copy</button>
    </div>
  `,a.querySelector("#otu-comment")?.focus(),a.querySelector("[data-merge]")?.addEventListener("click",()=>{Ne()}),a.querySelector("[data-copy]")?.addEventListener("click",()=>{Ne({copyOnly:!0})})}function rt(e){const t=f.find(n=>n.id===e);t&&(H=null,T=e,a.className="panel composer open",a.dataset.mode="edit",a.style.left="18px",a.style.top="18px",a.innerHTML=`
    <div class="panel-header">
      <div class="panel-title">${l("message")} Edit annotation</div>
      <button class="icon-button" data-cancel aria-label="Close annotation editor" data-tooltip="Close">
        ${l("x")}
      </button>
    </div>
    <div class="target-card">
      <strong>${q(t.elementPath)}</strong>
      <span>${fe(t.status??"pending")} note</span>
    </div>
    <textarea id="otu-comment">${q(t.comment)}</textarea>
    <div class="field-row">
      <label class="form-field">
        Intent
        <select id="otu-intent">
          ${["fix","change","question","approve"].map(n=>`<option value="${n}" ${t.intent===n?"selected":""}>${tn(n)}</option>`).join("")}
        </select>
      </label>
      <label class="form-field">
        Priority
        <select id="otu-severity">
          ${["important","blocking","suggestion"].map(n=>`<option value="${n}" ${t.severity===n?"selected":""}>${fe(n)}</option>`).join("")}
        </select>
      </label>
    </div>
    <div class="button-row">
      <button class="command danger" data-delete>${l("trash")} Delete</button>
      <button class="command" data-cancel>${l("x")} Close</button>
      <button class="command primary" data-save>${l("check")} Save note</button>
    </div>
  `,a.querySelector("[data-cancel]")?.addEventListener("click",M),a.querySelector("[data-delete]")?.addEventListener("click",un),a.querySelector("[data-save]")?.addEventListener("click",dn))}function M(){H=null,T=null,C=null,a.className="panel composer",delete a.dataset.mode,a.innerHTML=""}function Te(){return a.classList.contains("open")}function ln(e){e.key==="Escape"&&Te()&&(e.preventDefault(),e.stopPropagation(),M())}function cn(e){e.key!=="Escape"&&e.stopPropagation()}async function Ne(e={}){if(!H)return;const t=a.querySelector("#otu-comment")?.value.trim()??"";if(!t){m("Type a change first");return}const n=rn(H,t,"change","important");if(e.copyOnly){await at([n]),M();return}f=[...f,n],await B(),d(),y(),p.classList.contains("open")&&g(!0),M(),r.syncEnabled&&K(()=>Ae(n)),m("Merged into batch")}async function dn(){if(!T)return;const e=T,t=a.querySelector("#otu-comment")?.value.trim()??"";if(!t){m("Comment cannot be empty");return}const n=a.querySelector("#otu-intent")?.value??"fix",o=a.querySelector("#otu-severity")?.value??"important",i=new Date().toISOString();f=f.map(s=>s.id===e?{...s,comment:t,intent:n,severity:o,updatedAt:i}:s),await B(),d(),y(),p.classList.contains("open")&&g(!0),M(),r.syncEnabled&&K(()=>Sn(e,{comment:t,intent:n,severity:o,updatedAt:i}))}async function un(){T&&await ot(T)}async function pn(e){return e.length===0?null:Ct(e,{mode:"change-request",detail:r.outputDetail,includeHeader:!0})}async function at(e,t=!0){const n=await pn(e);return n===null?(t&&m("No changes to copy"),!1):(await navigator.clipboard.writeText(n),t&&m("Change request copied"),!0)}function fn(e){return!(e instanceof Element)||e.closest(".toolbar-header .icon-button")?!1:!!e.closest(".toolbar-header, .collapsed-button")}function hn(e){if(e.button!==0||!fn(e.target))return;const t=u.getBoundingClientRect();k={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startLeft:t.left,startTop:t.top,moved:!1}}function gn(e){if(!k||k.pointerId!==e.pointerId)return;const t=e.clientX-k.startX,n=e.clientY-k.startY;if(!k.moved&&Math.hypot(t,n)<4)return;k.moved=!0,u.classList.add("dragging"),u.hasPointerCapture(e.pointerId)||u.setPointerCapture(e.pointerId);const o=u.getBoundingClientRect(),i=J(k.startLeft+t,k.startTop+n,o.width,o.height);Pe(u,i),tt(),e.preventDefault(),e.stopPropagation()}function st(e){if(!k||k.pointerId!==e.pointerId)return;const t=k.moved;if(k=null,u.classList.remove("dragging"),u.hasPointerCapture(e.pointerId)&&u.releasePointerCapture(e.pointerId),t){const n=u.getBoundingClientRect(),o=J(n.left,n.top,n.width,n.height);r={...r,uiPosition:o},ve(),ee=!0,window.setTimeout(()=>{ee=!1},250),m("UI position saved"),e.preventDefault(),e.stopPropagation()}}function mn(e){return e instanceof Element&&!!e.closest("textarea, button, input, select")}function bn(e,t){const n=a.getBoundingClientRect(),o=8,i=Math.max(o,window.innerWidth-n.width-o),s=Math.max(o,window.innerHeight-n.height-o);return{left:Math.min(Math.max(e,o),i),top:Math.min(Math.max(t,o),s)}}function vn(e){if(!a.classList.contains("open")||e.button!==0||mn(e.target))return;const t=a.getBoundingClientRect();C={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startLeft:t.left,startTop:t.top},a.classList.add("dragging"),a.setPointerCapture(e.pointerId),e.preventDefault(),e.stopPropagation()}function xn(e){if(!C||C.pointerId!==e.pointerId)return;const t=bn(C.startLeft+e.clientX-C.startX,C.startTop+e.clientY-C.startY);a.style.left=`${t.left}px`,a.style.top=`${t.top}px`,e.preventDefault(),e.stopPropagation()}function lt(e){!C||C.pointerId!==e.pointerId||(C=null,a.classList.remove("dragging"),a.hasPointerCapture(e.pointerId)&&a.releasePointerCapture(e.pointerId),e.preventDefault(),e.stopPropagation())}function wn(){if(!document.getElementById(je)){const e=document.createElement("style");e.id=je,e.textContent=`
      html.opentargetui-motion-paused *,
      html.opentargetui-motion-paused *::before,
      html.opentargetui-motion-paused *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `,document.head.appendChild(e)}pe=Array.from(document.querySelectorAll("video, audio")).filter(e=>e instanceof HTMLMediaElement&&!e.paused?(e.pause(),!0):!1),document.documentElement.classList.add("opentargetui-motion-paused"),R=!0,m("Motion paused")}function yn(){document.documentElement.classList.remove("opentargetui-motion-paused"),pe.forEach(e=>{e.play().catch(()=>{})}),pe=[],R=!1,m("Motion resumed")}async function B(){await be(De(location.href),f)}async function kn(){const{copyOnAdd:e,...t}=await ce(ge(),z);r={...z,...t,enabled:Ge??!1},r.serverUrl=xe(r.serverUrl),f=await ce(De(location.href),[]),A=await ce(qe(location.href),null),Ce(),Ie(),d(),y(),L(!1),r.syncEnabled&&ie()}function Ie(){Gt(r.enabled),!r.enabled&&(x=!1,w=!1,S=null,H=null,T=null,ut(),M(),g(!1),L(!1))}function $n(e){const t=r.enabled,{copyOnAdd:n,...o}=e;r={...z,...o,enabled:r.enabled,serverUrl:xe(e.serverUrl||z.serverUrl)},Ce(),Ie(),d(),y(),r.enabled&&!t&&(F=!1),r.enabled&&(d(),p.classList.contains("open")&&g(!0)),r.syncEnabled?ie():(se(),we())}async function ct(){if(A)return A;const e=await fetch(`${r.serverUrl}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:location.href,title:document.title})});if(!e.ok)throw new Error(`Session failed: ${e.status}`);const n=(await e.json()).id;return A=n,await be(qe(location.href),n),f=f.map(o=>({...o,sessionId:n})),await B(),n}async function ie(){try{re=!1,te=!1,Ee("connecting");const e=await ct();await Promise.all(f.map(t=>Ae(t))),Cn(e),we(),m("Server connected")}catch(e){ye(e,"Server unavailable")}}function se(){_?.close(),_=null}function Cn(e){se(),_=new EventSource(`${r.serverUrl}/sessions/${e}/events`),_.onmessage=t=>{const n=JSON.parse(t.data);n.type==="annotation.updated"&&n.data&&(f=f.map(o=>o.id===n.data?.id?n.data:o),B(),d(),y(),p.classList.contains("open")&&g(!0)),n.type==="annotation.deleted"&&n.annotationId&&(f=f.filter(o=>o.id!==n.annotationId),B(),d(),y(),p.classList.contains("open")&&g(!0))},_.onerror=()=>{ye(void 0,"Server events disconnected")}}async function Ae(e){const t=await ct(),n=await fetch(`${r.serverUrl}/sessions/${t}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok)throw new Error(`Annotation sync failed: ${n.status}`)}async function Sn(e,t){const n=await fetch(`${r.serverUrl}/annotations/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(`Annotation update failed: ${n.status}`)}async function dt(e){const t=await fetch(`${r.serverUrl}/annotations/${e}`,{method:"DELETE"});if(!t.ok)throw new Error(`Annotation delete failed: ${t.status}`)}function En(e){const t=e.getBoundingClientRect();I.style.display="block",I.style.left=`${t.left}px`,I.style.top=`${t.top}px`,I.style.width=`${t.width}px`,I.style.height=`${t.height}px`}function ut(){I.style.display="none"}function Be(e){const t=e.target;return!(t instanceof Element)||t.closest("[data-opentargetui]")?null:t}function Ln(e){if(!r.enabled||!x&&!w||Y(e))return;const t=Be(e);t&&En(t)}function Mn(){r.enabled&&!x&&!w&&ut()}async function Pn(e){if(!r.enabled||Y(e))return;const t=Be(e);if(!t&&!S)return;if(e.preventDefault(),e.stopPropagation(),!S){if(!t)return;const i=Fe(t);S={element:t,rect:t.getBoundingClientRect(),path:i,label:gt(t)},d(),m("Click the destination");return}const n=sn(S,e.clientX,e.clientY);let o=!1;try{o=await at([n],!1)}catch(i){console.warn("[OpenTarget UI] Move request clipboard copy failed",i)}f=[...f,n],w=!1,S=null,await B(),d(),y(),p.classList.contains("open")&&g(!0),r.syncEnabled&&K(()=>Ae(n)),m(o?"Move request copied":"Move request added")}function Tn(e){if(!r.enabled||Te()||!x||Y(e))return;const t=window.getSelection();if(!t||t.isCollapsed||t.toString().trim().length===0)return;const n=t.getRangeAt(0),o=n.getBoundingClientRect();if(o.width<=0||o.height<=0)return;const i=n.commonAncestorContainer.nodeType===Node.ELEMENT_NODE?n.commonAncestorContainer:n.commonAncestorContainer.parentElement;i instanceof Element&&(ue=!0,it({element:i,rect:o,clientX:e.clientX,clientY:e.clientY,selectedText:t.toString().trim()}))}function In(e){if(!r.enabled)return;if(Te()&&!Y(e)){r.blockPageInteractions&&(e.preventDefault(),e.stopPropagation()),M();return}if(w){Pn(e);return}if(!x||Y(e))return;if(ue){ue=!1,e.preventDefault(),e.stopPropagation();return}const t=Be(e);t&&(r.blockPageInteractions&&(e.preventDefault(),e.stopPropagation()),it({element:t,rect:t.getBoundingClientRect(),clientX:e.clientX,clientY:e.clientY,selectedText:""}))}function An(){r.enabled&&(y(),et())}function q(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.addEventListener("mousemove",Ln,!0);document.addEventListener("mouseout",Mn,!0);document.addEventListener("mouseup",Tn,!0);document.addEventListener("click",In,!0);document.addEventListener("keydown",ln,!0);window.addEventListener("pointerdown",ke,!0);window.addEventListener("pointerup",ke,!0);window.addEventListener("pointercancel",ke,!0);window.addEventListener("mousedown",$e,!0);window.addEventListener("mouseup",$e,!0);window.addEventListener("click",$e,!0);u.addEventListener("pointerdown",hn);u.addEventListener("pointermove",gn);u.addEventListener("pointerup",st);u.addEventListener("pointercancel",st);a.addEventListener("keydown",cn);a.addEventListener("pointerdown",vn);a.addEventListener("pointermove",xn);a.addEventListener("pointerup",lt);a.addEventListener("pointercancel",lt);window.addEventListener("scroll",y,{passive:!0});window.addEventListener("resize",An,{passive:!0});function Bn(e,t,n){if(e.source!=="opentargetui-popup")return!1;if(e.type==="get-state")return n({ok:!0,enabled:r.enabled}),!0;if(e.type==="set-enabled"){const o=!!e.enabled;return Ge=o,r={...r,enabled:o},Ie(),d(),y(),o&&(F=!1,d()),n({ok:!0,enabled:o}),!0}return!1}try{typeof chrome<"u"&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener(Bn),typeof chrome<"u"&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{if(t!=="local")return;const n=e[ge()];n?.newValue&&$n(n.newValue)})}catch(e){ae(e)?W=!0:console.warn("[OpenTarget UI] Message handler unavailable",e)}kn();
//# sourceMappingURL=content.js.map
