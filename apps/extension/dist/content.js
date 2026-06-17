const ae="opentargetui:v1";function je(e){const t=new URL(e);return`${ae}:page:${t.origin}${t.pathname}`}function Ne(e){const t=new URL(e);return`${ae}:session:${t.origin}${t.pathname}`}function be(){return`${ae}:settings`}function Re(){return`${ae}:structure-reference`}const ot=/(?:^|[-_])(?:[a-f0-9]{6,}|css|sc|module|chakra|mui|mantine|emotion)(?:[-_]|$)/i;function De(e){return globalThis.CSS&&typeof globalThis.CSS.escape=="function"?globalThis.CSS.escape(e):e.replace(/[^a-zA-Z0-9_-]/g,t=>`\\${t}`)}function pe(e,t){try{return t.querySelectorAll(e).length===1}catch{return!1}}function rt(e){return Array.from(e.classList).filter(t=>t.length>=2&&!ot.test(t)).slice(0,3).map(t=>`.${De(t)}`)}function it(e){const t=e.tagName.toLowerCase();let n=1,o=e.previousElementSibling;for(;o;)o.tagName.toLowerCase()===t&&(n+=1),o=o.previousElementSibling;return`${t}:nth-of-type(${n})`}function at(e){const t=e.tagName.toLowerCase(),n=(e.textContent??"").replace(/\s+/g," ").trim(),o=e.getAttribute("aria-label")?.trim(),r=e.getAttribute("alt")?.trim();if((t==="button"||t==="a")&&n)return`${t}[${n.slice(0,48)}]`;if(o)return`${t}[aria-label="${o.slice(0,48)}"]`;if(r)return`${t}[alt="${r.slice(0,48)}"]`;if(/^h[1-6]$/.test(t)&&n)return`${t}[${n.slice(0,48)}]`;const a=e.id?`#${e.id}`:"",c=Array.from(e.classList).slice(0,2).join(".");return`${t}${a}${c?`.${c}`:""}`}function st(e,t=document){const n=e.tagName.toLowerCase();if(e.id){const r=`#${De(e.id)}`;if(pe(r,t))return r}const o=rt(e).join("");if(o){const r=`${n}${o}`;if(pe(r,t))return r}return it(e)}function qe(e,t=document){const n=[];let o=e;for(;o&&o.nodeType===Node.ELEMENT_NODE;){const r=st(o,t);n.unshift(r);const a=n.join(" > ");if(pe(a,t))return a;if(o.tagName.toLowerCase()==="body")break;o=o.parentElement}return n.join(" > ")}function ze(e){const t=[],n=e.getAttribute("role"),o=e.getAttribute("aria-label"),r=e.getAttribute("aria-expanded"),a=e.getAttribute("aria-pressed"),c=e.hasAttribute("disabled")||e.getAttribute("aria-disabled")==="true";return n&&t.push(`role=${n}`),o&&t.push(`aria-label="${o}"`),r!==null&&t.push(`aria-expanded=${r}`),a!==null&&t.push(`aria-pressed=${a}`),c&&t.push("disabled=true"),t.join("; ")}function Oe(e,t=240){const n=(e.textContent||e.parentElement?.textContent||"").replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}...`:n}function lt(e){const t=getComputedStyle(e);return["display","position","width","height","margin","padding","font-size","font-family","font-weight","line-height","color","background-color","border","border-radius","box-shadow","z-index"].map(o=>`${o}: ${t.getPropertyValue(o)};`).filter(o=>!o.endsWith(": ;")).join(`
`)}function m(e,t){return t==null||t===""?null:`**${e}:** ${String(t)}`}function Ue(e){if(!e.boundingBox)return null;const t=e.boundingBox;return`${Math.round(t.x)}px, ${Math.round(t.y)}px (${Math.round(t.width)}x${Math.round(t.height)}px)`}function Ae(e){return`${Math.round(e.x)}px, ${Math.round(e.y)}px (${Math.round(e.width)}x${Math.round(e.height)}px)`}function Te(e,t){return t?`**${e}:**

\`\`\`
${t.trim()}
\`\`\``:null}function z(e){const t=e.trim();return t?t.includes("`")?`\`\` ${t} \`\``:`\`${t}\``:""}function ct(e){return`"${e.replace(/\s+/g," ").trim()}"`}function dt(e){return[...new Set(e.map(t=>t?.trim()).filter(Boolean))]}function ut(e,t){const n=e.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);return n.length===0?[`${t+1}. Change the selected target`]:[`${t+1}. ${n[0]}`,...n.slice(1).map(o=>`   ${o}`)]}function pt(e,t,n,o){const r=[...ut(e.comment,t),`   - Target: ${z(e.elementPath)}`,e.element?`   - Element: ${z(e.element)}`:null,o&&e.url?`   - URL: ${z(e.url)}`:null,e.selectedText?`   - Selected text: ${ct(e.selectedText)}`:null,e.rearrange?`   - Move from: ${z(Ae(e.rearrange.originalRect))}`:null,e.rearrange?`   - Move to: ${z(Ae(e.rearrange.currentRect))}`:null].filter(Boolean);if(n==="compact"||n==="standard"||(r.push(...[m("Position",Ue(e)),m("Classes",e.cssClasses),m("Accessibility",e.accessibility),m("Nearby Text",e.nearbyText)].filter(Boolean).map(c=>`   - ${c}`)),n==="detailed"))return r.join(`
`);const a=e.thread?.length?e.thread.map(c=>`     - ${c.role}: ${c.content}`).join(`
`):void 0;return r.push(...[m("Fixed/Sticky",e.isFixed),m("Full DOM Path",e.fullPath),e.computedStyles?`**Computed Styles:**

\`\`\`
${e.computedStyles.trim()}
\`\`\``:null,a?`**Thread:**
${a}`:null].filter(Boolean).map(c=>`   - ${c}`)),r.join(`
`)}function ht(e,t){const n=t.detail??"standard",o=t.includeHeader??!0,r=[...e].sort(($,j)=>$.timestamp-j.timestamp);if(r.length===0)return"No annotations captured.";const a=dt(r.map($=>$.url)),c=a.length===1?a[0]:void 0,E=a.length>1;return`${o?`${["Implement these UI changes in one pass. Verify each target against the current DOM before editing.",c?`Page: ${z(c)}`:null].filter(Boolean).join(`
`)}

`:""}${r.map(($,j)=>pt($,j,n,E)).join(`

`)}`}function ft(e,t,n){if(n==="compact")return[`- **#${t+1} ${e.elementPath}**`,e.selectedText?`  - Selected text: "${e.selectedText}"`:null,`  - Feedback: ${e.comment}`].filter(Boolean).join(`
`);const o=[`## Annotation #${t+1}`,m("Element",e.element),m("Path",e.elementPath),m("URL",e.url),m("Selected Text",e.selectedText?`"${e.selectedText}"`:void 0),m("Feedback",e.comment)].filter(Boolean);if(n==="standard")return o.join(`

`);const r=[...o,m("Position",Ue(e)),m("Classes",e.cssClasses),m("Accessibility",e.accessibility),m("Nearby Text",e.nearbyText)].filter(Boolean);if(n==="detailed")return r.join(`

`);const a=e.thread?.length?e.thread.map(c=>`- ${c.role}: ${c.content}`).join(`
`):void 0;return[...r,m("Fixed/Sticky",e.isFixed),m("Full DOM Path",e.fullPath),Te("Computed Styles",e.computedStyles),Te("Thread",a)].filter(Boolean).join(`

`)}function gt(e,t={}){if(t.mode==="change-request")return ht(e,t);const n=t.detail??"standard",o=[...e].sort((r,a)=>r.timestamp-a.timestamp);return o.length===0?"No annotations captured.":o.map((r,a)=>ft(r,a,n)).join(`

`)}const mt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,bt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,xt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,wt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,vt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,yt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,kt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,$t=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Ct=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,St=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Et=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Mt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Lt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,At=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Tt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,It=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Fe="opentargetui-root",Ie="opentargetui-pause-style",R={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0},Pt={check:mt,clipboardList:bt,copy:xt,eye:wt,eyeOff:vt,maximize:yt,message:kt,mousePointer:$t,panelClose:Ct,pause:St,play:Et,server:Mt,settings:Lt,target:At,trash:Tt,x:It};function l(e){return Pt[e].replace(/<!--[\s\S]*?-->\s*/g,"").replace("<svg",'<svg aria-hidden="true" focusable="false"').replace('class="lucide','class="otu-icon lucide')}function Q(e){return typeof chrome<"u"&&chrome.runtime?.getURL?chrome.runtime.getURL(e.replace(/^\//,"")):e}function Bt(){return`
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
  `}let i={...R},h=[],b=!1,w=!1,D=!0,N=!1,H=null,L=null,P=null,_=null,C=null,y=null,k=null,xe=0,F=null,te=!1,he=!1,fe=[],G=!1,se=!1,ne=!1,ge=null;const Pe=document.getElementById(Fe);Pe&&Pe.remove();const S=document.createElement("div");S.id=Fe;S.setAttribute("data-opentargetui","root");S.style.all="initial";S.style.position="fixed";S.style.inset="0";S.style.zIndex="2147483647";S.style.pointerEvents="none";const T=S.attachShadow({mode:"open"});document.documentElement.appendChild(S);const oe=document.createElement("style");oe.textContent=`
  ${Bt()}

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
    --otu-accent: ${R.markerColor};
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
`;T.appendChild(oe);const I=document.createElement("div");I.className="hover-frame";T.appendChild(I);const O=document.createElement("div");O.className="marker-layer";T.appendChild(O);const p=document.createElement("div");p.className="toolbar";T.appendChild(p);const s=document.createElement("div");s.className="panel composer";T.appendChild(s);const u=document.createElement("div");u.className="panel batch";T.appendChild(u);const x=document.createElement("div");x.className="panel settings";T.appendChild(x);const V=document.createElement("div");V.className="toast";T.appendChild(V);function He(){if(G)return!1;try{return typeof chrome<"u"&&!!chrome.runtime?.id&&!!chrome.storage?.local}catch(e){return ce(e)&&(G=!0),!1}}async function ee(e,t){if(!He())return t;try{return(await chrome.storage.local.get(e))[e]??t}catch(n){return ce(n)?G=!0:console.warn("[OpenTarget UI] Storage read failed",n),t}}async function le(e,t){if(He())try{await chrome.storage.local.set({[e]:t})}catch(n){ce(n)?G=!0:console.warn("[OpenTarget UI] Storage write failed",n)}}async function we(){await le(be(),{...i,enabled:!1})}function ve(e){return e.trim().replace(/\/+$/,"")||R.serverUrl}function f(e){V.textContent=e,V.classList.add("show"),window.setTimeout(()=>V.classList.remove("show"),1600)}function ce(e){return e instanceof Error&&/extension context invalidated/i.test(e.message)}function jt(e){return e instanceof TypeError&&/failed to fetch/i.test(e.message)}function Nt(){se=!1,ne=!1}function ye(e,t){ue(),se=!0,ne||(ne=!0,f(t),e&&!jt(e)&&console.warn("[OpenTarget UI] Server sync failed",e))}function J(e){se||e().catch(t=>ye(t,"Saved locally; server unavailable"))}function de(e){return e.composedPath().includes(S)||e.composedPath().includes(T)}function ke(){oe.textContent=oe.textContent?.replace(/--otu-accent: #[0-9a-fA-F]{6};/,`--otu-accent: ${i.markerColor};`)??""}function Y(){return h.filter(e=>e.status!=="dismissed"&&e.status!=="resolved")}function Rt(){const e=Y().length;return`${e} ${e===1?"note":"notes"}`}function W(){return xe>Date.now()}function $e(){xe=0,F!==null&&(window.clearTimeout(F),F=null)}function Dt(){xe=Date.now()+3200,F!==null&&window.clearTimeout(F),F=window.setTimeout(()=>{$e(),d(),u.classList.contains("open")&&g(!0)},3200)}function qt(e,t="Untitled change"){return e.replace(/\s+/g," ").trim()||t}function Z(e,t,n,o,r=10){const a=Math.max(r,window.innerWidth-n-r),c=Math.max(r,window.innerHeight-o-r);return{left:Math.min(Math.max(e,r),a),top:Math.min(Math.max(t,r),c)}}function zt(){const e=p.getBoundingClientRect(),t=e.width||Math.min(360,window.innerWidth-28),n=e.height||180;return Z(window.innerWidth-t-18,window.innerHeight-n-18,t,n)}function Ce(e,t){e.style.left=`${t.left}px`,e.style.top=`${t.top}px`,e.style.right="auto",e.style.bottom="auto"}function Ye(){const e=p.getBoundingClientRect(),t=e.width||Math.min(360,window.innerWidth-28),n=e.height||180,o=i.uiPosition?Z(i.uiPosition.left,i.uiPosition.top,t,n):zt();Ce(p,o),Xe()}function re(e){if(!e.classList.contains("open"))return;const t=p.getBoundingClientRect(),n=e.getBoundingClientRect(),o=10,r=n.width||360,a=n.height||240,c=t.right-r;let E=t.top-a-o;E<10&&(E=t.bottom+o),Ce(e,Z(c,E,r,a))}function Xe(){re(u),re(x)}function me(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Ot(e){return{fix:"Fix issue",change:"Change design",question:"Ask question",approve:"Approve"}[e]}function d(){if(!i.enabled){p.innerHTML="";return}p.className=`toolbar${D?" collapsed":""}`,D?p.innerHTML=`
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
            <div class="brand-meta">${Rt()} on this page</div>
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
        <button class="action-button ${w?"active":""}" data-action="move" aria-label="Move an element">
          ${l("maximize")}
          <span>${w?k?"Place":"Select":"Move"}</span>
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
        <button class="icon-button ${i.hideMarkers?"active":""}" data-action="hide" aria-label="${i.hideMarkers?"Show markers":"Hide markers"}" data-tooltip="${i.hideMarkers?"Show markers":"Hide markers"}">
          ${i.hideMarkers?l("eye"):l("eyeOff")}
        </button>
        <button class="icon-button ${N?"active":""}" data-action="pause" aria-label="${N?"Resume page motion":"Pause page motion"}" data-tooltip="${N?"Resume motion":"Pause motion"}">
          ${l(N?"play":"pause")}
        </button>
        <button class="icon-button" data-action="settings" aria-label="Open settings" data-tooltip="Settings">
          ${l("settings")}
        </button>
        <button class="icon-button danger ${W()?"active":""}" data-action="clear" aria-label="${W()?"Confirm clear annotations":"Clear annotations"}" data-tooltip="${W()?"Click again to clear":"Clear annotations"}">
          ${l("trash")}
        </button>
      </div>
      <div class="status-row">
        <span class="status-pill"><span class="dot ${b||w?"on":""}"></span>${b?"Click a target":w?k?"Click destination":"Click item to move":"Ready"}</span>
        <span class="status-pill">${l("server")} ${i.syncEnabled?"Sync enabled":"Local only"}</span>
      </div>
    `,p.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",t=>{if(te){te=!1,t.preventDefault(),t.stopPropagation();return}_e(e.dataset.action??"")})}),Ye()}function v(){if(O.innerHTML="",!i.enabled){O.style.display="none";return}O.style.display=i.hideMarkers?"none":"block",h.forEach((e,t)=>{if(e.status==="dismissed")return;const n=document.createElement("button");n.className="marker",n.type="button",n.dataset.id=e.id,n.dataset.status=e.status??"pending",n.textContent=String(t+1),n.title=e.comment,n.style.left=`${e.x}%`,n.style.top=`${e.isFixed?e.y:e.y-window.scrollY}px`,n.style.setProperty("--otu-accent",i.markerColor),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Ge(e.id)}),O.appendChild(n)})}function g(e=!1){if(u.className=`panel batch${e?" open":""}`,!e){u.innerHTML="";return}const t=Y(),n=W();u.innerHTML=`
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
            ${t.map((o,r)=>`
                  <article class="batch-item">
                    <div class="batch-item-header">
                      <span class="batch-index">${r+1}</span>
                      <div class="batch-comment">${U(qt(o.comment))}</div>
                      <div class="batch-item-actions">
                        <button class="icon-button" data-batch-edit="${U(o.id)}" aria-label="Edit change ${r+1}" data-tooltip="Edit">
                          ${l("message")}
                        </button>
                        <button class="icon-button danger" data-batch-delete="${U(o.id)}" aria-label="Delete change ${r+1}" data-tooltip="Delete">
                          ${l("trash")}
                        </button>
                      </div>
                    </div>
                    <div class="batch-target">${U(o.kind==="rearrange"?`Move: ${o.elementPath}`:o.elementPath)}</div>
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
  `,u.querySelector("[data-batch-close]")?.addEventListener("click",()=>{g(!1),d()}),u.querySelector("[data-batch-copy]")?.addEventListener("click",()=>{Se()}),u.querySelector("[data-batch-clear]")?.addEventListener("click",()=>{_e("clear")}),u.querySelectorAll("[data-batch-edit]").forEach(o=>{o.addEventListener("click",()=>{g(!1),d(),Ge(o.dataset.batchEdit??"")})}),u.querySelectorAll("[data-batch-delete]").forEach(o=>{o.addEventListener("click",()=>{Ve(o.dataset.batchDelete??"")})}),re(u)}function M(e=!1){x.className=`panel settings${e?" open":""}`,x.innerHTML=`
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
          ${["compact","standard","detailed","forensic"].map(t=>`<option value="${t}" ${i.outputDetail===t?"selected":""}>${me(t)}</option>`).join("")}
        </select>
      </label>
      <label class="setting">
        Marker colour
        <input id="otu-marker-color" type="color" value="${i.markerColor}" />
      </label>
      <label class="setting">
        Server URL
        <input id="otu-server-url" type="url" value="${i.serverUrl}" />
      </label>
      <label class="toggle-row">
        <span class="toggle-copy">
          <strong>Sync to local server</strong>
          <small>Send notes to the MCP bridge.</small>
        </span>
        <input id="otu-sync" type="checkbox" ${i.syncEnabled?"checked":""} />
      </label>
      <label class="toggle-row">
        <span class="toggle-copy">
          <strong>Copy after add</strong>
          <small>Put markdown on the clipboard immediately.</small>
        </span>
        <input id="otu-copy-add" type="checkbox" ${i.copyOnAdd?"checked":""} />
      </label>
      <label class="toggle-row">
        <span class="toggle-copy">
          <strong>Block page clicks while annotating</strong>
          <small>Prevents accidental page actions.</small>
        </span>
        <input id="otu-block" type="checkbox" ${i.blockPageInteractions?"checked":""} />
      </label>
    </div>
    <div class="button-row">
      <button class="command" data-settings-close>${l("x")} Close</button>
      <button class="command primary" data-settings-save>${l("check")} Save settings</button>
    </div>
  `,x.querySelector("[data-settings-close]")?.addEventListener("click",()=>{M(!1)}),x.querySelector("[data-settings-save]")?.addEventListener("click",async()=>{const t=x.querySelector("#otu-output-detail")?.value,n=x.querySelector("#otu-marker-color")?.value||i.markerColor,o=ve(x.querySelector("#otu-server-url")?.value||i.serverUrl),r=!!x.querySelector("#otu-sync")?.checked,a=!!x.querySelector("#otu-copy-add")?.checked,c=!!x.querySelector("#otu-block")?.checked;i={...i,outputDetail:t,markerColor:n,serverUrl:o,syncEnabled:r,copyOnAdd:a,blockPageInteractions:c},await we(),ke(),d(),v(),M(!1),i.syncEnabled?Ee():ue(),f("Settings saved")}),re(x)}async function _e(e){if(i.enabled){if(e==="expand"){D=!1,d();return}if(e==="collapse"){D=!0,b=!1,w=!1,k=null,A(),g(!1),M(!1),d();return}if(e==="select"){b=!b,w=!1,k=null,g(!1),M(!1),d(),f(b?"Click or select text to annotate":"Targeting off");return}if(e==="move"){w=!w,k=null,b=!1,A(),g(!1),M(!1),d(),f(w?"Click the item to move":"Move mode off");return}if(e==="batch"){const t=!u.classList.contains("open");M(!1),g(t),d();return}if(e==="hide"){i={...i,hideMarkers:!i.hideMarkers},await we(),d(),v();return}if(e==="pause"){N?pn():un(),d();return}if(e==="copy"){await Se();return}if(e==="clear"){if(Y().length===0){$e(),d(),u.classList.contains("open")&&g(!0),f("No annotations to clear");return}if(!W()){Dt(),d(),u.classList.contains("open")&&g(!0),f("Click clear again to delete notes");return}await Ut();return}e==="settings"&&(g(!1),M(!x.classList.contains("open")))}}async function Ut(){const e=h;h=[],$e(),await B(),d(),v(),u.classList.contains("open")&&g(!0),f("Annotations cleared"),i.syncEnabled&&e.forEach(t=>J(()=>tt(t.id)))}async function Ve(e){!e||!h.find(n=>n.id===e)||(h=h.filter(n=>n.id!==e),await B(),d(),v(),u.classList.contains("open")&&g(!0),L===e&&A(),f("Annotation deleted"),i.syncEnabled&&J(()=>tt(e)))}function Ft(e){let t=e;for(;t&&t!==document.documentElement;){const n=getComputedStyle(t).position;if(n==="fixed"||n==="sticky")return!0;t=t.parentElement}return!1}function Ht(e,t,n,o){const r=e.rect,a=Ft(e.element),c=r.left+r.width/2,E=r.top+r.height/2,X=qe(e.element),$=Date.now(),j={id:`otu_${$.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:t,elementPath:X,timestamp:$,x:Math.max(0,Math.min(100,c/Math.max(window.innerWidth,1)*100)),y:a?E:E+window.scrollY,element:e.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:{x:r.left+window.scrollX,y:r.top+window.scrollY,width:r.width,height:r.height},cssClasses:Array.from(e.element.classList).join(" "),computedStyles:lt(e.element),accessibility:ze(e.element),nearbyText:Oe(e.element),isFixed:a,fullPath:X,intent:n,severity:o,kind:"feedback",status:"pending",thread:[]};return e.selectedText&&(j.selectedText=e.selectedText),P&&(j.sessionId=P),j}function Yt(e){return{x:e.left+window.scrollX,y:e.top+window.scrollY,width:e.width,height:e.height}}function Xt(e){return{x:e.left,y:e.top,width:e.width,height:e.height}}function _t(e,t,n){const o=Date.now(),r=Math.max(e.rect.width,1),a=Math.max(e.rect.height,1),c={x:t+window.scrollX-r/2,y:n+window.scrollY-a/2,width:r,height:a},E=c.x-window.scrollX+r/2,X=c.y-window.scrollY+a/2,$={id:`otu_${o.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:`Move ${e.label} to the pointed position`,elementPath:e.path,timestamp:o,x:Math.max(0,Math.min(100,E/Math.max(window.innerWidth,1)*100)),y:X+window.scrollY,element:e.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:c,cssClasses:Array.from(e.element.classList).join(" "),accessibility:ze(e.element),nearbyText:Oe(e.element),isFixed:!1,fullPath:e.path,intent:"change",severity:"important",kind:"rearrange",rearrange:{selector:e.path,label:e.label,tagName:e.element.tagName.toLowerCase(),originalRect:Yt(e.rect),currentRect:c},status:"pending",thread:[]};return P&&($.sessionId=P),$}function We(e){H=e,L=null,s.className="panel composer open",s.dataset.mode="create",s.style.left=`${Math.min(e.clientX+12,window.innerWidth-376)}px`,s.style.top=`${Math.min(e.clientY+12,window.innerHeight-260)}px`,s.innerHTML=`
    <textarea id="otu-comment" placeholder="Type the change for this target"></textarea>
    <div class="button-row">
      <button class="command" data-merge>${l("message")} Merge</button>
      <button class="command primary" data-copy>${l("copy")} Copy</button>
    </div>
  `,s.querySelector("#otu-comment")?.focus(),s.querySelector("[data-merge]")?.addEventListener("click",()=>{Be({copyAfter:!1})}),s.querySelector("[data-copy]")?.addEventListener("click",()=>{Be({copyAfter:!0})})}function Ge(e){const t=h.find(n=>n.id===e);t&&(H=null,L=e,s.className="panel composer open",s.dataset.mode="edit",s.style.left="18px",s.style.top="18px",s.innerHTML=`
    <div class="panel-header">
      <div class="panel-title">${l("message")} Edit annotation</div>
      <button class="icon-button" data-cancel aria-label="Close annotation editor" data-tooltip="Close">
        ${l("x")}
      </button>
    </div>
    <div class="target-card">
      <strong>${U(t.elementPath)}</strong>
      <span>${me(t.status??"pending")} note</span>
    </div>
    <textarea id="otu-comment">${U(t.comment)}</textarea>
    <div class="field-row">
      <label class="form-field">
        Intent
        <select id="otu-intent">
          ${["fix","change","question","approve"].map(n=>`<option value="${n}" ${t.intent===n?"selected":""}>${Ot(n)}</option>`).join("")}
        </select>
      </label>
      <label class="form-field">
        Priority
        <select id="otu-severity">
          ${["important","blocking","suggestion"].map(n=>`<option value="${n}" ${t.severity===n?"selected":""}>${me(n)}</option>`).join("")}
        </select>
      </label>
    </div>
    <div class="button-row">
      <button class="command danger" data-delete>${l("trash")} Delete</button>
      <button class="command" data-cancel>${l("x")} Close</button>
      <button class="command primary" data-save>${l("check")} Save note</button>
    </div>
  `,s.querySelector("[data-cancel]")?.addEventListener("click",A),s.querySelector("[data-delete]")?.addEventListener("click",Gt),s.querySelector("[data-save]")?.addEventListener("click",Wt))}function A(){H=null,L=null,C=null,s.className="panel composer",delete s.dataset.mode,s.innerHTML=""}function Vt(e){e.key==="Escape"&&(!s.classList.contains("open")||s.dataset.mode!=="create"||(e.preventDefault(),e.stopPropagation(),A()))}async function Be(e){if(!H)return;const t=s.querySelector("#otu-comment")?.value.trim()??"";if(!t){f("Type a change first");return}const n=Ht(H,t,"change","important");if(e.copyAfter){await Je([...Y(),n],!1),A(),f("Copied without marker");return}h=[...h,n],await B(),d(),v(),u.classList.contains("open")&&g(!0),A(),i.syncEnabled&&J(()=>Me(n)),i.copyOnAdd?(await Se(!1),f("Merged and copied")):f("Merged into batch")}async function Wt(){if(!L)return;const e=L,t=s.querySelector("#otu-comment")?.value.trim()??"";if(!t){f("Comment cannot be empty");return}const n=s.querySelector("#otu-intent")?.value??"fix",o=s.querySelector("#otu-severity")?.value??"important",r=new Date().toISOString();h=h.map(a=>a.id===e?{...a,comment:t,intent:n,severity:o,updatedAt:r}:a),await B(),d(),v(),u.classList.contains("open")&&g(!0),A(),i.syncEnabled&&J(()=>mn(e,{comment:t,intent:n,severity:o,updatedAt:r}))}async function Gt(){L&&await Ve(L)}function K(e){if(!(e instanceof HTMLElement)||e.closest("[data-opentargetui]"))return!1;const t=e.getBoundingClientRect();if(t.width<80||t.height<40)return!1;const n=getComputedStyle(e);return n.display!=="none"&&n.visibility!=="hidden"&&n.opacity!=="0"}function Kt(e){const t=e.getAttribute("role");if(t)return t;const n=e.tagName.toLowerCase();return n==="header"?"header":n==="nav"?"navigation":n==="main"?"main":n==="aside"?"aside":n==="footer"?"footer":n==="article"?"article":n==="section"?"section":"content block"}function Jt(e){const t=e.tagName.toLowerCase(),n=e.getAttribute("role"),o=Array.from(e.children).slice(0,4).map(r=>r.tagName.toLowerCase()).join("+");return`${t}${n?`[${n}]`:""}${o?`>${o}`:""}`}function q(e,t){return e.querySelectorAll(t).length}function Zt(e){return Array.from(e.children).filter(K).slice(0,8).map(t=>{const n=t.getBoundingClientRect(),o=t.tagName.toLowerCase(),r=t.getAttribute("role");return`${o}${r?`[${r}]`:""} ${Math.round(n.width)}x${Math.round(n.height)}`})}function Qt(e){const t=new Map;return Array.from(e.children).filter(K).forEach(n=>{const o=Jt(n);t.set(o,(t.get(o)??0)+1)}),Array.from(t.entries()).filter(([,n])=>n>1).slice(0,5).map(([n,o])=>`${o}x ${n}`)}function en(e,t){const n=e.getBoundingClientRect(),o=getComputedStyle(e),r=e.getAttribute("role")??void 0;return{index:t,tag:e.tagName.toLowerCase(),...r?{role:r}:{},landmark:Kt(e),bounds:Xt(n),layout:[o.display,o.flexDirection!=="row"?`flex-${o.flexDirection}`:null,o.gridTemplateColumns!=="none"?"grid":null,o.position!=="static"?o.position:null].filter(Boolean).join(", "),childCount:Array.from(e.children).filter(K).length,directChildren:Zt(e),patterns:Qt(e),counts:{headings:q(e,"h1,h2,h3,h4,h5,h6"),links:q(e,"a[href]"),buttons:q(e,"button,[role='button']"),forms:q(e,"form,input,select,textarea"),media:q(e,"img,picture,svg,video"),repeatedItems:q(e,"article,li,[class*='card' i]")}}}function tn(){const e=["header","nav","main","section","article","aside","footer","[role='banner']","[role='navigation']","[role='main']","[role='complementary']","[role='contentinfo']"].join(","),t=Array.from(document.querySelectorAll(e)).filter(K),n=t.filter(r=>!t.some(a=>a!==r&&a.contains(r))),o=(n.length>0?n:Array.from(document.body.children).filter(K)).slice(0,16).map((r,a)=>en(r,a+1));return{url:location.href,title:document.title,capturedAt:new Date().toISOString(),viewport:{width:window.innerWidth,height:window.innerHeight},sections:o}}function nn(e){const t=e.sections.map(n=>{const o=Object.entries(n.counts).filter(([,r])=>r>0).map(([r,a])=>`${r}: ${a}`).join(", ");return[`${n.index}. ${n.landmark} (${n.tag}${n.role?`, role=${n.role}`:""})`,`   - Bounds: ${Math.round(n.bounds.x)}, ${Math.round(n.bounds.y)} (${Math.round(n.bounds.width)}x${Math.round(n.bounds.height)}px)`,n.layout?`   - Layout: ${n.layout}`:null,`   - Visible direct children: ${n.childCount}`,n.directChildren.length?`   - Child blocks: ${n.directChildren.join("; ")}`:null,n.patterns.length?`   - Repeated patterns: ${n.patterns.join("; ")}`:null,o?`   - Element counts: ${o}`:null].filter(Boolean).join(`
`)});return["Reference structure to follow:","Use this only for page organization, section order, layout rhythm, and repeated block patterns. Keep the target site's brand, copy, colors, images, and assets unless separately requested.",`Reference page: ${e.url}`,`Reference viewport: ${e.viewport.width}x${e.viewport.height}`,"",...t].join(`
`)}async function Ke(e){const t=await ee(Re(),null);if(e.length===0&&!t)return null;const n=[];return t&&n.push(nn(t)),e.length>0?n.push(gt(e,{mode:"change-request",detail:i.outputDetail,includeHeader:!0})):n.push("Restructure the current page to follow the reference structure above."),n.join(`

---

`)}async function Se(e=!0){return Je(Y(),e)}async function Je(e,t=!0){const n=await Ke(e);return n===null?(t&&f("No changes to copy"),!1):(await navigator.clipboard.writeText(n),t&&f("Change request copied"),!0)}function on(e){return!(e instanceof Element)||e.closest(".toolbar-header .icon-button")?!1:!!e.closest(".toolbar-header, .collapsed-button")}function rn(e){if(e.button!==0||!on(e.target))return;const t=p.getBoundingClientRect();y={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startLeft:t.left,startTop:t.top,moved:!1}}function an(e){if(!y||y.pointerId!==e.pointerId)return;const t=e.clientX-y.startX,n=e.clientY-y.startY;if(!y.moved&&Math.hypot(t,n)<4)return;y.moved=!0,p.classList.add("dragging"),p.hasPointerCapture(e.pointerId)||p.setPointerCapture(e.pointerId);const o=p.getBoundingClientRect(),r=Z(y.startLeft+t,y.startTop+n,o.width,o.height);Ce(p,r),Xe(),e.preventDefault(),e.stopPropagation()}function Ze(e){if(!y||y.pointerId!==e.pointerId)return;const t=y.moved;if(y=null,p.classList.remove("dragging"),p.hasPointerCapture(e.pointerId)&&p.releasePointerCapture(e.pointerId),t){const n=p.getBoundingClientRect(),o=Z(n.left,n.top,n.width,n.height);i={...i,uiPosition:o},we(),te=!0,window.setTimeout(()=>{te=!1},250),f("UI position saved"),e.preventDefault(),e.stopPropagation()}}function sn(e){return e instanceof Element&&!!e.closest("textarea, button, input, select")}function ln(e,t){const n=s.getBoundingClientRect(),o=8,r=Math.max(o,window.innerWidth-n.width-o),a=Math.max(o,window.innerHeight-n.height-o);return{left:Math.min(Math.max(e,o),r),top:Math.min(Math.max(t,o),a)}}function cn(e){if(!s.classList.contains("open")||e.button!==0||sn(e.target))return;const t=s.getBoundingClientRect();C={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startLeft:t.left,startTop:t.top},s.classList.add("dragging"),s.setPointerCapture(e.pointerId),e.preventDefault(),e.stopPropagation()}function dn(e){if(!C||C.pointerId!==e.pointerId)return;const t=ln(C.startLeft+e.clientX-C.startX,C.startTop+e.clientY-C.startY);s.style.left=`${t.left}px`,s.style.top=`${t.top}px`,e.preventDefault(),e.stopPropagation()}function Qe(e){!C||C.pointerId!==e.pointerId||(C=null,s.classList.remove("dragging"),s.hasPointerCapture(e.pointerId)&&s.releasePointerCapture(e.pointerId),e.preventDefault(),e.stopPropagation())}function un(){if(!document.getElementById(Ie)){const e=document.createElement("style");e.id=Ie,e.textContent=`
      html.opentargetui-motion-paused *,
      html.opentargetui-motion-paused *::before,
      html.opentargetui-motion-paused *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `,document.head.appendChild(e)}fe=Array.from(document.querySelectorAll("video, audio")).filter(e=>e instanceof HTMLMediaElement&&!e.paused?(e.pause(),!0):!1),document.documentElement.classList.add("opentargetui-motion-paused"),N=!0,f("Motion paused")}function pn(){document.documentElement.classList.remove("opentargetui-motion-paused"),fe.forEach(e=>{e.play().catch(()=>{})}),fe=[],N=!1,f("Motion resumed")}async function B(){await le(je(location.href),h)}async function hn(){i={...R,...await ee(be(),R),enabled:ge??!1},i.serverUrl=ve(i.serverUrl),h=await ee(je(location.href),[]),P=await ee(Ne(location.href),null),ke(),ie(),d(),v(),M(!1),i.syncEnabled&&Ee()}function ie(){S.style.display=i.enabled?"block":"none",!i.enabled&&(b=!1,w=!1,k=null,H=null,L=null,nt(),A(),g(!1),M(!1))}function fn(e){const t=i.enabled;i={...R,...e,enabled:i.enabled,serverUrl:ve(e.serverUrl||R.serverUrl)},ke(),ie(),d(),v(),i.enabled&&!t&&(D=!1),i.enabled&&(d(),u.classList.contains("open")&&g(!0)),i.syncEnabled?Ee():ue()}async function et(){if(P)return P;const e=await fetch(`${i.serverUrl}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:location.href,title:document.title})});if(!e.ok)throw new Error(`Session failed: ${e.status}`);const n=(await e.json()).id;return P=n,await le(Ne(location.href),n),h=h.map(o=>({...o,sessionId:n})),await B(),n}async function Ee(){try{se=!1,ne=!1;const e=await et();await Promise.all(h.map(t=>Me(t))),gn(e),Nt(),f("Server connected")}catch(e){ye(e,"Server unavailable")}}function ue(){_?.close(),_=null}function gn(e){ue(),_=new EventSource(`${i.serverUrl}/sessions/${e}/events`),_.onmessage=t=>{const n=JSON.parse(t.data);n.type==="annotation.updated"&&n.data&&(h=h.map(o=>o.id===n.data?.id?n.data:o),B(),d(),v(),u.classList.contains("open")&&g(!0)),n.type==="annotation.deleted"&&n.annotationId&&(h=h.filter(o=>o.id!==n.annotationId),B(),d(),v(),u.classList.contains("open")&&g(!0))},_.onerror=()=>{ye(void 0,"Server events disconnected")}}async function Me(e){const t=await et(),n=await fetch(`${i.serverUrl}/sessions/${t}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok)throw new Error(`Annotation sync failed: ${n.status}`)}async function mn(e,t){const n=await fetch(`${i.serverUrl}/annotations/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(`Annotation update failed: ${n.status}`)}async function tt(e){const t=await fetch(`${i.serverUrl}/annotations/${e}`,{method:"DELETE"});if(!t.ok)throw new Error(`Annotation delete failed: ${t.status}`)}function bn(e){const t=e.getBoundingClientRect();I.style.display="block",I.style.left=`${t.left}px`,I.style.top=`${t.top}px`,I.style.width=`${t.width}px`,I.style.height=`${t.height}px`}function nt(){I.style.display="none"}function Le(e){const t=e.target;return!(t instanceof Element)||t.closest("[data-opentargetui]")?null:t}function xn(e){if(!i.enabled||!b&&!w||de(e))return;const t=Le(e);t&&bn(t)}function wn(){i.enabled&&!b&&!w&&nt()}async function vn(e){if(!i.enabled||de(e))return;const t=Le(e);if(!t&&!k)return;if(e.preventDefault(),e.stopPropagation(),!k){if(!t)return;const o=qe(t);k={element:t,rect:t.getBoundingClientRect(),path:o,label:at(t)},d(),f("Click the destination");return}const n=_t(k,e.clientX,e.clientY);h=[...h,n],w=!1,k=null,await B(),d(),v(),u.classList.contains("open")&&g(!0),i.syncEnabled&&J(()=>Me(n)),f("Move request added")}function yn(e){if(!i.enabled||!b||de(e))return;const t=window.getSelection();if(!t||t.isCollapsed||t.toString().trim().length===0)return;const n=t.getRangeAt(0),o=n.getBoundingClientRect();if(o.width<=0||o.height<=0)return;const r=n.commonAncestorContainer.nodeType===Node.ELEMENT_NODE?n.commonAncestorContainer:n.commonAncestorContainer.parentElement;r instanceof Element&&(he=!0,We({element:r,rect:o,clientX:e.clientX,clientY:e.clientY,selectedText:t.toString().trim()}))}function kn(e){if(!i.enabled)return;if(w){vn(e);return}if(!b||de(e))return;if(he){he=!1,e.preventDefault(),e.stopPropagation();return}const t=Le(e);t&&(i.blockPageInteractions&&(e.preventDefault(),e.stopPropagation()),We({element:t,rect:t.getBoundingClientRect(),clientX:e.clientX,clientY:e.clientY,selectedText:""}))}function $n(){i.enabled&&(v(),Ye())}function U(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.addEventListener("mousemove",xn,!0);document.addEventListener("mouseout",wn,!0);document.addEventListener("mouseup",yn,!0);document.addEventListener("click",kn,!0);document.addEventListener("keydown",Vt,!0);p.addEventListener("pointerdown",rn);p.addEventListener("pointermove",an);p.addEventListener("pointerup",Ze);p.addEventListener("pointercancel",Ze);s.addEventListener("pointerdown",cn);s.addEventListener("pointermove",dn);s.addEventListener("pointerup",Qe);s.addEventListener("pointercancel",Qe);window.addEventListener("scroll",v,{passive:!0});window.addEventListener("resize",$n,{passive:!0});function Cn(e,t,n){if(e.source!=="opentargetui-popup")return!1;if(e.type==="get-state")return n({ok:!0,enabled:i.enabled}),!0;if(e.type==="set-enabled"){const o=!!e.enabled;return ge=o,i={...i,enabled:o},ie(),d(),v(),o&&(D=!1,d()),n({ok:!0,enabled:o}),!0}if(e.type==="toggle-selection")return i.enabled||(ge=!0,i={...i,enabled:!0},ie()),b=!b,w=!1,k=null,D=!1,g(!1),M(!1),d(),n({ok:!0}),!0;if(e.type==="copy-feedback")return Ke(Y()).then(o=>n({ok:o!==null,text:o??void 0})),!0;if(e.type==="capture-structure-reference"){const o=tn();return n({ok:!0,reference:o}),le(Re(),o),f("Structure reference captured"),!1}return!1}try{typeof chrome<"u"&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener(Cn),typeof chrome<"u"&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{if(t!=="local")return;const n=e[be()];n?.newValue&&fn(n.newValue)})}catch(e){ce(e)?G=!0:console.warn("[OpenTarget UI] Message handler unavailable",e)}hn();
//# sourceMappingURL=content.js.map
