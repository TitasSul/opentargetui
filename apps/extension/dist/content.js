const ht="opentargetui:v1";function Et(t){const e=new URL(t);return`${ht}:page:${e.origin}${e.pathname}`}function Mt(t){const e=new URL(t);return`${ht}:session:${e.origin}${e.pathname}`}function ot(){return`${ht}:settings`}const Vt=/(?:^|[-_])(?:[a-f0-9]{6,}|css|sc|module|chakra|mui|mantine|emotion)(?:[-_]|$)/i;function Lt(t){return globalThis.CSS&&typeof globalThis.CSS.escape=="function"?globalThis.CSS.escape(t):t.replace(/[^a-zA-Z0-9_-]/g,e=>`\\${e}`)}function ct(t,e){try{return e.querySelectorAll(t).length===1}catch{return!1}}function Jt(t){return Array.from(t.classList).filter(e=>e.length>=2&&!Vt.test(e)).slice(0,3).map(e=>`.${Lt(e)}`)}function Kt(t){const e=t.tagName.toLowerCase();let n=1,o=t.previousElementSibling;for(;o;)o.tagName.toLowerCase()===e&&(n+=1),o=o.previousElementSibling;return`${e}:nth-of-type(${n})`}function Zt(t){const e=t.tagName.toLowerCase(),n=(t.textContent??"").replace(/\s+/g," ").trim(),o=t.getAttribute("aria-label")?.trim(),a=t.getAttribute("alt")?.trim();if((e==="button"||e==="a")&&n)return`${e}[${n.slice(0,48)}]`;if(o)return`${e}[aria-label="${o.slice(0,48)}"]`;if(a)return`${e}[alt="${a.slice(0,48)}"]`;if(/^h[1-6]$/.test(e)&&n)return`${e}[${n.slice(0,48)}]`;const s=t.id?`#${t.id}`:"",c=Array.from(t.classList).slice(0,2).join(".");return`${e}${s}${c?`.${c}`:""}`}function Qt(t,e=document){const n=t.tagName.toLowerCase();if(t.id){const a=`#${Lt(t.id)}`;if(ct(a,e))return a}const o=Jt(t).join("");if(o){const a=`${n}${o}`;if(ct(a,e))return a}return Kt(t)}function Tt(t,e=document){const n=[];let o=t;for(;o&&o.nodeType===Node.ELEMENT_NODE;){const a=Qt(o,e);n.unshift(a);const s=n.join(" > ");if(ct(s,e))return s;if(o.tagName.toLowerCase()==="body")break;o=o.parentElement}return n.join(" > ")}function It(t){const e=[],n=t.getAttribute("role"),o=t.getAttribute("aria-label"),a=t.getAttribute("aria-expanded"),s=t.getAttribute("aria-pressed"),c=t.hasAttribute("disabled")||t.getAttribute("aria-disabled")==="true";return n&&e.push(`role=${n}`),o&&e.push(`aria-label="${o}"`),a!==null&&e.push(`aria-expanded=${a}`),s!==null&&e.push(`aria-pressed=${s}`),c&&e.push("disabled=true"),e.join("; ")}function At(t,e=240){const n=(t.textContent||t.parentElement?.textContent||"").replace(/\s+/g," ").trim();return n.length>e?`${n.slice(0,e-1)}...`:n}function te(t){const e=getComputedStyle(t);return["display","position","width","height","margin","padding","font-size","font-family","font-weight","line-height","color","background-color","border","border-radius","box-shadow","z-index"].map(o=>`${o}: ${e.getPropertyValue(o)};`).filter(o=>!o.endsWith(": ;")).join(`
`)}function m(t,e){return e==null||e===""?null:`**${t}:** ${String(e)}`}function Pt(t){if(!t.boundingBox)return null;const e=t.boundingBox;return`${Math.round(e.x)}px, ${Math.round(e.y)}px (${Math.round(e.width)}x${Math.round(e.height)}px)`}function yt(t){return`${Math.round(t.x)}px, ${Math.round(t.y)}px (${Math.round(t.width)}x${Math.round(t.height)}px)`}function kt(t,e){return e?`**${t}:**

\`\`\`
${e.trim()}
\`\`\``:null}function D(t){const e=t.trim();return e?e.includes("`")?`\`\` ${e} \`\``:`\`${e}\``:""}function ee(t){return`"${t.replace(/\s+/g," ").trim()}"`}function ne(t){return[...new Set(t.map(e=>e?.trim()).filter(Boolean))]}function oe(t,e){const n=t.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);return n.length===0?[`${e+1}. Change the selected target`]:[`${e+1}. ${n[0]}`,...n.slice(1).map(o=>`   ${o}`)]}function ae(t,e,n,o){const a=[...oe(t.comment,e),`   - Target: ${D(t.elementPath)}`,t.element?`   - Element: ${D(t.element)}`:null,o&&t.url?`   - URL: ${D(t.url)}`:null,t.selectedText?`   - Selected text: ${ee(t.selectedText)}`:null,t.rearrange?`   - Move from: ${D(yt(t.rearrange.originalRect))}`:null,t.rearrange?`   - Move to: ${D(yt(t.rearrange.currentRect))}`:null].filter(Boolean);if(n==="compact"||n==="standard"||(a.push(...[m("Position",Pt(t)),m("Classes",t.cssClasses),m("Accessibility",t.accessibility),m("Nearby Text",t.nearbyText)].filter(Boolean).map(c=>`   - ${c}`)),n==="detailed"))return a.join(`
`);const s=t.thread?.length?t.thread.map(c=>`     - ${c.role}: ${c.content}`).join(`
`):void 0;return a.push(...[m("Fixed/Sticky",t.isFixed),m("Full DOM Path",t.fullPath),t.computedStyles?`**Computed Styles:**

\`\`\`
${t.computedStyles.trim()}
\`\`\``:null,s?`**Thread:**
${s}`:null].filter(Boolean).map(c=>`   - ${c}`)),a.join(`
`)}function ie(t,e){const n=e.detail??"standard",o=e.includeHeader??!0,a=[...t].sort((k,j)=>k.timestamp-j.timestamp);if(a.length===0)return"No annotations captured.";const s=ne(a.map(k=>k.url)),c=s.length===1?s[0]:void 0,S=s.length>1;return`${o?`${["Implement these UI changes in one pass. Verify each target against the current DOM before editing.",c?`Page: ${D(c)}`:null].filter(Boolean).join(`
`)}

`:""}${a.map((k,j)=>ae(k,j,n,S)).join(`

`)}`}function re(t,e,n){if(n==="compact")return[`- **#${e+1} ${t.elementPath}**`,t.selectedText?`  - Selected text: "${t.selectedText}"`:null,`  - Feedback: ${t.comment}`].filter(Boolean).join(`
`);const o=[`## Annotation #${e+1}`,m("Element",t.element),m("Path",t.elementPath),m("URL",t.url),m("Selected Text",t.selectedText?`"${t.selectedText}"`:void 0),m("Feedback",t.comment)].filter(Boolean);if(n==="standard")return o.join(`

`);const a=[...o,m("Position",Pt(t)),m("Classes",t.cssClasses),m("Accessibility",t.accessibility),m("Nearby Text",t.nearbyText)].filter(Boolean);if(n==="detailed")return a.join(`

`);const s=t.thread?.length?t.thread.map(c=>`- ${c.role}: ${c.content}`).join(`
`):void 0;return[...a,m("Fixed/Sticky",t.isFixed),m("Full DOM Path",t.fullPath),kt("Computed Styles",t.computedStyles),kt("Thread",s)].filter(Boolean).join(`

`)}function se(t,e={}){if(e.mode==="change-request")return ie(t,e);const n=e.detail??"standard",o=[...t].sort((a,s)=>a.timestamp-s.timestamp);return o.length===0?"No annotations captured.":o.map((a,s)=>re(a,s,n)).join(`

`)}const le=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ce=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,de=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ue=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,pe=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,he=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,fe=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ge=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,me=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,be=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,xe=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ve=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,we=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ye=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ke=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,$e=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Bt="opentargetui-root",$t="opentargetui-pause-style",H={enabled:!0,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0},Ce={check:le,clipboardList:ce,copy:de,eye:ue,eyeOff:pe,maximize:he,message:fe,mousePointer:ge,panelClose:me,pause:be,play:xe,server:ve,settings:we,target:ye,trash:ke,x:$e};function l(t){return Ce[t].replace(/<!--[\s\S]*?-->\s*/g,"").replace("<svg",'<svg aria-hidden="true" focusable="false"').replace('class="lucide','class="otu-icon lucide')}function Z(t){return typeof chrome<"u"&&chrome.runtime?.getURL?chrome.runtime.getURL(t.replace(/^\//,"")):t}function Se(){return`
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
  `}let i={...H},h=[],x=!1,v=!1,X=!0,N=!1,_=null,A=null,I=null,O=null,$=null,w=null,C=null,ft=0,R=null,Q=!1,dt=!1,ut=[],G=!1,at=!1,tt=!1;const Ct=document.getElementById(Bt);Ct&&Ct.remove();const E=document.createElement("div");E.id=Bt;E.setAttribute("data-opentargetui","root");E.style.all="initial";E.style.position="fixed";E.style.inset="0";E.style.zIndex="2147483647";E.style.pointerEvents="none";const L=E.attachShadow({mode:"open"});document.documentElement.appendChild(E);const et=document.createElement("style");et.textContent=`
  ${Se()}

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
    --otu-accent: ${H.markerColor};
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
`;L.appendChild(et);const T=document.createElement("div");T.className="hover-frame";L.appendChild(T);const U=document.createElement("div");U.className="marker-layer";L.appendChild(U);const u=document.createElement("div");u.className="toolbar";L.appendChild(u);const r=document.createElement("div");r.className="panel composer";L.appendChild(r);const d=document.createElement("div");d.className="panel batch";L.appendChild(d);const b=document.createElement("div");b.className="panel settings";L.appendChild(b);const F=document.createElement("div");F.className="toast";L.appendChild(F);function jt(){if(G)return!1;try{return typeof chrome<"u"&&!!chrome.runtime?.id&&!!chrome.storage?.local}catch(t){return it(t)&&(G=!0),!1}}async function lt(t,e){if(!jt())return e;try{return(await chrome.storage.local.get(t))[t]??e}catch(n){return it(n)?G=!0:console.warn("[OpenTarget UI] Storage read failed",n),e}}async function W(t,e){if(jt())try{await chrome.storage.local.set({[t]:e})}catch(n){it(n)?G=!0:console.warn("[OpenTarget UI] Storage write failed",n)}}function Nt(t){return t.trim().replace(/\/+$/,"")||H.serverUrl}function f(t){F.textContent=t,F.classList.add("show"),window.setTimeout(()=>F.classList.remove("show"),1600)}function it(t){return t instanceof Error&&/extension context invalidated/i.test(t.message)}function Ee(t){return t instanceof TypeError&&/failed to fetch/i.test(t.message)}function Me(){at=!1,tt=!1}function gt(t,e){xt(),at=!0,tt||(tt=!0,f(e),t&&!Ee(t)&&console.warn("[OpenTarget UI] Server sync failed",t))}function V(t){at||t().catch(e=>gt(e,"Saved locally; server unavailable"))}function rt(t){return t.composedPath().includes(E)||t.composedPath().includes(L)}function Dt(){et.textContent=et.textContent?.replace(/--otu-accent: #[0-9a-fA-F]{6};/,`--otu-accent: ${i.markerColor};`)??""}function J(){return h.filter(t=>t.status!=="dismissed"&&t.status!=="resolved")}function Le(){const t=J().length;return`${t} ${t===1?"note":"notes"}`}function Y(){return ft>Date.now()}function mt(){ft=0,R!==null&&(window.clearTimeout(R),R=null)}function Te(){ft=Date.now()+3200,R!==null&&window.clearTimeout(R),R=window.setTimeout(()=>{mt(),p(),d.classList.contains("open")&&g(!0)},3200)}function Ie(t,e="Untitled change"){return t.replace(/\s+/g," ").trim()||e}function K(t,e,n,o,a=10){const s=Math.max(a,window.innerWidth-n-a),c=Math.max(a,window.innerHeight-o-a);return{left:Math.min(Math.max(t,a),s),top:Math.min(Math.max(e,a),c)}}function Ae(){const t=u.getBoundingClientRect(),e=t.width||Math.min(360,window.innerWidth-28),n=t.height||180;return K(window.innerWidth-e-18,window.innerHeight-n-18,e,n)}function bt(t,e){t.style.left=`${e.left}px`,t.style.top=`${e.top}px`,t.style.right="auto",t.style.bottom="auto"}function qt(){const t=u.getBoundingClientRect(),e=t.width||Math.min(360,window.innerWidth-28),n=t.height||180,o=i.uiPosition?K(i.uiPosition.left,i.uiPosition.top,e,n):Ae();bt(u,o),Rt()}function nt(t){if(!t.classList.contains("open"))return;const e=u.getBoundingClientRect(),n=t.getBoundingClientRect(),o=10,a=n.width||360,s=n.height||240,c=e.right-a;let S=e.top-s-o;S<10&&(S=e.bottom+o),bt(t,K(c,S,a,s))}function Rt(){nt(d),nt(b)}function pt(t){return t.charAt(0).toUpperCase()+t.slice(1)}function Pe(t){return{fix:"Fix issue",change:"Change design",question:"Ask question",approve:"Approve"}[t]}function p(){u.className=`toolbar${X?" collapsed":""}`,X?u.innerHTML=`
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
            <div class="brand-meta">${Le()} on this page</div>
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
        <button class="action-button ${v?"active":""}" data-action="move" aria-label="Move an element">
          ${l("maximize")}
          <span>${v?C?"Place":"Select":"Move"}</span>
        </button>
        <button class="action-button ${d.classList.contains("open")?"active":""}" data-action="batch" aria-label="Review annotation batch">
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
        <button class="icon-button danger ${Y()?"active":""}" data-action="clear" aria-label="${Y()?"Confirm clear annotations":"Clear annotations"}" data-tooltip="${Y()?"Click again to clear":"Clear annotations"}">
          ${l("trash")}
        </button>
      </div>
      <div class="status-row">
        <span class="status-pill"><span class="dot ${x||v?"on":""}"></span>${x?"Click a target":v?C?"Click destination":"Click item to move":"Ready"}</span>
        <span class="status-pill">${l("server")} ${i.syncEnabled?"Sync enabled":"Local only"}</span>
      </div>
    `,u.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",e=>{if(Q){Q=!1,e.preventDefault(),e.stopPropagation();return}zt(t.dataset.action??"")})}),qt()}function y(){U.innerHTML="",U.style.display=i.hideMarkers?"none":"block",h.forEach((t,e)=>{if(t.status==="dismissed")return;const n=document.createElement("button");n.className="marker",n.type="button",n.dataset.id=t.id,n.dataset.status=t.status??"pending",n.textContent=String(e+1),n.title=t.comment,n.style.left=`${t.x}%`,n.style.top=`${t.isFixed?t.y:t.y-window.scrollY}px`,n.style.setProperty("--otu-accent",i.markerColor),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Ft(t.id)}),U.appendChild(n)})}function g(t=!1){if(d.className=`panel batch${t?" open":""}`,!t){d.innerHTML="";return}const e=J(),n=Y();d.innerHTML=`
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
            ${e.map((o,a)=>`
                  <article class="batch-item">
                    <div class="batch-item-header">
                      <span class="batch-index">${a+1}</span>
                      <div class="batch-comment">${q(Ie(o.comment))}</div>
                      <div class="batch-item-actions">
                        <button class="icon-button" data-batch-edit="${q(o.id)}" aria-label="Edit change ${a+1}" data-tooltip="Edit">
                          ${l("message")}
                        </button>
                        <button class="icon-button danger" data-batch-delete="${q(o.id)}" aria-label="Delete change ${a+1}" data-tooltip="Delete">
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
      <button class="command danger" data-batch-clear ${e.length===0?"disabled":""}>${l("trash")} ${n?"Confirm clear":"Clear all"}</button>
      <button class="command primary" data-batch-copy ${e.length===0?"disabled":""}>${l("copy")} Copy request</button>
    </div>
  `,d.querySelector("[data-batch-close]")?.addEventListener("click",()=>{g(!1),p()}),d.querySelector("[data-batch-copy]")?.addEventListener("click",()=>{st()}),d.querySelector("[data-batch-clear]")?.addEventListener("click",()=>{zt("clear")}),d.querySelectorAll("[data-batch-edit]").forEach(o=>{o.addEventListener("click",()=>{g(!1),p(),Ft(o.dataset.batchEdit??"")})}),d.querySelectorAll("[data-batch-delete]").forEach(o=>{o.addEventListener("click",()=>{Ot(o.dataset.batchDelete??"")})}),nt(d)}function M(t=!1){b.className=`panel settings${t?" open":""}`,b.innerHTML=`
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
          ${["compact","standard","detailed","forensic"].map(e=>`<option value="${e}" ${i.outputDetail===e?"selected":""}>${pt(e)}</option>`).join("")}
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
  `,b.querySelector("[data-settings-close]")?.addEventListener("click",()=>{M(!1)}),b.querySelector("[data-settings-save]")?.addEventListener("click",async()=>{const e=b.querySelector("#otu-output-detail")?.value,n=b.querySelector("#otu-marker-color")?.value||i.markerColor,o=Nt(b.querySelector("#otu-server-url")?.value||i.serverUrl),a=!!b.querySelector("#otu-sync")?.checked,s=!!b.querySelector("#otu-copy-add")?.checked,c=!!b.querySelector("#otu-block")?.checked;i={...i,outputDetail:e,markerColor:n,serverUrl:o,syncEnabled:a,copyOnAdd:s,blockPageInteractions:c},await W(ot(),i),Dt(),p(),y(),M(!1),i.syncEnabled?Gt():xt(),f("Settings saved")}),nt(b)}async function zt(t){if(t==="expand"){X=!1,p();return}if(t==="collapse"){X=!0,x=!1,v=!1,C=null,P(),g(!1),M(!1),p();return}if(t==="select"){x=!x,v=!1,C=null,g(!1),M(!1),p(),f(x?"Click or select text to annotate":"Targeting off");return}if(t==="move"){v=!v,C=null,x=!1,P(),g(!1),M(!1),p(),f(v?"Click the item to move":"Move mode off");return}if(t==="batch"){const e=!d.classList.contains("open");M(!1),g(e),p();return}if(t==="hide"){i={...i,hideMarkers:!i.hideMarkers},await W(ot(),i),p(),y();return}if(t==="pause"){N?Ve():We(),p();return}if(t==="copy"){await st();return}if(t==="clear"){if(J().length===0){mt(),p(),d.classList.contains("open")&&g(!0),f("No annotations to clear");return}if(!Y()){Te(),p(),d.classList.contains("open")&&g(!0),f("Click clear again to delete notes");return}await Be();return}t==="settings"&&(g(!1),M(!b.classList.contains("open")))}async function Be(){const t=h;h=[],mt(),await B(),p(),y(),d.classList.contains("open")&&g(!0),f("Annotations cleared"),i.syncEnabled&&t.forEach(e=>V(()=>Wt(e.id)))}async function Ot(t){!t||!h.find(n=>n.id===t)||(h=h.filter(n=>n.id!==t),await B(),p(),y(),d.classList.contains("open")&&g(!0),A===t&&P(),f("Annotation deleted"),i.syncEnabled&&V(()=>Wt(t)))}function je(t){let e=t;for(;e&&e!==document.documentElement;){const n=getComputedStyle(e).position;if(n==="fixed"||n==="sticky")return!0;e=e.parentElement}return!1}function Ne(t,e,n,o){const a=t.rect,s=je(t.element),c=a.left+a.width/2,S=a.top+a.height/2,z=Tt(t.element),k=Date.now(),j={id:`otu_${k.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:e,elementPath:z,timestamp:k,x:Math.max(0,Math.min(100,c/Math.max(window.innerWidth,1)*100)),y:s?S:S+window.scrollY,element:t.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:{x:a.left+window.scrollX,y:a.top+window.scrollY,width:a.width,height:a.height},cssClasses:Array.from(t.element.classList).join(" "),computedStyles:te(t.element),accessibility:It(t.element),nearbyText:At(t.element),isFixed:s,fullPath:z,intent:n,severity:o,kind:"feedback",status:"pending",thread:[]};return t.selectedText&&(j.selectedText=t.selectedText),I&&(j.sessionId=I),j}function De(t){return{x:t.left+window.scrollX,y:t.top+window.scrollY,width:t.width,height:t.height}}function qe(t,e,n){const o=Date.now(),a=Math.max(t.rect.width,1),s=Math.max(t.rect.height,1),c={x:e+window.scrollX-a/2,y:n+window.scrollY-s/2,width:a,height:s},S=c.x-window.scrollX+a/2,z=c.y-window.scrollY+s/2,k={id:`otu_${o.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:`Move ${t.label} to the pointed position`,elementPath:t.path,timestamp:o,x:Math.max(0,Math.min(100,S/Math.max(window.innerWidth,1)*100)),y:z+window.scrollY,element:t.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:c,cssClasses:Array.from(t.element.classList).join(" "),accessibility:It(t.element),nearbyText:At(t.element),isFixed:!1,fullPath:t.path,intent:"change",severity:"important",kind:"rearrange",rearrange:{selector:t.path,label:t.label,tagName:t.element.tagName.toLowerCase(),originalRect:De(t.rect),currentRect:c},status:"pending",thread:[]};return I&&(k.sessionId=I),k}function Ut(t){_=t,A=null,r.className="panel composer open",r.dataset.mode="create",r.style.left=`${Math.min(t.clientX+12,window.innerWidth-376)}px`,r.style.top=`${Math.min(t.clientY+12,window.innerHeight-260)}px`,r.innerHTML=`
    <textarea id="otu-comment" placeholder="Type the change for this target"></textarea>
    <div class="button-row">
      <button class="command" data-merge>${l("message")} Merge</button>
      <button class="command primary" data-copy>${l("copy")} Copy</button>
    </div>
  `,r.querySelector("#otu-comment")?.focus(),r.querySelector("[data-merge]")?.addEventListener("click",()=>{St({copyAfter:!1})}),r.querySelector("[data-copy]")?.addEventListener("click",()=>{St({copyAfter:!0})})}function Ft(t){const e=h.find(n=>n.id===t);e&&(_=null,A=t,r.className="panel composer open",r.dataset.mode="edit",r.style.left="18px",r.style.top="18px",r.innerHTML=`
    <div class="panel-header">
      <div class="panel-title">${l("message")} Edit annotation</div>
      <button class="icon-button" data-cancel aria-label="Close annotation editor" data-tooltip="Close">
        ${l("x")}
      </button>
    </div>
    <div class="target-card">
      <strong>${q(e.elementPath)}</strong>
      <span>${pt(e.status??"pending")} note</span>
    </div>
    <textarea id="otu-comment">${q(e.comment)}</textarea>
    <div class="field-row">
      <label class="form-field">
        Intent
        <select id="otu-intent">
          ${["fix","change","question","approve"].map(n=>`<option value="${n}" ${e.intent===n?"selected":""}>${Pe(n)}</option>`).join("")}
        </select>
      </label>
      <label class="form-field">
        Priority
        <select id="otu-severity">
          ${["important","blocking","suggestion"].map(n=>`<option value="${n}" ${e.severity===n?"selected":""}>${pt(n)}</option>`).join("")}
        </select>
      </label>
    </div>
    <div class="button-row">
      <button class="command danger" data-delete>${l("trash")} Delete</button>
      <button class="command" data-cancel>${l("x")} Close</button>
      <button class="command primary" data-save>${l("check")} Save note</button>
    </div>
  `,r.querySelector("[data-cancel]")?.addEventListener("click",P),r.querySelector("[data-delete]")?.addEventListener("click",Oe),r.querySelector("[data-save]")?.addEventListener("click",ze))}function P(){_=null,A=null,$=null,r.className="panel composer",delete r.dataset.mode,r.innerHTML=""}function Re(t){t.key==="Escape"&&(!r.classList.contains("open")||r.dataset.mode!=="create"||(t.preventDefault(),t.stopPropagation(),P()))}async function St(t){if(!_)return;const e=r.querySelector("#otu-comment")?.value.trim()??"";if(!e){f("Type a change first");return}const n=Ne(_,e,"change","important");if(t.copyAfter){await Yt([...J(),n],!1),P(),f("Copied without marker");return}h=[...h,n],await B(),p(),y(),d.classList.contains("open")&&g(!0),P(),i.syncEnabled&&V(()=>vt(n)),i.copyOnAdd?(await st(!1),f("Merged and copied")):f("Merged into batch")}async function ze(){if(!A)return;const t=A,e=r.querySelector("#otu-comment")?.value.trim()??"";if(!e){f("Comment cannot be empty");return}const n=r.querySelector("#otu-intent")?.value??"fix",o=r.querySelector("#otu-severity")?.value??"important",a=new Date().toISOString();h=h.map(s=>s.id===t?{...s,comment:e,intent:n,severity:o,updatedAt:a}:s),await B(),p(),y(),d.classList.contains("open")&&g(!0),P(),i.syncEnabled&&V(()=>Ze(t,{comment:e,intent:n,severity:o,updatedAt:a}))}async function Oe(){A&&await Ot(A)}async function st(t=!0){return Yt(J(),t)}async function Yt(t,e=!0){if(t.length===0)return e&&f("No changes to copy"),!1;const n=se(t,{mode:"change-request",detail:i.outputDetail,includeHeader:!0});return await navigator.clipboard.writeText(n),e&&f("Change request copied"),!0}function Ue(t){return!(t instanceof Element)||t.closest(".toolbar-header .icon-button")?!1:!!t.closest(".toolbar-header, .collapsed-button")}function Fe(t){if(t.button!==0||!Ue(t.target))return;const e=u.getBoundingClientRect();w={pointerId:t.pointerId,startX:t.clientX,startY:t.clientY,startLeft:e.left,startTop:e.top,moved:!1}}function Ye(t){if(!w||w.pointerId!==t.pointerId)return;const e=t.clientX-w.startX,n=t.clientY-w.startY;if(!w.moved&&Math.hypot(e,n)<4)return;w.moved=!0,u.classList.add("dragging"),u.hasPointerCapture(t.pointerId)||u.setPointerCapture(t.pointerId);const o=u.getBoundingClientRect(),a=K(w.startLeft+e,w.startTop+n,o.width,o.height);bt(u,a),Rt(),t.preventDefault(),t.stopPropagation()}function Ht(t){if(!w||w.pointerId!==t.pointerId)return;const e=w.moved;if(w=null,u.classList.remove("dragging"),u.hasPointerCapture(t.pointerId)&&u.releasePointerCapture(t.pointerId),e){const n=u.getBoundingClientRect(),o=K(n.left,n.top,n.width,n.height);i={...i,uiPosition:o},W(ot(),i),Q=!0,window.setTimeout(()=>{Q=!1},250),f("UI position saved"),t.preventDefault(),t.stopPropagation()}}function He(t){return t instanceof Element&&!!t.closest("textarea, button, input, select")}function Xe(t,e){const n=r.getBoundingClientRect(),o=8,a=Math.max(o,window.innerWidth-n.width-o),s=Math.max(o,window.innerHeight-n.height-o);return{left:Math.min(Math.max(t,o),a),top:Math.min(Math.max(e,o),s)}}function _e(t){if(!r.classList.contains("open")||t.button!==0||He(t.target))return;const e=r.getBoundingClientRect();$={pointerId:t.pointerId,startX:t.clientX,startY:t.clientY,startLeft:e.left,startTop:e.top},r.classList.add("dragging"),r.setPointerCapture(t.pointerId),t.preventDefault(),t.stopPropagation()}function Ge(t){if(!$||$.pointerId!==t.pointerId)return;const e=Xe($.startLeft+t.clientX-$.startX,$.startTop+t.clientY-$.startY);r.style.left=`${e.left}px`,r.style.top=`${e.top}px`,t.preventDefault(),t.stopPropagation()}function Xt(t){!$||$.pointerId!==t.pointerId||($=null,r.classList.remove("dragging"),r.hasPointerCapture(t.pointerId)&&r.releasePointerCapture(t.pointerId),t.preventDefault(),t.stopPropagation())}function We(){if(!document.getElementById($t)){const t=document.createElement("style");t.id=$t,t.textContent=`
      html.opentargetui-motion-paused *,
      html.opentargetui-motion-paused *::before,
      html.opentargetui-motion-paused *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `,document.head.appendChild(t)}ut=Array.from(document.querySelectorAll("video, audio")).filter(t=>t instanceof HTMLMediaElement&&!t.paused?(t.pause(),!0):!1),document.documentElement.classList.add("opentargetui-motion-paused"),N=!0,f("Motion paused")}function Ve(){document.documentElement.classList.remove("opentargetui-motion-paused"),ut.forEach(t=>{t.play().catch(()=>{})}),ut=[],N=!1,f("Motion resumed")}async function B(){await W(Et(location.href),h)}async function Je(){i={...H,...await lt(ot(),H)},i.serverUrl=Nt(i.serverUrl),h=await lt(Et(location.href),[]),I=await lt(Mt(location.href),null),Dt(),p(),y(),M(!1),i.syncEnabled&&Gt()}async function _t(){if(I)return I;const t=await fetch(`${i.serverUrl}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:location.href,title:document.title})});if(!t.ok)throw new Error(`Session failed: ${t.status}`);const n=(await t.json()).id;return I=n,await W(Mt(location.href),n),h=h.map(o=>({...o,sessionId:n})),await B(),n}async function Gt(){try{at=!1,tt=!1;const t=await _t();await Promise.all(h.map(e=>vt(e))),Ke(t),Me(),f("Server connected")}catch(t){gt(t,"Server unavailable")}}function xt(){O?.close(),O=null}function Ke(t){xt(),O=new EventSource(`${i.serverUrl}/sessions/${t}/events`),O.onmessage=e=>{const n=JSON.parse(e.data);n.type==="annotation.updated"&&n.data&&(h=h.map(o=>o.id===n.data?.id?n.data:o),B(),p(),y(),d.classList.contains("open")&&g(!0)),n.type==="annotation.deleted"&&n.annotationId&&(h=h.filter(o=>o.id!==n.annotationId),B(),p(),y(),d.classList.contains("open")&&g(!0))},O.onerror=()=>{gt(void 0,"Server events disconnected")}}async function vt(t){const e=await _t(),n=await fetch(`${i.serverUrl}/sessions/${e}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(`Annotation sync failed: ${n.status}`)}async function Ze(t,e){const n=await fetch(`${i.serverUrl}/annotations/${t}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok)throw new Error(`Annotation update failed: ${n.status}`)}async function Wt(t){const e=await fetch(`${i.serverUrl}/annotations/${t}`,{method:"DELETE"});if(!e.ok)throw new Error(`Annotation delete failed: ${e.status}`)}function Qe(t){const e=t.getBoundingClientRect();T.style.display="block",T.style.left=`${e.left}px`,T.style.top=`${e.top}px`,T.style.width=`${e.width}px`,T.style.height=`${e.height}px`}function tn(){T.style.display="none"}function wt(t){const e=t.target;return!(e instanceof Element)||e.closest("[data-opentargetui]")?null:e}function en(t){if(!x&&!v||rt(t))return;const e=wt(t);e&&Qe(e)}function nn(){!x&&!v&&tn()}async function on(t){if(rt(t))return;const e=wt(t);if(!e&&!C)return;if(t.preventDefault(),t.stopPropagation(),!C){if(!e)return;const o=Tt(e);C={element:e,rect:e.getBoundingClientRect(),path:o,label:Zt(e)},p(),f("Click the destination");return}const n=qe(C,t.clientX,t.clientY);h=[...h,n],v=!1,C=null,await B(),p(),y(),d.classList.contains("open")&&g(!0),i.syncEnabled&&V(()=>vt(n)),f("Move request added")}function an(t){if(!x||rt(t))return;const e=window.getSelection();if(!e||e.isCollapsed||e.toString().trim().length===0)return;const n=e.getRangeAt(0),o=n.getBoundingClientRect();if(o.width<=0||o.height<=0)return;const a=n.commonAncestorContainer.nodeType===Node.ELEMENT_NODE?n.commonAncestorContainer:n.commonAncestorContainer.parentElement;a instanceof Element&&(dt=!0,Ut({element:a,rect:o,clientX:t.clientX,clientY:t.clientY,selectedText:e.toString().trim()}))}function rn(t){if(v){on(t);return}if(!x||rt(t))return;if(dt){dt=!1,t.preventDefault(),t.stopPropagation();return}const e=wt(t);e&&(i.blockPageInteractions&&(t.preventDefault(),t.stopPropagation()),Ut({element:e,rect:e.getBoundingClientRect(),clientX:t.clientX,clientY:t.clientY,selectedText:""}))}function sn(){y(),qt()}function q(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.addEventListener("mousemove",en,!0);document.addEventListener("mouseout",nn,!0);document.addEventListener("mouseup",an,!0);document.addEventListener("click",rn,!0);document.addEventListener("keydown",Re,!0);u.addEventListener("pointerdown",Fe);u.addEventListener("pointermove",Ye);u.addEventListener("pointerup",Ht);u.addEventListener("pointercancel",Ht);r.addEventListener("pointerdown",_e);r.addEventListener("pointermove",Ge);r.addEventListener("pointerup",Xt);r.addEventListener("pointercancel",Xt);window.addEventListener("scroll",y,{passive:!0});window.addEventListener("resize",sn,{passive:!0});function ln(t,e,n){return t.source!=="opentargetui-popup"?!1:t.type==="toggle-selection"?(x=!x,v=!1,C=null,X=!1,g(!1),M(!1),p(),n({ok:!0}),!0):t.type==="copy-feedback"?(st().then(o=>n({ok:o,copied:o})),!0):!1}try{typeof chrome<"u"&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener(ln)}catch(t){it(t)?G=!0:console.warn("[OpenTarget UI] Message handler unavailable",t)}Je();
//# sourceMappingURL=content.js.map
