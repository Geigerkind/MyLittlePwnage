!function(e){function t(t){for(var n,i,r=t[0],a=t[1],o=0,c=[];o<r.length;o++)i=r[o],s[i]&&c.push(s[i][0]),s[i]=0;for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n]);for(l&&l(t);c.length;)c.shift()()}var n={},s={9:0};function i(t){if(n[t])return n[t].exports;var s=n[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.e=function(e){var t=[],n=s[e];if(0!==n)if(n)t.push(n[2]);else{var r=new Promise(function(t,i){n=s[e]=[t,i]});t.push(n[2]=r);var a=document.getElementsByTagName("head")[0],o=document.createElement("script");o.charset="utf-8",o.timeout=120,i.nc&&o.setAttribute("nonce",i.nc),o.src=i.p+""+({0:"vendors~firebasedatabase~firebaseinit~gamelogic",1:"vendors~firebasedatabase~gamelogic",2:"vendors~gamelogic",3:"imprint",4:"gamelogic",5:"firebaseinit",6:"vendors~firebaseui",7:"top10k",8:"crypto-js"}[e]||e)+".bundle.1f34d0524f14d7ec16c8.js";var l=setTimeout(function(){c({type:"timeout",target:o})},12e4);function c(t){o.onerror=o.onload=null,clearTimeout(l);var n=s[e];if(0!==n){if(n){var i=t&&("load"===t.type?"missing":t.type),r=t&&t.target&&t.target.src,a=new Error("Loading chunk "+e+" failed.\n("+i+": "+r+")");a.type=i,a.request=r,n[1](a)}s[e]=void 0}}o.onerror=o.onload=c,a.appendChild(o)}return Promise.all(t)},i.m=e,i.c=n,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},i.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i.oe=function(e){throw console.error(e),e};var r=window.webpackJsonp=window.webpackJsonp||[],a=r.push.bind(r);r.push=t,r=r.slice();for(var o=0;o<r.length;o++)t(r[o]);var l=a;i(i.s="49On")}({"+jIT":function(e,t,n){"use strict";n.r(t),n.d(t,"state",function(){return s});const s={game:{players:[]},page:"index",players:[],rounds:0,mode:0,maxRounds:10,hackLastQuestion:0,gamesRef:()=>Promise.all([Promise.all([n.e(0),n.e(1)]).then(function(){var e=n("jHEe");return"object"==typeof e&&e&&e.__esModule?e:Object.assign({},"object"==typeof e&&e,{default:e})}),Promise.all([n.e(0),n.e(5)]).then(n.bind(null,"qiDv"))]).then(([e,t])=>t.database().ref("games")),isCreator:()=>s.user.uid===game.creator}},"49On":function(e,t,n){"use strict";n.r(t);var s=n("dr/t"),i=n("+jIT");Object(s.rerender)(),window.state=i.state,window.rerender=s.rerender,"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(e=>{console.log("SW registered: ",e)}).catch(e=>{console.log("SW registration failed: ",e)})})},LfEo:function(e,t,n){"use strict";n.d(t,"a",function(){return o});var s=n("R7eb"),i=n("dr/t"),r=n("xzSw"),a=n.n(r);const o=e=>s["a"]`
<img height="200" width="200" src="${a.a}"  alt="A unicorn vomiting a rainbow" />
<h1>Ready to pwn?</h1>
<div class="button" on-click=${t=>{Promise.all([n.e(0),n.e(1),n.e(2),n.e(4)]).then(n.bind(null,"qnbl")).then(({anonLogin:t,createNewGame:n})=>{e.user?(n(e.user),Object(i.changePage)("name")):t().then(e=>{n(e),Object(i.changePage)("name")})})}}>Singleplayer</div>
<div class="button" on-click=${e=>Object(i.changePage)("create_mp")}>Multiplayer</div>
  <div class="button" id="mode-button" on-click=${t=>{0===e.mode?e.mode=1:e.mode=0,Object(i.rerender)()}}
  >Mode: ${0===e.mode?"Number => Password":"Password => Number"}</div>
`},R7eb:function(e,t,n){"use strict";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const s=new Map;class i{constructor(e,t,n,s=_){this.strings=e,this.values=t,this.type=n,this.partCallback=s}getHTML(){const e=this.strings.length-1;let t="",n=!0;for(let s=0;s<e;s++){const e=this.strings[s];t+=e;const i=u(e);t+=(n=i>-1?i<e.length:n)?o:a}return t+this.strings[e]}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}function r(e,t,n=function(e){let t=s.get(e.type);void 0===t&&(t=new Map,s.set(e.type,t));let n=t.get(e.strings);return void 0===n&&(n=new h(e,e.getTemplateElement()),t.set(e.strings,n)),n}){const i=n(e);let r=t.__templateInstance;if(void 0!==r&&r.template===i&&r._partCallback===e.partCallback)return void r.update(e.values);r=new w(i,e.partCallback,n),t.__templateInstance=r;const a=r._clone();r.update(e.values),x(t,t.firstChild),t.appendChild(a)}const a=`{{lit-${String(Math.random()).slice(2)}}}`,o=`\x3c!--${a}--\x3e`,l=new RegExp(`${a}|${o}`),c=/[ \x09\x0a\x0c\x0d]([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)[ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*)$/;function u(e){const t=e.lastIndexOf(">");return e.indexOf("<",t+1)>-1?e.length:t}class d{constructor(e,t,n,s,i){this.type=e,this.index=t,this.name=n,this.rawName=s,this.strings=i}}class h{constructor(e,t){this.parts=[],this.element=t;const n=this.element.content,s=document.createTreeWalker(n,133,null,!1);let i=-1,r=0;const o=[];let u,h;for(;s.nextNode();){i++,u=h;const t=h=s.currentNode;if(1===t.nodeType){if(!t.hasAttributes())continue;const n=t.attributes;let s=0;for(let e=0;e<n.length;e++)n[e].value.indexOf(a)>=0&&s++;for(;s-- >0;){const s=e.strings[r],a=c.exec(s)[1],o=n.getNamedItem(a),u=o.value.split(l);this.parts.push(new d("attribute",i,o.name,a,u)),t.removeAttribute(o.name),r+=u.length-1}}else if(3===t.nodeType){const e=t.nodeValue;if(e.indexOf(a)<0)continue;const n=t.parentNode,s=e.split(l),o=s.length-1;r+=o,t.textContent=s[o];for(let e=0;e<o;e++)n.insertBefore(document.createTextNode(s[e]),t),this.parts.push(new d("node",i++))}else if(8===t.nodeType&&t.nodeValue===a){const e=t.parentNode,n=t.previousSibling;null===n||n!==u||n.nodeType!==Node.TEXT_NODE?e.insertBefore(document.createTextNode(""),t):i--,this.parts.push(new d("node",i++)),o.push(t),null===t.nextSibling?e.insertBefore(document.createTextNode(""),t):i--,h=u,r++}}for(const e of o)e.parentNode.removeChild(e)}}const p=(e,t)=>m(t)?(t=t(e),f):null===t?void 0:t,m=e=>"function"==typeof e&&!0===e.__litDirective,f={},g=e=>null===e||!("object"==typeof e||"function"==typeof e);class v{constructor(e,t,n,s){this.instance=e,this.element=t,this.name=n,this.strings=s,this.size=s.length-1,this._previousValues=[]}_interpolate(e,t){const n=this.strings,s=n.length-1;let i="";for(let r=0;r<s;r++){i+=n[r];const s=p(this,e[t+r]);if(s&&s!==f&&(Array.isArray(s)||"string"!=typeof s&&s[Symbol.iterator]))for(const e of s)i+=e;else i+=s}return i+n[s]}_equalToPreviousValues(e,t){for(let n=t;n<t+this.size;n++)if(this._previousValues[n]!==e[n]||!g(e[n]))return!1;return!0}setValue(e,t){if(this._equalToPreviousValues(e,t))return;const n=this.strings;let s;2===n.length&&""===n[0]&&""===n[1]?(s=p(this,e[t]),Array.isArray(s)&&(s=s.join(""))):s=this._interpolate(e,t),s!==f&&this.element.setAttribute(this.name,s),this._previousValues=e}}class b{constructor(e,t,n){this.instance=e,this.startNode=t,this.endNode=n,this._previousValue=void 0}setValue(e){if((e=p(this,e))!==f)if(g(e)){if(e===this._previousValue)return;this._setText(e)}else e instanceof i?this._setTemplateResult(e):Array.isArray(e)||e[Symbol.iterator]?this._setIterable(e):e instanceof Node?this._setNode(e):void 0!==e.then?this._setPromise(e):this._setText(e)}_insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}_setNode(e){this._previousValue!==e&&(this.clear(),this._insert(e),this._previousValue=e)}_setText(e){const t=this.startNode.nextSibling;e=void 0===e?"":e,t===this.endNode.previousSibling&&t.nodeType===Node.TEXT_NODE?t.textContent=e:this._setNode(document.createTextNode(e)),this._previousValue=e}_setTemplateResult(e){const t=this.instance._getTemplate(e);let n;this._previousValue&&this._previousValue.template===t?n=this._previousValue:(n=new w(t,this.instance._partCallback,this.instance._getTemplate),this._setNode(n._clone()),this._previousValue=n),n.update(e.values)}_setIterable(e){Array.isArray(this._previousValue)||(this.clear(),this._previousValue=[]);const t=this._previousValue;let n=0;for(const s of e){let e=t[n];if(void 0===e){let s=this.startNode;n>0&&(s=t[n-1].endNode=document.createTextNode(""),this._insert(s)),e=new b(this.instance,s,this.endNode),t.push(e)}e.setValue(s),n++}if(0===n)this.clear(),this._previousValue=void 0;else if(n<t.length){const e=t[n-1];t.length=n,this.clear(e.endNode.previousSibling),e.endNode=this.endNode}}_setPromise(e){this._previousValue=e,e.then(t=>{this._previousValue===e&&this.setValue(t)})}clear(e=this.startNode){x(this.startNode.parentNode,e.nextSibling,this.endNode)}}const _=(e,t,n)=>{if("attribute"===t.type)return new v(e,n,t.name,t.strings);if("node"===t.type)return new b(e,n,n.nextSibling);throw new Error(`Unknown part type ${t.type}`)};class w{constructor(e,t,n){this._parts=[],this.template=e,this._partCallback=t,this._getTemplate=n}update(e){let t=0;for(const n of this._parts)void 0===n.size?(n.setValue(e[t]),t++):(n.setValue(e,t),t+=n.size)}_clone(){const e=document.importNode(this.template.element.content,!0),t=this.template.parts;if(t.length>0){const n=document.createTreeWalker(e,133,null,!1);let s=-1;for(let e=0;e<t.length;e++){const i=t[e];for(;s<i.index;)s++,n.nextNode();this._parts.push(this._partCallback(this,i,n.currentNode))}}return e}}const x=(e,t,n=null)=>{let s=t;for(;s!==n;){const t=s.nextSibling;e.removeChild(s),s=t}};n.d(t,"a",function(){return y}),n.d(t,"b",function(){return r});
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const y=(e,...t)=>new i(e,t,"html",N),N=(e,t,n)=>{if("attribute"===t.type){if(t.rawName.startsWith("on-"))return new class{constructor(e,t,n){this.instance=e,this.element=t,this.eventName=n}setValue(e){const t=p(this,e),n=this._listener;t!==n&&(this._listener=t,null!=n&&this.element.removeEventListener(this.eventName,n),null!=t&&this.element.addEventListener(this.eventName,t))}}(e,n,t.rawName.slice(3));if(t.name.endsWith("$")){const s=t.name.slice(0,-1);return new v(e,n,s,t.strings)}return t.name.endsWith("?")?new class extends v{setValue(e,t){const n=this.strings;if(2!==n.length||""!==n[0]||""!==n[1])throw new Error("boolean attributes can only contain a single expression");{const n=p(this,e[t]);if(n===f)return;n?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name)}}}(e,n,t.name.slice(0,-1),t.strings):new class extends v{setValue(e,t){const n=this.strings;let s;this._equalToPreviousValues(e,t)||((s=2===n.length&&""===n[0]&&""===n[1]?p(this,e[t]):this._interpolate(e,t))!==f&&(this.element[this.name]=s),this._previousValues=e)}}(e,n,t.rawName,t.strings)}return _(e,t,n)}},"dr/t":function(e,t,n){"use strict";n.r(t);var s=n("R7eb"),i=n("+jIT"),r=n("LfEo"),a=n("xzSw"),o=n.n(a);const l=e=>s["a"]`
<header>
    <div>
      <a href="javascript:void(0);" on-click=${e=>d("index")}>
        <img height="40" width="40" src="${o.a}" title="MyLittlePwnage" alt="A unicorn vomiting a rainbow"  />
      </a>
    </div>
    <div id="title">MyLittlePwnage</div>
</header>
<main>
    <section>
        ${c(e)}
    </section>
</main>
<footer>
    <a href="https://lergin.de/imprint">Imprint</a>
    <a href="https://lergin.de/privacy">Privacy<a>
    <a href="javascript:void(0);" on-click=${e=>d("imprint")}>Credits</a>
</footer>`,c=e=>{if("index"==e.page)return Object(r.a)(e);switch(e.page){case"index":return Object(r.a)(e);case"imprint":return n.e(3).then(n.bind(null,"gfhc")).then(({imprintTemplate:t})=>t(e))}return Promise.all([n.e(0),n.e(1),n.e(2),n.e(4)]).then(n.bind(null,"qnbl")).then(({questionGuessPwTemplate:t,questionGuessAmountTemplate:n,createMPGameTemplate:s,setNameTemplate:i,enterGroupTemplate:r,leaderboardTemplate:a,answerTemplate:o,loadingTemplate:l,winTemplate:c,waitingTemplate:u})=>{switch(e.page){case"question":switch(e.game.mode){case 0:return t(e);case 1:return n(e)}break;case"create_mp":return s(e);case"name":return i(e);case"enter_group":return r(e);case"waiting":return u(e);case"leaderboard":return a(e);case"win":return c(e);case"answer":return o(e);case"loading":return l(e)}})};function u(){Object(s.b)(l(i.state),document.body)}function d(e){i.state.page=e,gtag("config",window.GA_TRACKING_ID,{page_path:`/${e}`}),u()}n.d(t,"rerender",function(){return u}),n.d(t,"changePage",function(){return d}),window.location.hash.startsWith("#!")&&Promise.all([n.e(0),n.e(1),n.e(2),n.e(4)]).then(n.bind(null,"qnbl")).then(({anonLogin:e,openGame:t})=>{i.state.user?(t(window.location.hash.substr(2)),d("name")):e().then(e=>{t(window.location.hash.substr(2)),d("name")})})},xzSw:function(e,t,n){e.exports=n.p+"3414894f6df05c17c9e848256138e374.png"}});
//# sourceMappingURL=app.bundle.1f34d0524f14d7ec16c8.js.map