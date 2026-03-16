(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={context:void 0,registry:void 0,effects:void 0,done:!1,getContextId(){return t(this.context.count)},getNextContextId(){return t(this.context.count++)}};function t(t){let n=String(t),r=n.length-1;return e.context.id+(r?String.fromCharCode(96+r):``)+n}function n(t){e.context=t}function r(){return{...e.context,id:e.getNextContextId(),count:0}}var i=(e,t)=>e===t,a=Symbol(`solid-track`),o={equals:i},s=null,c=le,l=1,u=2,d={owned:null,cleanups:null,context:null,owner:null},f=null,p=null,m=null,h=null,g=null,_=null,v=null,y=0;function b(e,t){let n=g,r=f,i=e.length===0,a=t===void 0?r:t,o=i?d:{owned:null,cleanups:null,context:a?a.context:null,owner:a},s=i?e:()=>e(()=>T(()=>M(o)));f=o,g=null;try{return j(s,!0)}finally{g=n,f=r}}function x(e,t){t=t?Object.assign({},o,t):o;let n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0};return[ie.bind(n),e=>(typeof e==`function`&&(e=p&&p.running&&p.sources.has(n)?e(n.tValue):e(n.value)),ae(n,e))]}function S(e,t,n){let r=se(e,t,!1,l);m&&p&&p.running?_.push(r):k(r)}function C(e,t,n){c=de;let r=se(e,t,!1,l),i=re&&ne(re);i&&(r.suspense=i),(!n||!n.render)&&(r.user=!0),v?v.push(r):k(r)}function w(e,t,n){n=n?Object.assign({},o,n):o;let r=se(e,t,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,m&&p&&p.running?(r.tState=l,_.push(r)):k(r),ie.bind(r)}function T(e){if(!h&&g===null)return e();let t=g;g=null;try{return h?h.untrack(e):e()}finally{g=t}}function E(e){C(()=>T(e))}function D(e){return f===null||(f.cleanups===null?f.cleanups=[e]:f.cleanups.push(e)),e}function O(e){if(p&&p.running)return e(),p.done;let t=g,n=f;return Promise.resolve().then(()=>{g=t,f=n;let r;return(m||re)&&(r=p||={sources:new Set,effects:[],promises:new Set,disposed:new Set,queue:new Set,running:!0},r.done||=new Promise(e=>r.resolve=e),r.running=!0),j(e,!1),g=f=null,r?r.done:void 0})}var[ee,te]=x(!1);function ne(e){let t;return f&&f.context&&(t=f.context[e.id])!==void 0?t:e.defaultValue}var re;function ie(){let e=p&&p.running;if(this.sources&&(e?this.tState:this.state))if((e?this.tState:this.state)===l)k(this);else{let e=_;_=null,j(()=>fe(this),!1),_=e}if(g){let e=this.observers?this.observers.length:0;g.sources?(g.sources.push(this),g.sourceSlots.push(e)):(g.sources=[this],g.sourceSlots=[e]),this.observers?(this.observers.push(g),this.observerSlots.push(g.sources.length-1)):(this.observers=[g],this.observerSlots=[g.sources.length-1])}return e&&p.sources.has(this)?this.tValue:this.value}function ae(e,t,n){let r=p&&p.running&&p.sources.has(e)?e.tValue:e.value;if(!e.comparator||!e.comparator(r,t)){if(p){let r=p.running;(r||!n&&p.sources.has(e))&&(p.sources.add(e),e.tValue=t),r||(e.value=t)}else e.value=t;e.observers&&e.observers.length&&j(()=>{for(let t=0;t<e.observers.length;t+=1){let n=e.observers[t],r=p&&p.running;r&&p.disposed.has(n)||((r?!n.tState:!n.state)&&(n.pure?_.push(n):v.push(n),n.observers&&pe(n)),r?n.tState=l:n.state=l)}if(_.length>1e6)throw _=[],Error()},!1)}return t}function k(e){if(!e.fn)return;M(e);let t=y;oe(e,p&&p.running&&p.sources.has(e)?e.tValue:e.value,t),p&&!p.running&&p.sources.has(e)&&queueMicrotask(()=>{j(()=>{p&&(p.running=!0),g=f=e,oe(e,e.tValue,t),g=f=null},!1)})}function oe(e,t,n){let r,i=f,a=g;g=f=e;try{r=e.fn(t)}catch(t){return e.pure&&(p&&p.running?(e.tState=l,e.tOwned&&e.tOwned.forEach(M),e.tOwned=void 0):(e.state=l,e.owned&&e.owned.forEach(M),e.owned=null)),e.updatedAt=n+1,_e(t)}finally{g=a,f=i}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&`observers`in e?ae(e,r,!0):p&&p.running&&e.pure?(p.sources.add(e),e.tValue=r):e.value=r,e.updatedAt=n)}function se(e,t,n,r=l,i){let a={fn:e,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:f,context:f?f.context:null,pure:n};if(p&&p.running&&(a.state=0,a.tState=r),f===null||f!==d&&(p&&p.running&&f.pure?f.tOwned?f.tOwned.push(a):f.tOwned=[a]:f.owned?f.owned.push(a):f.owned=[a]),h&&a.fn){let[e,t]=x(void 0,{equals:!1}),n=h.factory(a.fn,t);D(()=>n.dispose());let r=h.factory(a.fn,()=>O(t).then(()=>r.dispose()));a.fn=t=>(e(),p&&p.running?r.track(t):n.track(t))}return a}function A(e){let t=p&&p.running;if((t?e.tState:e.state)===0)return;if((t?e.tState:e.state)===u)return fe(e);if(e.suspense&&T(e.suspense.inFallback))return e.suspense.effects.push(e);let n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<y);){if(t&&p.disposed.has(e))return;(t?e.tState:e.state)&&n.push(e)}for(let r=n.length-1;r>=0;r--){if(e=n[r],t){let t=e,i=n[r+1];for(;(t=t.owner)&&t!==i;)if(p.disposed.has(t))return}if((t?e.tState:e.state)===l)k(e);else if((t?e.tState:e.state)===u){let t=_;_=null,j(()=>fe(e,n[0]),!1),_=t}}}function j(e,t){if(_)return e();let n=!1;t||(_=[]),v?n=!0:v=[],y++;try{let t=e();return ce(n),t}catch(e){n||(v=null),_=null,_e(e)}}function ce(e){if(_&&=(m&&p&&p.running?ue(_):le(_),null),e)return;let t;if(p){if(!p.promises.size&&!p.queue.size){let e=p.sources,n=p.disposed;v.push.apply(v,p.effects),t=p.resolve;for(let e of v)`tState`in e&&(e.state=e.tState),delete e.tState;p=null,j(()=>{for(let e of n)M(e);for(let t of e){if(t.value=t.tValue,t.owned)for(let e=0,n=t.owned.length;e<n;e++)M(t.owned[e]);t.tOwned&&(t.owned=t.tOwned),delete t.tValue,delete t.tOwned,t.tState=0}te(!1)},!1)}else if(p.running){p.running=!1,p.effects.push.apply(p.effects,v),v=null,te(!0);return}}let n=v;v=null,n.length&&j(()=>c(n),!1),t&&t()}function le(e){for(let t=0;t<e.length;t++)A(e[t])}function ue(e){for(let t=0;t<e.length;t++){let n=e[t],r=p.queue;r.has(n)||(r.add(n),m(()=>{r.delete(n),j(()=>{p.running=!0,A(n)},!1),p&&(p.running=!1)}))}}function de(t){let r,i=0;for(r=0;r<t.length;r++){let e=t[r];e.user?t[i++]=e:A(e)}if(e.context){if(e.count){e.effects||=[],e.effects.push(...t.slice(0,i));return}n()}for(e.effects&&(e.done||!e.count)&&(t=[...e.effects,...t],i+=e.effects.length,delete e.effects),r=0;r<i;r++)A(t[r])}function fe(e,t){let n=p&&p.running;n?e.tState=0:e.state=0;for(let r=0;r<e.sources.length;r+=1){let i=e.sources[r];if(i.sources){let e=n?i.tState:i.state;e===l?i!==t&&(!i.updatedAt||i.updatedAt<y)&&A(i):e===u&&fe(i,t)}}}function pe(e){let t=p&&p.running;for(let n=0;n<e.observers.length;n+=1){let r=e.observers[n];(t?!r.tState:!r.state)&&(t?r.tState=u:r.state=u,r.pure?_.push(r):v.push(r),r.observers&&pe(r))}}function M(e){let t;if(e.sources)for(;e.sources.length;){let t=e.sources.pop(),n=e.sourceSlots.pop(),r=t.observers;if(r&&r.length){let e=r.pop(),i=t.observerSlots.pop();n<r.length&&(e.sourceSlots[i]=n,r[n]=e,t.observerSlots[n]=i)}}if(e.tOwned){for(t=e.tOwned.length-1;t>=0;t--)M(e.tOwned[t]);delete e.tOwned}if(p&&p.running&&e.pure)me(e,!0);else if(e.owned){for(t=e.owned.length-1;t>=0;t--)M(e.owned[t]);e.owned=null}if(e.cleanups){for(t=e.cleanups.length-1;t>=0;t--)e.cleanups[t]();e.cleanups=null}p&&p.running?e.tState=0:e.state=0}function me(e,t){if(t||(e.tState=0,p.disposed.add(e)),e.owned)for(let t=0;t<e.owned.length;t++)me(e.owned[t])}function he(e){return e instanceof Error?e:Error(typeof e==`string`?e:`Unknown error`,{cause:e})}function ge(e,t,n){try{for(let n of t)n(e)}catch(e){_e(e,n&&n.owner||null)}}function _e(e,t=f){let n=s&&t&&t.context&&t.context[s],r=he(e);if(!n)throw r;v?v.push({fn(){ge(r,n,t)},state:l}):ge(r,n,t)}var ve=Symbol(`fallback`);function ye(e){for(let t=0;t<e.length;t++)e[t]()}function be(e,t,n={}){let r=[],i=[],o=[],s=0,c=t.length>1?[]:null;return D(()=>ye(o)),()=>{let l=e()||[],u=l.length,d,f;return l[a],T(()=>{let e,t,a,m,h,g,_,v,y;if(u===0)s!==0&&(ye(o),o=[],r=[],i=[],s=0,c&&=[]),n.fallback&&(r=[ve],i[0]=b(e=>(o[0]=e,n.fallback())),s=1);else if(s===0){for(i=Array(u),f=0;f<u;f++)r[f]=l[f],i[f]=b(p);s=u}else{for(a=Array(u),m=Array(u),c&&(h=Array(u)),g=0,_=Math.min(s,u);g<_&&r[g]===l[g];g++);for(_=s-1,v=u-1;_>=g&&v>=g&&r[_]===l[v];_--,v--)a[v]=i[_],m[v]=o[_],c&&(h[v]=c[_]);for(e=new Map,t=Array(v+1),f=v;f>=g;f--)y=l[f],d=e.get(y),t[f]=d===void 0?-1:d,e.set(y,f);for(d=g;d<=_;d++)y=r[d],f=e.get(y),f!==void 0&&f!==-1?(a[f]=i[d],m[f]=o[d],c&&(h[f]=c[d]),f=t[f],e.set(y,f)):o[d]();for(f=g;f<u;f++)f in a?(i[f]=a[f],o[f]=m[f],c&&(c[f]=h[f],c[f](f))):i[f]=b(p);i=i.slice(0,s=u),r=l.slice(0)}return i});function p(e){if(o[f]=e,c){let[e,n]=x(f);return c[f]=n,t(l[f],e)}return t(l[f])}}}var xe=!1;function N(t,i){if(xe&&e.context){let a=e.context;n(r());let o=T(()=>t(i||{}));return n(a),o}return T(()=>t(i||{}))}var Se=e=>`Stale read from <${e}>.`;function P(e){let t=`fallback`in e&&{fallback:()=>e.fallback};return w(be(()=>e.each,e.children,t||void 0))}function F(e){let t=e.keyed,n=w(()=>e.when,void 0,void 0),r=t?n:w(n,void 0,{equals:(e,t)=>!e==!t});return w(()=>{let i=r();if(i){let a=e.children;return typeof a==`function`&&a.length>0?T(()=>a(t?i:()=>{if(!T(r))throw Se(`Show`);return n()})):a}return e.fallback},void 0,void 0)}Object.assign(Object.create(null),{className:`class`,htmlFor:`for`}),Object.assign(Object.create(null),{class:`className`,novalidate:{$:`noValidate`,FORM:1},formnovalidate:{$:`formNoValidate`,BUTTON:1,INPUT:1},ismap:{$:`isMap`,IMG:1},nomodule:{$:`noModule`,SCRIPT:1},playsinline:{$:`playsInline`,VIDEO:1},readonly:{$:`readOnly`,INPUT:1,TEXTAREA:1},adauctionheaders:{$:`adAuctionHeaders`,IFRAME:1},allowfullscreen:{$:`allowFullscreen`,IFRAME:1},browsingtopics:{$:`browsingTopics`,IMG:1},defaultchecked:{$:`defaultChecked`,INPUT:1},defaultmuted:{$:`defaultMuted`,AUDIO:1,VIDEO:1},defaultselected:{$:`defaultSelected`,OPTION:1},disablepictureinpicture:{$:`disablePictureInPicture`,VIDEO:1},disableremoteplayback:{$:`disableRemotePlayback`,AUDIO:1,VIDEO:1},preservespitch:{$:`preservesPitch`,AUDIO:1,VIDEO:1},shadowrootclonable:{$:`shadowRootClonable`,TEMPLATE:1},shadowrootdelegatesfocus:{$:`shadowRootDelegatesFocus`,TEMPLATE:1},shadowrootserializable:{$:`shadowRootSerializable`,TEMPLATE:1},sharedstoragewritable:{$:`sharedStorageWritable`,IFRAME:1,IMG:1}});var Ce=e=>w(()=>e());function we(e,t,n){let r=n.length,i=t.length,a=r,o=0,s=0,c=t[i-1].nextSibling,l=null;for(;o<i||s<a;){if(t[o]===n[s]){o++,s++;continue}for(;t[i-1]===n[a-1];)i--,a--;if(i===o){let t=a<r?s?n[s-1].nextSibling:n[a-s]:c;for(;s<a;)e.insertBefore(n[s++],t)}else if(a===s)for(;o<i;)(!l||!l.has(t[o]))&&t[o].remove(),o++;else if(t[o]===n[a-1]&&n[s]===t[i-1]){let r=t[--i].nextSibling;e.insertBefore(n[s++],t[o++].nextSibling),e.insertBefore(n[--a],r),t[i]=n[a]}else{if(!l){l=new Map;let e=s;for(;e<a;)l.set(n[e],e++)}let r=l.get(t[o]);if(r!=null)if(s<r&&r<a){let c=o,u=1,d;for(;++c<i&&c<a&&!((d=l.get(t[c]))==null||d!==r+u);)u++;if(u>r-s){let i=t[o];for(;s<r;)e.insertBefore(n[s++],i)}else e.replaceChild(n[s++],t[o++])}else o++;else t[o++].remove()}}}var Te=`_$DX_DELEGATE`;function Ee(e,t,n,r={}){let i;return b(r=>{i=r,t===document?e():z(t,e(),t.firstChild?null:void 0,n)},r.owner),()=>{i(),t.textContent=``}}function I(e,t,n,r){let i,a=()=>{let t=r?document.createElementNS(`http://www.w3.org/1998/Math/MathML`,`template`):document.createElement(`template`);return t.innerHTML=e,n?t.content.firstChild.firstChild:r?t.firstChild:t.content.firstChild},o=t?()=>T(()=>document.importNode(i||=a(),!0)):()=>(i||=a()).cloneNode(!0);return o.cloneNode=o,o}function De(e,t=window.document){let n=t[Te]||(t[Te]=new Set);for(let r=0,i=e.length;r<i;r++){let i=e[r];n.has(i)||(n.add(i),t.addEventListener(i,Me))}}function L(e,t,n){je(e)||(n==null?e.removeAttribute(t):e.setAttribute(t,n))}function Oe(e,t){je(e)||(t==null?e.removeAttribute(`class`):e.className=t)}function ke(e,t,n){if(!t)return n?L(e,`style`):t;let r=e.style;if(typeof t==`string`)return r.cssText=t;typeof n==`string`&&(r.cssText=n=void 0),n||={},t||={};let i,a;for(a in n)t[a]??r.removeProperty(a),delete n[a];for(a in t)i=t[a],i!==n[a]&&(r.setProperty(a,i),n[a]=i);return n}function R(e,t,n){n==null?e.style.removeProperty(t):e.style.setProperty(t,n)}function Ae(e,t,n){return T(()=>e(t,n))}function z(e,t,n,r){if(n!==void 0&&!r&&(r=[]),typeof t!=`function`)return Ne(e,t,r,n);S(r=>Ne(e,t(),r,n),r)}function je(t){return!!e.context&&!e.done&&(!t||t.isConnected)}function Me(t){if(e.registry&&e.events&&e.events.find(([e,n])=>n===t))return;let n=t.target,r=`$$${t.type}`,i=t.target,a=t.currentTarget,o=e=>Object.defineProperty(t,`target`,{configurable:!0,value:e}),s=()=>{let e=n[r];if(e&&!n.disabled){let i=n[`${r}Data`];if(i===void 0?e.call(n,t):e.call(n,i,t),t.cancelBubble)return}return n.host&&typeof n.host!=`string`&&!n.host._$host&&n.contains(t.target)&&o(n.host),!0},c=()=>{for(;s()&&(n=n._$host||n.parentNode||n.host););};if(Object.defineProperty(t,`currentTarget`,{configurable:!0,get(){return n||document}}),e.registry&&!e.done&&(e.done=_$HY.done=!0),t.composedPath){let e=t.composedPath();o(e[0]);for(let t=0;t<e.length-2&&(n=e[t],s());t++){if(n._$host){n=n._$host,c();break}if(n.parentNode===a)break}}else c();o(i)}function Ne(e,t,n,r,i){let a=je(e);if(a){!n&&(n=[...e.childNodes]);let t=[];for(let e=0;e<n.length;e++){let r=n[e];r.nodeType===8&&r.data.slice(0,2)===`!$`?r.remove():t.push(r)}n=t}for(;typeof n==`function`;)n=n();if(t===n)return n;let o=typeof t,s=r!==void 0;if(e=s&&n[0]&&n[0].parentNode||e,o===`string`||o===`number`){if(a||o===`number`&&(t=t.toString(),t===n))return n;if(s){let i=n[0];i&&i.nodeType===3?i.data!==t&&(i.data=t):i=document.createTextNode(t),n=B(e,n,r,i)}else n=n!==``&&typeof n==`string`?e.firstChild.data=t:e.textContent=t}else if(t==null||o===`boolean`){if(a)return n;n=B(e,n,r)}else if(o===`function`)return S(()=>{let i=t();for(;typeof i==`function`;)i=i();n=Ne(e,i,n,r)}),()=>n;else if(Array.isArray(t)){let o=[],c=n&&Array.isArray(n);if(Pe(o,t,n,i))return S(()=>n=Ne(e,o,n,r,!0)),()=>n;if(a){if(!o.length)return n;if(r===void 0)return n=[...e.childNodes];let t=o[0];if(t.parentNode!==e)return n;let i=[t];for(;(t=t.nextSibling)!==r;)i.push(t);return n=i}if(o.length===0){if(n=B(e,n,r),s)return n}else c?n.length===0?Fe(e,o,r):we(e,n,o):(n&&B(e),Fe(e,o));n=o}else if(t.nodeType){if(a&&t.parentNode)return n=s?[t]:t;if(Array.isArray(n)){if(s)return n=B(e,n,r,t);B(e,n,null,t)}else n==null||n===``||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}return n}function Pe(e,t,n,r){let i=!1;for(let a=0,o=t.length;a<o;a++){let o=t[a],s=n&&n[e.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)==`object`&&o.nodeType)e.push(o);else if(Array.isArray(o))i=Pe(e,o,s)||i;else if(c===`function`)if(r){for(;typeof o==`function`;)o=o();i=Pe(e,Array.isArray(o)?o:[o],Array.isArray(s)?s:[s])||i}else e.push(o),i=!0;else{let t=String(o);s&&s.nodeType===3&&s.data===t?e.push(s):e.push(document.createTextNode(t))}}return i}function Fe(e,t,n=null){for(let r=0,i=t.length;r<i;r++)e.insertBefore(t[r],n)}function B(e,t,n,r){if(n===void 0)return e.textContent=``;let i=r||document.createTextNode(``);if(t.length){let r=!1;for(let a=t.length-1;a>=0;a--){let o=t[a];if(i!==o){let t=o.parentNode===e;!r&&!a?t?e.replaceChild(i,o):e.insertBefore(i,n):t&&o.remove()}else r=!0}}else e.insertBefore(i,n);return[i]}var Ie=`where-to-live-sw-cleanup-reloaded`;async function Le(){if(!(`serviceWorker`in navigator))return;let e=await navigator.serviceWorker.getRegistrations(),t=await Promise.all(e.map(e=>e.unregister()));if(`caches`in window){let e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e)))}navigator.serviceWorker.controller&&t.some(Boolean)&&!window.sessionStorage.getItem(Ie)&&(window.sessionStorage.setItem(Ie,`true`),window.location.reload())}window.addEventListener(`load`,()=>{Le().catch(e=>{console.error(`Failed to clean up service workers`,e)})});function Re(e){return e.split(` `).filter(Boolean).map(e=>e.charAt(0)+e.toLowerCase().slice(1)).join(` `)}function ze(e){return[e.c?Re(e.c):``,e.s].filter(Boolean).join(`, `)}function Be(e){let t=ze(e);return e.a?`Near ${t}`:t}function Ve(e){let t=e.split(` `);return`${Re(t.slice(0,-1).join(` `))} ${t.slice(-1).join(` `)}`.trim()}function He(e){let t=e&&e.w?e.w:null;return t&&typeof t.r==`number`?t.r:(t&&t.m?t.m:[]).reduce((e,t,n)=>n%2==0?e+t:e-t,0)}function Ue(e){let t=e&&e.w?e.w:null;return t&&typeof t.p==`number`?t.p:He(e)}var V=.44808497551000004,We={r:213,g:219,b:225},Ge=`viridis`,H=[{id:`cividis`,label:`Cividis`,description:`Safest blue-to-gold option for color-vision deficiency.`,swatch:`linear-gradient(90deg, #00204c 0%, #2f4f73 28%, #626e7d 55%, #9f9447 78%, #fee838 100%)`,stops:[`#00204c`,`#2f4f73`,`#626e7d`,`#9f9447`,`#fee838`],chartPositive:`#355f8d`,chartNegative:`#9f7e2e`,chartTrack:`#d5dde5`},{id:`viridis`,label:`Viridis`,description:`Best general-purpose sequential palette for ordered scores.`,swatch:`linear-gradient(90deg, #440154 0%, #3b528b 28%, #21918c 58%, #5dc863 80%, #c8df21 100%)`,stops:[`#440154`,`#3b528b`,`#21918c`,`#5dc863`,`#c8df21`],chartPositive:`#15803d`,chartNegative:`#c2410c`,chartTrack:`#dce3ed`},{id:`contrast`,label:`Ocean`,description:`Higher-contrast navy-to-teal scale without blown-out highlights.`,swatch:`linear-gradient(90deg, #203a5c 0%, #235789 24%, #1f7a8c 52%, #1fa187 78%, #8bd3c7 100%)`,stops:[`#203a5c`,`#235789`,`#1f7a8c`,`#1fa187`,`#8bd3c7`],chartPositive:`#1f7a8c`,chartNegative:`#235789`,chartTrack:`#d8e5ea`}],Ke=H.reduce((e,t)=>(e[t.id]=t.stops.map(qe),e),{});function qe(e){let t=e.replace(`#`,``),n=parseInt(t,16);return{r:n>>16&255,g:n>>8&255,b:n&255}}function Je(e,t,n){let r=Math.min(Math.max(n,0),1);return{r:Math.round(e.r+(t.r-e.r)*r),g:Math.round(e.g+(t.g-e.g)*r),b:Math.round(e.b+(t.b-e.b)*r)}}function Ye(e,t){if(e.length===1)return e[0];let n=Math.min(Math.max(t,0),1),r=Math.min(e.length-2,Math.floor(n*(e.length-1))),i=e[r],a=e[r+1];return Je(i,a,n*(e.length-1)-r)}function Xe(e=Ge){return H.find(t=>t.id===e)||H[0]}function Ze(e=Ge){let t=Xe(e);return{positive:t.chartPositive,negative:t.chartNegative,track:t.chartTrack}}function Qe(e,t,n){let r=Ye(Ke[t]||Ke.viridis,e/100),i=n?r:Je(r,We,.72),a=n?1:.55;return`rgba(${i.r}, ${i.g}, ${i.b}, ${a})`}function $e(e,t,n,r,i,a){e.beginPath(),e.moveTo(t+a.tl,n),e.lineTo(t+r-a.tr,n),e.bezierCurveTo(t+r-a.tr*V,n,t+r,n+a.tr*V,t+r,n+a.tr),e.lineTo(t+r,n+i-a.br),e.bezierCurveTo(t+r,n+i-a.br*V,t+r-a.br*V,n+i,t+r-a.br,n+i),e.lineTo(t+a.bl,n+i),e.bezierCurveTo(t+a.bl*V,n+i,t,n+i-a.bl*V,t,n+i-a.bl),e.lineTo(t,n+a.tl),e.bezierCurveTo(t,n+a.tl*V,t+a.tl*V,n,t+a.tl,n),e.closePath(),e.fill()}function et(e){return e&&e.s?e.s:``}function tt(e,t){let n=et(e);return!!n&&n===et(t)}function nt(e,t,n,r,i,a,o,s){let c=r*t.length/t[0].length;t.forEach((l,u)=>l.forEach((l,d)=>{if(l.c){let f=u>0&&!!(t[u-1][d]&&t[u-1][d].c),p=u<t.length-1&&!!(t[u+1][d]&&t[u+1][d].c),m=d>0&&!!(t[u][d-1]&&t[u][d-1].c),h=d<t[u].length-1&&!!(t[u][d+1]&&t[u][d+1].c),g=u>0&&tt(l,t[u-1][d]),_=u<t.length-1&&tt(l,t[u+1][d]),v=d>0&&tt(l,t[u][d-1]),y=d<t[u].length-1&&tt(l,t[u][d+1]),b=i*.08,x=s?i*.4:b,S=s&&m&&v?b/2:x/2,C=s&&h&&y?b/2:x/2,w=s&&f&&g?b/2:x/2,T=s&&p&&_?b/2:x/2,E=d*i+S,D=u*i+w,O=i-S-C,ee=i-w-T;if(E*n.a<-n.e+r&&(E+O)*n.a>-n.e&&D*n.a<-n.f+c&&(D+ee)*n.a>-n.f){let t=Math.min(O,ee),n=t/6,r=t/2,i={tl:n,tr:n,br:n,bl:n};!f&&!m&&(i.tl=r),!f&&!h&&(i.tr=r),!p&&!h&&(i.br=r),!p&&!m&&(i.bl=r);let s;s=a.length>0?l.z?l.z.filter(e=>(`00000`+e.toString()).slice(-5).substr(0,a.length)===a).length>0:!1:!0,e.fillStyle=Qe(Math.max(0,Math.min(Ue(l),100)),o,s),$e(e,E,D,O,ee,i)}}}))}var rt=I(`<div class=app-hover><div class=hover-title><span></span><span>/100</span></div><div class=hover-charts>`),it=I(`<div class=hover-chart><div class=hover-chart-bar><div></div><div></div></div><span>`),at=[31,28,31,30,31,30,31,31,30,31,30,31],ot=[`J`,`F`,`M`,`A`,`M`,`J`,`J`,`A`,`S`,`O`,`N`,`D`];function st(e){let t=w(()=>e.paletteMode??`viridis`),n=w(()=>e.state.data?.w?.m??[]),r=w(()=>Math.max(0,Math.min(Ue(e.state.data),100))),i=w(()=>He(e.state.data)),a=w(()=>Math.min(Math.max(e.state.x,272/2)+5,document.documentElement.clientWidth-272/2-5)),o=w(()=>Ze(t())),s=w(()=>({left:`${a()}px`,top:`${e.state.y}px`,"--before-offset":`calc(50% + ${e.state.x-a()}px)`,"--cell-size":`${e.cell*e.mapScale+7}px`}));return N(F,{get when(){return Ce(()=>!!e.state.visible)()&&e.state.data},get children(){var t=rt(),a=t.firstChild,c=a.firstChild,l=c.nextSibling,u=l.firstChild,d=a.nextSibling;return z(c,()=>Be(e.state.data)),z(l,r,u),z(d,N(P,{get each(){return n().filter((e,t)=>t%2==0)},children:(e,t)=>{let r=t(),i=n()[r*2+1];return(()=>{var t=it(),n=t.firstChild,a=n.firstChild,s=a.nextSibling,c=n.nextSibling;return z(c,()=>ot[r]),S(t=>{var c=o().track,l=`${i/at[r]*100}%`,u=o().negative,d=`${e/at[r]*100}%`,f=o().positive;return c!==t.e&&R(n,`background-color`,t.e=c),l!==t.t&&R(a,`height`,t.t=l),u!==t.a&&R(a,`background`,t.a=u),d!==t.o&&R(s,`height`,t.o=d),f!==t.i&&R(s,`background`,t.i=f),t},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),t})()}})),S(n=>{var r=e.state.y-135<window.pageYOffset,a=s(),o=`Raw score: ${i()}`;return r!==n.e&&t.classList.toggle(`flip`,n.e=r),n.t=ke(t,a,n.t),o!==n.a&&L(l,`title`,n.a=o),n},{e:void 0,t:void 0,a:void 0}),t}})}function ct(e){return ct=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},ct(e)}function lt(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function ut(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function dt(e,t,n){return t&&ut(e.prototype,t),n&&ut(e,n),e}function ft(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function U(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t],r=Object.keys(n);typeof Object.getOwnPropertySymbols==`function`&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){ft(e,t,n[t])})}return e}function pt(e,t){return mt(e)||ht(e,t)||gt()}function mt(e){if(Array.isArray(e))return e}function ht(e,t){var n=[],r=!0,i=!1,a=void 0;try{for(var o=e[Symbol.iterator](),s;!(r=(s=o.next()).done)&&(n.push(s.value),!(t&&n.length===t));r=!0);}catch(e){i=!0,a=e}finally{try{!r&&o.return!=null&&o.return()}finally{if(i)throw a}}return n}function gt(){throw TypeError(`Invalid attempt to destructure non-iterable instance`)}var _t=function(){},vt={},yt={},bt={mark:_t,measure:_t};try{typeof window<`u`&&(vt=window),typeof document<`u`&&(yt=document),typeof performance<`u`&&(bt=performance)}catch{}var xt=(vt.navigator||{}).userAgent,St=xt===void 0?``:xt,Ct=vt,W=yt,wt=bt;Ct.document;var Tt=!!W.documentElement&&!!W.head&&typeof W.addEventListener==`function`&&typeof W.createElement==`function`;~St.indexOf(`MSIE`)||~St.indexOf(`Trident/`);var G=`___FONT_AWESOME___`,Et=`fa`,Dt=`svg-inline--fa`,Ot=`data-fa-i2svg`;(function(){try{return!0}catch{return!1}})();var kt=[1,2,3,4,5,6,7,8,9,10],At=kt.concat([11,12,13,14,15,16,17,18,19,20]),K={GROUP:`group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`};[`xs`,`sm`,`lg`,`fw`,`ul`,`li`,`border`,`pull-left`,`pull-right`,`spin`,`pulse`,`rotate-90`,`rotate-180`,`rotate-270`,`flip-horizontal`,`flip-vertical`,`flip-both`,`stack`,`stack-1x`,`stack-2x`,`inverse`,`layers`,`layers-text`,`layers-counter`,K.GROUP,K.SWAP_OPACITY,K.PRIMARY,K.SECONDARY].concat(kt.map(function(e){return`${e}x`}),At.map(function(e){return`w-${e}`}));var jt=Ct.FontAwesomeConfig||{};function Mt(e){var t=W.querySelector(`script[`+e+`]`);if(t)return t.getAttribute(e)}function Nt(e){return e===``?!0:e===`false`?!1:e===`true`?!0:e}W&&typeof W.querySelector==`function`&&[[`data-family-prefix`,`familyPrefix`],[`data-replacement-class`,`replacementClass`],[`data-auto-replace-svg`,`autoReplaceSvg`],[`data-auto-add-css`,`autoAddCss`],[`data-auto-a11y`,`autoA11y`],[`data-search-pseudo-elements`,`searchPseudoElements`],[`data-observe-mutations`,`observeMutations`],[`data-mutate-approach`,`mutateApproach`],[`data-keep-original-source`,`keepOriginalSource`],[`data-measure-performance`,`measurePerformance`],[`data-show-missing-icons`,`showMissingIcons`]].forEach(function(e){var t=pt(e,2),n=t[0],r=t[1],i=Nt(Mt(n));i!=null&&(jt[r]=i)});var Pt=U({},{familyPrefix:Et,replacementClass:Dt,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:`async`,keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0},jt);Pt.autoReplaceSvg||(Pt.observeMutations=!1);var q=U({},Pt);Ct.FontAwesomeConfig=q;var J=Ct||{};J[G]||(J[G]={}),J[G].styles||(J[G].styles={}),J[G].hooks||(J[G].hooks={}),J[G].shims||(J[G].shims=[]);var Y=J[G],Ft=[],It=function e(){W.removeEventListener(`DOMContentLoaded`,e),Lt=1,Ft.map(function(e){return e()})},Lt=!1;Tt&&(Lt=(W.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(W.readyState),Lt||W.addEventListener(`DOMContentLoaded`,It));var Rt=`pending`,zt=`settled`,Bt=`fulfilled`,Vt=`rejected`,Ht=function(){},Ut=typeof global<`u`&&global.process!==void 0&&typeof global.process.emit==`function`,Wt=typeof setImmediate>`u`?setTimeout:setImmediate,X=[],Gt;function Kt(){for(var e=0;e<X.length;e++)X[e][0](X[e][1]);X=[],Gt=!1}function qt(e,t){X.push([e,t]),Gt||(Gt=!0,Wt(Kt,0))}function Jt(e,t){function n(e){Zt(t,e)}function r(e){$t(t,e)}try{e(n,r)}catch(e){r(e)}}function Yt(e){var t=e.owner,n=t._state,r=t._data,i=e[n],a=e.then;if(typeof i==`function`){n=Bt;try{r=i(r)}catch(e){$t(a,e)}}Xt(a,r)||(n===Bt&&Zt(a,r),n===Vt&&$t(a,r))}function Xt(e,t){var n;try{if(e===t)throw TypeError(`A promises callback cannot return that same promise.`);if(t&&(typeof t==`function`||ct(t)===`object`)){var r=t.then;if(typeof r==`function`)return r.call(t,function(r){n||(n=!0,t===r?Qt(e,r):Zt(e,r))},function(t){n||(n=!0,$t(e,t))}),!0}}catch(t){return n||$t(e,t),!0}return!1}function Zt(e,t){(e===t||!Xt(e,t))&&Qt(e,t)}function Qt(e,t){e._state===Rt&&(e._state=zt,e._data=t,qt(tn,e))}function $t(e,t){e._state===Rt&&(e._state=zt,e._data=t,qt(nn,e))}function en(e){e._then=e._then.forEach(Yt)}function tn(e){e._state=Bt,en(e)}function nn(e){e._state=Vt,en(e),!e._handled&&Ut&&global.process.emit(`unhandledRejection`,e._data,e)}function rn(e){global.process.emit(`rejectionHandled`,e)}function Z(e){if(typeof e!=`function`)throw TypeError(`Promise resolver `+e+` is not a function`);if(!(this instanceof Z))throw TypeError(`Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.`);this._then=[],Jt(e,this)}Z.prototype={constructor:Z,_state:Rt,_then:null,_data:void 0,_handled:!1,then:function(e,t){var n={owner:this,then:new this.constructor(Ht),fulfilled:e,rejected:t};return(t||e)&&!this._handled&&(this._handled=!0,this._state===Vt&&Ut&&qt(rn,this)),this._state===Bt||this._state===Vt?qt(Yt,n):this._then.push(n),n.then},catch:function(e){return this.then(null,e)}},Z.all=function(e){if(!Array.isArray(e))throw TypeError(`You must pass an array to Promise.all().`);return new Z(function(t,n){var r=[],i=0;function a(e){return i++,function(n){r[e]=n,--i||t(r)}}for(var o=0,s;o<e.length;o++)s=e[o],s&&typeof s.then==`function`?s.then(a(o),n):r[o]=s;i||t(r)})},Z.race=function(e){if(!Array.isArray(e))throw TypeError(`You must pass an array to Promise.race().`);return new Z(function(t,n){for(var r=0,i;r<e.length;r++)i=e[r],i&&typeof i.then==`function`?i.then(t,n):t(i)})},Z.resolve=function(e){return e&&ct(e)===`object`&&e.constructor===Z?e:new Z(function(t){t(e)})},Z.reject=function(e){return new Z(function(t,n){n(e)})};var Q={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function an(e){if(!(!e||!Tt)){var t=W.createElement(`style`);t.setAttribute(`type`,`text/css`),t.innerHTML=e;for(var n=W.head.childNodes,r=null,i=n.length-1;i>-1;i--){var a=n[i],o=(a.tagName||``).toUpperCase();[`STYLE`,`LINK`].indexOf(o)>-1&&(r=a)}return W.head.insertBefore(t,r),e}}var on=`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;function sn(){for(var e=12,t=``;e-- >0;)t+=on[Math.random()*62|0];return t}function cn(e){return`${e}`.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function ln(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}="${cn(e[n])}" `},``).trim()}function un(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}: ${e[n]};`},``)}function dn(e){return e.size!==Q.size||e.x!==Q.x||e.y!==Q.y||e.rotate!==Q.rotate||e.flipX||e.flipY}function fn(e){var t=e.transform,n=e.containerWidth,r=e.iconWidth;return{outer:{transform:`translate(${n/2} 256)`},inner:{transform:`${`translate(${t.x*32}, ${t.y*32}) `} ${`scale(${t.size/16*(t.flipX?-1:1)}, ${t.size/16*(t.flipY?-1:1)}) `} ${`rotate(${t.rotate} 0 0)`}`},path:{transform:`translate(${r/2*-1} -256)`}}}var pn={x:0,y:0,width:`100%`,height:`100%`};function mn(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill=`black`),e}function hn(e){return e.tag===`g`?e.children:[e]}function gn(e){var t=e.children,n=e.attributes,r=e.main,i=e.mask,a=e.transform,o=r.width,s=r.icon,c=i.width,l=i.icon,u=fn({transform:a,containerWidth:c,iconWidth:o}),d={tag:`rect`,attributes:U({},pn,{fill:`white`})},f=s.children?{children:s.children.map(mn)}:{},p={tag:`g`,attributes:U({},u.inner),children:[mn(U({tag:s.tag,attributes:U({},s.attributes,u.path)},f))]},m={tag:`g`,attributes:U({},u.outer),children:[p]},h=`mask-${sn()}`,g=`clip-${sn()}`,_={tag:`mask`,attributes:U({},pn,{id:h,maskUnits:`userSpaceOnUse`,maskContentUnits:`userSpaceOnUse`}),children:[d,m]},v={tag:`defs`,children:[{tag:`clipPath`,attributes:{id:g},children:hn(l)},_]};return t.push(v,{tag:`rect`,attributes:U({fill:`currentColor`,"clip-path":`url(#${g})`,mask:`url(#${h})`},pn)}),{children:t,attributes:n}}function _n(e){var t=e.children,n=e.attributes,r=e.main,i=e.transform,a=e.styles,o=un(a);if(o.length>0&&(n.style=o),dn(i)){var s=fn({transform:i,containerWidth:r.width,iconWidth:r.width});t.push({tag:`g`,attributes:U({},s.outer),children:[{tag:`g`,attributes:U({},s.inner),children:[{tag:r.icon.tag,children:r.icon.children,attributes:U({},r.icon.attributes,s.path)}]}]})}else t.push(r.icon);return{children:t,attributes:n}}function vn(e){var t=e.children,n=e.main,r=e.mask,i=e.attributes,a=e.styles,o=e.transform;if(dn(o)&&n.found&&!r.found){var s={x:n.width/n.height/2,y:.5};i.style=un(U({},a,{"transform-origin":`${s.x+o.x/16}em ${s.y+o.y/16}em`}))}return[{tag:`svg`,attributes:i,children:t}]}function yn(e){var t=e.prefix,n=e.iconName,r=e.children,i=e.attributes,a=e.symbol;return[{tag:`svg`,attributes:{style:`display: none;`},children:[{tag:`symbol`,attributes:U({},i,{id:a===!0?`${t}-${q.familyPrefix}-${n}`:a}),children:r}]}]}function bn(e){var t=e.icons,n=t.main,r=t.mask,i=e.prefix,a=e.iconName,o=e.transform,s=e.symbol,c=e.title,l=e.extra,u=e.watchable,d=u===void 0?!1:u,f=r.found?r:n,p=f.width,m=f.height,h=`fa-w-${Math.ceil(p/m*16)}`,g=[q.replacementClass,a?`${q.familyPrefix}-${a}`:``,h].filter(function(e){return l.classes.indexOf(e)===-1}).concat(l.classes).join(` `),_={children:[],attributes:U({},l.attributes,{"data-prefix":i,"data-icon":a,class:g,role:l.attributes.role||`img`,xmlns:`http://www.w3.org/2000/svg`,viewBox:`0 0 ${p} ${m}`})};d&&(_.attributes[Ot]=``),c&&_.children.push({tag:`title`,attributes:{id:_.attributes[`aria-labelledby`]||`title-${sn()}`},children:[c]});var v=U({},_,{prefix:i,iconName:a,main:n,mask:r,transform:o,symbol:s,styles:l.styles}),y=r.found&&n.found?gn(v):_n(v),b=y.children,x=y.attributes;return v.children=b,v.attributes=x,s?yn(v):vn(v)}q.measurePerformance&&wt&&wt.mark&&wt.measure;var xn=function(e,t){return function(n,r,i,a){return e.call(t,n,r,i,a)}},Sn=function(e,t,n,r){var i=Object.keys(e),a=i.length,o=r===void 0?t:xn(t,r),s,c,l;for(n===void 0?(s=1,l=e[i[0]]):(s=0,l=n);s<a;s++)c=i[s],l=o(l,e[c],c,e);return l};function Cn(e,t){var n=(arguments.length>2&&arguments[2]!==void 0?arguments[2]:{}).skipHooks,r=n===void 0?!1:n,i=Object.keys(t).reduce(function(e,n){var r=t[n];return r.icon?e[r.iconName]=r.icon:e[n]=r,e},{});typeof Y.hooks.addPack==`function`&&!r?Y.hooks.addPack(e,i):Y.styles[e]=U({},Y.styles[e]||{},i),e===`fas`&&Cn(`fa`,t)}var wn=Y.styles,Tn=Y.shims,En=function(){var e=function(e){return Sn(wn,function(t,n,r){return t[r]=Sn(n,e,{}),t},{})};e(function(e,t,n){return t[3]&&(e[t[3]]=n),e}),e(function(e,t,n){var r=t[2];return e[n]=n,r.forEach(function(t){e[t]=n}),e});var t=`far`in wn;Sn(Tn,function(e,n){var r=n[0],i=n[1],a=n[2];return i===`far`&&!t&&(i=`fas`),e[r]={prefix:i,iconName:a},e},{})};En(),Y.styles;function Dn(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}function On(e){var t=e.tag,n=e.attributes,r=n===void 0?{}:n,i=e.children,a=i===void 0?[]:i;return typeof e==`string`?cn(e):`<${t} ${ln(r)}>${a.map(On).join(``)}</${t}>`}function kn(e){this.name=`MissingIcon`,this.message=e||`Icon unavailable`,this.stack=Error().stack}kn.prototype=Object.create(Error.prototype),kn.prototype.constructor=kn;var An={fill:`currentColor`},jn={attributeType:`XML`,repeatCount:`indefinite`,dur:`2s`};U({},An,{d:`M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z`});var Mn=U({},jn,{attributeName:`opacity`});U({},An,{cx:`256`,cy:`364`,r:`28`}),U({},jn,{attributeName:`r`,values:`28;14;28;28;14;28;`}),U({},Mn,{values:`1;0;1;1;0;1;`}),U({},An,{opacity:`1`,d:`M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z`}),U({},Mn,{values:`1;0;0;0;0;1;`}),U({},An,{opacity:`0`,d:`M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z`}),U({},Mn,{values:`0;0;1;1;0;0;`}),Y.styles;function Nn(e){var t=e[0],n=e[1],r=pt(e.slice(4),1)[0],i=null;return i=Array.isArray(r)?{tag:`g`,attributes:{class:`${q.familyPrefix}-${K.GROUP}`},children:[{tag:`path`,attributes:{class:`${q.familyPrefix}-${K.SECONDARY}`,fill:`currentColor`,d:r[0]}},{tag:`path`,attributes:{class:`${q.familyPrefix}-${K.PRIMARY}`,fill:`currentColor`,d:r[1]}}]}:{tag:`path`,attributes:{fill:`currentColor`,d:r}},{found:!0,width:t,height:n,icon:i}}Y.styles;var Pn=`svg:not(:root).svg-inline--fa {
  overflow: visible;
}

.svg-inline--fa {
  display: inline-block;
  font-size: inherit;
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.225em;
}
.svg-inline--fa.fa-w-1 {
  width: 0.0625em;
}
.svg-inline--fa.fa-w-2 {
  width: 0.125em;
}
.svg-inline--fa.fa-w-3 {
  width: 0.1875em;
}
.svg-inline--fa.fa-w-4 {
  width: 0.25em;
}
.svg-inline--fa.fa-w-5 {
  width: 0.3125em;
}
.svg-inline--fa.fa-w-6 {
  width: 0.375em;
}
.svg-inline--fa.fa-w-7 {
  width: 0.4375em;
}
.svg-inline--fa.fa-w-8 {
  width: 0.5em;
}
.svg-inline--fa.fa-w-9 {
  width: 0.5625em;
}
.svg-inline--fa.fa-w-10 {
  width: 0.625em;
}
.svg-inline--fa.fa-w-11 {
  width: 0.6875em;
}
.svg-inline--fa.fa-w-12 {
  width: 0.75em;
}
.svg-inline--fa.fa-w-13 {
  width: 0.8125em;
}
.svg-inline--fa.fa-w-14 {
  width: 0.875em;
}
.svg-inline--fa.fa-w-15 {
  width: 0.9375em;
}
.svg-inline--fa.fa-w-16 {
  width: 1em;
}
.svg-inline--fa.fa-w-17 {
  width: 1.0625em;
}
.svg-inline--fa.fa-w-18 {
  width: 1.125em;
}
.svg-inline--fa.fa-w-19 {
  width: 1.1875em;
}
.svg-inline--fa.fa-w-20 {
  width: 1.25em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: 0.3em;
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: 0.3em;
  width: auto;
}
.svg-inline--fa.fa-border {
  height: 1.5em;
}
.svg-inline--fa.fa-li {
  width: 2em;
}
.svg-inline--fa.fa-fw {
  width: 1.25em;
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-counter {
  background-color: #ff253a;
  border-radius: 1em;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  color: #fff;
  height: 1.5em;
  line-height: 1;
  max-width: 5em;
  min-width: 1.5em;
  overflow: hidden;
  padding: 0.25em;
  right: 0;
  text-overflow: ellipsis;
  top: 0;
  -webkit-transform: scale(0.25);
          transform: scale(0.25);
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: 0;
  right: 0;
  top: auto;
  -webkit-transform: scale(0.25);
          transform: scale(0.25);
  -webkit-transform-origin: bottom right;
          transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: 0;
  left: 0;
  right: auto;
  top: auto;
  -webkit-transform: scale(0.25);
          transform: scale(0.25);
  -webkit-transform-origin: bottom left;
          transform-origin: bottom left;
}

.fa-layers-top-right {
  right: 0;
  top: 0;
  -webkit-transform: scale(0.25);
          transform: scale(0.25);
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-top-left {
  left: 0;
  right: auto;
  top: 0;
  -webkit-transform: scale(0.25);
          transform: scale(0.25);
  -webkit-transform-origin: top left;
          transform-origin: top left;
}

.fa-lg {
  font-size: 1.3333333333em;
  line-height: 0.75em;
  vertical-align: -0.0667em;
}

.fa-xs {
  font-size: 0.75em;
}

.fa-sm {
  font-size: 0.875em;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: 2.5em;
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: -2em;
  position: absolute;
  text-align: center;
  width: 2em;
  line-height: inherit;
}

.fa-border {
  border: solid 0.08em #eee;
  border-radius: 0.1em;
  padding: 0.2em 0.25em 0.15em;
}

.fa-pull-left {
  float: left;
}

.fa-pull-right {
  float: right;
}

.fa.fa-pull-left,
.fas.fa-pull-left,
.far.fa-pull-left,
.fal.fa-pull-left,
.fab.fa-pull-left {
  margin-right: 0.3em;
}
.fa.fa-pull-right,
.fas.fa-pull-right,
.far.fa-pull-right,
.fal.fa-pull-right,
.fab.fa-pull-right {
  margin-left: 0.3em;
}

.fa-spin {
  -webkit-animation: fa-spin 2s infinite linear;
          animation: fa-spin 2s infinite linear;
}

.fa-pulse {
  -webkit-animation: fa-spin 1s infinite steps(8);
          animation: fa-spin 1s infinite steps(8);
}

@-webkit-keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}

@keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)";
  -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
}

.fa-rotate-180 {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2)";
  -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
}

.fa-rotate-270 {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)";
  -webkit-transform: rotate(270deg);
          transform: rotate(270deg);
}

.fa-flip-horizontal {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)";
  -webkit-transform: scale(-1, 1);
          transform: scale(-1, 1);
}

.fa-flip-vertical {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)";
  -webkit-transform: scale(1, -1);
          transform: scale(1, -1);
}

.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)";
  -webkit-transform: scale(-1, -1);
          transform: scale(-1, -1);
}

:root .fa-rotate-90,
:root .fa-rotate-180,
:root .fa-rotate-270,
:root .fa-flip-horizontal,
:root .fa-flip-vertical,
:root .fa-flip-both {
  -webkit-filter: none;
          filter: none;
}

.fa-stack {
  display: inline-block;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: #fff;
}

.sr-only {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.sr-only-focusable:active, .sr-only-focusable:focus {
  clip: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  position: static;
  width: auto;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: 1;
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: 0.4;
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: 0.4;
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: 1;
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.fad.fa-inverse {
  color: #fff;
}`;function Fn(){var e=Et,t=Dt,n=q.familyPrefix,r=q.replacementClass,i=Pn;if(n!==e||r!==t){var a=RegExp(`\\.${e}\\-`,`g`),o=RegExp(`\\--${e}\\-`,`g`),s=RegExp(`\\.${t}`,`g`);i=i.replace(a,`.${n}-`).replace(o,`--${n}-`).replace(s,`.${r}`)}return i}var In=function(){function e(){lt(this,e),this.definitions={}}return dt(e,[{key:`add`,value:function(){var e=this,t=[...arguments].reduce(this._pullDefinitions,{});Object.keys(t).forEach(function(n){e.definitions[n]=U({},e.definitions[n]||{},t[n]),Cn(n,t[n]),En()})}},{key:`reset`,value:function(){this.definitions={}}},{key:`_pullDefinitions`,value:function(e,t){var n=t.prefix&&t.iconName&&t.icon?{0:t}:t;return Object.keys(n).map(function(t){var r=n[t],i=r.prefix,a=r.iconName,o=r.icon;e[i]||(e[i]={}),e[i][a]=o}),e}}]),e}();function Ln(){q.autoAddCss&&!Hn&&(an(Fn()),Hn=!0)}function Rn(e,t){return Object.defineProperty(e,`abstract`,{get:t}),Object.defineProperty(e,`html`,{get:function(){return e.abstract.map(function(e){return On(e)})}}),Object.defineProperty(e,`node`,{get:function(){if(Tt){var t=W.createElement(`div`);return t.innerHTML=e.html,t.children}}}),e}function zn(e){var t=e.prefix,n=t===void 0?`fa`:t,r=e.iconName;if(r)return Dn(Vn.definitions,n,r)||Dn(Y.styles,n,r)}function Bn(e){return function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(t||{}).icon?t:zn(t||{}),i=n.mask;return i&&=(i||{}).icon?i:zn(i||{}),e(r,U({},n,{mask:i}))}}var Vn=new In,Hn=!1,Un=Bn(function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?Q:n,i=t.symbol,a=i===void 0?!1:i,o=t.mask,s=o===void 0?null:o,c=t.title,l=c===void 0?null:c,u=t.classes,d=u===void 0?[]:u,f=t.attributes,p=f===void 0?{}:f,m=t.styles,h=m===void 0?{}:m;if(e){var g=e.prefix,_=e.iconName,v=e.icon;return Rn(U({type:`icon`},e),function(){return Ln(),q.autoA11y&&(l?p[`aria-labelledby`]=`${q.replacementClass}-title-${sn()}`:(p[`aria-hidden`]=`true`,p.focusable=`false`)),bn({icons:{main:Nn(v),mask:s?Nn(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:_,transform:U({},Q,r),symbol:a,title:l,extra:{attributes:p,styles:h,classes:d}})})}}),Wn={prefix:`fab`,iconName:`github`,icon:[496,512,[],`f09b`,`M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z`]},Gn={prefix:`fas`,iconName:`caret-up`,icon:[320,512,[],`f0d8`,`M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z`]},Kn={prefix:`fas`,iconName:`exclamation-circle`,icon:[512,512,[],`f06a`,`M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z`]},qn={prefix:`fas`,iconName:`minus`,icon:[448,512,[],`f068`,`M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z`]},Jn={prefix:`fas`,iconName:`plus`,icon:[448,512,[],`f067`,`M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z`]},Yn={prefix:`fas`,iconName:`sun`,icon:[512,512,[],`f185`,`M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z`]},Xn={prefix:`fas`,iconName:`times-circle`,icon:[512,512,[],`f057`,`M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z`]},Zn=I(`<span>`);Vn.add(Gn,Jn,qn,Xn,Wn,Kn,Yn),q.autoAddCss=!1;function $(e){let t=w(()=>{let t=Un(typeof e.icon==`object`?e.icon:{prefix:`fas`,iconName:e.icon});return t?t.html[0]:(console.error(`Icon not found! Icon: ${typeof e.icon==`object`?`${e.icon.prefix}.${e.icon.iconName}`:`fas.${e.icon}`}`),``)});return(()=>{var n=Zn();return S(r=>{var i=`app-icon ${e.class??``}`.trim(),a=t();return i!==r.e&&Oe(n,r.e=i),a!==r.t&&(n.innerHTML=r.t=a),r},{e:void 0,t:void 0}),n})()}var Qn=I(`<div class=palette-menu role=group aria-label="Map color palette"><button type=button class="palette-option toggle-option"><span class=toggle-pill aria-hidden=true><span class=toggle-knob></span></span><span class=palette-copy><span class=palette-name>State gaps</span><span class=palette-description>Separate states with larger gaps instead of one continuous land mass.`),$n=I(`<div class=app-map><canvas class=map-canvas></canvas><div class=palette-picker><button type=button class=palette-trigger aria-label="Select map palette"><span class="palette-swatch trigger-swatch"></span><span class=palette-trigger-copy><span class=palette-trigger-label>Colors</span><span class=palette-trigger-name></span></span><span class=palette-caret></span></button></div><div class=map-controls><div class=map-move><button type=button class="move up"></button><button type=button class="move down"></button><button type=button class="move left"></button><button type=button class="move right"></button></div><div class=map-zoom><button type=button></button><button type=button>`),er=I(`<button type=button class=palette-option><span class=palette-swatch></span><span class=palette-copy><span class=palette-name></span><span class=palette-description>`),tr=`map-state-borders`,nr={x:0,y:0,data:null,visible:!1};function rr(e){let t,n,r=nr,[i,a]=x(Ge),[o,s]=x(!1),[c,l]=x(!1),[u,d]=x(0),[f,p]=x({a:1,b:0,c:0,d:1,e:0,f:0}),m=w(()=>u()/window.devicePixelRatio),h=w(()=>H.find(e=>e.id===i())??H[0]),g=t=>{t.visible===r.visible&&t.data===r.data&&t.x===r.x&&t.y===r.y||(r=t,e.onHoverChange(t))},_=()=>{g(nr)},v=()=>{t&&d(t.clientWidth*window.devicePixelRatio)},y=t=>{let n=u(),r=f(),i=n*e.data.length/e.data[0].length,a=0;if(t<1&&r.a!==1?a=Math.max(1,r.a*t):t>1&&r.a!==5&&(a=Math.min(5,r.a*t)),a===0)return;let o=r.e*a/r.a-(a-1)*n/2+(r.a-1)*n/2*a/r.a,s=r.f*a/r.a-(a-1)*i/2+(r.a-1)*i/2*a/r.a,c=Math.min(Math.max(o,n-n*a),0),l=Math.min(Math.max(s,i-i*a),0);p({...r,a,d:a,e:c,f:l}),e.onScaleChange(a)},b=(t,n)=>{let r=u(),i=f(),a=r*e.data.length/e.data[0].length,o=Math.min(Math.max(i.e+t,r-r*i.a),0),s=Math.min(Math.max(i.f+n,a-a*i.a),0);(i.e!==o||i.f!==s)&&p({...i,e:o,f:s})},T=(t,r,i)=>{if(!n||!t?.c)return nr;let a=n.getBoundingClientRect(),o=n.width/window.devicePixelRatio/e.data[0].length,s=f();return{x:a.left+window.scrollX+s.e/window.devicePixelRatio+(i*o+o/2)*s.a,y:a.top+window.scrollY+s.f/window.devicePixelRatio+r*o*s.a,data:t,visible:!0}},O=(t,r)=>{if(!n)return nr;let i=n.getBoundingClientRect(),a=f(),o=n.width/window.devicePixelRatio/e.data[0].length,s=(t-i.left-a.e/window.devicePixelRatio)/a.a,c=(r-i.top-a.f/window.devicePixelRatio)/a.a;for(let t=0;t<e.data.length;t+=1){let n=e.data[t];for(let e=0;e<n.length;e+=1){let r=n[e];if(c>t*o&&c<t*o+o&&s>e*o&&s<e*o+o&&r?.c)return T(r,t,e)}}return nr},ee=()=>{let t=e.search;if(!n||t.length!==5){_();return}for(let n=0;n<e.data.length;n+=1){let r=e.data[n];for(let e=0;e<r.length;e+=1){let i=r[e],a=i?.z??[];for(let r of a)if(`00000${r}`.slice(-5)===t){g(T(i,n,e));return}}}_()},te=t=>{e.search.length!==5&&g(O(t.clientX,t.clientY))},ne=()=>{e.search.length!==5&&_()},re=()=>{if(!n)return;let t=n.getContext(`2d`),r=u();if(!t||r===0)return;t.clearRect(0,0,n.width,n.height);let a=n.width/e.data[0].length,o=f();t.setTransform(o.a,o.b,o.c,o.d,o.e,o.f),nt(t,e.data,o,r,a,e.search,i(),c())};E(()=>{let e=window.localStorage.getItem(`map-palette-mode`);e&&H.some(t=>t.id===e)&&a(e),l(window.localStorage.getItem(tr)===`true`),v();let t=()=>v();window.addEventListener(`resize`,t),D(()=>window.removeEventListener(`resize`,t))}),C(()=>{e.onPaletteChange(i())}),C(()=>{e.onWidthChange?.(m())}),C(()=>{if(e.search,f(),u(),e.search.length===5){ee();return}_()}),C(()=>{u(),f(),i(),c(),e.search;let t=window.setTimeout(()=>re(),50);D(()=>window.clearTimeout(t))});let ie=e=>{if(i()===e){s(!1);return}a(e),s(!1),window.localStorage.setItem(`map-palette-mode`,e)},ae=()=>{let e=!c();l(e),window.localStorage.setItem(tr,String(e))};return(()=>{var r=$n(),a=r.firstChild,l=a.nextSibling,d=l.firstChild,f=d.firstChild,p=f.nextSibling,g=p.firstChild.nextSibling,_=p.nextSibling,v=l.nextSibling.firstChild,x=v.firstChild,C=x.nextSibling,w=C.nextSibling,T=w.nextSibling,E=v.nextSibling.firstChild,D=E.nextSibling;return Ae(e=>{t=e},r),a.addEventListener(`mouseleave`,ne),a.$$mousemove=te,Ae(e=>{n=e},a),d.$$click=()=>s(e=>!e),z(g,()=>h().label),z(l,N(F,{get when(){return o()},get children(){var e=Qn(),t=e.firstChild,n=t.firstChild;return z(e,N(P,{each:H,children:e=>(()=>{var t=er(),n=t.firstChild,r=n.nextSibling.firstChild,a=r.nextSibling;return t.$$click=()=>ie(e.id),z(r,()=>e.label),z(a,()=>e.description),S(r=>{var a=i()===e.id,o=e.description,s=e.swatch;return a!==r.e&&t.classList.toggle(`active`,r.e=a),o!==r.t&&L(t,`title`,r.t=o),s!==r.a&&R(n,`background-image`,r.a=s),r},{e:void 0,t:void 0,a:void 0}),t})()}),t),t.$$click=ae,S(e=>{var r=!!c(),i=c(),a=!!c();return r!==e.e&&t.classList.toggle(`active`,e.e=r),i!==e.t&&L(t,`aria-pressed`,e.t=i),a!==e.a&&n.classList.toggle(`active`,e.a=a),e},{e:void 0,t:void 0,a:void 0}),e}}),null),x.$$click=()=>b(0,u()/5),z(x,N($,{icon:`caret-up`})),C.$$click=()=>b(0,-u()/5),z(C,N($,{icon:`caret-up`})),w.$$click=()=>b(u()/5,0),z(w,N($,{icon:`caret-up`})),T.$$click=()=>b(-u()/5,0),z(T,N($,{icon:`caret-up`})),E.$$click=()=>y(4/3),z(E,N($,{icon:`plus`})),D.$$click=()=>y(3/4),z(D,N($,{icon:`minus`})),S(t=>{var n=`${m()}px`,r=`${m()/e.data[0].length*e.data.length}px`,i=u(),s=u()/e.data[0].length*e.data.length,c=!!o(),p=o(),g=h().swatch,v=!!o();return n!==t.e&&R(a,`width`,t.e=n),r!==t.t&&R(a,`height`,t.t=r),i!==t.a&&L(a,`width`,t.a=i),s!==t.o&&L(a,`height`,t.o=s),c!==t.i&&l.classList.toggle(`open`,t.i=c),p!==t.n&&L(d,`aria-expanded`,t.n=p),g!==t.s&&R(f,`background-image`,t.s=g),v!==t.h&&_.classList.toggle(`open`,t.h=v),t},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),r})()}De([`mousemove`,`click`]);var ir=I(`<span>/100`),ar=I(`<div class=rankingPane><section class=rankingSection><span class=rankingLabel>Method</span><p>NOAA weather data from 2010 to 2024. Each place is scored by pleasant days minus unpleasant days, then normalized to 0-100. Days that are neither pleasant nor unpleasant are treated as neutral. Perceived temperature includes humidity.</p></section><section class=rankingSection><span class=rankingLabel>Rules</span><div class=criteriaGrid><div class=criteriaBlock><span>Pleasant</span><ul><li>Average perceived temperature between 62°F and 75°F</li><li>Maximum perceived temperature below 82°F</li><li>Minimum perceived temperature above 45°F</li><li><a href=https://en.wikipedia.org/wiki/Visibility target=_blank rel=nofollow>Visibility</a> above 6 statute miles</li><li>Less than 0.10&quot; of precipitation</li><li>Missing visibility does not block a pleasant day</li><li>Missing precipitation does not block a pleasant day</li><li>NOAA incomplete zero-precipitation reports do not count as pleasant</li></ul></div><div class=criteriaBlock><span>Unpleasant</span><ul><li>Average perceived temperature below 40°F, unless the maximum still reaches 50°F</li><li>Average perceived temperature above 88°F</li><li><a href=https://en.wikipedia.org/wiki/Visibility target=_blank rel=nofollow>Visibility</a> below 5 statute miles</li><li>Any snow or ice pellets, hail, thunder, or tornadoes/funnel clouds</li><li>More than 0.20&quot; of precipitation</li></ul></div></div></section><section class=rankingSection><div class=rankingHeading><span class=rankingLabel>Top</span><h2>Best weather</h2></div><div class=rankingList></div></section><section class=rankingSection><div class=rankingHeading><span class=rankingLabel>Bottom</span><h2>Hardest weather</h2></div><div class=rankingList>`),or=I(`<div><span>`);function sr(e){let t=Math.max(0,Math.min(Ue(e),100)),n=He(e);return(()=>{var e=ir(),r=e.firstChild;return L(e,`title`,`Raw score: ${n}`),z(e,t,r),e})()}function cr(e,t){return e[t[1]][t[0]]}function lr(e){return(()=>{var t=ar(),n=t.firstChild.nextSibling.nextSibling,r=n.firstChild.nextSibling,i=n.nextSibling.firstChild.nextSibling;return z(r,N(P,{get each(){return e.top},children:t=>{let n=cr(e.data,t);return(()=>{var e=or(),t=e.firstChild;return z(t,()=>ze(n)),z(e,()=>sr(n),null),e})()}})),z(i,N(P,{get each(){return e.bottom},children:t=>{let n=cr(e.data,t);return(()=>{var e=or(),t=e.firstChild;return z(t,()=>ze(n)),z(e,()=>sr(n),null),e})()}})),t})()}var ur=I(`<div class=results role=listbox>`),dr=I(`<div class=searchWrap><div class=searchHold><div class=searchBox><input class=search placeholder="Search ZIP code or city"role=combobox aria-autocomplete=list><button type=button aria-label="Clear search">`),fr=I(`<button type=button role=option><span></span><span>`);function pr(e){let t=new Map;for(let n of e){let e=t.get(n.n);if(!e){t.set(n.n,{...n,count:1});continue}e.count+=1,(n.p>e.p||n.p===e.p&&n.z<e.z)&&(e.z=n.z,e.p=n.p)}return Array.from(t.values())}function mr(e,t){let n=e.toLowerCase().split(`,`)[0];return n===t?0:n.startsWith(`${t} `)?1:n.startsWith(t)?2:n.includes(` ${t}`)?3:4}function hr(e,t,n){let r=mr(t.n,e)-mr(n.n,e);return r===0?t.c===n.c?t.p===n.p?t.z.localeCompare(n.z):n.p-t.p:n.c-t.c:r}function gr(e){let[t,n]=x(``),[r,i]=x(-1),a=w(()=>{let n=t();if(Number.isNaN(parseInt(n,10))){if(n.length<=2)return[];let t=n.toLowerCase();return pr(e.searchIndex.filter(e=>e.n.toLowerCase().includes(t))).sort((e,n)=>hr(t,e,n)).slice(0,10)}return n.length>1&&n.length<5?e.searchIndex.filter(e=>e.z.startsWith(n)).map(e=>({...e,count:1})).slice(0,10):[]});C(()=>{let e=a(),t=r();if(e.length===0){t!==-1&&i(-1);return}t>=e.length&&i(e.length-1)});let o=t=>{if(n(t),i(-1),Number.isNaN(parseInt(t,10))){e.onChange(``);return}e.onChange(t)},s=e=>{o(e.z)},c=e=>{let t=a();if(t.length!==0){if(e.key===`ArrowDown`){e.preventDefault(),i(e=>e<t.length-1?e+1:t.length-1);return}if(e.key===`ArrowUp`){e.preventDefault(),i(e=>e>0?e-1:0);return}if(e.key===`Enter`){let n=r();if(n<0){e.preventDefault(),s(t[0]);return}e.preventDefault(),s(t[n]);return}e.key===`Escape`&&i(-1)}};return(()=>{var e=dr(),n=e.firstChild,l=n.firstChild.firstChild,u=l.nextSibling;return l.$$keydown=e=>c(e),l.$$input=e=>o(e.currentTarget.value),u.$$click=()=>o(``),z(u,N($,{icon:`times-circle`})),z(n,N(F,{get when(){return a().length>0},get children(){var e=ur();return z(e,N(P,{get each(){return a()},children:(e,t)=>(()=>{var n=fr(),a=n.firstChild,o=a.nextSibling;return n.$$click=()=>s(e),n.addEventListener(`mouseenter`,()=>i(t())),z(a,(()=>{var t=Ce(()=>e.count>1);return()=>t()?`${e.z} +${e.count-1}`:e.z})()),z(o,()=>Ve(e.n)),S(e=>{var i=`search-result-${t()}`,a=r()===t(),o=r()===t();return i!==e.e&&L(n,`id`,e.e=i),a!==e.t&&L(n,`aria-selected`,e.t=a),o!==e.a&&n.classList.toggle(`active`,e.a=o),e},{e:void 0,t:void 0,a:void 0}),n})()})),e}}),null),S(e=>{var t=a().length>0,n=r()>=0?`search-result-${r()}`:void 0;return t!==e.e&&L(l,`aria-expanded`,e.e=t),n!==e.t&&L(l,`aria-activedescendant`,e.t=n),e},{e:void 0,t:void 0}),S(()=>l.value=t()),e})()}De([`input`,`keydown`,`click`]);var _r=I(`<div class=hud-search>`),vr=I(`<aside class=detail-panel><div class=detail-panel-body>`),yr=I(`<section class=app-home><div class=top-hud><div class=hud-brand><span>Where to Live</span></div><span class="hud-chip hud-meta">NOAA 2010-2024</span><button type=button class="hud-chip hud-details"></button><a class="hud-chip hud-source"href=https://github.com/Nicell/where-to-live target=_blank rel=noreferrer><span>Source</span></a></div><div class=map-holder>`),br=I(`<div class=app-root>`),xr=I(`<span>Loading Weather Data`),Sr=I(`<div class=loading>`),Cr=I(`<span>`),wr={x:0,y:0,data:null,visible:!1},Tr=`/where-to-live/assets/map.json`,Er=`/where-to-live/assets/search.json`;async function Dr(e){let t=await fetch(e);if(!t.ok)throw Error(`Failed to load ${e}: ${t.status}`);return t.json()}function Or(){let[e,t]=x(wr),[n,r]=x(``),[i,a]=x(null),[o,s]=x(null),[c,l]=x(1),[u,d]=x(0),[f,p]=x(Ge),[m,h]=x(!1),[g,_]=x(null),v=w(()=>{let e=i(),t=u();return!e||e.m.length===0||t===0?0:t/e.m[0].length}),y=w(()=>{let e=i();return!e||e.m.length===0?1.8:e.m[0].length/e.m.length});return E(()=>{let e=()=>{window.innerWidth<768&&h(!1)};window.addEventListener(`resize`,e),D(()=>window.removeEventListener(`resize`,e)),Dr(Tr).then(e=>{a(e)}).catch(e=>{_(e instanceof Error?e.message:`Unable to load weather data.`)}),Dr(Er).then(e=>{s(e)}).catch(e=>{console.error(`Unable to load search index.`,e)})}),(()=>{var a=br();return z(a,N(F,{get when(){return i()},get fallback(){return(()=>{var e=Sr();return z(e,N(F,{get when(){return!g()},get fallback(){return[N($,{icon:`exclamation-circle`}),(()=>{var e=Cr();return z(e,g),e})()]},get children(){return[N($,{class:`loader`,icon:`sun`}),xr()]}})),e})()},get children(){var a=yr(),s=a.firstChild,u=s.firstChild,g=u.firstChild,_=u.nextSibling,b=_.nextSibling,x=b.nextSibling,C=x.firstChild,w=s.nextSibling;return z(u,N($,{icon:`sun`}),g),z(s,N(F,{get when(){return o()},get children(){var e=_r();return z(e,N(gr,{get searchIndex(){return o()??[]},onChange:r})),e}}),_),b.$$click=()=>h(e=>!e),z(b,()=>m()?`Hide details`:`Open details`),z(x,N($,{icon:{prefix:`fab`,iconName:`github`}}),C),z(w,N(rr,{get data(){return i().m},get search(){return n()},onHoverChange:t,onScaleChange:l,onPaletteChange:p,onWidthChange:d})),z(a,N(F,{get when(){return m()},get children(){var e=vr(),t=e.firstChild;return z(t,N(lr,{get top(){return i().t},get bottom(){return i().b},get data(){return i().m}})),e}}),null),z(a,N(st,{get state(){return e()},get cell(){return v()},get mapScale(){return c()},get paletteMode(){return f()}}),null),S(e=>{var t=String(y()),n=m();return t!==e.e&&R(a,`--map-aspect`,e.e=t),n!==e.t&&L(b,`aria-expanded`,e.t=n),e},{e:void 0,t:void 0}),a}})),a})()}De([`click`]);var kr=document.getElementById(`app`);if(!kr)throw Error(`App root not found.`);Ee(()=>N(Or,{}),kr);
//# sourceMappingURL=index-DHFOOH9U.js.map