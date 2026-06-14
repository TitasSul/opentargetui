const e="opentargetui:v1:settings",t={enabled:!0,outputDetail:"standard",markerColor:"#35c5b1",serverUrl:"http://localhost:4747",syncEnabled:!1,copyOnAdd:!1,hideMarkers:!1,blockPageInteractions:!0};chrome.runtime.onInstalled.addListener(async()=>{(await chrome.storage.local.get(e))[e]||await chrome.storage.local.set({[e]:t})});
//# sourceMappingURL=background.js.map
