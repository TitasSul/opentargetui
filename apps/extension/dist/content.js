const fe="opentargetui:v1";function Oe(e){const t=new URL(e);return`${fe}:page:${t.origin}${t.pathname}`}function ze(e){const t=new URL(e);return`${fe}:session:${t.origin}${t.pathname}`}function he(){return`${fe}:settings`}const at=/(?:^|[-_])(?:[a-f0-9]{6,}|css|sc|module|chakra|mui|mantine|emotion)(?:[-_]|$)/i;function Ne(e){return globalThis.CSS&&typeof globalThis.CSS.escape=="function"?globalThis.CSS.escape(e):e.replace(/[^a-zA-Z0-9_-]/g,t=>`\\${t}`)}function ce(e,t){try{return t.querySelectorAll(e).length===1}catch{return!1}}function rt(e){return Array.from(e.classList).filter(t=>t.length>=2&&!at.test(t)).slice(0,3).map(t=>`.${Ne(t)}`)}function st(e){const t=e.tagName.toLowerCase();let n=1,o=e.previousElementSibling;for(;o;)o.tagName.toLowerCase()===t&&(n+=1),o=o.previousElementSibling;return`${t}:nth-of-type(${n})`}function lt(e){const t=e.tagName.toLowerCase(),n=(e.textContent??"").replace(/\s+/g," ").trim(),o=e.getAttribute("aria-label")?.trim(),a=e.getAttribute("alt")?.trim();if((t==="button"||t==="a")&&n)return`${t}[${n.slice(0,48)}]`;if(o)return`${t}[aria-label="${o.slice(0,48)}"]`;if(a)return`${t}[alt="${a.slice(0,48)}"]`;if(/^h[1-6]$/.test(t)&&n)return`${t}[${n.slice(0,48)}]`;const s=e.id?`#${e.id}`:"",c=Array.from(e.classList).slice(0,2).join(".");return`${t}${s}${c?`.${c}`:""}`}function ct(e,t=document){const n=e.tagName.toLowerCase();if(e.id){const a=`#${Ne(e.id)}`;if(ce(a,t))return a}const o=rt(e).join("");if(o){const a=`${n}${o}`;if(ce(a,t))return a}return st(e)}function De(e,t=document){const n=[];let o=e;for(;o&&o.nodeType===Node.ELEMENT_NODE;){const a=ct(o,t);n.unshift(a);const s=n.join(" > ");if(ce(s,t))return s;if(o.tagName.toLowerCase()==="body")break;o=o.parentElement}return n.join(" > ")}function Ue(e){const t=[],n=e.getAttribute("role"),o=e.getAttribute("aria-label"),a=e.getAttribute("aria-expanded"),s=e.getAttribute("aria-pressed"),c=e.hasAttribute("disabled")||e.getAttribute("aria-disabled")==="true";return n&&t.push(`role=${n}`),o&&t.push(`aria-label="${o}"`),a!==null&&t.push(`aria-expanded=${a}`),s!==null&&t.push(`aria-pressed=${s}`),c&&t.push("disabled=true"),t.join("; ")}function qe(e,t=240){const n=(e.textContent||e.parentElement?.textContent||"").replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}...`:n}function dt(e){const t=getComputedStyle(e);return["display","position","width","height","margin","padding","font-size","font-family","font-weight","line-height","color","background-color","border","border-radius","box-shadow","z-index"].map(o=>`${o}: ${t.getPropertyValue(o)};`).filter(o=>!o.endsWith(": ;")).join(`
`)}function b(e,t){return t==null||t===""?null:`**${e}:** ${String(t)}`}function Fe(e){if(!e.boundingBox)return null;const t=e.boundingBox;return`${Math.round(t.x)}px, ${Math.round(t.y)}px (${Math.round(t.width)}x${Math.round(t.height)}px)`}function Ie(e){return`${Math.round(e.x)}px, ${Math.round(e.y)}px (${Math.round(e.width)}x${Math.round(e.height)}px)`}function Ae(e,t){return t?`**${e}:**

\`\`\`
${t.trim()}
\`\`\``:null}function N(e){const t=e.trim();return t?t.includes("`")?`\`\` ${t} \`\``:`\`${t}\``:""}function ut(e){return`"${e.replace(/\s+/g," ").trim()}"`}function pt(e){return[...new Set(e.map(t=>t?.trim()).filter(Boolean))]}function ft(e,t){const n=e.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);return n.length===0?[`${t+1}. Change the selected target`]:[`${t+1}. ${n[0]}`,...n.slice(1).map(o=>`   ${o}`)]}function ht(e,t,n,o){const a=[...ft(e.comment,t),`   - Target: ${N(e.elementPath)}`,e.element?`   - Element: ${N(e.element)}`:null,o&&e.url?`   - URL: ${N(e.url)}`:null,e.selectedText?`   - Selected text: ${ut(e.selectedText)}`:null,e.rearrange?`   - Move from: ${N(Ie(e.rearrange.originalRect))}`:null,e.rearrange?`   - Move to: ${N(Ie(e.rearrange.currentRect))}`:null].filter(Boolean);if(n==="compact"||n==="standard"||(a.push(...[b("Position",Fe(e)),b("Classes",e.cssClasses),b("Accessibility",e.accessibility),b("Nearby Text",e.nearbyText)].filter(Boolean).map(c=>`   - ${c}`)),n==="detailed"))return a.join(`
`);const s=e.thread?.length?e.thread.map(c=>`     - ${c.role}: ${c.content}`).join(`
`):void 0;return a.push(...[b("Fixed/Sticky",e.isFixed),b("Full DOM Path",e.fullPath),e.computedStyles?`**Computed Styles:**

\`\`\`
${e.computedStyles.trim()}
\`\`\``:null,s?`**Thread:**
${s}`:null].filter(Boolean).map(c=>`   - ${c}`)),a.join(`
`)}function gt(e,t){const n=t.detail??"standard",o=t.includeHeader??!0,a=[...e].sort(($,R)=>$.timestamp-R.timestamp);if(a.length===0)return"No annotations captured.";const s=pt(a.map($=>$.url)),c=s.length===1?s[0]:void 0,E=s.length>1;return`${o?`${["Implement these UI changes in one pass. Verify each target against the current DOM before editing.",c?`Page: ${N(c)}`:null].filter(Boolean).join(`
`)}

`:""}${a.map(($,R)=>ht($,R,n,E)).join(`

`)}`}function mt(e,t,n){if(n==="compact")return[`- **#${t+1} ${e.elementPath}**`,e.selectedText?`  - Selected text: "${e.selectedText}"`:null,`  - Feedback: ${e.comment}`].filter(Boolean).join(`
`);const o=[`## Annotation #${t+1}`,b("Element",e.element),b("Path",e.elementPath),b("URL",e.url),b("Selected Text",e.selectedText?`"${e.selectedText}"`:void 0),b("Feedback",e.comment)].filter(Boolean);if(n==="standard")return o.join(`

`);const a=[...o,b("Position",Fe(e)),b("Classes",e.cssClasses),b("Accessibility",e.accessibility),b("Nearby Text",e.nearbyText)].filter(Boolean);if(n==="detailed")return a.join(`

`);const s=e.thread?.length?e.thread.map(c=>`- ${c.role}: ${c.content}`).join(`
`):void 0;return[...a,b("Fixed/Sticky",e.isFixed),b("Full DOM Path",e.fullPath),Ae("Computed Styles",e.computedStyles),Ae("Thread",s)].filter(Boolean).join(`

`)}function bt(e,t={}){if(t.mode==="change-request")return gt(e,t);const n=t.detail??"standard",o=[...e].sort((a,s)=>a.timestamp-s.timestamp);return o.length===0?"No annotations captured.":o.map((a,s)=>mt(a,s,n)).join(`

`)}const vt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,xt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,wt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,yt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,kt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,$t=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Ct=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,St=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Et=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Lt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Mt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Pt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Tt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,It=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,At=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Bt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,He="opentargetui-root",Be="opentargetui-pause-style",z={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,hideMarkers:!1,blockPageInteractions:!0},Rt={check:vt,clipboardList:xt,copy:wt,eye:yt,eyeOff:kt,maximize:$t,message:Ct,mousePointer:St,panelClose:Et,pause:Lt,play:Mt,server:Pt,settings:Tt,target:It,trash:At,x:Bt};function l(e){return Rt[e].replace(/<!--[\s\S]*?-->\s*/g,"").replace("<svg",'<svg aria-hidden="true" focusable="false"').replace('class="lucide','class="otu-icon lucide')}function Z(e){return typeof chrome<"u"&&chrome.runtime?.getURL?chrome.runtime.getURL(e.replace(/^\//,"")):e}function jt(){return`
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
  `}let i={...z},f=[],x=!1,w=!1,F=!0,j=!1,H=null,P=null,A=null,X=null,C=null,k=null,S=null,ge=0,q=null,Q=!1,de=!1,ue=[],V=!1,ie=!1,ee=!1,O="local",Ye=null,se=0;const Re=document.getElementById(He);Re&&Re.remove();const h=document.createElement("div");h.id=He;h.setAttribute("data-opentargetui","root");h.setAttribute("popover","manual");h.style.all="initial";h.style.position="fixed";h.style.inset="0";h.style.zIndex="2147483647";h.style.pointerEvents="none";h.style.margin="0";h.style.border="0";h.style.padding="0";h.style.background="transparent";const T=h.attachShadow({mode:"open"});document.documentElement.appendChild(h);const te=document.createElement("style");te.textContent=`
  ${jt()}

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
`;T.appendChild(te);const I=document.createElement("div");I.className="hover-frame";T.appendChild(I);const D=document.createElement("div");D.className="marker-layer";T.appendChild(D);const u=document.createElement("div");u.className="toolbar";T.appendChild(u);const r=document.createElement("div");r.className="panel composer";T.appendChild(r);const p=document.createElement("div");p.className="panel batch";T.appendChild(p);const v=document.createElement("div");v.className="panel settings";T.appendChild(v);const _=document.createElement("div");_.className="toast";T.appendChild(_);function Xe(){if(V)return!1;try{return typeof chrome<"u"&&!!chrome.runtime?.id&&!!chrome.storage?.local}catch(e){return ae(e)&&(V=!0),!1}}async function le(e,t){if(!Xe())return t;try{return(await chrome.storage.local.get(e))[e]??t}catch(n){return ae(n)?V=!0:console.warn("[OpenTarget UI] Storage read failed",n),t}}async function me(e,t){if(Xe())try{await chrome.storage.local.set({[e]:t})}catch(n){ae(n)?V=!0:console.warn("[OpenTarget UI] Storage write failed",n)}}async function be(){const{copyOnAdd:e,...t}=i;await me(he(),{...t,enabled:!1})}function ve(e){return e.trim().replace(/\/+$/,"")||z.serverUrl}function m(e){_.textContent=e,_.classList.add("show"),window.setTimeout(()=>_.classList.remove("show"),1600)}function ae(e){return e instanceof Error&&/extension context invalidated/i.test(e.message)}function Ot(e){return e instanceof TypeError&&/failed to fetch/i.test(e.message)}function xe(){ie=!1,ee=!1,$e(i.syncEnabled?"connected":"local")}function we(e,t){re(),ie=!0,$e(i.syncEnabled?"offline":"local"),ee||(ee=!0,m(t),e&&!Ot(e)&&console.warn("[OpenTarget UI] Server sync failed",e))}function K(e){ie||e().catch(t=>we(t,"Saved locally; server unavailable"))}function W(e){return e.composedPath().includes(h)||e.composedPath().includes(T)}function ye(){te.textContent=te.textContent?.replace(/--otu-accent: #[0-9a-fA-F]{6};/,`--otu-accent: ${i.markerColor};`)??""}function ke(){try{return h.matches(":popover-open")}catch{return!1}}function zt(){const e=h;if(!(typeof e.showPopover!="function"||ke()))try{e.showPopover()}catch{}}function Nt(){const e=h;if(typeof e.showPopover=="function")try{ke()&&e.hidePopover?.(),e.showPopover()}catch{}}function _e(){!i.enabled||se||(se=window.requestAnimationFrame(()=>{se=0,Nt()}))}function Dt(){const e=h;if(!(typeof e.hidePopover!="function"||!ke()))try{e.hidePopover()}catch{}}function Ut(e){if(e){h.style.display="block",zt();return}Dt(),h.style.display="none"}function Ge(){return i.syncEnabled?O==="connecting"?"Connecting":O==="connected"?"Server connected":O==="offline"?"Server unavailable":"Sync enabled":"Local only"}function qt(){return O==="offline"?" warn":""}function Ft(){d(),v.classList.contains("open")&&L(!0)}function $e(e){O!==e&&(O=e,Ft())}const Ht=new MutationObserver(e=>{if(!i.enabled)return;e.some(n=>{const o=n.target;return o instanceof Element&&(o===h||o.closest("[data-opentargetui]"))?!1:n.type==="childList"||n.attributeName==="open"})&&_e()});Ht.observe(document.documentElement,{attributes:!0,attributeFilter:["open"],childList:!0,subtree:!0});document.addEventListener("toggle",e=>{if(!i.enabled)return;const t=e.target;t instanceof Element&&t.closest("[data-opentargetui]")||_e()},!0);function Ce(){return f.filter(e=>e.status!=="dismissed"&&e.status!=="resolved")}function Yt(){const e=Ce().length;return`${e} ${e===1?"note":"notes"}`}function G(){return ge>Date.now()}function Se(){ge=0,q!==null&&(window.clearTimeout(q),q=null)}function Xt(){ge=Date.now()+3200,q!==null&&window.clearTimeout(q),q=window.setTimeout(()=>{Se(),d(),p.classList.contains("open")&&g(!0)},3200)}function _t(e,t="Untitled change"){return e.replace(/\s+/g," ").trim()||t}function J(e,t,n,o,a=10){const s=Math.max(a,window.innerWidth-n-a),c=Math.max(a,window.innerHeight-o-a);return{left:Math.min(Math.max(e,a),s),top:Math.min(Math.max(t,a),c)}}function Gt(){const e=u.getBoundingClientRect(),t=e.width||Math.min(360,window.innerWidth-28),n=e.height||180;return J(window.innerWidth-t-18,window.innerHeight-n-18,t,n)}function Ee(e,t){e.style.left=`${t.left}px`,e.style.top=`${t.top}px`,e.style.right="auto",e.style.bottom="auto"}function Ve(){const e=u.getBoundingClientRect(),t=e.width||Math.min(360,window.innerWidth-28),n=e.height||180,o=i.uiPosition?J(i.uiPosition.left,i.uiPosition.top,t,n):Gt();Ee(u,o),We()}function ne(e){if(!e.classList.contains("open"))return;const t=u.getBoundingClientRect(),n=e.getBoundingClientRect(),o=10,a=n.width||360,s=n.height||240,c=t.right-a;let E=t.top-s-o;E<10&&(E=t.bottom+o),Ee(e,J(c,E,a,s))}function We(){ne(p),ne(v)}function pe(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Vt(e){return{fix:"Fix issue",change:"Change design",question:"Ask question",approve:"Approve"}[e]}function d(){if(!i.enabled){u.innerHTML="";return}u.className=`toolbar${F?" collapsed":""}`,F?u.innerHTML=`
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
            <div class="brand-meta">${Yt()} on this page</div>
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
        <button class="icon-button ${i.hideMarkers?"active":""}" data-action="hide" aria-label="${i.hideMarkers?"Show markers":"Hide markers"}" data-tooltip="${i.hideMarkers?"Show markers":"Hide markers"}">
          ${i.hideMarkers?l("eye"):l("eyeOff")}
        </button>
        <button class="icon-button ${j?"active":""}" data-action="pause" aria-label="${j?"Resume page motion":"Pause page motion"}" data-tooltip="${j?"Resume motion":"Pause motion"}">
          ${l(j?"play":"pause")}
        </button>
        <button class="icon-button" data-action="settings" aria-label="Open settings" data-tooltip="Settings">
          ${l("settings")}
        </button>
        <button class="icon-button danger ${G()?"active":""}" data-action="clear" aria-label="${G()?"Confirm clear annotations":"Clear annotations"}" data-tooltip="${G()?"Click again to clear":"Clear annotations"}">
          ${l("trash")}
        </button>
      </div>
      <div class="status-row">
        <span class="status-pill"><span class="dot ${x||w?"on":""}"></span>${x?"Click a target":w?S?"Click destination":"Click item to move":"Ready"}</span>
        <span class="status-pill${qt()}">${l("server")} ${Ge()}</span>
      </div>
    `,u.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",t=>{if(Q){Q=!1,t.preventDefault(),t.stopPropagation();return}Ke(e.dataset.action??"")})}),Ve()}function y(){if(D.innerHTML="",!i.enabled){D.style.display="none";return}D.style.display=i.hideMarkers?"none":"block",f.forEach((e,t)=>{if(e.status==="dismissed")return;const n=document.createElement("button");n.className="marker",n.type="button",n.dataset.id=e.id,n.dataset.status=e.status??"pending",n.textContent=String(t+1),n.title=e.comment,n.style.left=`${e.x}%`,n.style.top=`${e.isFixed?e.y:e.y-window.scrollY}px`,n.style.setProperty("--otu-accent",i.markerColor),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Qe(e.id)}),D.appendChild(n)})}function g(e=!1){if(p.className=`panel batch${e?" open":""}`,!e){p.innerHTML="";return}const t=Ce(),n=G();p.innerHTML=`
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
            ${t.map((o,a)=>`
                  <article class="batch-item">
                    <div class="batch-item-header">
                      <span class="batch-index">${a+1}</span>
                      <div class="batch-comment">${U(_t(o.comment))}</div>
                      <div class="batch-item-actions">
                        <button class="icon-button" data-batch-edit="${U(o.id)}" aria-label="Edit change ${a+1}" data-tooltip="Edit">
                          ${l("message")}
                        </button>
                        <button class="icon-button danger" data-batch-delete="${U(o.id)}" aria-label="Delete change ${a+1}" data-tooltip="Delete">
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
    </div>
  `,p.querySelector("[data-batch-close]")?.addEventListener("click",()=>{g(!1),d()}),p.querySelector("[data-batch-clear]")?.addEventListener("click",()=>{Ke("clear")}),p.querySelectorAll("[data-batch-edit]").forEach(o=>{o.addEventListener("click",()=>{g(!1),d(),Qe(o.dataset.batchEdit??"")})}),p.querySelectorAll("[data-batch-delete]").forEach(o=>{o.addEventListener("click",()=>{Je(o.dataset.batchDelete??"")})}),ne(p)}function L(e=!1){v.className=`panel settings${e?" open":""}`,v.innerHTML=`
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
          ${["compact","standard","detailed","forensic"].map(t=>`<option value="${t}" ${i.outputDetail===t?"selected":""}>${pe(t)}</option>`).join("")}
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
      <div class="sync-health">
        <span>${l("server")} <strong>${Ge()}</strong></span>
        ${i.syncEnabled&&O==="offline"?'<button class="command" data-sync-retry>Retry</button>':""}
      </div>
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
  `,v.querySelector("[data-settings-close]")?.addEventListener("click",()=>{L(!1)}),v.querySelector("[data-sync-retry]")?.addEventListener("click",()=>{oe()}),v.querySelector("[data-settings-save]")?.addEventListener("click",async()=>{const t=v.querySelector("#otu-output-detail")?.value,n=v.querySelector("#otu-marker-color")?.value||i.markerColor,o=ve(v.querySelector("#otu-server-url")?.value||i.serverUrl),a=!!v.querySelector("#otu-sync")?.checked,s=!!v.querySelector("#otu-block")?.checked;i={...i,outputDetail:t,markerColor:n,serverUrl:o,syncEnabled:a,blockPageInteractions:s},await be(),ye(),d(),y(),L(!1),i.syncEnabled?oe():(re(),xe()),m("Settings saved")}),ne(v)}async function Ke(e){if(i.enabled){if(e==="expand"){F=!1,d();return}if(e==="collapse"){F=!0,x=!1,w=!1,S=null,M(),g(!1),L(!1),d();return}if(e==="select"){x=!x,w=!1,S=null,g(!1),L(!1),d(),m(x?"Click or select text to annotate":"Targeting off");return}if(e==="move"){w=!w,S=null,x=!1,M(),g(!1),L(!1),d(),m(w?"Click the item to move":"Move mode off");return}if(e==="batch"){const t=!p.classList.contains("open");L(!1),g(t),d();return}if(e==="hide"){i={...i,hideMarkers:!i.hideMarkers},await be(),d(),y();return}if(e==="pause"){j?gn():hn(),d();return}if(e==="clear"){if(Ce().length===0){Se(),d(),p.classList.contains("open")&&g(!0),m("No annotations to clear");return}if(!G()){Xt(),d(),p.classList.contains("open")&&g(!0),m("Click clear again to delete notes");return}await Wt();return}e==="settings"&&(g(!1),L(!v.classList.contains("open")))}}async function Wt(){const e=f;f=[],Se(),await B(),d(),y(),p.classList.contains("open")&&g(!0),m("Annotations cleared"),i.syncEnabled&&e.forEach(t=>K(()=>ot(t.id)))}async function Je(e){!e||!f.find(n=>n.id===e)||(f=f.filter(n=>n.id!==e),await B(),d(),y(),p.classList.contains("open")&&g(!0),P===e&&M(),m("Annotation deleted"),i.syncEnabled&&K(()=>ot(e)))}function Kt(e){let t=e;for(;t&&t!==document.documentElement;){const n=getComputedStyle(t).position;if(n==="fixed"||n==="sticky")return!0;t=t.parentElement}return!1}function Jt(e,t,n,o){const a=e.rect,s=Kt(e.element),c=a.left+a.width/2,E=a.top+a.height/2,Y=De(e.element),$=Date.now(),R={id:`otu_${$.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:t,elementPath:Y,timestamp:$,x:Math.max(0,Math.min(100,c/Math.max(window.innerWidth,1)*100)),y:s?E:E+window.scrollY,element:e.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:{x:a.left+window.scrollX,y:a.top+window.scrollY,width:a.width,height:a.height},cssClasses:Array.from(e.element.classList).join(" "),computedStyles:dt(e.element),accessibility:Ue(e.element),nearbyText:qe(e.element),isFixed:s,fullPath:Y,intent:n,severity:o,kind:"feedback",status:"pending",thread:[]};return e.selectedText&&(R.selectedText=e.selectedText),A&&(R.sessionId=A),R}function Zt(e){return{x:e.left+window.scrollX,y:e.top+window.scrollY,width:e.width,height:e.height}}function Qt(e,t,n){const o=Date.now(),a=Math.max(e.rect.width,1),s=Math.max(e.rect.height,1),c={x:t+window.scrollX-a/2,y:n+window.scrollY-s/2,width:a,height:s},E=c.x-window.scrollX+a/2,Y=c.y-window.scrollY+s/2,$={id:`otu_${o.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:`Move ${e.label} to the pointed position`,elementPath:e.path,timestamp:o,x:Math.max(0,Math.min(100,E/Math.max(window.innerWidth,1)*100)),y:Y+window.scrollY,element:e.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:c,cssClasses:Array.from(e.element.classList).join(" "),accessibility:Ue(e.element),nearbyText:qe(e.element),isFixed:!1,fullPath:e.path,intent:"change",severity:"important",kind:"rearrange",rearrange:{selector:e.path,label:e.label,tagName:e.element.tagName.toLowerCase(),originalRect:Zt(e.rect),currentRect:c},status:"pending",thread:[]};return A&&($.sessionId=A),$}function Ze(e){H=e,P=null,r.className="panel composer open",r.dataset.mode="create",r.style.left=`${Math.min(e.clientX+12,window.innerWidth-376)}px`,r.style.top=`${Math.min(e.clientY+12,window.innerHeight-260)}px`,r.innerHTML=`
    <textarea id="otu-comment" placeholder="Type the change for this target"></textarea>
    <div class="button-row">
      <button class="command" data-merge>${l("message")} Merge</button>
      <button class="command primary" data-copy>${l("copy")} Copy</button>
    </div>
  `,r.querySelector("#otu-comment")?.focus(),r.querySelector("[data-merge]")?.addEventListener("click",()=>{je()}),r.querySelector("[data-copy]")?.addEventListener("click",()=>{je({copyOnly:!0})})}function Qe(e){const t=f.find(n=>n.id===e);t&&(H=null,P=e,r.className="panel composer open",r.dataset.mode="edit",r.style.left="18px",r.style.top="18px",r.innerHTML=`
    <div class="panel-header">
      <div class="panel-title">${l("message")} Edit annotation</div>
      <button class="icon-button" data-cancel aria-label="Close annotation editor" data-tooltip="Close">
        ${l("x")}
      </button>
    </div>
    <div class="target-card">
      <strong>${U(t.elementPath)}</strong>
      <span>${pe(t.status??"pending")} note</span>
    </div>
    <textarea id="otu-comment">${U(t.comment)}</textarea>
    <div class="field-row">
      <label class="form-field">
        Intent
        <select id="otu-intent">
          ${["fix","change","question","approve"].map(n=>`<option value="${n}" ${t.intent===n?"selected":""}>${Vt(n)}</option>`).join("")}
        </select>
      </label>
      <label class="form-field">
        Priority
        <select id="otu-severity">
          ${["important","blocking","suggestion"].map(n=>`<option value="${n}" ${t.severity===n?"selected":""}>${pe(n)}</option>`).join("")}
        </select>
      </label>
    </div>
    <div class="button-row">
      <button class="command danger" data-delete>${l("trash")} Delete</button>
      <button class="command" data-cancel>${l("x")} Close</button>
      <button class="command primary" data-save>${l("check")} Save note</button>
    </div>
  `,r.querySelector("[data-cancel]")?.addEventListener("click",M),r.querySelector("[data-delete]")?.addEventListener("click",on),r.querySelector("[data-save]")?.addEventListener("click",nn))}function M(){H=null,P=null,C=null,r.className="panel composer",delete r.dataset.mode,r.innerHTML=""}function Le(){return r.classList.contains("open")}function en(e){e.key==="Escape"&&Le()&&(e.preventDefault(),e.stopPropagation(),M())}function tn(e){e.key!=="Escape"&&e.stopPropagation()}async function je(e={}){if(!H)return;const t=r.querySelector("#otu-comment")?.value.trim()??"";if(!t){m("Type a change first");return}const n=Jt(H,t,"change","important");if(e.copyOnly){await rn([n]),M();return}f=[...f,n],await B(),d(),y(),p.classList.contains("open")&&g(!0),M(),i.syncEnabled&&K(()=>Pe(n)),m("Merged into batch")}async function nn(){if(!P)return;const e=P,t=r.querySelector("#otu-comment")?.value.trim()??"";if(!t){m("Comment cannot be empty");return}const n=r.querySelector("#otu-intent")?.value??"fix",o=r.querySelector("#otu-severity")?.value??"important",a=new Date().toISOString();f=f.map(s=>s.id===e?{...s,comment:t,intent:n,severity:o,updatedAt:a}:s),await B(),d(),y(),p.classList.contains("open")&&g(!0),M(),i.syncEnabled&&K(()=>xn(e,{comment:t,intent:n,severity:o,updatedAt:a}))}async function on(){P&&await Je(P)}async function an(e){return e.length===0?null:bt(e,{mode:"change-request",detail:i.outputDetail,includeHeader:!0})}async function rn(e,t=!0){const n=await an(e);return n===null?(t&&m("No changes to copy"),!1):(await navigator.clipboard.writeText(n),t&&m("Change request copied"),!0)}function sn(e){return!(e instanceof Element)||e.closest(".toolbar-header .icon-button")?!1:!!e.closest(".toolbar-header, .collapsed-button")}function ln(e){if(e.button!==0||!sn(e.target))return;const t=u.getBoundingClientRect();k={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startLeft:t.left,startTop:t.top,moved:!1}}function cn(e){if(!k||k.pointerId!==e.pointerId)return;const t=e.clientX-k.startX,n=e.clientY-k.startY;if(!k.moved&&Math.hypot(t,n)<4)return;k.moved=!0,u.classList.add("dragging"),u.hasPointerCapture(e.pointerId)||u.setPointerCapture(e.pointerId);const o=u.getBoundingClientRect(),a=J(k.startLeft+t,k.startTop+n,o.width,o.height);Ee(u,a),We(),e.preventDefault(),e.stopPropagation()}function et(e){if(!k||k.pointerId!==e.pointerId)return;const t=k.moved;if(k=null,u.classList.remove("dragging"),u.hasPointerCapture(e.pointerId)&&u.releasePointerCapture(e.pointerId),t){const n=u.getBoundingClientRect(),o=J(n.left,n.top,n.width,n.height);i={...i,uiPosition:o},be(),Q=!0,window.setTimeout(()=>{Q=!1},250),m("UI position saved"),e.preventDefault(),e.stopPropagation()}}function dn(e){return e instanceof Element&&!!e.closest("textarea, button, input, select")}function un(e,t){const n=r.getBoundingClientRect(),o=8,a=Math.max(o,window.innerWidth-n.width-o),s=Math.max(o,window.innerHeight-n.height-o);return{left:Math.min(Math.max(e,o),a),top:Math.min(Math.max(t,o),s)}}function pn(e){if(!r.classList.contains("open")||e.button!==0||dn(e.target))return;const t=r.getBoundingClientRect();C={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startLeft:t.left,startTop:t.top},r.classList.add("dragging"),r.setPointerCapture(e.pointerId),e.preventDefault(),e.stopPropagation()}function fn(e){if(!C||C.pointerId!==e.pointerId)return;const t=un(C.startLeft+e.clientX-C.startX,C.startTop+e.clientY-C.startY);r.style.left=`${t.left}px`,r.style.top=`${t.top}px`,e.preventDefault(),e.stopPropagation()}function tt(e){!C||C.pointerId!==e.pointerId||(C=null,r.classList.remove("dragging"),r.hasPointerCapture(e.pointerId)&&r.releasePointerCapture(e.pointerId),e.preventDefault(),e.stopPropagation())}function hn(){if(!document.getElementById(Be)){const e=document.createElement("style");e.id=Be,e.textContent=`
      html.opentargetui-motion-paused *,
      html.opentargetui-motion-paused *::before,
      html.opentargetui-motion-paused *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `,document.head.appendChild(e)}ue=Array.from(document.querySelectorAll("video, audio")).filter(e=>e instanceof HTMLMediaElement&&!e.paused?(e.pause(),!0):!1),document.documentElement.classList.add("opentargetui-motion-paused"),j=!0,m("Motion paused")}function gn(){document.documentElement.classList.remove("opentargetui-motion-paused"),ue.forEach(e=>{e.play().catch(()=>{})}),ue=[],j=!1,m("Motion resumed")}async function B(){await me(Oe(location.href),f)}async function mn(){const{copyOnAdd:e,...t}=await le(he(),z);i={...z,...t,enabled:Ye??!1},i.serverUrl=ve(i.serverUrl),f=await le(Oe(location.href),[]),A=await le(ze(location.href),null),ye(),Me(),d(),y(),L(!1),i.syncEnabled&&oe()}function Me(){Ut(i.enabled),!i.enabled&&(x=!1,w=!1,S=null,H=null,P=null,it(),M(),g(!1),L(!1))}function bn(e){const t=i.enabled,{copyOnAdd:n,...o}=e;i={...z,...o,enabled:i.enabled,serverUrl:ve(e.serverUrl||z.serverUrl)},ye(),Me(),d(),y(),i.enabled&&!t&&(F=!1),i.enabled&&(d(),p.classList.contains("open")&&g(!0)),i.syncEnabled?oe():(re(),xe())}async function nt(){if(A)return A;const e=await fetch(`${i.serverUrl}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:location.href,title:document.title})});if(!e.ok)throw new Error(`Session failed: ${e.status}`);const n=(await e.json()).id;return A=n,await me(ze(location.href),n),f=f.map(o=>({...o,sessionId:n})),await B(),n}async function oe(){try{ie=!1,ee=!1,$e("connecting");const e=await nt();await Promise.all(f.map(t=>Pe(t))),vn(e),xe(),m("Server connected")}catch(e){we(e,"Server unavailable")}}function re(){X?.close(),X=null}function vn(e){re(),X=new EventSource(`${i.serverUrl}/sessions/${e}/events`),X.onmessage=t=>{const n=JSON.parse(t.data);n.type==="annotation.updated"&&n.data&&(f=f.map(o=>o.id===n.data?.id?n.data:o),B(),d(),y(),p.classList.contains("open")&&g(!0)),n.type==="annotation.deleted"&&n.annotationId&&(f=f.filter(o=>o.id!==n.annotationId),B(),d(),y(),p.classList.contains("open")&&g(!0))},X.onerror=()=>{we(void 0,"Server events disconnected")}}async function Pe(e){const t=await nt(),n=await fetch(`${i.serverUrl}/sessions/${t}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok)throw new Error(`Annotation sync failed: ${n.status}`)}async function xn(e,t){const n=await fetch(`${i.serverUrl}/annotations/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(`Annotation update failed: ${n.status}`)}async function ot(e){const t=await fetch(`${i.serverUrl}/annotations/${e}`,{method:"DELETE"});if(!t.ok)throw new Error(`Annotation delete failed: ${t.status}`)}function wn(e){const t=e.getBoundingClientRect();I.style.display="block",I.style.left=`${t.left}px`,I.style.top=`${t.top}px`,I.style.width=`${t.width}px`,I.style.height=`${t.height}px`}function it(){I.style.display="none"}function Te(e){const t=e.target;return!(t instanceof Element)||t.closest("[data-opentargetui]")?null:t}function yn(e){if(!i.enabled||!x&&!w||W(e))return;const t=Te(e);t&&wn(t)}function kn(){i.enabled&&!x&&!w&&it()}async function $n(e){if(!i.enabled||W(e))return;const t=Te(e);if(!t&&!S)return;if(e.preventDefault(),e.stopPropagation(),!S){if(!t)return;const o=De(t);S={element:t,rect:t.getBoundingClientRect(),path:o,label:lt(t)},d(),m("Click the destination");return}const n=Qt(S,e.clientX,e.clientY);f=[...f,n],w=!1,S=null,await B(),d(),y(),p.classList.contains("open")&&g(!0),i.syncEnabled&&K(()=>Pe(n)),m("Move request added")}function Cn(e){if(!i.enabled||Le()||!x||W(e))return;const t=window.getSelection();if(!t||t.isCollapsed||t.toString().trim().length===0)return;const n=t.getRangeAt(0),o=n.getBoundingClientRect();if(o.width<=0||o.height<=0)return;const a=n.commonAncestorContainer.nodeType===Node.ELEMENT_NODE?n.commonAncestorContainer:n.commonAncestorContainer.parentElement;a instanceof Element&&(de=!0,Ze({element:a,rect:o,clientX:e.clientX,clientY:e.clientY,selectedText:t.toString().trim()}))}function Sn(e){if(!i.enabled)return;if(Le()&&!W(e)){i.blockPageInteractions&&(e.preventDefault(),e.stopPropagation()),M();return}if(w){$n(e);return}if(!x||W(e))return;if(de){de=!1,e.preventDefault(),e.stopPropagation();return}const t=Te(e);t&&(i.blockPageInteractions&&(e.preventDefault(),e.stopPropagation()),Ze({element:t,rect:t.getBoundingClientRect(),clientX:e.clientX,clientY:e.clientY,selectedText:""}))}function En(){i.enabled&&(y(),Ve())}function U(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.addEventListener("mousemove",yn,!0);document.addEventListener("mouseout",kn,!0);document.addEventListener("mouseup",Cn,!0);document.addEventListener("click",Sn,!0);document.addEventListener("keydown",en,!0);u.addEventListener("pointerdown",ln);u.addEventListener("pointermove",cn);u.addEventListener("pointerup",et);u.addEventListener("pointercancel",et);r.addEventListener("keydown",tn);r.addEventListener("pointerdown",pn);r.addEventListener("pointermove",fn);r.addEventListener("pointerup",tt);r.addEventListener("pointercancel",tt);window.addEventListener("scroll",y,{passive:!0});window.addEventListener("resize",En,{passive:!0});function Ln(e,t,n){if(e.source!=="opentargetui-popup")return!1;if(e.type==="get-state")return n({ok:!0,enabled:i.enabled}),!0;if(e.type==="set-enabled"){const o=!!e.enabled;return Ye=o,i={...i,enabled:o},Me(),d(),y(),o&&(F=!1,d()),n({ok:!0,enabled:o}),!0}return!1}try{typeof chrome<"u"&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener(Ln),typeof chrome<"u"&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{if(t!=="local")return;const n=e[he()];n?.newValue&&bn(n.newValue)})}catch(e){ae(e)?V=!0:console.warn("[OpenTarget UI] Message handler unavailable",e)}mn();
//# sourceMappingURL=content.js.map
