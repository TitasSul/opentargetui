const lt="opentargetui:v1";function Pt(t){const e=new URL(t);return`${lt}:page:${e.origin}${e.pathname}`}function Bt(t){const e=new URL(t);return`${lt}:session:${e.origin}${e.pathname}`}function D(){return`${lt}:settings`}function jt(){return`${lt}:structure-reference`}const ee=/(?:^|[-_])(?:[a-f0-9]{6,}|css|sc|module|chakra|mui|mantine|emotion)(?:[-_]|$)/i;function Rt(t){return globalThis.CSS&&typeof globalThis.CSS.escape=="function"?globalThis.CSS.escape(t):t.replace(/[^a-zA-Z0-9_-]/g,e=>`\\${e}`)}function ht(t,e){try{return e.querySelectorAll(t).length===1}catch{return!1}}function ne(t){return Array.from(t.classList).filter(e=>e.length>=2&&!ee.test(e)).slice(0,3).map(e=>`.${Rt(e)}`)}function oe(t){const e=t.tagName.toLowerCase();let n=1,o=t.previousElementSibling;for(;o;)o.tagName.toLowerCase()===e&&(n+=1),o=o.previousElementSibling;return`${e}:nth-of-type(${n})`}function re(t){const e=t.tagName.toLowerCase(),n=(t.textContent??"").replace(/\s+/g," ").trim(),o=t.getAttribute("aria-label")?.trim(),r=t.getAttribute("alt")?.trim();if((e==="button"||e==="a")&&n)return`${e}[${n.slice(0,48)}]`;if(o)return`${e}[aria-label="${o.slice(0,48)}"]`;if(r)return`${e}[alt="${r.slice(0,48)}"]`;if(/^h[1-6]$/.test(e)&&n)return`${e}[${n.slice(0,48)}]`;const a=t.id?`#${t.id}`:"",c=Array.from(t.classList).slice(0,2).join(".");return`${e}${a}${c?`.${c}`:""}`}function ie(t,e=document){const n=t.tagName.toLowerCase();if(t.id){const r=`#${Rt(t.id)}`;if(ht(r,e))return r}const o=ne(t).join("");if(o){const r=`${n}${o}`;if(ht(r,e))return r}return oe(t)}function Nt(t,e=document){const n=[];let o=t;for(;o&&o.nodeType===Node.ELEMENT_NODE;){const r=ie(o,e);n.unshift(r);const a=n.join(" > ");if(ht(a,e))return a;if(o.tagName.toLowerCase()==="body")break;o=o.parentElement}return n.join(" > ")}function Dt(t){const e=[],n=t.getAttribute("role"),o=t.getAttribute("aria-label"),r=t.getAttribute("aria-expanded"),a=t.getAttribute("aria-pressed"),c=t.hasAttribute("disabled")||t.getAttribute("aria-disabled")==="true";return n&&e.push(`role=${n}`),o&&e.push(`aria-label="${o}"`),r!==null&&e.push(`aria-expanded=${r}`),a!==null&&e.push(`aria-pressed=${a}`),c&&e.push("disabled=true"),e.join("; ")}function qt(t,e=240){const n=(t.textContent||t.parentElement?.textContent||"").replace(/\s+/g," ").trim();return n.length>e?`${n.slice(0,e-1)}...`:n}function ae(t){const e=getComputedStyle(t);return["display","position","width","height","margin","padding","font-size","font-family","font-weight","line-height","color","background-color","border","border-radius","box-shadow","z-index"].map(o=>`${o}: ${e.getPropertyValue(o)};`).filter(o=>!o.endsWith(": ;")).join(`
`)}function m(t,e){return e==null||e===""?null:`**${t}:** ${String(e)}`}function zt(t){if(!t.boundingBox)return null;const e=t.boundingBox;return`${Math.round(e.x)}px, ${Math.round(e.y)}px (${Math.round(e.width)}x${Math.round(e.height)}px)`}function Mt(t){return`${Math.round(t.x)}px, ${Math.round(t.y)}px (${Math.round(t.width)}x${Math.round(t.height)}px)`}function Lt(t,e){return e?`**${t}:**

\`\`\`
${e.trim()}
\`\`\``:null}function O(t){const e=t.trim();return e?e.includes("`")?`\`\` ${e} \`\``:`\`${e}\``:""}function se(t){return`"${t.replace(/\s+/g," ").trim()}"`}function le(t){return[...new Set(t.map(e=>e?.trim()).filter(Boolean))]}function ce(t,e){const n=t.trim().split(/\r?\n/).map(o=>o.trim()).filter(Boolean);return n.length===0?[`${e+1}. Change the selected target`]:[`${e+1}. ${n[0]}`,...n.slice(1).map(o=>`   ${o}`)]}function de(t,e,n,o){const r=[...ce(t.comment,e),`   - Target: ${O(t.elementPath)}`,t.element?`   - Element: ${O(t.element)}`:null,o&&t.url?`   - URL: ${O(t.url)}`:null,t.selectedText?`   - Selected text: ${se(t.selectedText)}`:null,t.rearrange?`   - Move from: ${O(Mt(t.rearrange.originalRect))}`:null,t.rearrange?`   - Move to: ${O(Mt(t.rearrange.currentRect))}`:null].filter(Boolean);if(n==="compact"||n==="standard"||(r.push(...[m("Position",zt(t)),m("Classes",t.cssClasses),m("Accessibility",t.accessibility),m("Nearby Text",t.nearbyText)].filter(Boolean).map(c=>`   - ${c}`)),n==="detailed"))return r.join(`
`);const a=t.thread?.length?t.thread.map(c=>`     - ${c.role}: ${c.content}`).join(`
`):void 0;return r.push(...[m("Fixed/Sticky",t.isFixed),m("Full DOM Path",t.fullPath),t.computedStyles?`**Computed Styles:**

\`\`\`
${t.computedStyles.trim()}
\`\`\``:null,a?`**Thread:**
${a}`:null].filter(Boolean).map(c=>`   - ${c}`)),r.join(`
`)}function ue(t,e){const n=e.detail??"standard",o=e.includeHeader??!0,r=[...t].sort(($,R)=>$.timestamp-R.timestamp);if(r.length===0)return"No annotations captured.";const a=le(r.map($=>$.url)),c=a.length===1?a[0]:void 0,E=a.length>1;return`${o?`${["Implement these UI changes in one pass. Verify each target against the current DOM before editing.",c?`Page: ${O(c)}`:null].filter(Boolean).join(`
`)}

`:""}${r.map(($,R)=>de($,R,n,E)).join(`

`)}`}function pe(t,e,n){if(n==="compact")return[`- **#${e+1} ${t.elementPath}**`,t.selectedText?`  - Selected text: "${t.selectedText}"`:null,`  - Feedback: ${t.comment}`].filter(Boolean).join(`
`);const o=[`## Annotation #${e+1}`,m("Element",t.element),m("Path",t.elementPath),m("URL",t.url),m("Selected Text",t.selectedText?`"${t.selectedText}"`:void 0),m("Feedback",t.comment)].filter(Boolean);if(n==="standard")return o.join(`

`);const r=[...o,m("Position",zt(t)),m("Classes",t.cssClasses),m("Accessibility",t.accessibility),m("Nearby Text",t.nearbyText)].filter(Boolean);if(n==="detailed")return r.join(`

`);const a=t.thread?.length?t.thread.map(c=>`- ${c.role}: ${c.content}`).join(`
`):void 0;return[...r,m("Fixed/Sticky",t.isFixed),m("Full DOM Path",t.fullPath),Lt("Computed Styles",t.computedStyles),Lt("Thread",a)].filter(Boolean).join(`

`)}function he(t,e={}){if(e.mode==="change-request")return ue(t,e);const n=e.detail??"standard",o=[...t].sort((r,a)=>r.timestamp-a.timestamp);return o.length===0?"No annotations captured.":o.map((r,a)=>pe(r,a,n)).join(`

`)}const fe=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ge=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,me=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,be=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,xe=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ve=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,we=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ye=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,ke=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,$e=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Ce=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Se=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Ee=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Me=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Le=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Ae=`<!-- @license lucide-static v1.18.0 - ISC -->
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
`,Ut="opentargetui-root",At="opentargetui-pause-style",q={enabled:!1,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0},Te={check:fe,clipboardList:ge,copy:me,eye:be,eyeOff:xe,maximize:ve,message:we,mousePointer:ye,panelClose:ke,pause:$e,play:Ce,server:Se,settings:Ee,target:Me,trash:Le,x:Ae};function l(t){return Te[t].replace(/<!--[\s\S]*?-->\s*/g,"").replace("<svg",'<svg aria-hidden="true" focusable="false"').replace('class="lucide','class="otu-icon lucide')}function et(t){return typeof chrome<"u"&&chrome.runtime?.getURL?chrome.runtime.getURL(t.replace(/^\//,"")):t}function Ie(){return`
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src: url("${et("fonts/geist-latin-400-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 500;
      src: url("${et("fonts/geist-latin-500-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 600;
      src: url("${et("fonts/geist-latin-600-normal.woff2")}") format("woff2");
    }
    @font-face {
      font-family: "Geist";
      font-style: normal;
      font-display: swap;
      font-weight: 700;
      src: url("${et("fonts/geist-latin-700-normal.woff2")}") format("woff2");
    }
  `}let i={...q},h=[],b=!1,v=!1,z=!0,N=!1,X=null,L=null,P=null,W=null,C=null,y=null,k=null,bt=0,Y=null,ot=!1,ft=!1,gt=[],J=!1,ct=!1,rt=!1;const Tt=document.getElementById(Ut);Tt&&Tt.remove();const S=document.createElement("div");S.id=Ut;S.setAttribute("data-opentargetui","root");S.style.all="initial";S.style.position="fixed";S.style.inset="0";S.style.zIndex="2147483647";S.style.pointerEvents="none";const T=S.attachShadow({mode:"open"});document.documentElement.appendChild(S);const it=document.createElement("style");it.textContent=`
  ${Ie()}

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
`;T.appendChild(it);const I=document.createElement("div");I.className="hover-frame";T.appendChild(I);const F=document.createElement("div");F.className="marker-layer";T.appendChild(F);const p=document.createElement("div");p.className="toolbar";T.appendChild(p);const s=document.createElement("div");s.className="panel composer";T.appendChild(s);const u=document.createElement("div");u.className="panel batch";T.appendChild(u);const x=document.createElement("div");x.className="panel settings";T.appendChild(x);const G=document.createElement("div");G.className="toast";T.appendChild(G);function Ot(){if(J)return!1;try{return typeof chrome<"u"&&!!chrome.runtime?.id&&!!chrome.storage?.local}catch(t){return dt(t)&&(J=!0),!1}}async function nt(t,e){if(!Ot())return e;try{return(await chrome.storage.local.get(t))[t]??e}catch(n){return dt(n)?J=!0:console.warn("[OpenTarget UI] Storage read failed",n),e}}async function B(t,e){if(Ot())try{await chrome.storage.local.set({[t]:e})}catch(n){dt(n)?J=!0:console.warn("[OpenTarget UI] Storage write failed",n)}}function xt(t){return t.trim().replace(/\/+$/,"")||q.serverUrl}function f(t){G.textContent=t,G.classList.add("show"),window.setTimeout(()=>G.classList.remove("show"),1600)}function dt(t){return t instanceof Error&&/extension context invalidated/i.test(t.message)}function Pe(t){return t instanceof TypeError&&/failed to fetch/i.test(t.message)}function Be(){ct=!1,rt=!1}function vt(t,e){pt(),ct=!0,rt||(rt=!0,f(e),t&&!Pe(t)&&console.warn("[OpenTarget UI] Server sync failed",t))}function Q(t){ct||t().catch(e=>vt(e,"Saved locally; server unavailable"))}function ut(t){return t.composedPath().includes(S)||t.composedPath().includes(T)}function wt(){it.textContent=it.textContent?.replace(/--otu-accent: #[0-9a-fA-F]{6};/,`--otu-accent: ${i.markerColor};`)??""}function _(){return h.filter(t=>t.status!=="dismissed"&&t.status!=="resolved")}function je(){const t=_().length;return`${t} ${t===1?"note":"notes"}`}function K(){return bt>Date.now()}function yt(){bt=0,Y!==null&&(window.clearTimeout(Y),Y=null)}function Re(){bt=Date.now()+3200,Y!==null&&window.clearTimeout(Y),Y=window.setTimeout(()=>{yt(),d(),u.classList.contains("open")&&g(!0)},3200)}function Ne(t,e="Untitled change"){return t.replace(/\s+/g," ").trim()||e}function tt(t,e,n,o,r=10){const a=Math.max(r,window.innerWidth-n-r),c=Math.max(r,window.innerHeight-o-r);return{left:Math.min(Math.max(t,r),a),top:Math.min(Math.max(e,r),c)}}function De(){const t=p.getBoundingClientRect(),e=t.width||Math.min(360,window.innerWidth-28),n=t.height||180;return tt(window.innerWidth-e-18,window.innerHeight-n-18,e,n)}function kt(t,e){t.style.left=`${e.left}px`,t.style.top=`${e.top}px`,t.style.right="auto",t.style.bottom="auto"}function Ft(){const t=p.getBoundingClientRect(),e=t.width||Math.min(360,window.innerWidth-28),n=t.height||180,o=i.uiPosition?tt(i.uiPosition.left,i.uiPosition.top,e,n):De();kt(p,o),Ht()}function at(t){if(!t.classList.contains("open"))return;const e=p.getBoundingClientRect(),n=t.getBoundingClientRect(),o=10,r=n.width||360,a=n.height||240,c=e.right-r;let E=e.top-a-o;E<10&&(E=e.bottom+o),kt(t,tt(c,E,r,a))}function Ht(){at(u),at(x)}function mt(t){return t.charAt(0).toUpperCase()+t.slice(1)}function qe(t){return{fix:"Fix issue",change:"Change design",question:"Ask question",approve:"Approve"}[t]}function d(){if(!i.enabled){p.innerHTML="";return}p.className=`toolbar${z?" collapsed":""}`,z?p.innerHTML=`
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
            <div class="brand-meta">${je()} on this page</div>
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
        <button class="icon-button ${i.hideMarkers?"active":""}" data-action="hide" aria-label="${i.hideMarkers?"Show markers":"Hide markers"}" data-tooltip="${i.hideMarkers?"Show markers":"Hide markers"}">
          ${i.hideMarkers?l("eye"):l("eyeOff")}
        </button>
        <button class="icon-button ${N?"active":""}" data-action="pause" aria-label="${N?"Resume page motion":"Pause page motion"}" data-tooltip="${N?"Resume motion":"Pause motion"}">
          ${l(N?"play":"pause")}
        </button>
        <button class="icon-button" data-action="settings" aria-label="Open settings" data-tooltip="Settings">
          ${l("settings")}
        </button>
        <button class="icon-button danger ${K()?"active":""}" data-action="clear" aria-label="${K()?"Confirm clear annotations":"Clear annotations"}" data-tooltip="${K()?"Click again to clear":"Clear annotations"}">
          ${l("trash")}
        </button>
      </div>
      <div class="status-row">
        <span class="status-pill"><span class="dot ${b||v?"on":""}"></span>${b?"Click a target":v?k?"Click destination":"Click item to move":"Ready"}</span>
        <span class="status-pill">${l("server")} ${i.syncEnabled?"Sync enabled":"Local only"}</span>
      </div>
    `,p.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",e=>{if(ot){ot=!1,e.preventDefault(),e.stopPropagation();return}Yt(t.dataset.action??"")})}),Ft()}function w(){if(F.innerHTML="",!i.enabled){F.style.display="none";return}F.style.display=i.hideMarkers?"none":"block",h.forEach((t,e)=>{if(t.status==="dismissed")return;const n=document.createElement("button");n.className="marker",n.type="button",n.dataset.id=t.id,n.dataset.status=t.status??"pending",n.textContent=String(e+1),n.title=t.comment,n.style.left=`${t.x}%`,n.style.top=`${t.isFixed?t.y:t.y-window.scrollY}px`,n.style.setProperty("--otu-accent",i.markerColor),n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Vt(t.id)}),F.appendChild(n)})}function g(t=!1){if(u.className=`panel batch${t?" open":""}`,!t){u.innerHTML="";return}const e=_(),n=K();u.innerHTML=`
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
            ${e.map((o,r)=>`
                  <article class="batch-item">
                    <div class="batch-item-header">
                      <span class="batch-index">${r+1}</span>
                      <div class="batch-comment">${H(Ne(o.comment))}</div>
                      <div class="batch-item-actions">
                        <button class="icon-button" data-batch-edit="${H(o.id)}" aria-label="Edit change ${r+1}" data-tooltip="Edit">
                          ${l("message")}
                        </button>
                        <button class="icon-button danger" data-batch-delete="${H(o.id)}" aria-label="Delete change ${r+1}" data-tooltip="Delete">
                          ${l("trash")}
                        </button>
                      </div>
                    </div>
                    <div class="batch-target">${H(o.kind==="rearrange"?`Move: ${o.elementPath}`:o.elementPath)}</div>
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
  `,u.querySelector("[data-batch-close]")?.addEventListener("click",()=>{g(!1),d()}),u.querySelector("[data-batch-copy]")?.addEventListener("click",()=>{$t()}),u.querySelector("[data-batch-clear]")?.addEventListener("click",()=>{Yt("clear")}),u.querySelectorAll("[data-batch-edit]").forEach(o=>{o.addEventListener("click",()=>{g(!1),d(),Vt(o.dataset.batchEdit??"")})}),u.querySelectorAll("[data-batch-delete]").forEach(o=>{o.addEventListener("click",()=>{Xt(o.dataset.batchDelete??"")})}),at(u)}function M(t=!1){x.className=`panel settings${t?" open":""}`,x.innerHTML=`
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
          ${["compact","standard","detailed","forensic"].map(e=>`<option value="${e}" ${i.outputDetail===e?"selected":""}>${mt(e)}</option>`).join("")}
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
  `,x.querySelector("[data-settings-close]")?.addEventListener("click",()=>{M(!1)}),x.querySelector("[data-settings-save]")?.addEventListener("click",async()=>{const e=x.querySelector("#otu-output-detail")?.value,n=x.querySelector("#otu-marker-color")?.value||i.markerColor,o=xt(x.querySelector("#otu-server-url")?.value||i.serverUrl),r=!!x.querySelector("#otu-sync")?.checked,a=!!x.querySelector("#otu-copy-add")?.checked,c=!!x.querySelector("#otu-block")?.checked;i={...i,outputDetail:e,markerColor:n,serverUrl:o,syncEnabled:r,copyOnAdd:a,blockPageInteractions:c},await B(D(),i),wt(),d(),w(),M(!1),i.syncEnabled?Ct():pt(),f("Settings saved")}),at(x)}async function Yt(t){if(i.enabled){if(t==="expand"){z=!1,d();return}if(t==="collapse"){z=!0,b=!1,v=!1,k=null,A(),g(!1),M(!1),d();return}if(t==="select"){b=!b,v=!1,k=null,g(!1),M(!1),d(),f(b?"Click or select text to annotate":"Targeting off");return}if(t==="move"){v=!v,k=null,b=!1,A(),g(!1),M(!1),d(),f(v?"Click the item to move":"Move mode off");return}if(t==="batch"){const e=!u.classList.contains("open");M(!1),g(e),d();return}if(t==="hide"){i={...i,hideMarkers:!i.hideMarkers},await B(D(),i),d(),w();return}if(t==="pause"){N?dn():cn(),d();return}if(t==="copy"){await $t();return}if(t==="clear"){if(_().length===0){yt(),d(),u.classList.contains("open")&&g(!0),f("No annotations to clear");return}if(!K()){Re(),d(),u.classList.contains("open")&&g(!0),f("Click clear again to delete notes");return}await ze();return}t==="settings"&&(g(!1),M(!x.classList.contains("open")))}}async function ze(){const t=h;h=[],yt(),await j(),d(),w(),u.classList.contains("open")&&g(!0),f("Annotations cleared"),i.syncEnabled&&t.forEach(e=>Q(()=>Qt(e.id)))}async function Xt(t){!t||!h.find(n=>n.id===t)||(h=h.filter(n=>n.id!==t),await j(),d(),w(),u.classList.contains("open")&&g(!0),L===t&&A(),f("Annotation deleted"),i.syncEnabled&&Q(()=>Qt(t)))}function Ue(t){let e=t;for(;e&&e!==document.documentElement;){const n=getComputedStyle(e).position;if(n==="fixed"||n==="sticky")return!0;e=e.parentElement}return!1}function Oe(t,e,n,o){const r=t.rect,a=Ue(t.element),c=r.left+r.width/2,E=r.top+r.height/2,V=Nt(t.element),$=Date.now(),R={id:`otu_${$.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:e,elementPath:V,timestamp:$,x:Math.max(0,Math.min(100,c/Math.max(window.innerWidth,1)*100)),y:a?E:E+window.scrollY,element:t.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:{x:r.left+window.scrollX,y:r.top+window.scrollY,width:r.width,height:r.height},cssClasses:Array.from(t.element.classList).join(" "),computedStyles:ae(t.element),accessibility:Dt(t.element),nearbyText:qt(t.element),isFixed:a,fullPath:V,intent:n,severity:o,kind:"feedback",status:"pending",thread:[]};return t.selectedText&&(R.selectedText=t.selectedText),P&&(R.sessionId=P),R}function Fe(t){return{x:t.left+window.scrollX,y:t.top+window.scrollY,width:t.width,height:t.height}}function He(t){return{x:t.left,y:t.top,width:t.width,height:t.height}}function Ye(t,e,n){const o=Date.now(),r=Math.max(t.rect.width,1),a=Math.max(t.rect.height,1),c={x:e+window.scrollX-r/2,y:n+window.scrollY-a/2,width:r,height:a},E=c.x-window.scrollX+r/2,V=c.y-window.scrollY+a/2,$={id:`otu_${o.toString(36)}_${Math.random().toString(36).slice(2,8)}`,comment:`Move ${t.label} to the pointed position`,elementPath:t.path,timestamp:o,x:Math.max(0,Math.min(100,E/Math.max(window.innerWidth,1)*100)),y:V+window.scrollY,element:t.element.tagName.toLowerCase(),url:location.href,title:document.title,boundingBox:c,cssClasses:Array.from(t.element.classList).join(" "),accessibility:Dt(t.element),nearbyText:qt(t.element),isFixed:!1,fullPath:t.path,intent:"change",severity:"important",kind:"rearrange",rearrange:{selector:t.path,label:t.label,tagName:t.element.tagName.toLowerCase(),originalRect:Fe(t.rect),currentRect:c},status:"pending",thread:[]};return P&&($.sessionId=P),$}function _t(t){X=t,L=null,s.className="panel composer open",s.dataset.mode="create",s.style.left=`${Math.min(t.clientX+12,window.innerWidth-376)}px`,s.style.top=`${Math.min(t.clientY+12,window.innerHeight-260)}px`,s.innerHTML=`
    <textarea id="otu-comment" placeholder="Type the change for this target"></textarea>
    <div class="button-row">
      <button class="command" data-merge>${l("message")} Merge</button>
      <button class="command primary" data-copy>${l("copy")} Copy</button>
    </div>
  `,s.querySelector("#otu-comment")?.focus(),s.querySelector("[data-merge]")?.addEventListener("click",()=>{It({copyAfter:!1})}),s.querySelector("[data-copy]")?.addEventListener("click",()=>{It({copyAfter:!0})})}function Vt(t){const e=h.find(n=>n.id===t);e&&(X=null,L=t,s.className="panel composer open",s.dataset.mode="edit",s.style.left="18px",s.style.top="18px",s.innerHTML=`
    <div class="panel-header">
      <div class="panel-title">${l("message")} Edit annotation</div>
      <button class="icon-button" data-cancel aria-label="Close annotation editor" data-tooltip="Close">
        ${l("x")}
      </button>
    </div>
    <div class="target-card">
      <strong>${H(e.elementPath)}</strong>
      <span>${mt(e.status??"pending")} note</span>
    </div>
    <textarea id="otu-comment">${H(e.comment)}</textarea>
    <div class="field-row">
      <label class="form-field">
        Intent
        <select id="otu-intent">
          ${["fix","change","question","approve"].map(n=>`<option value="${n}" ${e.intent===n?"selected":""}>${qe(n)}</option>`).join("")}
        </select>
      </label>
      <label class="form-field">
        Priority
        <select id="otu-severity">
          ${["important","blocking","suggestion"].map(n=>`<option value="${n}" ${e.severity===n?"selected":""}>${mt(n)}</option>`).join("")}
        </select>
      </label>
    </div>
    <div class="button-row">
      <button class="command danger" data-delete>${l("trash")} Delete</button>
      <button class="command" data-cancel>${l("x")} Close</button>
      <button class="command primary" data-save>${l("check")} Save note</button>
    </div>
  `,s.querySelector("[data-cancel]")?.addEventListener("click",A),s.querySelector("[data-delete]")?.addEventListener("click",Ve),s.querySelector("[data-save]")?.addEventListener("click",_e))}function A(){X=null,L=null,C=null,s.className="panel composer",delete s.dataset.mode,s.innerHTML=""}function Xe(t){t.key==="Escape"&&(!s.classList.contains("open")||s.dataset.mode!=="create"||(t.preventDefault(),t.stopPropagation(),A()))}async function It(t){if(!X)return;const e=s.querySelector("#otu-comment")?.value.trim()??"";if(!e){f("Type a change first");return}const n=Oe(X,e,"change","important");if(t.copyAfter){await Gt([..._(),n],!1),A(),f("Copied without marker");return}h=[...h,n],await j(),d(),w(),u.classList.contains("open")&&g(!0),A(),i.syncEnabled&&Q(()=>St(n)),i.copyOnAdd?(await $t(!1),f("Merged and copied")):f("Merged into batch")}async function _e(){if(!L)return;const t=L,e=s.querySelector("#otu-comment")?.value.trim()??"";if(!e){f("Comment cannot be empty");return}const n=s.querySelector("#otu-intent")?.value??"fix",o=s.querySelector("#otu-severity")?.value??"important",r=new Date().toISOString();h=h.map(a=>a.id===t?{...a,comment:e,intent:n,severity:o,updatedAt:r}:a),await j(),d(),w(),u.classList.contains("open")&&g(!0),A(),i.syncEnabled&&Q(()=>fn(t,{comment:e,intent:n,severity:o,updatedAt:r}))}async function Ve(){L&&await Xt(L)}function Z(t){if(!(t instanceof HTMLElement)||t.closest("[data-opentargetui]"))return!1;const e=t.getBoundingClientRect();if(e.width<80||e.height<40)return!1;const n=getComputedStyle(t);return n.display!=="none"&&n.visibility!=="hidden"&&n.opacity!=="0"}function We(t){const e=t.getAttribute("role");if(e)return e;const n=t.tagName.toLowerCase();return n==="header"?"header":n==="nav"?"navigation":n==="main"?"main":n==="aside"?"aside":n==="footer"?"footer":n==="article"?"article":n==="section"?"section":"content block"}function Ge(t){const e=t.tagName.toLowerCase(),n=t.getAttribute("role"),o=Array.from(t.children).slice(0,4).map(r=>r.tagName.toLowerCase()).join("+");return`${e}${n?`[${n}]`:""}${o?`>${o}`:""}`}function U(t,e){return t.querySelectorAll(e).length}function Ke(t){return Array.from(t.children).filter(Z).slice(0,8).map(e=>{const n=e.getBoundingClientRect(),o=e.tagName.toLowerCase(),r=e.getAttribute("role");return`${o}${r?`[${r}]`:""} ${Math.round(n.width)}x${Math.round(n.height)}`})}function Je(t){const e=new Map;return Array.from(t.children).filter(Z).forEach(n=>{const o=Ge(n);e.set(o,(e.get(o)??0)+1)}),Array.from(e.entries()).filter(([,n])=>n>1).slice(0,5).map(([n,o])=>`${o}x ${n}`)}function Ze(t,e){const n=t.getBoundingClientRect(),o=getComputedStyle(t),r=t.getAttribute("role")??void 0;return{index:e,tag:t.tagName.toLowerCase(),...r?{role:r}:{},landmark:We(t),bounds:He(n),layout:[o.display,o.flexDirection!=="row"?`flex-${o.flexDirection}`:null,o.gridTemplateColumns!=="none"?"grid":null,o.position!=="static"?o.position:null].filter(Boolean).join(", "),childCount:Array.from(t.children).filter(Z).length,directChildren:Ke(t),patterns:Je(t),counts:{headings:U(t,"h1,h2,h3,h4,h5,h6"),links:U(t,"a[href]"),buttons:U(t,"button,[role='button']"),forms:U(t,"form,input,select,textarea"),media:U(t,"img,picture,svg,video"),repeatedItems:U(t,"article,li,[class*='card' i]")}}}function Qe(){const t=["header","nav","main","section","article","aside","footer","[role='banner']","[role='navigation']","[role='main']","[role='complementary']","[role='contentinfo']"].join(","),e=Array.from(document.querySelectorAll(t)).filter(Z),n=e.filter(r=>!e.some(a=>a!==r&&a.contains(r))),o=(n.length>0?n:Array.from(document.body.children).filter(Z)).slice(0,16).map((r,a)=>Ze(r,a+1));return{url:location.href,title:document.title,capturedAt:new Date().toISOString(),viewport:{width:window.innerWidth,height:window.innerHeight},sections:o}}function tn(t){const e=t.sections.map(n=>{const o=Object.entries(n.counts).filter(([,r])=>r>0).map(([r,a])=>`${r}: ${a}`).join(", ");return[`${n.index}. ${n.landmark} (${n.tag}${n.role?`, role=${n.role}`:""})`,`   - Bounds: ${Math.round(n.bounds.x)}, ${Math.round(n.bounds.y)} (${Math.round(n.bounds.width)}x${Math.round(n.bounds.height)}px)`,n.layout?`   - Layout: ${n.layout}`:null,`   - Visible direct children: ${n.childCount}`,n.directChildren.length?`   - Child blocks: ${n.directChildren.join("; ")}`:null,n.patterns.length?`   - Repeated patterns: ${n.patterns.join("; ")}`:null,o?`   - Element counts: ${o}`:null].filter(Boolean).join(`
`)});return["Reference structure to follow:","Use this only for page organization, section order, layout rhythm, and repeated block patterns. Keep the target site's brand, copy, colors, images, and assets unless separately requested.",`Reference page: ${t.url}`,`Reference viewport: ${t.viewport.width}x${t.viewport.height}`,"",...e].join(`
`)}async function Wt(t){const e=await nt(jt(),null);if(t.length===0&&!e)return null;const n=[];return e&&n.push(tn(e)),t.length>0?n.push(he(t,{mode:"change-request",detail:i.outputDetail,includeHeader:!0})):n.push("Restructure the current page to follow the reference structure above."),n.join(`

---

`)}async function $t(t=!0){return Gt(_(),t)}async function Gt(t,e=!0){const n=await Wt(t);return n===null?(e&&f("No changes to copy"),!1):(await navigator.clipboard.writeText(n),e&&f("Change request copied"),!0)}function en(t){return!(t instanceof Element)||t.closest(".toolbar-header .icon-button")?!1:!!t.closest(".toolbar-header, .collapsed-button")}function nn(t){if(t.button!==0||!en(t.target))return;const e=p.getBoundingClientRect();y={pointerId:t.pointerId,startX:t.clientX,startY:t.clientY,startLeft:e.left,startTop:e.top,moved:!1}}function on(t){if(!y||y.pointerId!==t.pointerId)return;const e=t.clientX-y.startX,n=t.clientY-y.startY;if(!y.moved&&Math.hypot(e,n)<4)return;y.moved=!0,p.classList.add("dragging"),p.hasPointerCapture(t.pointerId)||p.setPointerCapture(t.pointerId);const o=p.getBoundingClientRect(),r=tt(y.startLeft+e,y.startTop+n,o.width,o.height);kt(p,r),Ht(),t.preventDefault(),t.stopPropagation()}function Kt(t){if(!y||y.pointerId!==t.pointerId)return;const e=y.moved;if(y=null,p.classList.remove("dragging"),p.hasPointerCapture(t.pointerId)&&p.releasePointerCapture(t.pointerId),e){const n=p.getBoundingClientRect(),o=tt(n.left,n.top,n.width,n.height);i={...i,uiPosition:o},B(D(),i),ot=!0,window.setTimeout(()=>{ot=!1},250),f("UI position saved"),t.preventDefault(),t.stopPropagation()}}function rn(t){return t instanceof Element&&!!t.closest("textarea, button, input, select")}function an(t,e){const n=s.getBoundingClientRect(),o=8,r=Math.max(o,window.innerWidth-n.width-o),a=Math.max(o,window.innerHeight-n.height-o);return{left:Math.min(Math.max(t,o),r),top:Math.min(Math.max(e,o),a)}}function sn(t){if(!s.classList.contains("open")||t.button!==0||rn(t.target))return;const e=s.getBoundingClientRect();C={pointerId:t.pointerId,startX:t.clientX,startY:t.clientY,startLeft:e.left,startTop:e.top},s.classList.add("dragging"),s.setPointerCapture(t.pointerId),t.preventDefault(),t.stopPropagation()}function ln(t){if(!C||C.pointerId!==t.pointerId)return;const e=an(C.startLeft+t.clientX-C.startX,C.startTop+t.clientY-C.startY);s.style.left=`${e.left}px`,s.style.top=`${e.top}px`,t.preventDefault(),t.stopPropagation()}function Jt(t){!C||C.pointerId!==t.pointerId||(C=null,s.classList.remove("dragging"),s.hasPointerCapture(t.pointerId)&&s.releasePointerCapture(t.pointerId),t.preventDefault(),t.stopPropagation())}function cn(){if(!document.getElementById(At)){const t=document.createElement("style");t.id=At,t.textContent=`
      html.opentargetui-motion-paused *,
      html.opentargetui-motion-paused *::before,
      html.opentargetui-motion-paused *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `,document.head.appendChild(t)}gt=Array.from(document.querySelectorAll("video, audio")).filter(t=>t instanceof HTMLMediaElement&&!t.paused?(t.pause(),!0):!1),document.documentElement.classList.add("opentargetui-motion-paused"),N=!0,f("Motion paused")}function dn(){document.documentElement.classList.remove("opentargetui-motion-paused"),gt.forEach(t=>{t.play().catch(()=>{})}),gt=[],N=!1,f("Motion resumed")}async function j(){await B(Pt(location.href),h)}async function un(){i={...q,...await nt(D(),q)},i.serverUrl=xt(i.serverUrl),h=await nt(Pt(location.href),[]),P=await nt(Bt(location.href),null),wt(),st(),d(),w(),M(!1),i.syncEnabled&&Ct()}function st(){S.style.display=i.enabled?"block":"none",!i.enabled&&(b=!1,v=!1,k=null,X=null,L=null,te(),A(),g(!1),M(!1))}function pn(t){const e=i.enabled;i={...q,...t,serverUrl:xt(t.serverUrl||q.serverUrl)},wt(),st(),d(),w(),i.enabled&&!e&&(z=!1),i.enabled&&(d(),u.classList.contains("open")&&g(!0)),i.syncEnabled?Ct():pt()}async function Zt(){if(P)return P;const t=await fetch(`${i.serverUrl}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:location.href,title:document.title})});if(!t.ok)throw new Error(`Session failed: ${t.status}`);const n=(await t.json()).id;return P=n,await B(Bt(location.href),n),h=h.map(o=>({...o,sessionId:n})),await j(),n}async function Ct(){try{ct=!1,rt=!1;const t=await Zt();await Promise.all(h.map(e=>St(e))),hn(t),Be(),f("Server connected")}catch(t){vt(t,"Server unavailable")}}function pt(){W?.close(),W=null}function hn(t){pt(),W=new EventSource(`${i.serverUrl}/sessions/${t}/events`),W.onmessage=e=>{const n=JSON.parse(e.data);n.type==="annotation.updated"&&n.data&&(h=h.map(o=>o.id===n.data?.id?n.data:o),j(),d(),w(),u.classList.contains("open")&&g(!0)),n.type==="annotation.deleted"&&n.annotationId&&(h=h.filter(o=>o.id!==n.annotationId),j(),d(),w(),u.classList.contains("open")&&g(!0))},W.onerror=()=>{vt(void 0,"Server events disconnected")}}async function St(t){const e=await Zt(),n=await fetch(`${i.serverUrl}/sessions/${e}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(`Annotation sync failed: ${n.status}`)}async function fn(t,e){const n=await fetch(`${i.serverUrl}/annotations/${t}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok)throw new Error(`Annotation update failed: ${n.status}`)}async function Qt(t){const e=await fetch(`${i.serverUrl}/annotations/${t}`,{method:"DELETE"});if(!e.ok)throw new Error(`Annotation delete failed: ${e.status}`)}function gn(t){const e=t.getBoundingClientRect();I.style.display="block",I.style.left=`${e.left}px`,I.style.top=`${e.top}px`,I.style.width=`${e.width}px`,I.style.height=`${e.height}px`}function te(){I.style.display="none"}function Et(t){const e=t.target;return!(e instanceof Element)||e.closest("[data-opentargetui]")?null:e}function mn(t){if(!i.enabled||!b&&!v||ut(t))return;const e=Et(t);e&&gn(e)}function bn(){i.enabled&&!b&&!v&&te()}async function xn(t){if(!i.enabled||ut(t))return;const e=Et(t);if(!e&&!k)return;if(t.preventDefault(),t.stopPropagation(),!k){if(!e)return;const o=Nt(e);k={element:e,rect:e.getBoundingClientRect(),path:o,label:re(e)},d(),f("Click the destination");return}const n=Ye(k,t.clientX,t.clientY);h=[...h,n],v=!1,k=null,await j(),d(),w(),u.classList.contains("open")&&g(!0),i.syncEnabled&&Q(()=>St(n)),f("Move request added")}function vn(t){if(!i.enabled||!b||ut(t))return;const e=window.getSelection();if(!e||e.isCollapsed||e.toString().trim().length===0)return;const n=e.getRangeAt(0),o=n.getBoundingClientRect();if(o.width<=0||o.height<=0)return;const r=n.commonAncestorContainer.nodeType===Node.ELEMENT_NODE?n.commonAncestorContainer:n.commonAncestorContainer.parentElement;r instanceof Element&&(ft=!0,_t({element:r,rect:o,clientX:t.clientX,clientY:t.clientY,selectedText:e.toString().trim()}))}function wn(t){if(!i.enabled)return;if(v){xn(t);return}if(!b||ut(t))return;if(ft){ft=!1,t.preventDefault(),t.stopPropagation();return}const e=Et(t);e&&(i.blockPageInteractions&&(t.preventDefault(),t.stopPropagation()),_t({element:e,rect:e.getBoundingClientRect(),clientX:t.clientX,clientY:t.clientY,selectedText:""}))}function yn(){i.enabled&&(w(),Ft())}function H(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.addEventListener("mousemove",mn,!0);document.addEventListener("mouseout",bn,!0);document.addEventListener("mouseup",vn,!0);document.addEventListener("click",wn,!0);document.addEventListener("keydown",Xe,!0);p.addEventListener("pointerdown",nn);p.addEventListener("pointermove",on);p.addEventListener("pointerup",Kt);p.addEventListener("pointercancel",Kt);s.addEventListener("pointerdown",sn);s.addEventListener("pointermove",ln);s.addEventListener("pointerup",Jt);s.addEventListener("pointercancel",Jt);window.addEventListener("scroll",w,{passive:!0});window.addEventListener("resize",yn,{passive:!0});function kn(t,e,n){if(t.source!=="opentargetui-popup")return!1;if(t.type==="set-enabled"){const o=!!t.enabled;return i={...i,enabled:o},B(D(),i),st(),d(),w(),o&&(z=!1,d()),n({ok:!0,enabled:o}),!0}if(t.type==="toggle-selection")return i.enabled||(i={...i,enabled:!0},B(D(),i),st()),b=!b,v=!1,k=null,z=!1,g(!1),M(!1),d(),n({ok:!0}),!0;if(t.type==="copy-feedback")return Wt(_()).then(o=>n({ok:o!==null,text:o??void 0})),!0;if(t.type==="capture-structure-reference"){const o=Qe();return n({ok:!0,reference:o}),B(jt(),o),f("Structure reference captured"),!1}return!1}try{typeof chrome<"u"&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener(kn),typeof chrome<"u"&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((t,e)=>{if(e!=="local")return;const n=t[D()];n?.newValue&&pn(n.newValue)})}catch(t){dt(t)?J=!0:console.warn("[OpenTarget UI] Message handler unavailable",t)}un();
//# sourceMappingURL=content.js.map
