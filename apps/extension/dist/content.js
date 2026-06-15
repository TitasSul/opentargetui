const gt="opentargetui:v1";function It(t){const e=new URL(t);return`${gt}:page:${e.origin}${e.pathname}`}function At(t){const e=new URL(t);return`${gt}:session:${e.origin}${e.pathname}`}function D(){return`${gt}:settings`}const Kt=/(?:^|[-_])(?:[a-f0-9]{6,}|css|sc|module|chakra|mui|mantine|emotion)(?:[-_]|$)/i;function Pt(t){return globalThis.CSS&&typeof globalThis.CSS.escape=="function"?globalThis.CSS.escape(t):t.replace(/[^a-zA-Z0-9_-]/g,e=>`\\${e}`)}function ut(t,e){try{return e.querySelectorAll(t).length===1}catch{return!1}}function Zt(t){return Array.from(t.classList).filter(e=>e.length>=2&&!Kt.test(e)).slice(0,3).map(e=>`.${Pt(e)}`)}function Qt(t){const e=t.tagName.toLowerCase();let n=1,o=t.previousElementSibling;for(;o;)o.tagName.toLowerCase()===e&&(n+=1),o=o.previousElementSibling;return`${e}:nth-of-type(${n})`}function te(t){const e=t.tagName.toLowerCase(),n=(t.textContent??"").replace(/\s+/g," ").trim(),o=t.getAttribute("aria-label")?.trim(),i=t.getAttribute("alt")?.trim();if((e==="button"||e==="a")&&n)return`${e}[${n.slice(0,48)}]`;if(o)return`${e}[aria-label="${o.slice(0,48)}"]`;if(i)return`${e}[alt="${i.slice(0,48)}"]`;if(/^h[1-6]$/.test(e)&&n)return`${e}[${n.slice(0,48)}]`;const s=t.id?`#${t.id}`:"",c=Array.from(t.classList).slice(0,2).join(".");return`${e}${s}${c?`.${c}`:""}`}function ee(t,e=document){const n=t.tagName.toLowerCase();if(t.id){const i=`#${Pt(t.id)}`;if(ut(i,e))return i}const o=Zt(t).join("");if(o){const i=`${n}${o}`;if(ut(i,e))return i}return Qt(t)}function Bt(t,e=document){const n=[];let o=t;for(;o&&o.nodeType===Node.ELEMENT_NODE;){const i=ee(o,e);n.unshift(i);const s=n.join(" > ");if(ut(s,e))return s;if(o.tagName.toLowerCase()==="body")break;o=o.parentElement}return n.join(" > ")}function jt(t){const e=[],n=t.getAttribute("role"),o=t.getAttribute("aria-label"),i=t.getAttribute("aria-expanded"),s=t.getAttribute("aria-pressed"),c=t.hasAttribute("disabled")||t.getAttribute("aria-disabled")==="true";return n&&e.push(`role=${n}`),o&&e.push(`aria-label="${o}"`),i!==null&&e.push(`aria-expanded=${i}`),s!==null&&e.push(`aria-pressed=${s}`),c&&e.push("disabled=true"),e.join("; ")}function Nt(t,e=240){const n=(t.textContent||t.parentElement?.textContent||"").replace(/\s+/g," ").trim();return n.length>e?`${n.slice(0,e-1)}...`:n}function ne(t){const e=getComputedStyle(t);return["display","position","width","height","margin","padding","font-size","font-family","font-weight","line-height","color","background-color","border","border-radius","box-shadow","z-index"].map(o=>`${o}: ${e.getPropertyValue(o)};`).filter(o=>!o.endsWith(": ;")).join(`
`)}function m(t,e){return e==null||e===""?null:`**${t}:** ${String(e)}`}function Dt(t){if(!t.boundingBox)return null;const e=t.boundingBox;return`${Math.round(e.x)}px, ${Math.round(e.y)}px (${Math.round(e.width)}x${Math.round(e.height)}px)`}function St(t){return`${Math.round(t.x)}px, ${Math.round(t.y)}px (${Math.round(t.width)}x${Math.round(t.height)}px)`}function Et(t,e){return e?`**${t}:**

\`\`\`
${e.trim()}
\`\`\``:null}function z(t){const e=t.trim();return e?e.includes("`")?`\`\` ${e} \`\``:`\`${e}\``:""}function oe(t){return`"${t.replace(/\s+/g," ").trim()}"`}function ae(t){return[...new Set(t.map(e=>e?.trim()).filter(Boolean))]}function ie(t,e){const n=t.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);return n.length===0?[`${e+1}. Change the selected target`]:[`${e+1}. ${n[0]}`,...n.slice(1).map(o=>`   ${o}`)]}function re(t,e,n,o){const i=[...ie(t.comment,e),`   - Target: ${z(t.elementPath)}`,t.element?`   - Element: ${z(t.element)}`:null,o&&t.url?`   - URL: ${z(t.url)}`:null,t.selectedText?`   - Selected text: ${oe(t.selectedText)}`:null,t.rearrange?`   - Move from: ${z(St(t.rearrange.originalRect))}`:null,t.rearrange?`   - Move to: ${z(St(t.rearrange.currentRect))}`:null].filter(Boolean);if(n==="compact"||n==="standard"||(i.push(...[m("Position",Dt(t)),m("Classes",t.cssClasses),m("Accessibility",t.accessibility),m("Nearby Text",t.nearbyText)].filter(Boolean).map(c=>`   - ${c}`)),n==="detailed"))return i.join(`
`);const s=t.thread?.length?t.thread.map(c=>`     - ${c.role}: ${c.content}`).join(`
`):void 0;return i.push(...[m("Fixed/Sticky",t.isFixed),m("Full DOM Path",t.fullPath),t.computedStyles?`**Computed Styles:**

\`\`\`
${t.computedStyles.trim()}
\`\`\``:null,s?`**Thread:**
${s}`:null].filter(Boolean).map(c=>`   - ${c}`)),i.join(`
`)}function se(t,e){const n=e.detail??"standard",o=e.includeHeader??!0,i=[...t].sort(($,j)=>$.timestamp-j.timestamp);if(i.length===0)return"No annotations captured.";const s=ae(i.map($=>$.url)),c=s.length===1?s[0]:void 0,E=s.length>1;return`${o?`${["Implement these UI changes in one pass. Verify each target against the current DOM before editing.",c?`Page: ${z(c)}`:null].filter(Boolean).join(`
`)}

`:""}${i.map(($,j)=>re($,j,n,E)).join(`

`)}`}function le(t,e,n){if(n==="compact")return[`- **#${e+1} ${t.elementPath}**`,t.selectedText?`  - Selected text: "${t.selectedText}"`:null,`  - Feedback: ${t.comment}`].filter(Boolean).join(`
`);const o=[`## Annotation #${e+1}`,m("Element",t.element),m("Path",t.elementPath),m("URL",t.url),m("Selected Text",t.selectedText?`"${t.selectedText}"`:void 0),m("Feedback",t.comment)].filter(Boolean);if(n==="standard")return o.join(`

`);const i=[...o,m("Position",Dt(t)),m("Classes",t.cssClasses),m("Accessibility",t.accessibility),m("Nearby Text",t.nearbyText)].filter(Boolean);if(n==="detailed")return i.join(`

`);const s=t.thread?.length?t.thread.map(c=>`- ${c.role}: ${c.content}`).join(`
`):void 0;return[...i,m("Fixed/Sticky",t.isFixed),m("Full DOM Path",t.fullPath),Et("Computed Styles",t.computedStyles),Et("Thread",s)].filter(Boolean).join(`

`)}function ce(t,e={}){if(e.mode==="change-request")return se(t,e);const n=e.detail??"standard",o=[...t].sort((i,s)=>i.timestamp-s.timestamp);return o.length===0?"No annotations captured.":o.map((i,s)=>le(i,s,n)).join(`

`)}const de=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ue=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,pe=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,he=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,fe=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ge=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,me=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,be=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,xe=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ve=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,we=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ye=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ke=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,$e=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Ce=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Se=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,qt="opentargetui-root",Mt="opentargetui-pause-style",q={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0},Ee={check:de,clipboardList:ue,copy:pe,eye:he,eyeOff:fe,maximize:ge,message:me,mousePointer:be,panelClose:xe,pause:ve,play:we,server:ye,settings:ke,target:$e,trash:Ce,x:Se};function l(t){return Ee[t].replace(/<!--[\s\S]*?-->\s*/g,"").replace("<svg",'<svg aria-hidden="true" focusable="false"').replace('class="lucide','class="otu-icon lucide')}function Q(t){return typeof chrome<"u"&&chrome.runtime?.getURL?chrome.runtime.getURL(t.replace(/^\//,"")):t}function Me(){return`
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
  `}let a={...q},h=[],b=!1,v=!1,U=!0,N=!1,Y=null,L=null,P=null,_=null,C=null,y=null,k=null,mt=0,H=null,tt=!1,pt=!1,ht=[],W=!1,it=!1,et=!1;const Lt=document.getElementById(qt);Lt&&Lt.remove();const S=document.createElement("div");S.id=qt;S.setAttribute("data-opentargetui","root");S.style.all="initial";S.style.position="fixed";S.style.inset="0";S.style.zIndex="2147483647";S.style.pointerEvents="none";const I=S.attachShadow({mode:"open"});document.documentElement.appendChild(S);const nt=document.createElement("style");nt.textContent=`
  ${Me()}

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
    --otu-accent: ${q.markerColor};
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
`;I.appendChild(nt);const A=document.createElement("div");A.className="hover-frame";I.appendChild(A);const O=document.createElement("div");O.className="marker-layer";I.appendChild(O);const p=document.createElement("div");p.className="toolbar";I.appendChild(p);const r=document.createElement("div");r.className="panel composer";I.appendChild(r);const u=document.createElement("div");u.className="panel batch";I.appendChild(u);const x=document.createElement("div");x.className="panel settings";I.appendChild(x);const G=document.createElement("div");G.className="toast";I.appendChild(G);function Ut(){if(W)return!1;try{return typeof chrome<"u"&&!!chrome.runtime?.id&&!!chrome.storage?.local}catch(t){return rt(t)&&(W=!0),!1}}async function dt(t,e){if(!Ut())return e;try{return(await chrome.storage.local.get(t))[t]??e}catch(n){return rt(n)?W=!0:console.warn("[OpenTarget UI] Storage read failed",n),e}}async function R(t,e){if(Ut())try{await chrome.storage.local.set({[t]:e})}catch(n){rt(n)?W=!0:console.warn("[OpenTarget UI] Storage write failed",n)}}function bt(t){return t.trim().replace(/\/+$/,"")||q.serverUrl}function f(t){G.textContent=t,G.classList.add("show"),window.setTimeout(()=>G.classList.remove("show"),1600)}function rt(t){return t instanceof Error&&/extension context invalidated/i.test(t.message)}function Le(t){return t instanceof TypeError&&/failed to fetch/i.test(t.message)}function Te(){it=!1,et=!1}function xt(t,e){ct(),it=!0,et||(et=!0,f(e),t&&!Le(t)&&console.warn("[OpenTarget UI] Server sync failed",t))}function J(t){it||t().catch(e=>xt(e,"Saved locally; server unavailable"))}function st(t){return t.composedPath().includes(S)||t.composedPath().includes(I)}function vt(){nt.textContent=nt.textContent?.replace(/--otu-accent: #[0-9a-fA-F]{6};/,`--otu-accent: ${a.markerColor};`)??""}function K(){return h.filter(t=>t.status!=="dismissed"&&t.status!=="resolved")}function Ie(){const t=K().length;return`${t} ${t===1?"note":"notes"}`}function V(){return mt>Date.now()}function wt(){mt=0,H!==null&&(window.clearTimeout(H),H=null)}function Ae(){mt=Date.now()+3200,H!==null&&window.clearTimeout(H),H=window.setTimeout(()=>{wt(),d(),u.classList.contains("open")&&g(!0)},3200)}function Pe(t,e="Untitled change"){return t.replace(/\s+/g," ").trim()||e}function Z(t,e,n,o,i=10){const s=Math.max(i,window.innerWidth-n-i),c=Math.max(i,window.innerHeight-o-i);return{left:Math.min(Math.max(t,i),s),top:Math.min(Math.max(e,i),c)}}function Be(){const t=p.getBoundingClientRect(),e=t.width||Math.min(360,window.innerWidth-28),n=t.height||180;return Z(window.innerWidth-e-18,window.innerHeight-n-18,e,n)}function yt(t,e){t.style.left=`${e.left}px`,t.style.top=`${e.top}px`,t.style.right="auto",t.style.bottom="auto"}function Rt(){const t=p.getBoundingClientRect(),e=t.width||Math.min(360,window.innerWidth-28),n=t.height||180,o=a.uiPosition?Z(a.uiPosition.left,a.uiPosition.top,e,n):Be();yt(p,o),zt()}function ot(t){if(!t.classList.contains("open"))return;const e=p.getBoundingClientRect(),n=t.getBoundingClientRect(),o=10,i=n.width||360,s=n.height||240,c=e.right-i;let E=e.top-s-o;E<10&&(E=e.bottom+o),yt(t,Z(c,E,i,s))}function zt(){ot(u),ot(x)}function ft(t){return t.charAt(0).toUpperCase()+t.slice(1)}function je(t){return{fix:"Fix issue",change:"Change design",question:"Ask question",approve:"Approve"}[t]}function d(){if(!a.enabled){p.innerHTML="";return}p.className=`toolbar${U?" collapsed":""}`,U?p.innerHTML=`
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
            <div class="brand-meta">${Ie()} on this page</div>
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
    `,p.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",e=>{if(tt){tt=!1,e.preventDefault(),e.stopPropagation();return}Ot(t.dataset.action??"")})}),Rt()}function w(){if(O.innerHTML="",!a.enabled){O.style.display="none";return}O.style.display=a.hideMarkers?"none":"block",h.forEach((t,e)=>{if(t.status==="dismissed")return;const n=document.createElement("button");n.className="marker",n.type="button",n.dataset.id=t.id,n.dataset.status=t.status??"pending",n.textContent=String(e+1),n.title=t.comment,n.style.left=`${t.x}%`,n.style.top=`${t.isFixed?t.y:t.y-window.scrollY}px`,n.style.setProperty("--otu-accent",a.markerColor),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Yt(t.id)}),O.appendChild(n)})}function g(t=!1){if(u.className=`panel batch${t?" open":""}`,!t){u.innerHTML="";return}const e=K(),n=V();u.innerHTML=`
    <div class="panel-header">
      <h2 class="panel-title">${l("clipboardList")} Review batch</h2>
      <button class="icon-button" data-batch-close aria-label="Close batch manager" data-tooltip="Close">
        ${l("x")}
      </button>
    </div>
    <div class="batch-summary">
      ${e.length>0?`${e.length} ${e.length===1?"change":"changes"} ready for the copied request.`:"No changes in this page batch yet."}
    </div>
    ${e.length>0?`<div class="batch-list">
            ${e.map((o,i)=>`
                  <article class="batch-item">
                    <div class="batch-item-header">
                      <span class="batch-index">${i+1}</span>
                      <div class="batch-comment">${F(Pe(o.comment))}</div>
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
      <button class="command danger" data-batch-clear ${e.length===0?"disabled":""}>${l("trash")} ${n?"Confirm clear":"Clear all"}</button>
      <button class="command primary" data-batch-copy ${e.length===0?"disabled":""}>${l("copy")} Copy request</button>
    </div>
  `,u.querySelector("[data-batch-close]")?.addEventListener("click",()=>{g(!1),d()}),u.querySelector("[data-batch-copy]")?.addEventListener("click",()=>{lt()}),u.querySelector("[data-batch-clear]")?.addEventListener("click",()=>{Ot("clear")}),u.querySelectorAll("[data-batch-edit]").forEach(o=>{o.addEventListener("click",()=>{g(!1),d(),Yt(o.dataset.batchEdit??"")})}),u.querySelectorAll("[data-batch-delete]").forEach(o=>{o.addEventListener("click",()=>{Ft(o.dataset.batchDelete??"")})}),ot(u)}function M(t=!1){x.className=`panel settings${t?" open":""}`,x.innerHTML=`
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
          ${["compact","standard","detailed","forensic"].map(e=>`<option value="${e}" ${a.outputDetail===e?"selected":""}>${ft(e)}</option>`).join("")}
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
  `,x.querySelector("[data-settings-close]")?.addEventListener("click",()=>{M(!1)}),x.querySelector("[data-settings-save]")?.addEventListener("click",async()=>{const e=x.querySelector("#otu-output-detail")?.value,n=x.querySelector("#otu-marker-color")?.value||a.markerColor,o=bt(x.querySelector("#otu-server-url")?.value||a.serverUrl),i=!!x.querySelector("#otu-sync")?.checked,s=!!x.querySelector("#otu-copy-add")?.checked,c=!!x.querySelector("#otu-block")?.checked;a={...a,outputDetail:e,markerColor:n,serverUrl:o,syncEnabled:i,copyOnAdd:s,blockPageInteractions:c},await R(D(),a),vt(),d(),w(),M(!1),a.syncEnabled?kt():ct(),f("Settings saved")}),ot(x)}async function Ot(t){if(a.enabled){if(t==="expand"){U=!1,d();return}if(t==="collapse"){U=!0,b=!1,v=!1,k=null,T(),g(!1),M(!1),d();return}if(t==="select"){b=!b,v=!1,k=null,g(!1),M(!1),d(),f(b?"Click or select text to annotate":"Targeting off");return}if(t==="move"){v=!v,k=null,b=!1,T(),g(!1),M(!1),d(),f(v?"Click the item to move":"Move mode off");return}if(t==="batch"){const e=!u.classList.contains("open");M(!1),g(e),d();return}if(t==="hide"){a={...a,hideMarkers:!a.hideMarkers},await R(D(),a),d(),w();return}if(t==="pause"){N?Ke():Je(),d();return}if(t==="copy"){await lt();return}if(t==="clear"){if(K().length===0){wt(),d(),u.classList.contains("open")&&g(!0),f("No annotations to clear");return}if(!V()){Ae(),d(),u.classList.contains("open")&&g(!0),f("Click clear again to delete notes");return}await Ne();return}t==="settings"&&(g(!1),M(!x.classList.contains("open")))}}async function Ne(){const t=h;h=[],wt(),await B(),d(),w(),u.classList.contains("open")&&g(!0),f("Annotations cleared"),a.syncEnabled&&t.forEach(e=>J(()=>Wt(e.id)))}async function Ft(t){!t||!h.find(n=>n.id===t)||(h=h.filter(n=>n.id!==t),await B(),d(),w(),u.classList.contains("open")&&g(!0),L===t&&T(),f("Annotation deleted"),a.syncEnabled&&J(()=>Wt(t)))}function De(t){let e=t;for(;e&&e!==document.documentElement;){const n=getComputedStyle(e).position;if(n==="fixed"||n==="sticky")return!0;e=e.parentElement}return!1}function qe(t,e,n,o){const i=t.rect,s=De(t.element),c=i.left+i.width/2,E=i.top+i.height/2,X=Bt(t.element),$=Date.now(),j={id:`otu_${$.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:e,elementPath:X,timestamp:$,x:Math.max(0,Math.min(100,c/Math.max(window.innerWidth,1)*100)),y:s?E:E+window.scrollY,element:t.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:{x:i.left+window.scrollX,y:i.top+window.scrollY,width:i.width,height:i.height},cssClasses:Array.from(t.element.classList).join(" "),computedStyles:ne(t.element),accessibility:jt(t.element),nearbyText:Nt(t.element),isFixed:s,fullPath:X,intent:n,severity:o,kind:"feedback",status:"pending",thread:[]};return t.selectedText&&(j.selectedText=t.selectedText),P&&(j.sessionId=P),j}function Ue(t){return{x:t.left+window.scrollX,y:t.top+window.scrollY,width:t.width,height:t.height}}function Re(t,e,n){const o=Date.now(),i=Math.max(t.rect.width,1),s=Math.max(t.rect.height,1),c={x:e+window.scrollX-i/2,y:n+window.scrollY-s/2,width:i,height:s},E=c.x-window.scrollX+i/2,X=c.y-window.scrollY+s/2,$={id:`otu_${o.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:`Move ${t.label} to the pointed position`,elementPath:t.path,timestamp:o,x:Math.max(0,Math.min(100,E/Math.max(window.innerWidth,1)*100)),y:X+window.scrollY,element:t.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:c,cssClasses:Array.from(t.element.classList).join(" "),accessibility:jt(t.element),nearbyText:Nt(t.element),isFixed:!1,fullPath:t.path,intent:"change",severity:"important",kind:"rearrange",rearrange:{selector:t.path,label:t.label,tagName:t.element.tagName.toLowerCase(),originalRect:Ue(t.rect),currentRect:c},status:"pending",thread:[]};return P&&($.sessionId=P),$}function Ht(t){Y=t,L=null,r.className="panel composer open",r.dataset.mode="create",r.style.left=`${Math.min(t.clientX+12,window.innerWidth-376)}px`,r.style.top=`${Math.min(t.clientY+12,window.innerHeight-260)}px`,r.innerHTML=`
    <textarea id="otu-comment" placeholder="Type the change for this target"></textarea>
    <div class="button-row">
      <button class="command" data-merge>${l("message")} Merge</button>
      <button class="command primary" data-copy>${l("copy")} Copy</button>
    </div>
  `,r.querySelector("#otu-comment")?.focus(),r.querySelector("[data-merge]")?.addEventListener("click",()=>{Tt({copyAfter:!1})}),r.querySelector("[data-copy]")?.addEventListener("click",()=>{Tt({copyAfter:!0})})}function Yt(t){const e=h.find(n=>n.id===t);e&&(Y=null,L=t,r.className="panel composer open",r.dataset.mode="edit",r.style.left="18px",r.style.top="18px",r.innerHTML=`
    <div class="panel-header">
      <div class="panel-title">${l("message")} Edit annotation</div>
      <button class="icon-button" data-cancel aria-label="Close annotation editor" data-tooltip="Close">
        ${l("x")}
      </button>
    </div>
    <div class="target-card">
      <strong>${F(e.elementPath)}</strong>
      <span>${ft(e.status??"pending")} note</span>
    </div>
    <textarea id="otu-comment">${F(e.comment)}</textarea>
    <div class="field-row">
      <label class="form-field">
        Intent
        <select id="otu-intent">
          ${["fix","change","question","approve"].map(n=>`<option value="${n}" ${e.intent===n?"selected":""}>${je(n)}</option>`).join("")}
        </select>
      </label>
      <label class="form-field">
        Priority
        <select id="otu-severity">
          ${["important","blocking","suggestion"].map(n=>`<option value="${n}" ${e.severity===n?"selected":""}>${ft(n)}</option>`).join("")}
        </select>
      </label>
    </div>
    <div class="button-row">
      <button class="command danger" data-delete>${l("trash")} Delete</button>
      <button class="command" data-cancel>${l("x")} Close</button>
      <button class="command primary" data-save>${l("check")} Save note</button>
    </div>
  `,r.querySelector("[data-cancel]")?.addEventListener("click",T),r.querySelector("[data-delete]")?.addEventListener("click",Fe),r.querySelector("[data-save]")?.addEventListener("click",Oe))}function T(){Y=null,L=null,C=null,r.className="panel composer",delete r.dataset.mode,r.innerHTML=""}function ze(t){t.key==="Escape"&&(!r.classList.contains("open")||r.dataset.mode!=="create"||(t.preventDefault(),t.stopPropagation(),T()))}async function Tt(t){if(!Y)return;const e=r.querySelector("#otu-comment")?.value.trim()??"";if(!e){f("Type a change first");return}const n=qe(Y,e,"change","important");if(t.copyAfter){await Xt([...K(),n],!1),T(),f("Copied without marker");return}h=[...h,n],await B(),d(),w(),u.classList.contains("open")&&g(!0),T(),a.syncEnabled&&J(()=>$t(n)),a.copyOnAdd?(await lt(!1),f("Merged and copied")):f("Merged into batch")}async function Oe(){if(!L)return;const t=L,e=r.querySelector("#otu-comment")?.value.trim()??"";if(!e){f("Comment cannot be empty");return}const n=r.querySelector("#otu-intent")?.value??"fix",o=r.querySelector("#otu-severity")?.value??"important",i=new Date().toISOString();h=h.map(s=>s.id===t?{...s,comment:e,intent:n,severity:o,updatedAt:i}:s),await B(),d(),w(),u.classList.contains("open")&&g(!0),T(),a.syncEnabled&&J(()=>en(t,{comment:e,intent:n,severity:o,updatedAt:i}))}async function Fe(){L&&await Ft(L)}async function lt(t=!0){return Xt(K(),t)}async function Xt(t,e=!0){if(t.length===0)return e&&f("No changes to copy"),!1;const n=ce(t,{mode:"change-request",detail:a.outputDetail,includeHeader:!0});return await navigator.clipboard.writeText(n),e&&f("Change request copied"),!0}function He(t){return!(t instanceof Element)||t.closest(".toolbar-header .icon-button")?!1:!!t.closest(".toolbar-header, .collapsed-button")}function Ye(t){if(t.button!==0||!He(t.target))return;const e=p.getBoundingClientRect();y={pointerId:t.pointerId,startX:t.clientX,startY:t.clientY,startLeft:e.left,startTop:e.top,moved:!1}}function Xe(t){if(!y||y.pointerId!==t.pointerId)return;const e=t.clientX-y.startX,n=t.clientY-y.startY;if(!y.moved&&Math.hypot(e,n)<4)return;y.moved=!0,p.classList.add("dragging"),p.hasPointerCapture(t.pointerId)||p.setPointerCapture(t.pointerId);const o=p.getBoundingClientRect(),i=Z(y.startLeft+e,y.startTop+n,o.width,o.height);yt(p,i),zt(),t.preventDefault(),t.stopPropagation()}function _t(t){if(!y||y.pointerId!==t.pointerId)return;const e=y.moved;if(y=null,p.classList.remove("dragging"),p.hasPointerCapture(t.pointerId)&&p.releasePointerCapture(t.pointerId),e){const n=p.getBoundingClientRect(),o=Z(n.left,n.top,n.width,n.height);a={...a,uiPosition:o},R(D(),a),tt=!0,window.setTimeout(()=>{tt=!1},250),f("UI position saved"),t.preventDefault(),t.stopPropagation()}}function _e(t){return t instanceof Element&&!!t.closest("textarea, button, input, select")}function Ge(t,e){const n=r.getBoundingClientRect(),o=8,i=Math.max(o,window.innerWidth-n.width-o),s=Math.max(o,window.innerHeight-n.height-o);return{left:Math.min(Math.max(t,o),i),top:Math.min(Math.max(e,o),s)}}function Ve(t){if(!r.classList.contains("open")||t.button!==0||_e(t.target))return;const e=r.getBoundingClientRect();C={pointerId:t.pointerId,startX:t.clientX,startY:t.clientY,startLeft:e.left,startTop:e.top},r.classList.add("dragging"),r.setPointerCapture(t.pointerId),t.preventDefault(),t.stopPropagation()}function We(t){if(!C||C.pointerId!==t.pointerId)return;const e=Ge(C.startLeft+t.clientX-C.startX,C.startTop+t.clientY-C.startY);r.style.left=`${e.left}px`,r.style.top=`${e.top}px`,t.preventDefault(),t.stopPropagation()}function Gt(t){!C||C.pointerId!==t.pointerId||(C=null,r.classList.remove("dragging"),r.hasPointerCapture(t.pointerId)&&r.releasePointerCapture(t.pointerId),t.preventDefault(),t.stopPropagation())}function Je(){if(!document.getElementById(Mt)){const t=document.createElement("style");t.id=Mt,t.textContent=`
      html.opentargetui-motion-paused *,
      html.opentargetui-motion-paused *::before,
      html.opentargetui-motion-paused *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `,document.head.appendChild(t)}ht=Array.from(document.querySelectorAll("video, audio")).filter(t=>t instanceof HTMLMediaElement&&!t.paused?(t.pause(),!0):!1),document.documentElement.classList.add("opentargetui-motion-paused"),N=!0,f("Motion paused")}function Ke(){document.documentElement.classList.remove("opentargetui-motion-paused"),ht.forEach(t=>{t.play().catch(()=>{})}),ht=[],N=!1,f("Motion resumed")}async function B(){await R(It(location.href),h)}async function Ze(){a={...q,...await dt(D(),q)},a.serverUrl=bt(a.serverUrl),h=await dt(It(location.href),[]),P=await dt(At(location.href),null),vt(),at(),d(),w(),M(!1),a.syncEnabled&&kt()}function at(){S.style.display=a.enabled?"block":"none",!a.enabled&&(b=!1,v=!1,k=null,Y=null,L=null,Jt(),T(),g(!1),M(!1))}function Qe(t){const e=a.enabled;a={...q,...t,serverUrl:bt(t.serverUrl||q.serverUrl)},vt(),at(),d(),w(),a.enabled&&!e&&(U=!1),a.enabled&&(d(),u.classList.contains("open")&&g(!0)),a.syncEnabled?kt():ct()}async function Vt(){if(P)return P;const t=await fetch(`${a.serverUrl}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:location.href,title:document.title})});if(!t.ok)throw new Error(`Session failed: ${t.status}`);const n=(await t.json()).id;return P=n,await R(At(location.href),n),h=h.map(o=>({...o,sessionId:n})),await B(),n}async function kt(){try{it=!1,et=!1;const t=await Vt();await Promise.all(h.map(e=>$t(e))),tn(t),Te(),f("Server connected")}catch(t){xt(t,"Server unavailable")}}function ct(){_?.close(),_=null}function tn(t){ct(),_=new EventSource(`${a.serverUrl}/sessions/${t}/events`),_.onmessage=e=>{const n=JSON.parse(e.data);n.type==="annotation.updated"&&n.data&&(h=h.map(o=>o.id===n.data?.id?n.data:o),B(),d(),w(),u.classList.contains("open")&&g(!0)),n.type==="annotation.deleted"&&n.annotationId&&(h=h.filter(o=>o.id!==n.annotationId),B(),d(),w(),u.classList.contains("open")&&g(!0))},_.onerror=()=>{xt(void 0,"Server events disconnected")}}async function $t(t){const e=await Vt(),n=await fetch(`${a.serverUrl}/sessions/${e}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(`Annotation sync failed: ${n.status}`)}async function en(t,e){const n=await fetch(`${a.serverUrl}/annotations/${t}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok)throw new Error(`Annotation update failed: ${n.status}`)}async function Wt(t){const e=await fetch(`${a.serverUrl}/annotations/${t}`,{method:"DELETE"});if(!e.ok)throw new Error(`Annotation delete failed: ${e.status}`)}function nn(t){const e=t.getBoundingClientRect();A.style.display="block",A.style.left=`${e.left}px`,A.style.top=`${e.top}px`,A.style.width=`${e.width}px`,A.style.height=`${e.height}px`}function Jt(){A.style.display="none"}function Ct(t){const e=t.target;return!(e instanceof Element)||e.closest("[data-opentargetui]")?null:e}function on(t){if(!a.enabled||!b&&!v||st(t))return;const e=Ct(t);e&&nn(e)}function an(){a.enabled&&!b&&!v&&Jt()}async function rn(t){if(!a.enabled||st(t))return;const e=Ct(t);if(!e&&!k)return;if(t.preventDefault(),t.stopPropagation(),!k){if(!e)return;const o=Bt(e);k={element:e,rect:e.getBoundingClientRect(),path:o,label:te(e)},d(),f("Click the destination");return}const n=Re(k,t.clientX,t.clientY);h=[...h,n],v=!1,k=null,await B(),d(),w(),u.classList.contains("open")&&g(!0),a.syncEnabled&&J(()=>$t(n)),f("Move request added")}function sn(t){if(!a.enabled||!b||st(t))return;const e=window.getSelection();if(!e||e.isCollapsed||e.toString().trim().length===0)return;const n=e.getRangeAt(0),o=n.getBoundingClientRect();if(o.width<=0||o.height<=0)return;const i=n.commonAncestorContainer.nodeType===Node.ELEMENT_NODE?n.commonAncestorContainer:n.commonAncestorContainer.parentElement;i instanceof Element&&(pt=!0,Ht({element:i,rect:o,clientX:t.clientX,clientY:t.clientY,selectedText:e.toString().trim()}))}function ln(t){if(!a.enabled)return;if(v){rn(t);return}if(!b||st(t))return;if(pt){pt=!1,t.preventDefault(),t.stopPropagation();return}const e=Ct(t);e&&(a.blockPageInteractions&&(t.preventDefault(),t.stopPropagation()),Ht({element:e,rect:e.getBoundingClientRect(),clientX:t.clientX,clientY:t.clientY,selectedText:""}))}function cn(){a.enabled&&(w(),Rt())}function F(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.addEventListener("mousemove",on,!0);document.addEventListener("mouseout",an,!0);document.addEventListener("mouseup",sn,!0);document.addEventListener("click",ln,!0);document.addEventListener("keydown",ze,!0);p.addEventListener("pointerdown",Ye);p.addEventListener("pointermove",Xe);p.addEventListener("pointerup",_t);p.addEventListener("pointercancel",_t);r.addEventListener("pointerdown",Ve);r.addEventListener("pointermove",We);r.addEventListener("pointerup",Gt);r.addEventListener("pointercancel",Gt);window.addEventListener("scroll",w,{passive:!0});window.addEventListener("resize",cn,{passive:!0});function dn(t,e,n){if(t.source!=="opentargetui-popup")return!1;if(t.type==="set-enabled"){const o=!!t.enabled;return a={...a,enabled:o},R(D(),a),at(),d(),w(),o&&(U=!1,d()),n({ok:!0,enabled:o}),!0}return t.type==="toggle-selection"?(a.enabled||(a={...a,enabled:!0},R(D(),a),at()),b=!b,v=!1,k=null,U=!1,g(!1),M(!1),d(),n({ok:!0}),!0):t.type==="copy-feedback"?(lt().then(o=>n({ok:o,copied:o})),!0):!1}try{typeof chrome<"u"&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener(dn),typeof chrome<"u"&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((t,e)=>{if(e!=="local")return;const n=t[D()];n?.newValue&&Qe(n.newValue)})}catch(t){rt(t)?W=!0:console.warn("[OpenTarget UI] Message handler unavailable",t)}Ze();
//# sourceMappingURL=content.js.map
