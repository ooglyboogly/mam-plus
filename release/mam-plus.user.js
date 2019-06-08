// ==UserScript==
// @name         mam-plus
// @namespace    https://github.com/GardenShade
// @version      4.0.0
// @description  Tweaks and features for MAM
// @author       GardenShade
// @run-at       document-start
// @include      https://myanonamouse.net/*
// @include      https://www.myanonamouse.net/*
// @connect      https://www.dropbox.com/*
// @icon         https://i.imgur.com/dX44pSv.png
// @resource     MP_CSS https://raw.githubusercontent.com/gardenshade/mam-plus/v4_ts/release/main.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_getResourceText
// ==/UserScript==
"use strict";var SettingGroup,MP,__awaiter=this&&this.__awaiter||function(e,t,s,i){return new(s||(s=Promise))(function(o,n){function r(e){try{l(i.next(e))}catch(e){n(e)}}function a(e){try{l(i.throw(e))}catch(e){n(e)}}function l(e){e.done?o(e.value):new s(function(t){t(e.value)}).then(r,a)}l((i=i.apply(e,t||[])).next())})};!function(e){e[e.Global=0]="Global",e[e["Browse & Search"]=1]="Browse & Search",e[e["Torrent Page"]=2]="Torrent Page",e[e.Shoutbox=3]="Shoutbox",e[e.Vault=4]="Vault",e[e["User Pages"]=5]="User Pages",e[e.Other=6]="Other"}(SettingGroup||(SettingGroup={}));class Util{static afTimer(){return new Promise(e=>{requestAnimationFrame(e)})}static setAttr(e,t){return new Promise(s=>{for(const s in t)e.setAttribute(s,t[s]);s()})}static objectLength(e){return Object.keys(e).length}static purgeSettings(){for(let e of GM_listValues())GM_deleteValue(e)}static reportCount(e,t,s){1!==t&&(s+="s"),MP.DEBUG&&console.log(`> ${e} ${t} ${s}`)}static startFeature(e,t,s){return __awaiter(this,void 0,void 0,function*(){function i(){return __awaiter(this,void 0,void 0,function*(){return yield Check.elemLoad(t),!0})}if(MP.settingsGlob.push(e),GM_getValue(e.title)){if(s){return!0===(yield Check.page(s))&&i()}return i()}return!1})}}class Check{static elemLoad(e){return __awaiter(this,void 0,void 0,function*(){const t=document.querySelector(e);if(MP.DEBUG&&console.log(`%c Looking for ${e}: ${t}`,"background: #222; color: #555"),void 0===t)throw`${e} is undefined!`;return null===t?(yield Util.afTimer(),yield this.elemLoad(e)):t})}static updated(){return MP.DEBUG&&(console.group("Check.updated()"),console.log(`PREV VER = ${this.prevVer}`),console.log(`NEW VER = ${this.newVer}`)),new Promise(e=>{this.newVer!==this.prevVer?(MP.DEBUG&&console.log("Script is new or updated"),GM_setValue("mp_version",this.newVer),this.prevVer?(MP.DEBUG&&(console.log("Script has run before"),console.groupEnd()),e("updated")):(MP.DEBUG&&(console.log("Script has never run"),console.groupEnd()),GM_setValue("goodreadsBtn",!0),GM_setValue("alerts",!0),e("firstRun"))):(MP.DEBUG&&(console.log("Script not updated"),console.groupEnd()),e(!1))})}static page(e){MP.DEBUG&&console.group("Check.page()");let t=GM_getValue("mp_currentPage");return MP.DEBUG&&console.log(`Stored Page: ${t}`),new Promise(s=>{if(void 0!==t)s(e?e===t:t);else{const t=window.location.pathname,i=t.split("/")[1],o=t.split("/")[2];let n;const r={"":"home","index.php":"home",shoutbox:"shoutbox",t:"torrent",preferences:"settings",u:"user",tor:o,millionaires:"vault"};MP.DEBUG&&console.log(`Page @ ${i}\nSubpage @ ${o}`),r[i]?(n=r[i]===o?o.split(".")[0].replace(/[0-9]/g,""):r[i],MP.DEBUG&&console.log(`Currently on ${n} page`),GM_setValue("mp_currentPage",n),s(e?e===n:n)):MP.DEBUG&&console.warn(`pageStr case returns '${r[i]}'`)}MP.DEBUG&&console.groupEnd()})}}Check.newVer=GM_info.script.version,Check.prevVer=GM_getValue("mp_version");class Style{constructor(){this._theme="light",this._prevTheme=this._getPrevTheme(),void 0!==this._prevTheme?this._theme=this._prevTheme:MP.DEBUG&&console.warn("no previous theme"),this._cssData=GM_getResourceText("MP_CSS")}get theme(){return this._theme}set theme(e){this._theme=e}alignToSiteTheme(){return __awaiter(this,void 0,void 0,function*(){const e=yield this._getSiteCSS();this._theme=e.indexOf("dark")>0?"dark":"light",this._prevTheme!==this._theme&&this._setPrevTheme(),Check.elemLoad("body").then(()=>{const e=document.querySelector("body");e?e.classList.add(`mp_${this._theme}`):MP.DEBUG&&console.warn(`Body is ${e}`)})})}injectLink(){const e="mp_css";if(document.getElementById(e))MP.DEBUG&&console.warn(`an element with the id "${e}" already exists`);else{const t=document.createElement("style");t.id=e,t.innerText=void 0!==this._cssData?this._cssData:"",document.querySelector("head").appendChild(t)}}_getPrevTheme(){return GM_getValue("style_theme")}_setPrevTheme(){GM_setValue("style_theme",this._theme)}_getSiteCSS(){return new Promise(e=>{const t=document.querySelector('head link[href*="ICGstation"]').getAttribute("href");"string"==typeof t?e(t):MP.DEBUG&&console.warn(`themeUrl is not a string: ${t}`)})}}class Alerts{constructor(){this._settings={scope:SettingGroup.Other,type:"checkbox",title:"alerts",desc:"Enable the MAM+ Alert panel for update information, etc."},MP.settingsGlob.push(this._settings)}notify(e,t){return MP.DEBUG&&console.group(`Alerts.notify( ${e} )`),new Promise(s=>{if(e)if(GM_getValue("alerts")){const i=(e,t)=>{if(MP.DEBUG&&console.log(`buildMsg( ${t} )`),e.length>0&&""!==e[0]){let s=`<h4>${t}:</h4><ul>`;return e.forEach(e=>{s+=`<li>${e}</li>`},s),s+="</ul>"}return""},o=e=>{MP.DEBUG&&console.log(`buildPanel( ${e} )`),Check.elemLoad("body").then(()=>{document.body.innerHTML+=`<div class='mp_notification'>${e}<span>X</span></div>`;const t=document.querySelector(".mp_notification"),s=t.querySelector("span");try{s&&s.addEventListener("click",()=>{t&&t.remove()},!1)}catch(e){MP.DEBUG&&console.log(e)}})};let n="";"updated"===e?(MP.DEBUG&&console.log("Building update message"),n=`<strong>MAM+ has been updated!</strong> You are now using v${MP.VERSION}, created on ${MP.TIMESTAMP}. Discuss it on <a href='forums.php?action=viewtopic&topicid=41863'>the forums</a>.<hr>`,n+=i(t.UPDATE_LIST,"Changes"),n+=i(t.BUG_LIST,"Known Bugs")):"firstRun"===e?(n='<h4>Welcome to MAM+!</h4>Please head over to your <a href="/preferences/index.php">preferences</a> to enable the MAM+ settings.<br>Any bug reports, feature requests, etc. can be made on <a href="https://github.com/gardenshade/mam-plus/issues">Github</a>, <a href="/forums.php?action=viewtopic&topicid=41863">the forums</a>, or <a href="/sendmessage.php?receiver=108303">through private message</a>.',MP.DEBUG&&console.log("Building first run message")):MP.DEBUG&&console.warn(`Received msg kind: ${e}`),o(n),MP.DEBUG&&console.groupEnd(),s(!0)}else MP.DEBUG&&(console.log("Notifications are disabled."),console.groupEnd()),s(!1)})}get settings(){return this._settings}}class Debug{constructor(){this._settings={scope:SettingGroup.Other,type:"checkbox",title:"debug",desc:"Error log (<em>Click this checkbox to enable verbose logging to the console</em>)"},MP.settingsGlob.push(this._settings)}get settings(){return this._settings}}class HideHome{constructor(){this._settings={scope:SettingGroup.Global,type:"dropdown",title:"hideHome",tag:"Remove banner/home",options:{default:"Do not remove either",hideBanner:"Hide the banner",hideHome:"Hide the home button"},desc:"Remove the header image or Home button, because both link to the homepage"},this._tar="#mainmenu",Util.startFeature(this._settings,this._tar).then(e=>{e&&this._init()})}_init(){const e=GM_getValue(this._settings.title);"hideHome"===e?(document.body.classList.add("mp_hide_home"),console.log("[M+] Hid the home button!")):"hideBanner"===e&&(document.body.classList.add("mp_hide_banner"),console.log("[M+] Hid the banner!"))}get settings(){return this._settings}}class HideBrowse{constructor(){this._settings={scope:SettingGroup.Global,type:"checkbox",title:"hideBrowse",desc:"Remove the Browse button, because Browse &amp; Search are practically the same"},this._tar="#mainmenu",Util.startFeature(this._settings,this._tar).then(e=>{e&&this._init()})}_init(){document.body.classList.add("mp_hide_browse"),console.log("[M+] Hid the browse button!")}get settings(){return this._settings}}class VaultLink{constructor(){this._settings={scope:SettingGroup.Global,type:"checkbox",title:"vaultLink",desc:"Make the Vault link bypass the Vault Info page"},this._tar="#millionInfo",Util.startFeature(this._settings,this._tar).then(e=>{e&&this._init()})}_init(){document.querySelector(this._tar).setAttribute("href","/millionaires/donate.php"),console.log("[M+] Made the vault text link to the donate page!")}get settings(){return this._settings}}class MiniVaultInfo{constructor(){this._settings={scope:SettingGroup.Global,type:"checkbox",title:"miniVaultInfo",desc:"Shorten the Vault link & ratio text"},this._tar="#millionInfo",Util.startFeature(this._settings,this._tar).then(e=>{e&&this._init()})}_init(){const e=document.querySelector(this._tar),t=document.querySelector("#tmR");t.innerHTML=`${parseFloat(t.innerText).toFixed(2)} <img src="/pic/updownBig.png" alt="ratio">`;let s=parseInt(e.textContent.split(":")[1].split(" ")[1].replace(/,/g,""));s=Number((s/1e6).toFixed(3)),e.textContent=`Vault: ${s} million`,console.log("[M+] Shortened the vault & ratio numbers!")}get settings(){return this._settings}}class Shared{constructor(){this.fillGiftBox=((e,t)=>(MP.DEBUG&&console.log(`Shared.fillGiftBox( ${e}, ${t} )`),new Promise(s=>{Check.elemLoad(e).then(()=>{const i=document.querySelector(e);if(i){const e=parseInt(GM_getValue(`${t}_val`));let o=parseInt(i.getAttribute("max"));NaN!==e&&e<=o&&(o=e),i.value=o.toFixed(0),s(o)}else s(void 0)})})))}}class TorGiftDefault{constructor(){this._settings={scope:SettingGroup["Torrent Page"],type:"textbox",title:"torGiftDefault",tag:"Default Gift",placeholder:"ex. 5000, max",desc:"Autofills the Gift box with a specified number of points. (<em>Or the max allowable value, whichever is lower</em>)"},this._tar="#thanksArea input[name=points]",Util.startFeature(this._settings,this._tar,"torrent").then(e=>{e&&this._init()})}_init(){(new Shared).fillGiftBox(this._tar,this._settings.title).then(e=>console.log(`[M+] Set the default gift amount to ${e}`))}get settings(){return this._settings}}class ToggleSnatched{constructor(){this._settings={scope:SettingGroup["Browse & Search"],type:"checkbox",title:"toggleSnatched",desc:"Add a button to hide/show results that you've snatched"},this._tar="#ssr",this._visible=GM_getValue("toggleSnatchedState"),Util.startFeature(this._settings,this._tar,"browse").then(e=>{e&&this._init()})}_init(){return __awaiter(this,void 0,void 0,function*(){let e,t,s;GM_getValue("stickySnatchedToggle")||this.setVisState(void 0),yield Promise.all([e=this._buildBtn(),t=this._getSearchList()]),this.setVisState(this._visible),e.then(e=>{e.addEventListener("click",()=>{"true"===this._visible?this.setVisState("false"):this.setVisState("true"),this._filterResults(s,'td div[class^="browse"]')},!1)}).catch(e=>{throw new Error(e)}),t.then(e=>{s=e,this._filterResults(s,'td div[class^="browse"]')})})}_buildBtn(){return new Promise(e=>{const t=document.querySelector("#resetNewIcon"),s=document.createElement("h1");t.insertAdjacentElement("beforebegin",s),Util.setAttr(s,{id:"mp_snatchedToggle",class:"torFormButton",role:"button"}),s.innerHTML="Hide Snatched",e(s)})}_getSearchList(){return new Promise(e=>__awaiter(this,void 0,void 0,function*(){yield Check.elemLoad('#ssr tr[id ^= "tdr"] td');const t=document.querySelectorAll('#ssr tr[id ^= "tdr"]');this._searchList=t,e(t)}))}_filterResults(e,t){e.forEach(e=>{const s=document.querySelector("#mp_snatchedToggle");let i=e.querySelector(t);console.log("🔥",i),null!==i&&("false"===this._visible?(s.innerHTML="Show Snatched",e.style.display="none"):(s.innerHTML="Hide Snatched",e.style.display="table-row"))})}setVisState(e){MP.DEBUG&&console.log("vis state:",this._visible,"\nval:",e),void 0===e&&(e="true"),GM_setValue("toggleSnatchedState",e),this._visible=e}get settings(){return this._settings}get searchList(){if(void 0===this._searchList)throw new Error("searchlist is undefined");return this._searchList}get visible(){return this._visible}set visible(e){this.setVisState(e)}}class StickySnatchedToggle{constructor(){this._settings={scope:SettingGroup["Browse & Search"],type:"checkbox",title:"stickySnatchedToggle",desc:"Make toggle state persist between page loads"},this._tar="#ssr",Util.startFeature(this._settings,this._tar,"browse").then(e=>{e&&this._init()})}_init(){console.log("[M+] Remembered snatch visibility state!")}get settings(){return this._settings}}class SimpleVault{constructor(){this._settings={scope:SettingGroup.Vault,type:"checkbox",title:"simpleVault",desc:"Simplify the Vault pages. (<em>This removes everything except the donate button &amp; list of recent donations</em>)"},this._tar="#mainBody",Util.startFeature(this._settings,this._tar,"vault").then(e=>{e&&this._init()})}_init(){return __awaiter(this,void 0,void 0,function*(){const e=GM_getValue("mp_currentPage"),t=document.querySelector(this._tar);console.group(`Applying Vault (${e}) settings...`);const s=t.querySelector("form"),i=t.querySelector("table:last-of-type");if(t.innerHTML="",null!=s){const e=s.cloneNode(!0);t.appendChild(e),e.classList.add("mp_vaultClone")}else t.innerHTML="<h1>Come back tomorrow!</h1>";if(null!=i){const e=i.cloneNode(!0);t.appendChild(e),e.classList.add("mp_vaultClone")}else t.style.paddingBottom="25px";console.log("[M+] Simplified the vault page!")})}get settings(){return this._settings}}class UserGiftDefault{constructor(){this._settings={scope:SettingGroup["User Pages"],type:"textbox",title:"userGiftDefault",tag:"Default Gift",placeholder:"ex. 1000, max",desc:"Autofills the Gift box with a specified number of points. (<em>Or the max allowable value, whichever is lower</em>)"},this._tar="#bonusgift",Util.startFeature(this._settings,this._tar,"user").then(e=>{e&&this._init()})}_init(){(new Shared).fillGiftBox(this._tar,this._settings.title).then(e=>console.log(`[M+] Set the default gift amount to ${e}`))}get settings(){return this._settings}}class InitFeatures{constructor(){new HideHome,new HideBrowse,new VaultLink,new MiniVaultInfo,new ToggleSnatched,new StickySnatchedToggle,new TorGiftDefault,new SimpleVault,new UserGiftDefault}}class Settings{static _getScopes(e){return MP.DEBUG&&console.log("_getScopes(",e,")"),new Promise(t=>{let s={};for(let t of e){let e=Number(t.scope);s[e]?s[e].push(t):s[e]=[t]}t(s)})}static _buildTable(e){return MP.DEBUG&&console.log("_buildTable(",e,")"),new Promise(t=>{let s='<tbody><tr><td class="row1" colspan="2"><br>Here you can enable &amp; disable any feature from the <a href="/forums.php?action=viewtopic&topicid=41863&page=p376355#376355">MAM+ userscript</a>! However, these settings are <strong>NOT</strong> stored on MAM; they are stored within the Tampermonkey/Greasemonkey extension in your browser, and must be customized on each of your browsers/devices separately.<br><br></td></tr>';Object.keys(e).forEach(t=>{let i=Number(t);s+=`<tr><td class='row2'>${SettingGroup[i]}</td><td class='row1'>`,Object.keys(e[i]).forEach(t=>{let o=Number(t),n=e[i][o];const r={checkbox:()=>{s+=`<input type='checkbox' id='${n.title}' value='true'>${n.desc}<br>`},textbox:()=>{s+=`<span class='mp_setTag'>${n.tag}:</span> <input type='text' id='${n.title}' placeholder='${n.placeholder}' class='mp_textInput' size='25'>${n.desc}<br>`},dropdown:()=>{s+=`<span class='mp_setTag'>${n.tag}:</span> <select id='${n.title}' class='mp_dropInput'>`,n.options&&Object.keys(n.options).forEach(e=>{s+=`<option value='${e}'>${n.options[e]}</option>`}),s+=`</select>${n.desc}<br>`}};n.type&&r[n.type]()}),s+="</td></tr>"}),t(s+='<tr><td class="row1" colspan="2"><div id="mp_submit">Save M+ Settings</div><span class="mp_savestate" style="opacity:0">Saved!</span></td></tr></tbody>')})}static _getSettings(e){let t=GM_listValues();MP.DEBUG&&console.log("_getSettings(",e,")\nStored GM keys:",t),Object.keys(e).forEach(t=>{Object.keys(e[Number(t)]).forEach(s=>{let i=e[Number(t)][Number(s)];if(MP.DEBUG&&console.log("Pref:",i.title,"| Set:",GM_getValue(`${i.title}`),"| Value:",GM_getValue(`${i.title}_val`)),null!==i&&"object"==typeof i){let e=document.getElementById(i.title);const t={checkbox:()=>{e.setAttribute("checked","checked")},textbox:()=>{e.value=GM_getValue(`${i.title}_val`)},dropdown:()=>{e.value=GM_getValue(i.title)}};t[i.type]&&GM_getValue(i.title)&&t[i.type]()}})})}static _setSettings(e){MP.DEBUG&&console.log("_setSettings(",e,")"),Object.keys(e).forEach(t=>{Object.keys(e[Number(t)]).forEach(s=>{let i=e[Number(t)][Number(s)];if(null!==i&&"object"==typeof i){let e=document.getElementById(i.title);const t={checkbox:()=>{e.checked&&GM_setValue(i.title,!0)},textbox:()=>{const t=e.value;""!==t&&(GM_setValue(i.title,!0),GM_setValue(`${i.title}_val`,t))},dropdown:()=>{GM_setValue(i.title,e.value)}};t[i.type]&&t[i.type]()}})}),console.log("[M+] Saved!")}static _saveSettings(e,t){MP.DEBUG&&console.group("_saveSettings()");const s=document.querySelector("span.mp_savestate"),i=GM_listValues();s.style.opacity="0",window.clearTimeout(e),console.log("[M+] Saving...");for(let e in i)"function"!=typeof i[e]&&(["mp_version","style_theme"].includes(i[e])||GM_setValue(i[e],!1));this._setSettings(t),s.style.opacity="1";try{e=window.setTimeout(()=>{s.style.opacity="0"},2345)}catch(e){MP.DEBUG&&console.warn(e)}MP.DEBUG&&console.groupEnd()}static init(e,t){return __awaiter(this,void 0,void 0,function*(){!0===e&&(MP.DEBUG&&console.group("new Settings()"),yield Check.elemLoad("#mainBody > table").then(e=>{MP.DEBUG&&console.log("[M+] Starting to build Settings table...");const s=document.querySelector("#mainBody > table"),i=document.createElement("h1"),o=document.createElement("table");let n;s.insertAdjacentElement("afterend",i),i.insertAdjacentElement("afterend",o),Util.setAttr(o,{class:"coltable",cellspacing:"1",style:"width:100%;min-width:100%;max-width:100%;"}),i.innerHTML="MAM+ Settings",this._getScopes(t).then(e=>(n=e,this._buildTable(e))).then(e=>(o.innerHTML=e,console.log("[M+] Added the MAM+ Settings table!"),n)).then(e=>(this._getSettings(e),e)).then(e=>{const t=document.querySelector("#mp_submit");try{t.addEventListener("click",()=>{this._saveSettings(void 0,e)},!1)}catch(e){MP.DEBUG&&console.warn(e)}MP.DEBUG&&console.groupEnd()})}))})}}Settings.obj={browse:{plaintextSearch:{id:"plaintextSearch",type:"checkbox",desc:"Insert plaintext search results at top of page"}},torrent:{pageTitle:"Torrent",goodreadsBtn:{id:"goodreadsBtn",type:"checkbox",desc:"Enable the MAM-to-Goodreads buttons"},fetchRating:{id:"fetchRating",type:"checkbox",desc:"Retrieve Goodreads rating info if possible"}},shoutbox:{pageTitle:"Shoutbox",priorityUsers:{id:"priorityUsers",type:"textbox",tag:"Emphasize Users",placeholder:"ex. 6, 25420, 77618",desc:"Emphasizes messages from the listed users in the shoutbox"},priorityStyle:{id:"priorityStyle",type:"textbox",tag:"Emphasis Style",placeholder:"default: 125, 125, 125, 0.3",desc:"Change the color/opacity of the highlighting rule for emphasized users' posts.<br>(<em>This is formatted as R,G,B,Opacity. RGB are 0-255 and Opacity is 0-1</em>)"},blockUsers:{id:"blockUsers",type:"textbox",tag:"Block Users",placeholder:"ex. 1234, 108303, 10000",desc:"Obscures messages from the listed users in the shoutbox"}}},function(e){e.DEBUG=!!GM_getValue("debug"),e.CHANGELOG={UPDATE_LIST:["CODE: Moved from Coffeescript to Typescript to allow for better practices and easier contribution. This likely introduced bugs.","CODE: Script starts before the page loads and uses a CSS sheet to hopefully prevent flashing content. This likely introduced bugs. ","CODE: Made features modular. This hopefully speeds up development","FIX: Home page features were not running if navigated to via the Home button","FIX: Default User Gift is now a textbox just like the Default Torrent Gift","ENHANCE: Toggle Snatched state can now be remembered"],BUG_LIST:["S: Currently, each function runs its own query to see what page is active; this value should be stored and reused for efficiency"]},e.TIMESTAMP="Jun 8",e.VERSION=Check.newVer,e.PREV_VER=Check.prevVer,e.errorLog=[],e.pagePath=window.location.pathname,e.mpCss=new Style,e.settingsGlob=[],e.run=(()=>__awaiter(this,void 0,void 0,function*(){console.group(`Welcome to MAM+ v${e.VERSION}!!!`),GM_deleteValue("mp_currentPage"),Check.page(),document.cookie="mp_enabled=1;domain=myanonamouse.net;path=/";const t=new Alerts;new Debug,Check.updated().then(s=>{s&&t.notify(s,e.CHANGELOG)}),new InitFeatures,Check.page("settings").then(t=>{!0===t&&Settings.init(t,e.settingsGlob)}),Check.elemLoad('head link[href*="ICGstation"]').then(()=>{e.mpCss.injectLink(),e.mpCss.alignToSiteTheme()}),console.groupEnd()}))}(MP||(MP={})),MP.run();