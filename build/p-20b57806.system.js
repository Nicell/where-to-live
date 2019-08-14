var __extends=this&&this.__extends||function(){var e=function(t,r){e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)if(t.hasOwnProperty(r))e[r]=t[r]};return e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}();var __awaiter=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(a,i){function f(e){try{o(n.next(e))}catch(e){i(e)}}function s(e){try{o(n["throw"](e))}catch(e){i(e)}}function o(e){e.done?a(e.value):new r(function(t){t(e.value)}).then(f,s)}o((n=n.apply(e,t||[])).next())})};var __generator=this&&this.__generator||function(e,t){var r={label:0,sent:function(){if(i[0]&1)throw i[1];return i[1]},trys:[],ops:[]},n,a,i,f;return f={next:s(0),throw:s(1),return:s(2)},typeof Symbol==="function"&&(f[Symbol.iterator]=function(){return this}),f;function s(e){return function(t){return o([e,t])}}function o(f){if(n)throw new TypeError("Generator is already executing.");while(r)try{if(n=1,a&&(i=f[0]&2?a["return"]:f[0]?a["throw"]||((i=a["return"])&&i.call(a),0):a.next)&&!(i=i.call(a,f[1])).done)return i;if(a=0,i)f=[f[0]&2,i.value];switch(f[0]){case 0:case 1:i=f;break;case 4:r.label++;return{value:f[1],done:false};case 5:r.label++;a=f[1];f=[0];continue;case 7:f=r.ops.pop();r.trys.pop();continue;default:if(!(i=r.trys,i=i.length>0&&i[i.length-1])&&(f[0]===6||f[0]===2)){r=0;continue}if(f[0]===3&&(!i||f[1]>i[0]&&f[1]<i[3])){r.label=f[1];break}if(f[0]===6&&r.label<i[1]){r.label=i[1];i=f;break}if(i&&r.label<i[2]){r.label=i[2];r.ops.push(f);break}if(i[2])r.ops.pop();r.trys.pop();continue}f=t.call(e,r)}catch(e){f=[6,e];a=0}finally{n=i=0}if(f[0]&5)throw f[1];return{value:f[0]?f[1]:void 0,done:true}}};System.register([],function(e,t){"use strict";return{execute:function(){var r=this;var n="app";var a=0;var i=false;var f;var s=false;var o=window;var l=document;var u={$flags$:0,$resourcesUrl$:"",jmp:function(e){return e()},raf:function(e){return requestAnimationFrame(e)},ael:function(e,t,r,n){return e.addEventListener(t,r,n)},rel:function(e,t,r,n){return e.removeEventListener(t,r,n)}};var c=function(){try{new CSSStyleSheet;return true}catch(e){}return false}();var $=new WeakMap;var v=function(e){return $.get(e)};var h=e("r",function(e,t){return $.set(t.$lazyInstance$=e,t)});var d=function(e){{var t={$flags$:0,$hostElement$:e,$instanceValues$:new Map};t.$onReadyPromise$=new Promise(function(e){return t.$onReadyResolve$=e});return $.set(e,t)}};var p=function(e,t){return t in e};var m=function(e){return console.error(e)};var g=new Map;var y=function(e,r,n){var a=e.$tagName$.replace(/-/g,"_");var i=e.$lazyBundleIds$;var f=g.get(i);if(f){return f[a]}return t.import("./"+i+".entry.js"+"").then(function(e){{g.set(i,e)}return e[a]},m)};var b=new Map;var w=o.__stencil_cssshim;var _=[];var S=[];var x=[];var k=function(e,t){return function(r){e.push(r);if(!i){i=true;if(t&&u.$flags$&4){R(C)}else{u.raf(C)}}}};var E=function(e){for(var t=0;t<e.length;t++){try{e[t](performance.now())}catch(e){m(e)}}e.length=0};var j=function(e,t){var r=0;var n=0;while(r<e.length&&(n=performance.now())<t){try{e[r++](n)}catch(e){m(e)}}if(r===e.length){e.length=0}else if(r!==0){e.splice(0,r)}};var C=function(){a++;E(_);var e=(u.$flags$&6)===2?performance.now()+10*Math.ceil(a*(1/22)):Infinity;j(S,e);j(x,e);if(S.length>0){x.push.apply(x,S);S.length=0}if(i=_.length+S.length+x.length>0){u.raf(C)}else{a=0}};var R=function(e){return Promise.resolve().then(e)};var L=k(S,true);var P={};var O=function(e){return e!=null};var U=function(e){return e.toLowerCase()};var N=function(e){e=typeof e;return e==="object"||e==="function"};var A=function(e){return"__sc_import_"+e.replace(/\s|-/g,"_")};var M=e("a",function(){if(!(o.CSS&&o.CSS.supports&&o.CSS.supports("color","var(--c)"))){return t.import("./p-aaf72d6b.system.js")}return Promise.resolve()});var B=e("p",function(){return __awaiter(r,void 0,void 0,function(){var e,r,a,i,f;return __generator(this,function(s){switch(s.label){case 0:e=t.meta.url;r=new RegExp("/"+n+"(\\.esm)?\\.js($|\\?|#)");a=Array.from(l.querySelectorAll("script")).find(function(e){return r.test(e.src)||e.getAttribute("data-namespace")===n});i=a["data-opts"];if(!(e!==""))return[3,1];return[2,Object.assign({},i,{resourcesUrl:new URL(".",e).href})];case 1:f=new URL(".",new URL(a.getAttribute("data-resources-url")||a.src,o.location.href));I(f.href);if(!!window.customElements)return[3,3];return[4,t.import("./p-bcae8885.system.js")];case 2:s.sent();s.label=3;case 3:return[2,Object.assign({},i,{resourcesUrl:f.href})]}})})});var I=function(e){var t=A(n);try{o[t]=new Function("w","return import(w);//"+Math.random())}catch(n){var r=new Map;o[t]=function(n){var a=new URL(n,e).href;var i=r.get(a);if(!i){var f=l.createElement("script");f.type="module";f.src=URL.createObjectURL(new Blob(["import * as m from '"+a+"'; window."+t+".m = m;"],{type:"application/javascript"}));i=new Promise(function(e){f.onload=function(){e(o[t].m);f.remove()}});r.set(a,i);l.head.appendChild(f)}return i}}};var T=function(e,t){if(e!=null&&!N(e)){if(t&2){return parseFloat(e)}if(t&1){return String(e)}return e}return e};var z="hydrated";var H=new WeakMap;var q=function(e,t,r){var n=b.get(e);if(c&&r){n=n||new CSSStyleSheet;n.replace(t)}else{n=t}b.set(e,n)};var V=function(e,t,r,n){var a=W(t.$tagName$);var i=b.get(a);e=e.nodeType===11?e:l;if(i){if(typeof i==="string"){e=e.head||e;var f=H.get(e);var s=void 0;if(!f){H.set(e,f=new Set)}if(!f.has(a)){{if(w){s=w.createHostStyle(n,a,i,!!(t.$flags$&10));var o=s["s-sc"];if(o){a=o;f=null}}else{s=l.createElement("style");s.innerHTML=i}e.insertBefore(s,e.querySelector("link"))}if(f){f.add(a)}}}else if(!e.adoptedStyleSheets.includes(i)){e.adoptedStyleSheets=e.adoptedStyleSheets.concat([i])}}return a};var F=function(e,t,r){var n=V(e.getRootNode(),t,r,e)};var W=function(e,t){return"sc-"+e};var D=e("h",function(e,t){var r=[];for(var n=2;n<arguments.length;n++){r[n-2]=arguments[n]}var a=null;var i=false;var f=false;var s;var o=[];var l=function(t){for(var r=0;r<t.length;r++){a=t[r];if(Array.isArray(a)){l(a)}else if(a!=null&&typeof a!=="boolean"){if(i=typeof e!=="function"&&!N(a)){a=String(a)}if(i&&f){o[o.length-1].$text$+=a}else{o.push(i?{$flags$:0,$text$:a}:a)}f=i}}};l(r);if(t){{s=t.key||undefined}{var u=t.className||t.class;if(u){t.class=typeof u!=="object"?u:Object.keys(u).filter(function(e){return u[e]}).join(" ")}}}if(typeof e==="function"){return e(t,o,J)}var c={$flags$:0,$tag$:e,$children$:o.length>0?o:null,$elm$:undefined,$attrs$:t};{c.$key$=s}return c});var G={};var Q=function(e){return e&&e.$tag$===G};var J={forEach:function(e,t){return e.map(K).forEach(t)},map:function(e,t){return e.map(K).map(t).map(X)}};var K=function(e){return{vattrs:e.$attrs$,vchildren:e.$children$,vkey:e.$key$,vname:e.$name$,vtag:e.$tag$,vtext:e.$text$}};var X=function(e){return{$flags$:0,$attrs$:e.vattrs,$children$:e.vchildren,$key$:e.vkey,$name$:e.vname,$tag$:e.vtag,$text$:e.vtext}};var Y=function(e,t,r,n,a,i){if(r===n){return}if(t==="class"){var f=e.classList;Z(r).forEach(function(e){return f.remove(e)});Z(n).forEach(function(e){return f.add(e)})}else if(t==="style"){{for(var s in r){if(!n||n[s]==null){if(s.includes("-")){e.style.removeProperty(s)}else{e.style[s]=""}}}}for(var s in n){if(!r||n[s]!==r[s]){if(s.includes("-")){e.style.setProperty(s,n[s])}else{e.style[s]=n[s]}}}}else if(t==="key");else if(t==="ref"){if(n){n(e)}}else if(t.startsWith("on")&&!p(e,t)){if(p(e,U(t))){t=U(t.substring(2))}else{t=U(t[2])+t.substring(3)}if(r){u.rel(e,t,r,false)}if(n){u.ael(e,t,n,false)}}else{var o=p(e,t);var l=N(n);if((o||l&&n!==null)&&!a){try{if(!e.tagName.includes("-")){var c=n==null?"":n;if(e[t]!==c){e[t]=c}}else{e[t]=n}}catch(e){}}if(n==null||n===false){{e.removeAttribute(t)}}else if((!o||i&4||a)&&!l){n=n===true?"":n.toString();{e.setAttribute(t,n)}}}};var Z=function(e){return!e?[]:e.split(/\s+/).filter(function(e){return e})};var ee=function(e,t,r,n){var a=t.$elm$.nodeType===11&&t.$elm$.host?t.$elm$.host:t.$elm$;var i=e&&e.$attrs$||P;var f=t.$attrs$||P;{for(n in i){if(!(n in f)){Y(a,n,i[n],undefined,r,t.$flags$)}}}for(n in f){Y(a,n,i[n],f[n],r,t.$flags$)}};var te=function(e,t,r,n){var a=t.$children$[r];var i=0;var f;var o;if(O(a.$text$)){a.$elm$=l.createTextNode(a.$text$)}else{f=a.$elm$=l.createElement(a.$tag$);{ee(null,a,s)}if(a.$children$){for(i=0;i<a.$children$.length;++i){o=te(e,a,i);if(o){f.appendChild(o)}}}}return a.$elm$};var re=function(e,t,r,n,a,i){var f=e;var s;for(;a<=i;++a){if(n[a]){s=te(null,r,a);if(s){n[a].$elm$=s;f.insertBefore(s,t)}}}};var ne=function(e,t,r,n){for(;t<=r;++t){if(O(e[t])){n=e[t].$elm$;se(e[t],true);n.remove()}}};var ae=function(e,t,r,n){var a=0;var i=0;var f=0;var s=0;var o=t.length-1;var l=t[0];var u=t[o];var c=n.length-1;var $=n[0];var v=n[c];var h;var d;while(a<=o&&i<=c){if(l==null){l=t[++a]}else if(u==null){u=t[--o]}else if($==null){$=n[++i]}else if(v==null){v=n[--c]}else if(ie(l,$)){fe(l,$);l=t[++a];$=n[++i]}else if(ie(u,v)){fe(u,v);u=t[--o];v=n[--c]}else if(ie(l,v)){fe(l,v);e.insertBefore(l.$elm$,u.$elm$.nextSibling);l=t[++a];v=n[--c]}else if(ie(u,$)){fe(u,$);e.insertBefore(u.$elm$,l.$elm$);u=t[--o];$=n[++i]}else{f=-1;{for(s=a;s<=o;++s){if(t[s]&&O(t[s].$key$)&&t[s].$key$===$.$key$){f=s;break}}}if(f>=0){d=t[f];if(d.$tag$!==$.$tag$){h=te(t&&t[i],r,f)}else{fe(d,$);t[f]=undefined;h=d.$elm$}$=n[++i]}else{h=te(t&&t[i],r,i);$=n[++i]}if(h){{l.$elm$.parentNode.insertBefore(h,l.$elm$)}}}}if(a>o){re(e,n[c+1]==null?null:n[c+1].$elm$,r,n,i,c)}else if(i>c){ne(t,a,o)}};var ie=function(e,t){if(e.$tag$===t.$tag$){{return e.$key$===t.$key$}return true}return false};var fe=function(e,t){var r=t.$elm$=e.$elm$;var n=e.$children$;var a=t.$children$;if(!O(t.$text$)){{{ee(e,t,s)}}if(O(n)&&O(a)){ae(r,n,t,a)}else if(O(a)){if(O(e.$text$)){r.textContent=""}re(r,null,t,a,0,a.length-1)}else if(O(n)){ne(n,0,n.length-1)}}else if(e.$text$!==t.$text$){r.textContent=t.$text$}};var se=function(e,t){if(e){e.$attrs$&&e.$attrs$.ref&&e.$attrs$.ref(t?null:e.$elm$);e.$children$&&e.$children$.forEach(function(e){se(e,t)})}};var oe=function(e,t,r,n){f=U(e.tagName);var a=t.$vnode$||{$flags$:0};var i=Q(n)?n:D(null,null,n);i.$tag$=null;i.$flags$|=4;t.$vnode$=i;i.$elm$=a.$elm$=e;fe(a,i)};var le=function(e,t,r,n){{t.$flags$|=16}var a=t.$lazyInstance$;var i=function(){return ue(e,t,r,a,n)};var f;return de(f,function(){return L(i)})};var ue=function(e,t,r,n,a){{t.$flags$&=~16}{e["s-lr"]=false}if(a){F(e,r,t.$modeName$)}{{t.$flags$|=4;try{oe(e,t,r,n.render())}catch(e){m(e)}t.$flags$&=~4}}if(w){w.updateHost(e)}{e["s-lr"]=true}{t.$flags$|=2}if(e["s-rc"].length>0){e["s-rc"].forEach(function(e){return e()});e["s-rc"].length=0}ce(e,t)};var ce=function(e,t,r){if(!e["s-al"]){var n=t.$lazyInstance$;var a=t.$ancestorComponent$;{he(n,"componentDidRender")}if(!(t.$flags$&64)){t.$flags$|=64;{e.classList.add(z)}{he(n,"componentDidLoad")}{t.$onReadyResolve$(e)}if(!a){ve()}}if(a){if(r=a["s-al"]){r.delete(e);if(r.size===0){a["s-al"]=undefined;a["s-init"]()}}t.$ancestorComponent$=undefined}}};var $e=function(e,t){{var r=v(e);if(r.$flags$&2){le(e,r,t,false)}}};var ve=function(){{l.documentElement.classList.add(z)}{u.$flags$|=2}};var he=function(e,t,r){if(e&&e[t]){try{return e[t](r)}catch(e){m(e)}}return undefined};var de=function(e,t){return e&&e.then?e.then(t):t()};var pe=function(e,t){return v(e).$instanceValues$.get(t)};var me=function(e,t,r,n){var a=v(e);var i=a.$hostElement$;var f=a.$instanceValues$.get(t);var s=a.$flags$;r=T(r,n.$members$[t][0]);if(r!==f&&(!(s&8)||f===undefined)){a.$instanceValues$.set(t,r);if(a.$lazyInstance$){if((s&(4|2|16))===2){le(i,a,n,false)}}}};var ge=function(e,t,r){if(t.$members$){var n=Object.entries(t.$members$);var a=e.prototype;n.forEach(function(e){var n=e[0],i=e[1][0];if(i&31||r&2&&i&32){Object.defineProperty(a,n,{get:function(){return pe(this,n)},set:function(e){me(this,n,e,t)},configurable:true,enumerable:true})}});if(r&1){var i=new Map;a.attributeChangedCallback=function(e,t,r){var n=this;u.jmp(function(){var t=i.get(e);n[t]=r===null&&typeof n[t]==="boolean"?false:r})};e.observedAttributes=n.filter(function(e){var t=e[0],r=e[1];return r[0]&15}).map(function(e){var t=e[0],r=e[1];var n=r[1]||t;i.set(n,t);return n})}}return e};var ye=function(e,t,n,a,i){return __awaiter(r,void 0,void 0,function(){var r,a,f,s;return __generator(this,function(o){switch(o.label){case 0:if(!((t.$flags$&32)===0))return[3,3];t.$flags$|=32;i=y(n);if(!i.then)return[3,2];return[4,i];case 1:i=o.sent();o.label=2;case 2:if(!i.isProxied){ge(i,n,2);i.isProxied=true}{t.$flags$|=8}try{new i(t)}catch(e){m(e)}{t.$flags$&=~8}r=W(n.$tagName$);if(!b.has(r)&&i.style){a=i.style;q(r,a,!!(n.$flags$&1))}o.label=3;case 3:f=t.$ancestorComponent$;s=function(){return le(e,t,n,true)};if(f&&f["s-lr"]===false&&f["s-rc"]){f["s-rc"].push(s)}else{s()}return[2]}})})};var be=function(e,t){if((u.$flags$&1)===0){var r=v(e);if(!(r.$flags$&1)){r.$flags$|=1;{var n=e;while(n=n.parentNode||n.host){if(n["s-init"]&&n["s-lr"]===false){r.$ancestorComponent$=n;(n["s-al"]=n["s-al"]||new Set).add(e);break}}}if(t.$members$){Object.entries(t.$members$).forEach(function(t){var r=t[0],n=t[1][0];if(n&31&&e.hasOwnProperty(r)){var a=e[r];delete e[r];e[r]=a}})}{R(function(){return ye(e,r,t)})}}}};var we=function(e){if((u.$flags$&1)===0){var t=v(e);if(w){w.removeHost(e)}}};var _e=e("b",function(e,t){if(t===void 0){t={}}var r=[];var n=t.exclude||[];var a=l.head;var i=o.customElements;var f=a.querySelector("meta[charset]");var s=l.createElement("style");var c;Object.assign(u,t);u.$resourcesUrl$=new URL(t.resourcesUrl||"./",l.baseURI).href;if(t.syncQueue){u.$flags$|=4}e.forEach(function(e){return e[1].forEach(function(t){var a={$flags$:t[0],$tagName$:t[1],$members$:t[2],$listeners$:t[3]};var f=a.$tagName$;var s=function(e){__extends(t,e);function t(t){var r=e.call(this,t)||this;t=r;{r["s-lr"]=false;r["s-rc"]=[]}d(t);return r}t.prototype.connectedCallback=function(){var e=this;if(c){clearTimeout(c);c=null}u.jmp(function(){return be(e,a)})};t.prototype.disconnectedCallback=function(){var e=this;u.jmp(function(){return we(e)})};t.prototype["s-init"]=function(){var e=v(this);if(e.$lazyInstance$){ce(this,e)}};t.prototype["s-hmr"]=function(e){};t.prototype.forceUpdate=function(){$e(this,a)};t.prototype.componentOnReady=function(){return v(this).$onReadyPromise$};return t}(HTMLElement);a.$lazyBundleIds$=e[0];if(!n.includes(f)&&!i.get(f)){r.push(f);i.define(f,ge(s,a,1))}})});s.innerHTML=r+"{visibility:hidden}.hydrated{visibility:inherit}";s.setAttribute("data-styles","");a.insertBefore(s,f?f.nextSibling:a.firstChild);u.jmp(function(){return c=setTimeout(ve,30)})});var Se=e("g",function(e){return v(e).$hostElement$})}}});