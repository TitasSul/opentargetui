const ue="opentargetui:v1";function Ie(e){const t=new URL(e);return`${ue}:page:${t.origin}${t.pathname}`}function Pe(e){const t=new URL(e);return`${ue}:session:${t.origin}${t.pathname}`}function pe(){return`${ue}:settings`}const Qe=/(?:^|[-_])(?:[a-f0-9]{6,}|css|sc|module|chakra|mui|mantine|emotion)(?:[-_]|$)/i;function Ae(e){return globalThis.CSS&&typeof globalThis.CSS.escape=="function"?globalThis.CSS.escape(e):e.replace(/[^a-zA-Z0-9_-]/g,t=>`\\${t}`)}function se(e,t){try{return t.querySelectorAll(e).length===1}catch{return!1}}function et(e){return Array.from(e.classList).filter(t=>t.length>=2&&!Qe.test(t)).slice(0,3).map(t=>`.${Ae(t)}`)}function tt(e){const t=e.tagName.toLowerCase();let n=1,o=e.previousElementSibling;for(;o;)o.tagName.toLowerCase()===t&&(n+=1),o=o.previousElementSibling;return`${t}:nth-of-type(${n})`}function nt(e){const t=e.tagName.toLowerCase(),n=(e.textContent??"").replace(/\s+/g," ").trim(),o=e.getAttribute("aria-label")?.trim(),a=e.getAttribute("alt")?.trim();if((t==="button"||t==="a")&&n)return`${t}[${n.slice(0,48)}]`;if(o)return`${t}[aria-label="${o.slice(0,48)}"]`;if(a)return`${t}[alt="${a.slice(0,48)}"]`;if(/^h[1-6]$/.test(t)&&n)return`${t}[${n.slice(0,48)}]`;const s=e.id?`#${e.id}`:"",l=Array.from(e.classList).slice(0,2).join(".");return`${t}${s}${l?`.${l}`:""}`}function ot(e,t=document){const n=e.tagName.toLowerCase();if(e.id){const a=`#${Ae(e.id)}`;if(se(a,t))return a}const o=et(e).join("");if(o){const a=`${n}${o}`;if(se(a,t))return a}return tt(e)}function Be(e,t=document){const n=[];let o=e;for(;o&&o.nodeType===Node.ELEMENT_NODE;){const a=ot(o,t);n.unshift(a);const s=n.join(" > ");if(se(s,t))return s;if(o.tagName.toLowerCase()==="body")break;o=o.parentElement}return n.join(" > ")}function je(e){const t=[],n=e.getAttribute("role"),o=e.getAttribute("aria-label"),a=e.getAttribute("aria-expanded"),s=e.getAttribute("aria-pressed"),l=e.hasAttribute("disabled")||e.getAttribute("aria-disabled")==="true";return n&&t.push(`role=${n}`),o&&t.push(`aria-label="${o}"`),a!==null&&t.push(`aria-expanded=${a}`),s!==null&&t.push(`aria-pressed=${s}`),l&&t.push("disabled=true"),t.join("; ")}function Ne(e,t=240){const n=(e.textContent||e.parentElement?.textContent||"").replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}...`:n}function at(e){const t=getComputedStyle(e);return["display","position","width","height","margin","padding","font-size","font-family","font-weight","line-height","color","background-color","border","border-radius","box-shadow","z-index"].map(o=>`${o}: ${t.getPropertyValue(o)};`).filter(o=>!o.endsWith(": ;")).join(`
`)}function m(e,t){return t==null||t===""?null:`**${e}:** ${String(t)}`}function ze(e){if(!e.boundingBox)return null;const t=e.boundingBox;return`${Math.round(t.x)}px, ${Math.round(t.y)}px (${Math.round(t.width)}x${Math.round(t.height)}px)`}function Se(e){return`${Math.round(e.x)}px, ${Math.round(e.y)}px (${Math.round(e.width)}x${Math.round(e.height)}px)`}function Ee(e,t){return t?`**${e}:**

\`\`\`
${t.trim()}
\`\`\``:null}function D(e){const t=e.trim();return t?t.includes("`")?`\`\` ${t} \`\``:`\`${t}\``:""}function it(e){return`"${e.replace(/\s+/g," ").trim()}"`}function rt(e){return[...new Set(e.map(t=>t?.trim()).filter(Boolean))]}function st(e,t){const n=e.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);return n.length===0?[`${t+1}. Change the selected target`]:[`${t+1}. ${n[0]}`,...n.slice(1).map(o=>`   ${o}`)]}function lt(e,t,n,o){const a=[...st(e.comment,t),`   - Target: ${D(e.elementPath)}`,e.element?`   - Element: ${D(e.element)}`:null,o&&e.url?`   - URL: ${D(e.url)}`:null,e.selectedText?`   - Selected text: ${it(e.selectedText)}`:null,e.rearrange?`   - Move from: ${D(Se(e.rearrange.originalRect))}`:null,e.rearrange?`   - Move to: ${D(Se(e.rearrange.currentRect))}`:null].filter(Boolean);if(n==="compact"||n==="standard"||(a.push(...[m("Position",ze(e)),m("Classes",e.cssClasses),m("Accessibility",e.accessibility),m("Nearby Text",e.nearbyText)].filter(Boolean).map(l=>`   - ${l}`)),n==="detailed"))return a.join(`
`);const s=e.thread?.length?e.thread.map(l=>`     - ${l.role}: ${l.content}`).join(`
`):void 0;return a.push(...[m("Fixed/Sticky",e.isFixed),m("Full DOM Path",e.fullPath),e.computedStyles?`**Computed Styles:**

\`\`\`
${e.computedStyles.trim()}
\`\`\``:null,s?`**Thread:**
${s}`:null].filter(Boolean).map(l=>`   - ${l}`)),a.join(`
`)}function ct(e,t){const n=t.detail??"standard",o=t.includeHeader??!0,a=[...e].sort((k,j)=>k.timestamp-j.timestamp);if(a.length===0)return"No annotations captured.";const s=rt(a.map(k=>k.url)),l=s.length===1?s[0]:void 0,E=s.length>1;return`${o?`${["Implement these UI changes in one pass. Verify each target against the current DOM before editing.",l?`Page: ${D(l)}`:null].filter(Boolean).join(`
`)}

`:""}${a.map((k,j)=>lt(k,j,n,E)).join(`

`)}`}function dt(e,t,n){if(n==="compact")return[`- **#${t+1} ${e.elementPath}**`,e.selectedText?`  - Selected text: "${e.selectedText}"`:null,`  - Feedback: ${e.comment}`].filter(Boolean).join(`
`);const o=[`## Annotation #${t+1}`,m("Element",e.element),m("Path",e.elementPath),m("URL",e.url),m("Selected Text",e.selectedText?`"${e.selectedText}"`:void 0),m("Feedback",e.comment)].filter(Boolean);if(n==="standard")return o.join(`

`);const a=[...o,m("Position",ze(e)),m("Classes",e.cssClasses),m("Accessibility",e.accessibility),m("Nearby Text",e.nearbyText)].filter(Boolean);if(n==="detailed")return a.join(`

`);const s=e.thread?.length?e.thread.map(l=>`- ${l.role}: ${l.content}`).join(`
`):void 0;return[...a,m("Fixed/Sticky",e.isFixed),m("Full DOM Path",e.fullPath),Ee("Computed Styles",e.computedStyles),Ee("Thread",s)].filter(Boolean).join(`

`)}function ut(e,t={}){if(t.mode==="change-request")return ct(e,t);const n=t.detail??"standard",o=[...e].sort((a,s)=>a.timestamp-s.timestamp);return o.length===0?"No annotations captured.":o.map((a,s)=>dt(a,s,n)).join(`

`)}const pt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ht=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ft=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,gt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,mt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,bt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,xt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,vt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,wt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,yt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,kt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,$t=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Ct=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,St=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Et=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Mt=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,De="opentargetui-root",Me="opentargetui-pause-style",z={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0},Lt={check:pt,clipboardList:ht,copy:ft,eye:gt,eyeOff:mt,maximize:bt,message:xt,mousePointer:vt,panelClose:wt,pause:yt,play:kt,server:$t,settings:Ct,target:St,trash:Et,x:Mt};function c(e){return Lt[e].replace(/<!--[\s\S]*?-->\s*/g,"").replace("<svg",'<svg aria-hidden="true" focusable="false"').replace('class="lucide','class="otu-icon lucide')}function K(e){return typeof chrome<"u"&&chrome.runtime?.getURL?chrome.runtime.getURL(e.replace(/^\//,"")):e}function Tt(){return`
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src: url("${K("fonts/geist-latin-400-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 500;
      src: url("${K("fonts/geist-latin-500-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 600;
      src: url("${K("fonts/geist-latin-600-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 700;
      src: url("${K("fonts/geist-latin-700-normal.woff2")}") format("woff2");
    }
  `}let i={...z},h=[],x=!1,v=!1,O=!0,N=!1,F=null,L=null,A=null,Y=null,$=null,y=null,C=null,he=0,q=null,Z=!1,le=!1,ce=[],G=!1,ne=!1,Q=!1,Re=null;const Le=document.getElementById(De);Le&&Le.remove();const S=document.createElement("div");S.id=De;S.setAttribute("data-opentargetui","root");S.style.all="initial";S.style.position="fixed";S.style.inset="0";S.style.zIndex="2147483647";S.style.pointerEvents="none";const I=S.attachShadow({mode:"open"});document.documentElement.appendChild(S);const ee=document.createElement("style");ee.textContent=`
  ${Tt()}

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
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
`;I.appendChild(ee);const P=document.createElement("div");P.className="hover-frame";I.appendChild(P);const R=document.createElement("div");R.className="marker-layer";I.appendChild(R);const u=document.createElement("div");u.className="toolbar";I.appendChild(u);const r=document.createElement("div");r.className="panel composer";I.appendChild(r);const p=document.createElement("div");p.className="panel batch";I.appendChild(p);const b=document.createElement("div");b.className="panel settings";I.appendChild(b);const X=document.createElement("div");X.className="toast";I.appendChild(X);function Ue(){if(G)return!1;try{return typeof chrome<"u"&&!!chrome.runtime?.id&&!!chrome.storage?.local}catch(e){return oe(e)&&(G=!0),!1}}async function re(e,t){if(!Ue())return t;try{return(await chrome.storage.local.get(e))[e]??t}catch(n){return oe(n)?G=!0:console.warn("[OpenTarget UI] Storage read failed",n),t}}async function fe(e,t){if(Ue())try{await chrome.storage.local.set({[e]:t})}catch(n){oe(n)?G=!0:console.warn("[OpenTarget UI] Storage write failed",n)}}async function ge(){await fe(pe(),{...i,enabled:!1})}function me(e){return e.trim().replace(/\/+$/,"")||z.serverUrl}function f(e){X.textContent=e,X.classList.add("show"),window.setTimeout(()=>X.classList.remove("show"),1600)}function oe(e){return e instanceof Error&&/extension context invalidated/i.test(e.message)}function It(e){return e instanceof TypeError&&/failed to fetch/i.test(e.message)}function Pt(){ne=!1,Q=!1}function be(e,t){ie(),ne=!0,Q||(Q=!0,f(t),e&&!It(e)&&console.warn("[OpenTarget UI] Server sync failed",e))}function V(e){ne||e().catch(t=>be(t,"Saved locally; server unavailable"))}function ae(e){return e.composedPath().includes(S)||e.composedPath().includes(I)}function xe(){ee.textContent=ee.textContent?.replace(/--otu-accent: #[0-9a-fA-F]{6};/,`--otu-accent: ${i.markerColor};`)??""}function W(){return h.filter(e=>e.status!=="dismissed"&&e.status!=="resolved")}function At(){const e=W().length;return`${e} ${e===1?"note":"notes"}`}function _(){return he>Date.now()}function ve(){he=0,q!==null&&(window.clearTimeout(q),q=null)}function Bt(){he=Date.now()+3200,q!==null&&window.clearTimeout(q),q=window.setTimeout(()=>{ve(),d(),p.classList.contains("open")&&g(!0)},3200)}function jt(e,t="Untitled change"){return e.replace(/\s+/g," ").trim()||t}function J(e,t,n,o,a=10){const s=Math.max(a,window.innerWidth-n-a),l=Math.max(a,window.innerHeight-o-a);return{left:Math.min(Math.max(e,a),s),top:Math.min(Math.max(t,a),l)}}function Nt(){const e=u.getBoundingClientRect(),t=e.width||Math.min(360,window.innerWidth-28),n=e.height||180;return J(window.innerWidth-t-18,window.innerHeight-n-18,t,n)}function we(e,t){e.style.left=`${t.left}px`,e.style.top=`${t.top}px`,e.style.right="auto",e.style.bottom="auto"}function qe(){const e=u.getBoundingClientRect(),t=e.width||Math.min(360,window.innerWidth-28),n=e.height||180,o=i.uiPosition?J(i.uiPosition.left,i.uiPosition.top,t,n):Nt();we(u,o),Oe()}function te(e){if(!e.classList.contains("open"))return;const t=u.getBoundingClientRect(),n=e.getBoundingClientRect(),o=10,a=n.width||360,s=n.height||240,l=t.right-a;let E=t.top-s-o;E<10&&(E=t.bottom+o),we(e,J(l,E,a,s))}function Oe(){te(p),te(b)}function de(e){return e.charAt(0).toUpperCase()+e.slice(1)}function zt(e){return{fix:"Fix issue",change:"Change design",question:"Ask question",approve:"Approve"}[e]}function d(){if(!i.enabled){u.innerHTML="";return}u.className=`toolbar${O?" collapsed":""}`,O?u.innerHTML=`
      <button class="collapsed-button" data-action="expand" aria-label="Open OpenTarget UI" data-tooltip="Open OpenTarget UI">
        ${c("target")}
        <span>OpenTarget</span>
      </button>
    `:u.innerHTML=`
      <div class="toolbar-header">
        <div class="brand">
          <div class="brand-mark">${c("target")}</div>
          <div class="brand-name">
            <div class="brand-title">OpenTarget UI</div>
            <div class="brand-meta">${At()} on this page</div>
          </div>
        </div>
        <button class="icon-button" data-action="collapse" aria-label="Collapse toolbar" data-tooltip="Collapse toolbar">
          ${c("panelClose")}
        </button>
      </div>
      <div class="primary-actions">
        <button class="action-button primary ${x?"active":""}" data-action="select" aria-label="Annotate page">
          ${c("mousePointer")}
          <span>${x?"Annotating":"Annotate"}</span>
        </button>
        <button class="action-button ${v?"active":""}" data-action="move" aria-label="Move an element">
          ${c("maximize")}
          <span>${v?C?"Place":"Select":"Move"}</span>
        </button>
        <button class="action-button ${p.classList.contains("open")?"active":""}" data-action="batch" aria-label="Review annotation batch">
          ${c("clipboardList")}
          <span>Review</span>
        </button>
        <button class="action-button" data-action="copy" aria-label="Copy change request">
          ${c("copy")}
          <span>Copy</span>
        </button>
      </div>
      <div class="utility-actions" aria-label="OpenTarget UI utilities">
        <button class="icon-button ${i.hideMarkers?"active":""}" data-action="hide" aria-label="${i.hideMarkers?"Show markers":"Hide markers"}" data-tooltip="${i.hideMarkers?"Show markers":"Hide markers"}">
          ${i.hideMarkers?c("eye"):c("eyeOff")}
        </button>
        <button class="icon-button ${N?"active":""}" data-action="pause" aria-label="${N?"Resume page motion":"Pause page motion"}" data-tooltip="${N?"Resume motion":"Pause motion"}">
          ${c(N?"play":"pause")}
        </button>
        <button class="icon-button" data-action="settings" aria-label="Open settings" data-tooltip="Settings">
          ${c("settings")}
        </button>
        <button class="icon-button danger ${_()?"active":""}" data-action="clear" aria-label="${_()?"Confirm clear annotations":"Clear annotations"}" data-tooltip="${_()?"Click again to clear":"Clear annotations"}">
          ${c("trash")}
        </button>
      </div>
      <div class="status-row">
        <span class="status-pill"><span class="dot ${x||v?"on":""}"></span>${x?"Click a target":v?C?"Click destination":"Click item to move":"Ready"}</span>
        <span class="status-pill">${c("server")} ${i.syncEnabled?"Sync enabled":"Local only"}</span>
      </div>
    `,u.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",t=>{if(Z){Z=!1,t.preventDefault(),t.stopPropagation();return}Fe(e.dataset.action??"")})}),qe()}function w(){if(R.innerHTML="",!i.enabled){R.style.display="none";return}R.style.display=i.hideMarkers?"none":"block",h.forEach((e,t)=>{if(e.status==="dismissed")return;const n=document.createElement("button");n.className="marker",n.type="button",n.dataset.id=e.id,n.dataset.status=e.status??"pending",n.textContent=String(t+1),n.title=e.comment,n.style.left=`${e.x}%`,n.style.top=`${e.isFixed?e.y:e.y-window.scrollY}px`,n.style.setProperty("--otu-accent",i.markerColor),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Xe(e.id)}),R.appendChild(n)})}function g(e=!1){if(p.className=`panel batch${e?" open":""}`,!e){p.innerHTML="";return}const t=W(),n=_();p.innerHTML=`
    <div class="panel-header">
      <h2 class="panel-title">${c("clipboardList")} Review batch</h2>
      <button class="icon-button" data-batch-close aria-label="Close batch manager" data-tooltip="Close">
        ${c("x")}
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
                      <div class="batch-comment">${U(jt(o.comment))}</div>
                      <div class="batch-item-actions">
                        <button class="icon-button" data-batch-edit="${U(o.id)}" aria-label="Edit change ${a+1}" data-tooltip="Edit">
                          ${c("message")}
                        </button>
                        <button class="icon-button danger" data-batch-delete="${U(o.id)}" aria-label="Delete change ${a+1}" data-tooltip="Delete">
                          ${c("trash")}
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
      <button class="command danger" data-batch-clear ${t.length===0?"disabled":""}>${c("trash")} ${n?"Confirm clear":"Clear all"}</button>
    </div>
  `,p.querySelector("[data-batch-close]")?.addEventListener("click",()=>{g(!1),d()}),p.querySelector("[data-batch-clear]")?.addEventListener("click",()=>{Fe("clear")}),p.querySelectorAll("[data-batch-edit]").forEach(o=>{o.addEventListener("click",()=>{g(!1),d(),Xe(o.dataset.batchEdit??"")})}),p.querySelectorAll("[data-batch-delete]").forEach(o=>{o.addEventListener("click",()=>{He(o.dataset.batchDelete??"")})}),te(p)}function M(e=!1){b.className=`panel settings${e?" open":""}`,b.innerHTML=`
    <div class="panel-header">
      <h2 class="panel-title">${c("settings")} Settings</h2>
      <button class="icon-button" data-settings-close aria-label="Close settings" data-tooltip="Close settings">
        ${c("x")}
      </button>
    </div>
    <div class="setting-grid">
      <label class="setting">
        Output detail
        <select id="otu-output-detail">
          ${["compact","standard","detailed","forensic"].map(t=>`<option value="${t}" ${i.outputDetail===t?"selected":""}>${de(t)}</option>`).join("")}
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
      <button class="command" data-settings-close>${c("x")} Close</button>
      <button class="command primary" data-settings-save>${c("check")} Save settings</button>
    </div>
  `,b.querySelector("[data-settings-close]")?.addEventListener("click",()=>{M(!1)}),b.querySelector("[data-settings-save]")?.addEventListener("click",async()=>{const t=b.querySelector("#otu-output-detail")?.value,n=b.querySelector("#otu-marker-color")?.value||i.markerColor,o=me(b.querySelector("#otu-server-url")?.value||i.serverUrl),a=!!b.querySelector("#otu-sync")?.checked,s=!!b.querySelector("#otu-copy-add")?.checked,l=!!b.querySelector("#otu-block")?.checked;i={...i,outputDetail:t,markerColor:n,serverUrl:o,syncEnabled:a,copyOnAdd:s,blockPageInteractions:l},await ge(),xe(),d(),w(),M(!1),i.syncEnabled?ke():ie(),f("Settings saved")}),te(b)}async function Fe(e){if(i.enabled){if(e==="expand"){O=!1,d();return}if(e==="collapse"){O=!0,x=!1,v=!1,C=null,T(),g(!1),M(!1),d();return}if(e==="select"){x=!x,v=!1,C=null,g(!1),M(!1),d(),f(x?"Click or select text to annotate":"Targeting off");return}if(e==="move"){v=!v,C=null,x=!1,T(),g(!1),M(!1),d(),f(v?"Click the item to move":"Move mode off");return}if(e==="batch"){const t=!p.classList.contains("open");M(!1),g(t),d();return}if(e==="hide"){i={...i,hideMarkers:!i.hideMarkers},await ge(),d(),w();return}if(e==="pause"){N?en():Qt(),d();return}if(e==="copy"){await _e();return}if(e==="clear"){if(W().length===0){ve(),d(),p.classList.contains("open")&&g(!0),f("No annotations to clear");return}if(!_()){Bt(),d(),p.classList.contains("open")&&g(!0),f("Click clear again to delete notes");return}await Dt();return}e==="settings"&&(g(!1),M(!b.classList.contains("open")))}}async function Dt(){const e=h;h=[],ve(),await B(),d(),w(),p.classList.contains("open")&&g(!0),f("Annotations cleared"),i.syncEnabled&&e.forEach(t=>V(()=>Ke(t.id)))}async function He(e){!e||!h.find(n=>n.id===e)||(h=h.filter(n=>n.id!==e),await B(),d(),w(),p.classList.contains("open")&&g(!0),L===e&&T(),f("Annotation deleted"),i.syncEnabled&&V(()=>Ke(e)))}function Rt(e){let t=e;for(;t&&t!==document.documentElement;){const n=getComputedStyle(t).position;if(n==="fixed"||n==="sticky")return!0;t=t.parentElement}return!1}function Ut(e,t,n,o){const a=e.rect,s=Rt(e.element),l=a.left+a.width/2,E=a.top+a.height/2,H=Be(e.element),k=Date.now(),j={id:`otu_${k.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:t,elementPath:H,timestamp:k,x:Math.max(0,Math.min(100,l/Math.max(window.innerWidth,1)*100)),y:s?E:E+window.scrollY,element:e.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:{x:a.left+window.scrollX,y:a.top+window.scrollY,width:a.width,height:a.height},cssClasses:Array.from(e.element.classList).join(" "),computedStyles:at(e.element),accessibility:je(e.element),nearbyText:Ne(e.element),isFixed:s,fullPath:H,intent:n,severity:o,kind:"feedback",status:"pending",thread:[]};return e.selectedText&&(j.selectedText=e.selectedText),A&&(j.sessionId=A),j}function qt(e){return{x:e.left+window.scrollX,y:e.top+window.scrollY,width:e.width,height:e.height}}function Ot(e,t,n){const o=Date.now(),a=Math.max(e.rect.width,1),s=Math.max(e.rect.height,1),l={x:t+window.scrollX-a/2,y:n+window.scrollY-s/2,width:a,height:s},E=l.x-window.scrollX+a/2,H=l.y-window.scrollY+s/2,k={id:`otu_${o.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:`Move ${e.label} to the pointed position`,elementPath:e.path,timestamp:o,x:Math.max(0,Math.min(100,E/Math.max(window.innerWidth,1)*100)),y:H+window.scrollY,element:e.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:l,cssClasses:Array.from(e.element.classList).join(" "),accessibility:je(e.element),nearbyText:Ne(e.element),isFixed:!1,fullPath:e.path,intent:"change",severity:"important",kind:"rearrange",rearrange:{selector:e.path,label:e.label,tagName:e.element.tagName.toLowerCase(),originalRect:qt(e.rect),currentRect:l},status:"pending",thread:[]};return A&&(k.sessionId=A),k}function Ye(e){F=e,L=null,r.className="panel composer open",r.dataset.mode="create",r.style.left=`${Math.min(e.clientX+12,window.innerWidth-376)}px`,r.style.top=`${Math.min(e.clientY+12,window.innerHeight-260)}px`,r.innerHTML=`
    <textarea id="otu-comment" placeholder="Type the change for this target"></textarea>
    <div class="button-row">
      <button class="command" data-merge>${c("message")} Merge</button>
      <button class="command primary" data-copy>${c("copy")} Copy</button>
    </div>
  `,r.querySelector("#otu-comment")?.focus(),r.querySelector("[data-merge]")?.addEventListener("click",()=>{Te({copyAfter:!1})}),r.querySelector("[data-copy]")?.addEventListener("click",()=>{Te({copyAfter:!0})})}function Xe(e){const t=h.find(n=>n.id===e);t&&(F=null,L=e,r.className="panel composer open",r.dataset.mode="edit",r.style.left="18px",r.style.top="18px",r.innerHTML=`
    <div class="panel-header">
      <div class="panel-title">${c("message")} Edit annotation</div>
      <button class="icon-button" data-cancel aria-label="Close annotation editor" data-tooltip="Close">
        ${c("x")}
      </button>
    </div>
    <div class="target-card">
      <strong>${U(t.elementPath)}</strong>
      <span>${de(t.status??"pending")} note</span>
    </div>
    <textarea id="otu-comment">${U(t.comment)}</textarea>
    <div class="field-row">
      <label class="form-field">
        Intent
        <select id="otu-intent">
          ${["fix","change","question","approve"].map(n=>`<option value="${n}" ${t.intent===n?"selected":""}>${zt(n)}</option>`).join("")}
        </select>
      </label>
      <label class="form-field">
        Priority
        <select id="otu-severity">
          ${["important","blocking","suggestion"].map(n=>`<option value="${n}" ${t.severity===n?"selected":""}>${de(n)}</option>`).join("")}
        </select>
      </label>
    </div>
    <div class="button-row">
      <button class="command danger" data-delete>${c("trash")} Delete</button>
      <button class="command" data-cancel>${c("x")} Close</button>
      <button class="command primary" data-save>${c("check")} Save note</button>
    </div>
  `,r.querySelector("[data-cancel]")?.addEventListener("click",T),r.querySelector("[data-delete]")?.addEventListener("click",Yt),r.querySelector("[data-save]")?.addEventListener("click",Ht))}function T(){F=null,L=null,$=null,r.className="panel composer",delete r.dataset.mode,r.innerHTML=""}function Ft(e){e.key==="Escape"&&(!r.classList.contains("open")||r.dataset.mode!=="create"||(e.preventDefault(),e.stopPropagation(),T()))}async function Te(e){if(!F)return;const t=r.querySelector("#otu-comment")?.value.trim()??"";if(!t){f("Type a change first");return}const n=Ut(F,t,"change","important");if(e.copyAfter){await Ge([...W(),n],!1),T(),f("Copied without marker");return}h=[...h,n],await B(),d(),w(),p.classList.contains("open")&&g(!0),T(),i.syncEnabled&&V(()=>$e(n)),i.copyOnAdd?(await _e(!1),f("Merged and copied")):f("Merged into batch")}async function Ht(){if(!L)return;const e=L,t=r.querySelector("#otu-comment")?.value.trim()??"";if(!t){f("Comment cannot be empty");return}const n=r.querySelector("#otu-intent")?.value??"fix",o=r.querySelector("#otu-severity")?.value??"important",a=new Date().toISOString();h=h.map(s=>s.id===e?{...s,comment:t,intent:n,severity:o,updatedAt:a}:s),await B(),d(),w(),p.classList.contains("open")&&g(!0),T(),i.syncEnabled&&V(()=>an(e,{comment:t,intent:n,severity:o,updatedAt:a}))}async function Yt(){L&&await He(L)}async function Xt(e){return e.length===0?null:ut(e,{mode:"change-request",detail:i.outputDetail,includeHeader:!0})}async function _e(e=!0){return Ge(W(),e)}async function Ge(e,t=!0){const n=await Xt(e);return n===null?(t&&f("No changes to copy"),!1):(await navigator.clipboard.writeText(n),t&&f("Change request copied"),!0)}function _t(e){return!(e instanceof Element)||e.closest(".toolbar-header .icon-button")?!1:!!e.closest(".toolbar-header, .collapsed-button")}function Gt(e){if(e.button!==0||!_t(e.target))return;const t=u.getBoundingClientRect();y={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startLeft:t.left,startTop:t.top,moved:!1}}function Vt(e){if(!y||y.pointerId!==e.pointerId)return;const t=e.clientX-y.startX,n=e.clientY-y.startY;if(!y.moved&&Math.hypot(t,n)<4)return;y.moved=!0,u.classList.add("dragging"),u.hasPointerCapture(e.pointerId)||u.setPointerCapture(e.pointerId);const o=u.getBoundingClientRect(),a=J(y.startLeft+t,y.startTop+n,o.width,o.height);we(u,a),Oe(),e.preventDefault(),e.stopPropagation()}function Ve(e){if(!y||y.pointerId!==e.pointerId)return;const t=y.moved;if(y=null,u.classList.remove("dragging"),u.hasPointerCapture(e.pointerId)&&u.releasePointerCapture(e.pointerId),t){const n=u.getBoundingClientRect(),o=J(n.left,n.top,n.width,n.height);i={...i,uiPosition:o},ge(),Z=!0,window.setTimeout(()=>{Z=!1},250),f("UI position saved"),e.preventDefault(),e.stopPropagation()}}function Wt(e){return e instanceof Element&&!!e.closest("textarea, button, input, select")}function Jt(e,t){const n=r.getBoundingClientRect(),o=8,a=Math.max(o,window.innerWidth-n.width-o),s=Math.max(o,window.innerHeight-n.height-o);return{left:Math.min(Math.max(e,o),a),top:Math.min(Math.max(t,o),s)}}function Kt(e){if(!r.classList.contains("open")||e.button!==0||Wt(e.target))return;const t=r.getBoundingClientRect();$={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,startLeft:t.left,startTop:t.top},r.classList.add("dragging"),r.setPointerCapture(e.pointerId),e.preventDefault(),e.stopPropagation()}function Zt(e){if(!$||$.pointerId!==e.pointerId)return;const t=Jt($.startLeft+e.clientX-$.startX,$.startTop+e.clientY-$.startY);r.style.left=`${t.left}px`,r.style.top=`${t.top}px`,e.preventDefault(),e.stopPropagation()}function We(e){!$||$.pointerId!==e.pointerId||($=null,r.classList.remove("dragging"),r.hasPointerCapture(e.pointerId)&&r.releasePointerCapture(e.pointerId),e.preventDefault(),e.stopPropagation())}function Qt(){if(!document.getElementById(Me)){const e=document.createElement("style");e.id=Me,e.textContent=`
      html.opentargetui-motion-paused *,
      html.opentargetui-motion-paused *::before,
      html.opentargetui-motion-paused *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `,document.head.appendChild(e)}ce=Array.from(document.querySelectorAll("video, audio")).filter(e=>e instanceof HTMLMediaElement&&!e.paused?(e.pause(),!0):!1),document.documentElement.classList.add("opentargetui-motion-paused"),N=!0,f("Motion paused")}function en(){document.documentElement.classList.remove("opentargetui-motion-paused"),ce.forEach(e=>{e.play().catch(()=>{})}),ce=[],N=!1,f("Motion resumed")}async function B(){await fe(Ie(location.href),h)}async function tn(){i={...z,...await re(pe(),z),enabled:Re??!1},i.serverUrl=me(i.serverUrl),h=await re(Ie(location.href),[]),A=await re(Pe(location.href),null),xe(),ye(),d(),w(),M(!1),i.syncEnabled&&ke()}function ye(){S.style.display=i.enabled?"block":"none",!i.enabled&&(x=!1,v=!1,C=null,F=null,L=null,Ze(),T(),g(!1),M(!1))}function nn(e){const t=i.enabled;i={...z,...e,enabled:i.enabled,serverUrl:me(e.serverUrl||z.serverUrl)},xe(),ye(),d(),w(),i.enabled&&!t&&(O=!1),i.enabled&&(d(),p.classList.contains("open")&&g(!0)),i.syncEnabled?ke():ie()}async function Je(){if(A)return A;const e=await fetch(`${i.serverUrl}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:location.href,title:document.title})});if(!e.ok)throw new Error(`Session failed: ${e.status}`);const n=(await e.json()).id;return A=n,await fe(Pe(location.href),n),h=h.map(o=>({...o,sessionId:n})),await B(),n}async function ke(){try{ne=!1,Q=!1;const e=await Je();await Promise.all(h.map(t=>$e(t))),on(e),Pt(),f("Server connected")}catch(e){be(e,"Server unavailable")}}function ie(){Y?.close(),Y=null}function on(e){ie(),Y=new EventSource(`${i.serverUrl}/sessions/${e}/events`),Y.onmessage=t=>{const n=JSON.parse(t.data);n.type==="annotation.updated"&&n.data&&(h=h.map(o=>o.id===n.data?.id?n.data:o),B(),d(),w(),p.classList.contains("open")&&g(!0)),n.type==="annotation.deleted"&&n.annotationId&&(h=h.filter(o=>o.id!==n.annotationId),B(),d(),w(),p.classList.contains("open")&&g(!0))},Y.onerror=()=>{be(void 0,"Server events disconnected")}}async function $e(e){const t=await Je(),n=await fetch(`${i.serverUrl}/sessions/${t}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok)throw new Error(`Annotation sync failed: ${n.status}`)}async function an(e,t){const n=await fetch(`${i.serverUrl}/annotations/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(`Annotation update failed: ${n.status}`)}async function Ke(e){const t=await fetch(`${i.serverUrl}/annotations/${e}`,{method:"DELETE"});if(!t.ok)throw new Error(`Annotation delete failed: ${t.status}`)}function rn(e){const t=e.getBoundingClientRect();P.style.display="block",P.style.left=`${t.left}px`,P.style.top=`${t.top}px`,P.style.width=`${t.width}px`,P.style.height=`${t.height}px`}function Ze(){P.style.display="none"}function Ce(e){const t=e.target;return!(t instanceof Element)||t.closest("[data-opentargetui]")?null:t}function sn(e){if(!i.enabled||!x&&!v||ae(e))return;const t=Ce(e);t&&rn(t)}function ln(){i.enabled&&!x&&!v&&Ze()}async function cn(e){if(!i.enabled||ae(e))return;const t=Ce(e);if(!t&&!C)return;if(e.preventDefault(),e.stopPropagation(),!C){if(!t)return;const o=Be(t);C={element:t,rect:t.getBoundingClientRect(),path:o,label:nt(t)},d(),f("Click the destination");return}const n=Ot(C,e.clientX,e.clientY);h=[...h,n],v=!1,C=null,await B(),d(),w(),p.classList.contains("open")&&g(!0),i.syncEnabled&&V(()=>$e(n)),f("Move request added")}function dn(e){if(!i.enabled||!x||ae(e))return;const t=window.getSelection();if(!t||t.isCollapsed||t.toString().trim().length===0)return;const n=t.getRangeAt(0),o=n.getBoundingClientRect();if(o.width<=0||o.height<=0)return;const a=n.commonAncestorContainer.nodeType===Node.ELEMENT_NODE?n.commonAncestorContainer:n.commonAncestorContainer.parentElement;a instanceof Element&&(le=!0,Ye({element:a,rect:o,clientX:e.clientX,clientY:e.clientY,selectedText:t.toString().trim()}))}function un(e){if(!i.enabled)return;if(v){cn(e);return}if(!x||ae(e))return;if(le){le=!1,e.preventDefault(),e.stopPropagation();return}const t=Ce(e);t&&(i.blockPageInteractions&&(e.preventDefault(),e.stopPropagation()),Ye({element:t,rect:t.getBoundingClientRect(),clientX:e.clientX,clientY:e.clientY,selectedText:""}))}function pn(){i.enabled&&(w(),qe())}function U(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.addEventListener("mousemove",sn,!0);document.addEventListener("mouseout",ln,!0);document.addEventListener("mouseup",dn,!0);document.addEventListener("click",un,!0);document.addEventListener("keydown",Ft,!0);u.addEventListener("pointerdown",Gt);u.addEventListener("pointermove",Vt);u.addEventListener("pointerup",Ve);u.addEventListener("pointercancel",Ve);r.addEventListener("pointerdown",Kt);r.addEventListener("pointermove",Zt);r.addEventListener("pointerup",We);r.addEventListener("pointercancel",We);window.addEventListener("scroll",w,{passive:!0});window.addEventListener("resize",pn,{passive:!0});function hn(e,t,n){if(e.source!=="opentargetui-popup")return!1;if(e.type==="get-state")return n({ok:!0,enabled:i.enabled}),!0;if(e.type==="set-enabled"){const o=!!e.enabled;return Re=o,i={...i,enabled:o},ye(),d(),w(),o&&(O=!1,d()),n({ok:!0,enabled:o}),!0}return!1}try{typeof chrome<"u"&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener(hn),typeof chrome<"u"&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{if(t!=="local")return;const n=e[pe()];n?.newValue&&nn(n.newValue)})}catch(e){oe(e)?G=!0:console.warn("[OpenTarget UI] Message handler unavailable",e)}tn();
//# sourceMappingURL=content.js.map
