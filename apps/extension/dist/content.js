const ge="opentargetui:v1";function Ie(e){const t=new URL(e);return`${ge}:page:${t.origin}${t.pathname}`}function Ae(e){const t=new URL(e);return`${ge}:session:${t.origin}${t.pathname}`}function z(){return`${ge}:settings`}const Ke=/(?:^|[-_])(?:[a-f0-9]{6,}|css|sc|module|chakra|mui|mantine|emotion)(?:[-_]|$)/i;function Pe(e){return globalThis.CSS&&typeof globalThis.CSS.escape=="function"?globalThis.CSS.escape(e):e.replace(/[^a-zA-Z0-9_-]/g,t=>`\\${t}`)}function ue(e,t){try{return t.querySelectorAll(e).length===1}catch{return!1}}function Ze(e){return Array.from(e.classList).filter(t=>t.length>=2&&!Ke.test(t)).slice(0,3).map(t=>`.${Pe(t)}`)}function Qe(e){const t=e.tagName.toLowerCase();let n=1,o=e.previousElementSibling;for(;o;)o.tagName.toLowerCase()===t&&(n+=1),o=o.previousElementSibling;return`${t}:nth-of-type(${n})`}function et(e){const t=e.tagName.toLowerCase(),n=(e.textContent??"").replace(/\s+/g," ").trim(),o=e.getAttribute("aria-label")?.trim(),i=e.getAttribute("alt")?.trim();if((t==="button"||t==="a")&&n)return`${t}[${n.slice(0,48)}]`;if(o)return`${t}[aria-label="${o.slice(0,48)}"]`;if(i)return`${t}[alt="${i.slice(0,48)}"]`;if(/^h[1-6]$/.test(t)&&n)return`${t}[${n.slice(0,48)}]`;const s=e.id?`#${e.id}`:"",c=Array.from(e.classList).slice(0,2).join(".");return`${t}${s}${c?`.${c}`:""}`}function tt(e,t=document){const n=e.tagName.toLowerCase();if(e.id){const i=`#${Pe(e.id)}`;if(ue(i,t))return i}const o=Ze(e).join("");if(o){const i=`${n}${o}`;if(ue(i,t))return i}return Qe(e)}function Be(e,t=document){const n=[];let o=e;for(;o&&o.nodeType===Node.ELEMENT_NODE;){const i=tt(o,t);n.unshift(i);const s=n.join(" > ");if(ue(s,t))return s;if(o.tagName.toLowerCase()==="body")break;o=o.parentElement}return n.join(" > ")}function je(e){const t=[],n=e.getAttribute("role"),o=e.getAttribute("aria-label"),i=e.getAttribute("aria-expanded"),s=e.getAttribute("aria-pressed"),c=e.hasAttribute("disabled")||e.getAttribute("aria-disabled")==="true";return n&&t.push(`role=${n}`),o&&t.push(`aria-label="${o}"`),i!==null&&t.push(`aria-expanded=${i}`),s!==null&&t.push(`aria-pressed=${s}`),c&&t.push("disabled=true"),t.join("; ")}function Ne(e,t=240){const n=(e.textContent||e.parentElement?.textContent||"").replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}...`:n}function nt(e){const t=getComputedStyle(e);return["display","position","width","height","margin","padding","font-size","font-family","font-weight","line-height","color","background-color","border","border-radius","box-shadow","z-index"].map(o=>`${o}: ${t.getPropertyValue(o)};`).filter(o=>!o.endsWith(": ;")).join(`
`)}function m(e,t){return t==null||t===""?null:`**${e}:** ${String(t)}`}function ze(e){if(!e.boundingBox)return null;const t=e.boundingBox;return`${Math.round(t.x)}px, ${Math.round(t.y)}px (${Math.round(t.width)}x${Math.round(t.height)}px)`}function Se(e){return`${Math.round(e.x)}px, ${Math.round(e.y)}px (${Math.round(e.width)}x${Math.round(e.height)}px)`}function Ee(e,t){return t?`**${e}:**

\`\`\`
${t.trim()}
\`\`\``:null}function R(e){const t=e.trim();return t?t.includes("`")?`\`\` ${t} \`\``:`\`${t}\``:""}function ot(e){return`"${e.replace(/\s+/g," ").trim()}"`}function at(e){return[...new Set(e.map(t=>t?.trim()).filter(Boolean))]}function it(e,t){const n=e.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);return n.length===0?[`${t+1}. Change the selected target`]:[`${t+1}. ${n[0]}`,...n.slice(1).map(o=>`   ${o}`)]}function rt(e,t,n,o){const i=[...it(e.comment,t),`   - Target: ${R(e.elementPath)}`,e.element?`   - Element: ${R(e.element)}`:null,o&&e.url?`   - URL: ${R(e.url)}`:null,e.selectedText?`   - Selected text: ${ot(e.selectedText)}`:null,e.rearrange?`   - Move from: ${R(Se(e.rearrange.originalRect))}`:null,e.rearrange?`   - Move to: ${R(Se(e.rearrange.currentRect))}`:null].filter(Boolean);if(n==="compact"||n==="standard"||(i.push(...[m("Position",ze(e)),m("Classes",e.cssClasses),m("Accessibility",e.accessibility),m("Nearby Text",e.nearbyText)].filter(Boolean).map(c=>`   - ${c}`)),n==="detailed"))return i.join(`
`);const s=e.thread?.length?e.thread.map(c=>`     - ${c.role}: ${c.content}`).join(`
`):void 0;return i.push(...[m("Fixed/Sticky",e.isFixed),m("Full DOM Path",e.fullPath),e.computedStyles?`**Computed Styles:**

\`\`\`
${e.computedStyles.trim()}
\`\`\``:null,s?`**Thread:**
${s}`:null].filter(Boolean).map(c=>`   - ${c}`)),i.join(`
`)}function st(e,t){const n=t.detail??"standard",o=t.includeHeader??!0,i=[...e].sort(($,j)=>$.timestamp-j.timestamp);if(i.length===0)return"No annotations captured.";const s=at(i.map($=>$.url)),c=s.length===1?s[0]:void 0,E=s.length>1;return`${o?`${["Implement these UI changes in one pass. Verify each target against the current DOM before editing.",c?`Page: ${R(c)}`:null].filter(Boolean).join(`
`)}

`:""}${i.map(($,j)=>rt($,j,n,E)).join(`

`)}`}function lt(e,t,n){if(n==="compact")return[`- **#${t+1} ${e.elementPath}**`,e.selectedText?`  - Selected text: "${e.selectedText}"`:null,`  - Feedback: ${e.comment}`].filter(Boolean).join(`
`);const o=[`## Annotation #${t+1}`,m("Element",e.element),m("Path",e.elementPath),m("URL",e.url),m("Selected Text",e.selectedText?`"${e.selectedText}"`:void 0),m("Feedback",e.comment)].filter(Boolean);if(n==="standard")return o.join(`

`);const i=[...o,m("Position",ze(e)),m("Classes",e.cssClasses),m("Accessibility",e.accessibility),m("Nearby Text",e.nearbyText)].filter(Boolean);if(n==="detailed")return i.join(`

`);const s=e.thread?.length?e.thread.map(c=>`- ${c.role}: ${c.content}`).join(`
`):void 0;return[...i,m("Fixed/Sticky",e.isFixed),m("Full DOM Path",e.fullPath),Ee("Computed Styles",e.computedStyles),Ee("Thread",s)].filter(Boolean).join(`

`)}function ct(e,t={}){if(t.mode==="change-request")return st(e,t);const n=t.detail??"standard",o=[...e].sort((i,s)=>i.timestamp-s.timestamp);return o.length===0?"No annotations captured.":o.map((i,s)=>lt(i,s,n)).join(`

`)}const dt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ut=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,pt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ht=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ft=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,gt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,mt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,bt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,xt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,vt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,wt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,yt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,kt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,$t=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Ct=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,St=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,De="opentargetui-root",Me="opentargetui-pause-style",D={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0},Et={check:dt,clipboardList:ut,copy:pt,eye:ht,eyeOff:ft,maximize:gt,message:mt,mousePointer:bt,panelClose:xt,pause:vt,play:wt,server:yt,settings:kt,target:$t,trash:Ct,x:St};function l(e){return Et[e].replace(/<!--[\s\S]*?-->\s*/g,"").replace("<svg",'<svg aria-hidden="true" focusable="false"').replace('class="lucide','class="otu-icon lucide')}function Q(e){return typeof chrome<"u"&&chrome.runtime?.getURL?chrome.runtime.getURL(e.replace(/^\//,"")):e}function Mt(){return`
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src: url("${Q("fonts/geist-latin-400-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 500;
      src: url("${Q("fonts/geist-latin-500-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 600;
      src: url("${Q("fonts/geist-latin-600-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 700;
      src: url("${Q("fonts/geist-latin-700-normal.woff2")}") format("woff2");
    }
  `}let a={...D},h=[],b=!1,v=!1,q=!0,N=!1,Y=null,L=null,P=null,_=null,C=null,y=null,k=null,me=0,H=null,ee=!1,pe=!1,he=[],W=!1,ie=!1,te=!1;const Le=document.getElementById(De);Le&&Le.remove();const S=document.createElement("div");S.id=De;S.setAttribute("data-opentargetui","root");S.style.all="initial";S.style.position="fixed";S.style.inset="0";S.style.zIndex="2147483647";S.style.pointerEvents="none";const I=S.attachShadow({mode:"open"});document.documentElement.appendChild(S);const ne=document.createElement("style");ne.textContent=`
  ${Mt()}

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
    --otu-accent: ${D.markerColor};
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
    grid-template-columns: repeat(4, minmax(0, 1fr));
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
    height: 38px;
    padding: 0 12px;
  }

  .action-button span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
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
`;I.appendChild(ne);const A=document.createElement("div");A.className="hover-frame";I.appendChild(A);const O=document.createElement("div");O.className="marker-layer";I.appendChild(O);const p=document.createElement("div");p.className="toolbar";I.appendChild(p);const r=document.createElement("div");r.className="panel composer";I.appendChild(r);const u=document.createElement("div");u.className="panel batch";I.appendChild(u);const x=document.createElement("div");x.className="panel settings";I.appendChild(x);const G=document.createElement("div");G.className="toast";I.appendChild(G);function qe(){if(W)return!1;try{return typeof chrome<"u"&&!!chrome.runtime?.id&&!!chrome.storage?.local}catch(e){return re(e)&&(W=!0),!1}}async function de(e,t){if(!qe())return t;try{return(await chrome.storage.local.get(e))[e]??t}catch(n){return re(n)?W=!0:console.warn("[OpenTarget UI] Storage read failed",n),t}}async function U(e,t){if(qe())try{await chrome.storage.local.set({[e]:t})}catch(n){re(n)?W=!0:console.warn("[OpenTarget UI] Storage write failed",n)}}function be(e){return e.trim().replace(/\/+$/,"")||D.serverUrl}function f(e){G.textContent=e,G.classList.add("show"),window.setTimeout(()=>G.classList.remove("show"),1600)}function re(e){return e instanceof Error&&/extension context invalidated/i.test(e.message)}function Lt(e){return e instanceof TypeError&&/failed to fetch/i.test(e.message)}function Tt(){ie=!1,te=!1}function xe(e,t){ce(),ie=!0,te||(te=!0,f(t),e&&!Lt(e)&&console.warn("[OpenTarget UI] Server sync failed",e))}function J(e){ie||e().catch(t=>xe(t,"Saved locally; server unavailable"))}function se(e){return e.composedPath().includes(S)||e.composedPath().includes(I)}function ve(){ne.textContent=ne.textContent?.replace(/--otu-accent: #[0-9a-fA-F]{6};/,`--otu-accent: ${a.markerColor};`)??""}function K(){return h.filter(e=>e.status!=="dismissed"&&e.status!=="resolved")}function It(){const e=K().length;return`${e} ${e===1?"note":"notes"}`}function V(){return me>Date.now()}function we(){me=0,H!==null&&(window.clearTimeout(H),H=null)}function At(){me=Date.now()+3200,H!==null&&window.clearTimeout(H),H=window.setTimeout(()=>{we(),d(),u.classList.contains("open")&&g(!0)},3200)}function Pt(e,t="Untitled change"){return e.replace(/\s+/g," ").trim()||t}function Z(e,t,n,o,i=10){const s=Math.max(i,window.innerWidth-n-i),c=Math.max(i,window.innerHeight-o-i);return{left:Math.min(Math.max(e,i),s),top:Math.min(Math.max(t,i),c)}}function Bt(){const e=p.getBoundingClientRect(),t=e.width||Math.min(360,window.innerWidth-28),n=e.height||180;return Z(window.innerWidth-t-18,window.innerHeight-n-18,t,n)}function ye(e,t){e.style.left=`${t.left}px`,e.style.top=`${t.top}px`,e.style.right="auto",e.style.bottom="auto"}function Ue(){const e=p.getBoundingClientRect(),t=e.width||Math.min(360,window.innerWidth-28),n=e.height||180,o=a.uiPosition?Z(a.uiPosition.left,a.uiPosition.top,t,n):Bt();ye(p,o),Re()}function oe(e){if(!e.classList.contains("open"))return;const t=p.getBoundingClientRect(),n=e.getBoundingClientRect(),o=10,i=n.width||360,s=n.height||240,c=t.right-i;let E=t.top-s-o;E<10&&(E=t.bottom+o),ye(e,Z(c,E,i,s))}function Re(){oe(u),oe(x)}function fe(e){return e.charAt(0).toUpperCase()+e.slice(1)}function jt(e){return{fix:"Fix issue",change:"Change design",question:"Ask question",approve:"Approve"}[e]}function d(){if(!a.enabled){p.innerHTML="";return}p.className=`toolbar${q?" collapsed":""}`,q?p.innerHTML=`
      <button class="collapsed-button" data-action="expand" aria-label="Open OpenTarget UI" data-tooltip="Open OpenTarget UI">
        ${l("target")}
        <span>OpenTarget</span>
      </button>
    `:p.innerHTML=`
      <div class="toolbar-header">
        <div class="brand">
          <div class="brand-mark">${l("target")}</div>
          <div class="brand-name">
            <div class="brand-title">OpenTarget UI</div>
            <div class="brand-meta">${It()} on this page</div>
          </div>
        </div>
        <button class="icon-button" data-action="collapse" aria-label="Collapse toolbar" data-tooltip="Collapse toolbar">
          ${l("panelClose")}
        </button>
      </div>
      <div class="primary-actions">
        <button class="action-button primary ${b?"active":""}" data-action="select" aria-label="Annotate page">
          ${l("mousePointer")}
          <span>${b?"Annotating":"Annotate"}</span>
        </button>
        <button class="action-button ${v?"active":""}" data-action="move" aria-label="Move an element">
          ${l("maximize")}
          <span>${v?k?"Place":"Select":"Move"}</span>
        </button>
        <button class="action-button ${u.classList.contains("open")?"active":""}" data-action="batch" aria-label="Review annotation batch">
          ${l("clipboardList")}
          <span>Review</span>
        </button>
        <button class="action-button" data-action="copy" aria-label="Copy change request">
          ${l("copy")}
          <span>Copy</span>
        </button>
      </div>
      <div class="utility-actions" aria-label="OpenTarget UI utilities">
        <button class="icon-button ${a.hideMarkers?"active":""}" data-action="hide" aria-label="${a.hideMarkers?"Show markers":"Hide markers"}" data-tooltip="${a.hideMarkers?"Show markers":"Hide markers"}">
          ${a.hideMarkers?l("eye"):l("eyeOff")}
        </button>
        <button class="icon-button ${N?"active":""}" data-action="pause" aria-label="${N?"Resume page motion":"Pause page motion"}" data-tooltip="${N?"Resume motion":"Pause motion"}">
          ${l(N?"play":"pause")}
        </button>
        <button class="icon-button" data-action="settings" aria-label="Open settings" data-tooltip="Settings">
          ${l("settings")}
        </button>
        <button class="icon-button danger ${V()?"active":""}" data-action="clear" aria-label="${V()?"Confirm clear annotations":"Clear annotations"}" data-tooltip="${V()?"Click again to clear":"Clear annotations"}">
          ${l("trash")}
        </button>
      </div>
      <div class="status-row">
        <span class="status-pill"><span class="dot ${b||v?"on":""}"></span>${b?"Click a target":v?k?"Click destination":"Click item to move":"Ready"}</span>
        <span class="status-pill">${l("server")} ${a.syncEnabled?"Sync enabled":"Local only"}</span>
      </div>
    `,p.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",t=>{if(ee){ee=!1,t.preventDefault(),t.stopPropagation();return}Oe(e.dataset.action??"")})}),Ue()}function w(){if(O.innerHTML="",!a.enabled){O.style.display="none";return}O.style.display=a.hideMarkers?"none":"block",h.forEach((e,t)=>{if(e.status==="dismissed")return;const n=document.createElement("button");n.className="marker",n.type="button",n.dataset.id=e.id,n.dataset.status=e.status??"pending",n.textContent=String(t+1),n.title=e.comment,n.style.left=`${e.x}%`,n.style.top=`${e.isFixed?e.y:e.y-window.scrollY}px`,n.style.setProperty("--otu-accent",a.markerColor),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Ye(e.id)}),O.appendChild(n)})}function g(e=!1){if(u.className=`panel batch${e?" open":""}`,!e){u.innerHTML="";return}const t=K(),n=V();u.innerHTML=`
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
                      <div class="batch-comment">${F(Pt(o.comment))}</div>
                      <div class="batch-item-actions">
                        <button class="icon-button" data-batch-edit="${F(o.id)}" aria-label="Edit change ${i+1}" data-tooltip="Edit">
                          ${l("message")}
                        </button>
                        <button class="icon-button danger" data-batch-delete="${F(o.id)}" aria-label="Delete change ${i+1}" data-tooltip="Delete">
                          ${l("trash")}
                        </button>
                      </div>
                    </div>
                    <div class="batch-target">${F(o.kind==="rearrange"?`Move: ${o.elementPath}`:o.elementPath)}</div>
                  </article>
                `).join("")}
          </div>`:`<div class="batch-empty">
            <strong>Nothing to send</strong>
            <span>Click Annotate or Move, then add a change to build the request.</span>
          </div>`}
    <div class="button-row">
      <button class="command danger" data-batch-clear ${t.length===0?"disabled":""}>${l("trash")} ${n?"Confirm clear":"Clear all"}</button>
      <button class="command primary" data-batch-copy ${t.length===0?"disabled":""}>${l("copy")} Copy request</button>
    </div>
  `,u.querySelector("[data-batch-close]")?.addEventListener("click",()=>{g(!1),d()}),u.querySelector("[data-batch-copy]")?.addEventListener("click",()=>{le()}),u.querySelector("[data-batch-clear]")?.addEventListener("click",()=>{Oe("clear")}),u.querySelectorAll("[data-batch-edit]").forEach(o=>{o.addEventListener("click",()=>{g(!1),d(),Ye(o.dataset.batchEdit??"")})}),u.querySelectorAll("[data-batch-delete]").forEach(o=>{o.addEventListener("click",()=>{Fe(o.dataset.batchDelete??"")})}),oe(u)}function M(e=!1){x.className=`panel settings${e?" open":""}`,x.innerHTML=`
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
          ${["compact","standard","detailed","forensic"].map(t=>`<option value="${t}" ${a.outputDetail===t?"selected":""}>${fe(t)}</option>`).join("")}
        </select>
      </label>
      <label class="setting">
        Marker colour
        <input id="otu-marker-color" type="color" value="${a.markerColor}" />
      </label>
      <label class="setting">
        Server URL
        <input id="otu-server-url" type="url" value="${a.serverUrl}" />
      </label>
      <label class="toggle-row">
        <span class="toggle-copy">
          <strong>Sync to local server</strong>
          <small>Send notes to the MCP bridge.</small>
        </span>
        <input id="otu-sync" type="checkbox" ${a.syncEnabled?"checked":""} />
      </label>
      <label class="toggle-row">
        <span class="toggle-copy">
          <strong>Copy after add</strong>
          <small>Put markdown on the clipboard immediately.</small>
        </span>
        <input id="otu-copy-add" type="checkbox" ${a.copyOnAdd?"checked":""} />
      </label>
      <label class="toggle-row">
        <span class="toggle-copy">
          <strong>Block page clicks while annotating</strong>
          <small>Prevents accidental page actions.</small>
        </span>
        <input id="otu-block" type="checkbox" ${a.blockPageInteractions?"checked":""} />
      </label>
    </div>
    <div class="button-row">
      <button class="command" data-settings-close>${l("x")} Close</button>
      <button class="command primary" data-settings-save>${l("check")} Save settings</button>
    </div>
  `,x.querySelector("[data-settings-close]")?.addEventListener("click",()=>{M(!1)}),x.querySelector("[data-settings-save]")?.addEventListener("click",async()=>{const t=x.querySelector("#otu-output-detail")?.value,n=x.querySelector("#otu-marker-color")?.value||a.markerColor,o=be(x.querySelector("#otu-server-url")?.value||a.serverUrl),i=!!x.querySelector("#otu-sync")?.checked,s=!!x.querySelector("#otu-copy-add")?.checked,c=!!x.querySelector("#otu-block")?.checked;a={...a,outputDetail:t,markerColor:n,serverUrl:o,syncEnabled:i,copyOnAdd:s,blockPageInteractions:c},await U(z(),a),ve(),d(),w(),M(!1),a.syncEnabled?ke():ce(),f("Settings saved")}),oe(x)}async function Oe(e){if(a.enabled){if(e==="expand"){q=!1,d();return}if(e==="collapse"){q=!0,b=!1,v=!1,k=null,T(),g(!1),M(!1),d();return}if(e==="select"){b=!b,v=!1,k=null,g(!1),M(!1),d(),f(b?"Click or select text to annotate":"Targeting off");return}if(e==="move"){v=!v,k=null,b=!1,T(),g(!1),M(!1),d(),f(v?"Click the item to move":"Move mode off");return}if(e==="batch"){const t=!u.classList.contains("open");M(!1),g(t),d();return}if(e==="hide"){a={...a,hideMarkers:!a.hideMarkers},await U(z(),a),d(),w();return}if(e==="pause"){N?Kt():Jt(),d();return}if(e==="copy"){await le();return}if(e==="clear"){if(K().length===0){we(),d(),u.classList.contains("open")&&g(!0),f("No annotations to clear");return}if(!V()){At(),d(),u.classList.contains("open")&&g(!0),f("Click clear again to delete notes");return}await Nt();return}e==="settings"&&(g(!1),M(!x.classList.contains("open")))}}async function Nt(){const e=h;h=[],we(),await B(),d(),w(),u.classList.contains("open")&&g(!0),f("Annotations cleared"),a.syncEnabled&&e.forEach(t=>J(()=>We(t.id)))}async function Fe(e){!e||!h.find(n=>n.id===e)||(h=h.filter(n=>n.id!==e),await B(),d(),w(),u.classList.contains("open")&&g(!0),L===e&&T(),f("Annotation deleted"),a.syncEnabled&&J(()=>We(e)))}function zt(e){let t=e;for(;t&&t!==document.documentElement;){const n=getComputedStyle(t).position;if(n==="fixed"||n==="sticky")return!0;t=t.parentElement}return!1}function Dt(e,t,n,o){const i=e.rect,s=zt(e.element),c=i.left+i.width/2,E=i.top+i.height/2,X=Be(e.element),$=Date.now(),j={id:`otu_${$.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:t,elementPath:X,timestamp:$,x:Math.max(0,Math.min(100,c/Math.max(window.innerWidth,1)*100)),y:s?E:E+window.scrollY,element:e.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:{x:i.left+window.scrollX,y:i.top+window.scrollY,width:i.width,height:i.height},cssClasses:Array.from(e.element.classList).join(" "),computedStyles:nt(e.element),accessibility:je(e.element),nearbyText:Ne(e.element),isFixed:s,fullPath:X,intent:n,severity:o,kind:"feedback",status:"pending",thread:[]};return e.selectedText&&(j.selectedText=e.selectedText),P&&(j.sessionId=P),j}function qt(e){return{x:e.left+window.scrollX,y:e.top+window.scrollY,width:e.width,height:e.height}}function Ut(e,t,n){const o=Date.now(),i=Math.max(e.rect.width,1),s=Math.max(e.rect.height,1),c={x:t+window.scrollX-i/2,y:n+window.scrollY-s/2,width:i,height:s},E=c.x-window.scrollX+i/2,X=c.y-window.scrollY+s/2,$={id:`otu_${o.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:`Move ${e.label} to the pointed position`,elementPath:e.path,timestamp:o,x:Math.max(0,Math.min(100,E/Math.max(window.innerWidth,1)*100)),y:X+window.scrollY,element:e.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:c,cssClasses:Array.from(e.element.classList).join(" "),accessibility:je(e.element),nearbyText:Ne(e.element),isFixed:!1,fullPath:e.path,intent:"change",severity:"important",kind:"rearrange",rearrange:{selector:e.path,label:e.label,tagName:e.element.tagName.toLowerCase(),originalRect:qt(e.rect),currentRect:c},status:"pending",thread:[]};return P&&($.sessionId=P),$}function He(e){Y=e,L=null,r.className="panel composer open",r.dataset.mode="create",r.style.left=`${Math.min(e.clientX+12,window.innerWidth-376)}px`,r.style.top=`${Math.min(e.clientY+12,window.innerHeight-260)}px`,r.innerHTML=`
    <textarea id="otu-comment" placeholder="Type the change for this target"></textarea>
    <div class="button-row">
      <button class="command" data-merge>${l("message")} Merge</button>
      <button class="command primary" data-copy>${l("copy")} Copy</button>
    </div>
  `,r.querySelector("#otu-comment")?.focus(),r.querySelector("[data-merge]")?.addEventListener("click",()=>{Te({copyAfter:!1})}),r.querySelector("[data-copy]")?.addEventListener("click",()=>{Te({copyAfter:!0})})}function Ye(e){const t=h.find(n=>n.id===e);t&&(Y=null,L=e,r.className="panel composer open",r.dataset.mode="edit",r.style.left="18px",r.style.top="18px",r.innerHTML=`
    <div class="panel-header">
      <div class="panel-title">${l("message")} Edit annotation</div>
      <button class="icon-button" data-cancel aria-label="Close annotation editor" data-tooltip="Close">
        ${l("x")}
      </button>
    </div>
    <div class="target-card">
      <strong>${F(t.elementPath)}</strong>
      <span>${fe(t.status??"pending")} note</span>
    </div>
    <textarea id="otu-comment">${F(t.comment)}</textarea>
    <div class="field-row">
      <label class="form-field">
        Intent
        <select id="otu-intent">
          ${["fix","change","question","approve"].map(n=>`<option value="${n}" ${t.intent===n?"selected":""}>${jt(n)}</option>`).join("")}
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
  `,r.querySelector("[data-cancel]")?.addEventListener("click",T),r.querySelector("[data-delete]")?.addEventListener("click",Ft),r.querySelector("[data-save]")?.addEventListener("click",Ot))}function T(){Y=null,L=null,C=null,r.className="panel composer",delete r.dataset.mode,r.innerHTML=""}function Rt(e){e.key==="Escape"&&(!r.classList.contains("open")||r.dataset.mode!=="create"||(e.preventDefault(),e.stopPropagation(),T()))}async function Te(e){if(!Y)return;const t=r.querySelector("#otu-comment")?.value.trim()??"";if(!t){f("Type a change first");return}const n=Dt(Y,t,"change","important");if(e.copyAfter){await Xe([...K(),n],!1),T(),f("Copied without marker");return}h=[...h,n],await B(),d(),w(),u.classList.contains("open")&&g(!0),T(),a.syncEnabled&&J(()=>$e(n)),a.copyOnAdd?(await le(!1),f("Merged and copied")):f("Merged into batch")}async function Ot(){if(!L)return;const e=L,t=r.querySelector("#otu-comment")?.value.trim()??"";if(!t){f("Comment cannot be empty");return}const n=r.querySelector("#otu-intent")?.value??"fix",o=r.querySelector("#otu-severity")?.value??"important",i=new Date().toISOString();h=h.map(s=>s.id===e?{...s,comment:t,intent:n,severity:o,updatedAt:i}:s),await B(),d(),w(),u.classList.contains("open")&&g(!0),T(),a.syncEnabled&&J(()=>tn(e,{comment:t,intent:n,severity:o,updatedAt:i}))}async function Ft(){L&&await Fe(L)}async function le(e=!0){return Xe(K(),e)}async function Xe(e,t=!0){if(e.length===0)return t&&f("No changes to copy"),!1;const n=ct(e,{mode:"change-request",detail:a.outputDetail,includeHeader:!0});return await navigator.clipboard.writeText(n),t&&f("Change request copied"),!0}function Ht(e){return!(e instanceof Element)||e.closest(".toolbar-header .icon-button")?!1:!!e.closest(".toolbar-header, .collapsed-button")}function Yt(e){if(e.button!==0||!Ht(e.target))return;const t=p.getBoundingClientRect();y={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startLeft:t.left,startTop:t.top,moved:!1}}function Xt(e){if(!y||y.pointerId!==e.pointerId)return;const t=e.clientX-y.startX,n=e.clientY-y.startY;if(!y.moved&&Math.hypot(t,n)<4)return;y.moved=!0,p.classList.add("dragging"),p.hasPointerCapture(e.pointerId)||p.setPointerCapture(e.pointerId);const o=p.getBoundingClientRect(),i=Z(y.startLeft+t,y.startTop+n,o.width,o.height);ye(p,i),Re(),e.preventDefault(),e.stopPropagation()}function _e(e){if(!y||y.pointerId!==e.pointerId)return;const t=y.moved;if(y=null,p.classList.remove("dragging"),p.hasPointerCapture(e.pointerId)&&p.releasePointerCapture(e.pointerId),t){const n=p.getBoundingClientRect(),o=Z(n.left,n.top,n.width,n.height);a={...a,uiPosition:o},U(z(),a),ee=!0,window.setTimeout(()=>{ee=!1},250),f("UI position saved"),e.preventDefault(),e.stopPropagation()}}function _t(e){return e instanceof Element&&!!e.closest("textarea, button, input, select")}function Gt(e,t){const n=r.getBoundingClientRect(),o=8,i=Math.max(o,window.innerWidth-n.width-o),s=Math.max(o,window.innerHeight-n.height-o);return{left:Math.min(Math.max(e,o),i),top:Math.min(Math.max(t,o),s)}}function Vt(e){if(!r.classList.contains("open")||e.button!==0||_t(e.target))return;const t=r.getBoundingClientRect();C={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startLeft:t.left,startTop:t.top},r.classList.add("dragging"),r.setPointerCapture(e.pointerId),e.preventDefault(),e.stopPropagation()}function Wt(e){if(!C||C.pointerId!==e.pointerId)return;const t=Gt(C.startLeft+e.clientX-C.startX,C.startTop+e.clientY-C.startY);r.style.left=`${t.left}px`,r.style.top=`${t.top}px`,e.preventDefault(),e.stopPropagation()}function Ge(e){!C||C.pointerId!==e.pointerId||(C=null,r.classList.remove("dragging"),r.hasPointerCapture(e.pointerId)&&r.releasePointerCapture(e.pointerId),e.preventDefault(),e.stopPropagation())}function Jt(){if(!document.getElementById(Me)){const e=document.createElement("style");e.id=Me,e.textContent=`
      html.opentargetui-motion-paused *,
      html.opentargetui-motion-paused *::before,
      html.opentargetui-motion-paused *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `,document.head.appendChild(e)}he=Array.from(document.querySelectorAll("video, audio")).filter(e=>e instanceof HTMLMediaElement&&!e.paused?(e.pause(),!0):!1),document.documentElement.classList.add("opentargetui-motion-paused"),N=!0,f("Motion paused")}function Kt(){document.documentElement.classList.remove("opentargetui-motion-paused"),he.forEach(e=>{e.play().catch(()=>{})}),he=[],N=!1,f("Motion resumed")}async function B(){await U(Ie(location.href),h)}async function Zt(){a={...D,...await de(z(),D)},a.serverUrl=be(a.serverUrl),h=await de(Ie(location.href),[]),P=await de(Ae(location.href),null),ve(),ae(),d(),w(),M(!1),a.syncEnabled&&ke()}function ae(){S.style.display=a.enabled?"block":"none",!a.enabled&&(b=!1,v=!1,k=null,Y=null,L=null,Je(),T(),g(!1),M(!1))}function Qt(e){const t=a.enabled;a={...D,...e,serverUrl:be(e.serverUrl||D.serverUrl)},ve(),ae(),d(),w(),a.enabled&&!t&&(q=!1),a.enabled&&(d(),u.classList.contains("open")&&g(!0)),a.syncEnabled?ke():ce()}async function Ve(){if(P)return P;const e=await fetch(`${a.serverUrl}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:location.href,title:document.title})});if(!e.ok)throw new Error(`Session failed: ${e.status}`);const n=(await e.json()).id;return P=n,await U(Ae(location.href),n),h=h.map(o=>({...o,sessionId:n})),await B(),n}async function ke(){try{ie=!1,te=!1;const e=await Ve();await Promise.all(h.map(t=>$e(t))),en(e),Tt(),f("Server connected")}catch(e){xe(e,"Server unavailable")}}function ce(){_?.close(),_=null}function en(e){ce(),_=new EventSource(`${a.serverUrl}/sessions/${e}/events`),_.onmessage=t=>{const n=JSON.parse(t.data);n.type==="annotation.updated"&&n.data&&(h=h.map(o=>o.id===n.data?.id?n.data:o),B(),d(),w(),u.classList.contains("open")&&g(!0)),n.type==="annotation.deleted"&&n.annotationId&&(h=h.filter(o=>o.id!==n.annotationId),B(),d(),w(),u.classList.contains("open")&&g(!0))},_.onerror=()=>{xe(void 0,"Server events disconnected")}}async function $e(e){const t=await Ve(),n=await fetch(`${a.serverUrl}/sessions/${t}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok)throw new Error(`Annotation sync failed: ${n.status}`)}async function tn(e,t){const n=await fetch(`${a.serverUrl}/annotations/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(`Annotation update failed: ${n.status}`)}async function We(e){const t=await fetch(`${a.serverUrl}/annotations/${e}`,{method:"DELETE"});if(!t.ok)throw new Error(`Annotation delete failed: ${t.status}`)}function nn(e){const t=e.getBoundingClientRect();A.style.display="block",A.style.left=`${t.left}px`,A.style.top=`${t.top}px`,A.style.width=`${t.width}px`,A.style.height=`${t.height}px`}function Je(){A.style.display="none"}function Ce(e){const t=e.target;return!(t instanceof Element)||t.closest("[data-opentargetui]")?null:t}function on(e){if(!a.enabled||!b&&!v||se(e))return;const t=Ce(e);t&&nn(t)}function an(){a.enabled&&!b&&!v&&Je()}async function rn(e){if(!a.enabled||se(e))return;const t=Ce(e);if(!t&&!k)return;if(e.preventDefault(),e.stopPropagation(),!k){if(!t)return;const o=Be(t);k={element:t,rect:t.getBoundingClientRect(),path:o,label:et(t)},d(),f("Click the destination");return}const n=Ut(k,e.clientX,e.clientY);h=[...h,n],v=!1,k=null,await B(),d(),w(),u.classList.contains("open")&&g(!0),a.syncEnabled&&J(()=>$e(n)),f("Move request added")}function sn(e){if(!a.enabled||!b||se(e))return;const t=window.getSelection();if(!t||t.isCollapsed||t.toString().trim().length===0)return;const n=t.getRangeAt(0),o=n.getBoundingClientRect();if(o.width<=0||o.height<=0)return;const i=n.commonAncestorContainer.nodeType===Node.ELEMENT_NODE?n.commonAncestorContainer:n.commonAncestorContainer.parentElement;i instanceof Element&&(pe=!0,He({element:i,rect:o,clientX:e.clientX,clientY:e.clientY,selectedText:t.toString().trim()}))}function ln(e){if(!a.enabled)return;if(v){rn(e);return}if(!b||se(e))return;if(pe){pe=!1,e.preventDefault(),e.stopPropagation();return}const t=Ce(e);t&&(a.blockPageInteractions&&(e.preventDefault(),e.stopPropagation()),He({element:t,rect:t.getBoundingClientRect(),clientX:e.clientX,clientY:e.clientY,selectedText:""}))}function cn(){a.enabled&&(w(),Ue())}function F(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.addEventListener("mousemove",on,!0);document.addEventListener("mouseout",an,!0);document.addEventListener("mouseup",sn,!0);document.addEventListener("click",ln,!0);document.addEventListener("keydown",Rt,!0);p.addEventListener("pointerdown",Yt);p.addEventListener("pointermove",Xt);p.addEventListener("pointerup",_e);p.addEventListener("pointercancel",_e);r.addEventListener("pointerdown",Vt);r.addEventListener("pointermove",Wt);r.addEventListener("pointerup",Ge);r.addEventListener("pointercancel",Ge);window.addEventListener("scroll",w,{passive:!0});window.addEventListener("resize",cn,{passive:!0});function dn(e,t,n){if(e.source!=="opentargetui-popup")return!1;if(e.type==="set-enabled"){const o=!!e.enabled;return a={...a,enabled:o},U(z(),a),ae(),d(),w(),o&&(q=!1,d()),n({ok:!0,enabled:o}),!0}return e.type==="toggle-selection"?(a.enabled||(a={...a,enabled:!0},U(z(),a),ae()),b=!b,v=!1,k=null,q=!1,g(!1),M(!1),d(),n({ok:!0}),!0):e.type==="copy-feedback"?(le().then(o=>n({ok:o,copied:o})),!0):!1}try{typeof chrome<"u"&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener(dn),typeof chrome<"u"&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{if(t!=="local")return;const n=e[z()];n?.newValue&&Qt(n.newValue)})}catch(e){re(e)?W=!0:console.warn("[OpenTarget UI] Message handler unavailable",e)}Zt();
//# sourceMappingURL=content.js.map
