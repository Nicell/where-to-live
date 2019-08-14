import{r as t,h as s,g as i}from"./p-4c2b2f3e.js";class h{constructor(s){t(this,s),this.getData=async()=>{this.data=await(await fetch("/assets/map.json")).json()},this.getZips=async()=>{this.zips=await(await fetch("/assets/zip.json")).json()},this.updateHover=t=>{this.hover=t},this.updateSearch=t=>{this.search=t},this.hover={x:0,y:0,data:{},visible:!1},this.search="",this.getData(),this.getZips()}getRank(t){return(t.w&&t.w.m?t.w.m:[]).reduce((t,s,i)=>i%2==0?t+s:t-s,0)}render(){const t=this.data.t[0],i=this.data.b[0],h=this.getRank(this.data.m[t[1]][t[0]]),a=this.getRank(this.data.m[i[1]][i[0]]);return s("div",{class:"app-home"},s("header",null,s("h1",null,"🌎 Where to Live"),s("a",{href:"https://github.com/Nicell/where-to-live",target:"_blank",rel:"noreferrer"},"GitHub")),this.data&&this.zips?s("div",null,s("div",{class:"map-holder"},s("app-map",{data:this.data.m,handleHover:this.updateHover,search:this.search,min:a,max:h})),s("app-hover",{state:this.hover}),s("app-search",{zips:this.zips,value:this.search,handleChange:this.updateSearch})):null,s("app-ranks",{top:this.data.t,bottom:this.data.b,data:this.data.m}))}static get style(){return"header{background-color:var(--foreground-secondary);color:var(--background);-webkit-box-shadow:var(--shadow-2);box-shadow:var(--shadow-2);padding:15px 20px;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center}header>h1{margin:0}header>a{color:var(--background)}.map-holder{padding:20px}\@media screen and (max-width:768px){.map-holder{padding:5px}}"}}const a=[31,28,31,30,31,30,31,31,30,31,30,31],e=["J","F","M","A","M","J","J","A","S","O","N","D"];class l{constructor(s){t(this,s)}render(){const t=this.state.data&&this.state.data.w&&this.state.data.w.m?this.state.data.w.m:[],i=Math.min(Math.max(this.state.x,136)+5,document.documentElement.clientWidth-136-5);return this.state.visible?s("div",{class:"app-hover",style:{left:i+"px",top:this.state.y+"px","--before-offset":`calc(50% + ${this.state.x-i}px)`}},this.state.data.c,", ",this.state.data.s," ",t.reduce((t,s,i)=>i%2==0?t+s:t-s,0),s("div",{class:"hover-charts"},t.map((i,h)=>h%2==0?s("div",{class:"hover-chart"},s("div",{class:"hover-chart-bar"},s("div",{style:{height:t[h+1]/a[h/2]*100+"%",background:"#ff5252"}}),s("div",{style:{height:i/a[h/2]*100+"%",background:"#69f0ae"}})),s("span",null,e[h/2])):null))):null}get el(){return i(this)}static get style(){return".app-hover{-webkit-transform:translate(-50%,calc(-100% - 7px));transform:translate(-50%,calc(-100% - 7px));-webkit-box-sizing:border-box;box-sizing:border-box;padding:10px 15px;border-radius:4px;border:solid 1px var(--background-dark);-webkit-box-shadow:var(--shadow-2);box-shadow:var(--shadow-2)}.app-hover,.app-hover:before{position:absolute;background:var(--background-light)}.app-hover:before{content:\"\";display:block;width:10px;height:10px;bottom:0;left:var(--before-offset);-webkit-transform:translate(-50%,6px) rotate(45deg);transform:translate(-50%,6px) rotate(45deg);border:1px solid transparent;border-bottom-color:var(--background-dark);border-right-color:var(--background-dark)}.hover-charts{display:-ms-flexbox;display:flex}.hover-chart{-ms-flex-align:center;align-items:center;padding-right:5px;font-size:12px}.hover-chart,.hover-chart-bar{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.hover-chart-bar{height:60px;width:15px;background-color:#eee;-ms-flex-pack:end;justify-content:flex-end}.hover-chart-bar>div{-webkit-transition:all .2s ease;transition:all .2s ease}"}}const n=1-.55191502449;function o(t,s,i,h,a,e,l,o,r){const c=.85*a,p=h*s.length/s[0].length;s.forEach((d,u)=>d.forEach((d,v)=>{if(d.c&&(v*a+(a-c)/2)*i.a<-i.e+h&&(v*a+(a-c)/2+c)*i.a>-i.e&&(u*a+(a-c)/2)*i.a<-i.f+p&&(u*a+(a-c)/2+c)*i.a>-i.f){const i=c/2,h=c/6,p={tl:h,tr:h,br:h,bl:h},m=(u!==s.length-1&&s[u+1][v].c?s[u+1][v].c:"").length>0,w=(0!==u&&s[u-1][v].c?s[u-1][v].c:"").length>0,f=(v!==s[u].length-1&&s[u][v+1].c?s[u][v+1].c:"").length>0,g=(0!==v&&s[u][v-1].c?s[u][v-1].c:"").length>0;let b;w||g||(p.tl=i),w||f||(p.tr=i),m||f||(p.br=i),m||g||(p.bl=i),b=!(e.length>0)||!!d.z&&d.z.filter(t=>("00000"+t.toString()).slice(-5).substr(0,e.length)===e).length>0;const y=(d.w&&d.w.m?d.w.m:[]).reduce((t,s,i)=>i%2==0?t+s:t-s,0);t.fillStyle=r?`hsla(${10+Math.max(y-l,0)/(-l+o)*200}, ${b?"80%":"20%"}, ${b?"56%":"76%"}, 1)`:`hsla(203, ${b?"100%":"0%"}, 46%, ${Math.max(y-l-50,0)/(-l+o-150)*.8+.2})`,function(t,s,i,h,a,e){t.beginPath(),t.moveTo(s+e.tl,i),t.lineTo(s+h-e.tr,i),t.bezierCurveTo(s+h-e.tr*n,i,s+h,i+e.tr*n,s+h,i+e.tr),t.lineTo(s+h,i+a-e.br),t.bezierCurveTo(s+h,i+a-e.br*n,s+h-e.br*n,i+a,s+h-e.br,i+a),t.lineTo(s+e.bl,i+a),t.bezierCurveTo(s+e.bl*n,i+a,s,i+a-e.bl*n,s,i+a-e.bl),t.lineTo(s,i+e.tl),t.bezierCurveTo(s,i+e.tl*n,s+e.tl*n,i,s+e.tl,i),t.closePath(),t.fill()}(t,v*a+(a-c)/2,u*a+(a-c)/2,c,c,p)}}))}class r{constructor(s){t(this,s),this.attachListeners=()=>{window.onresize=()=>{this.calcWidth()};const t=this.el.querySelector(".map-canvas");t.onmousemove=this.canvasHover,t.onmouseleave=this.endHover},this.changeScale=t=>{const s=this.width*this.data.length/this.data[0].length;let i=0;if(t<1&&1!==this.transform.a?i=Math.max(1,this.transform.a*t):t>1&&5!==this.transform.a&&(i=Math.min(5,this.transform.a*t)),0!==i){const t=this.transform.f*i/this.transform.a-(i-1)*s/2+(this.transform.a-1)*s/2*i/this.transform.a,h=Math.min(Math.max(this.transform.e*i/this.transform.a-(i-1)*this.width/2+(this.transform.a-1)*this.width/2*i/this.transform.a,this.width-this.width*i),0),a=Math.min(Math.max(t,s-s*i),0);this.transform=Object.assign({},this.transform,{a:i,d:i,e:h,f:a})}},this.changeTranslation=(t,s)=>{const i=this.width*this.data.length/this.data[0].length,h=Math.min(Math.max(this.transform.e+t,this.width-this.width*this.transform.a),0),a=Math.min(Math.max(this.transform.f+s,i-i*this.transform.a),0);this.transform.e===h&&this.transform.f===a||(this.transform=Object.assign({},this.transform,{e:h,f:a}))},this.canvasHover=t=>{const s=this.el.querySelector(".map-canvas"),i=s.width/window.devicePixelRatio/this.data[0].length,h=s.getBoundingClientRect(),a=(t.clientX-h.left-this.transform.e/window.devicePixelRatio)/this.transform.a,e=(t.clientY-h.top-this.transform.f/window.devicePixelRatio)/this.transform.a;let l;this.data.forEach((t,s)=>t.forEach((t,n)=>{e>s*i&&e<s*i+i&&a>n*i&&a<n*i+i&&t.c&&(l={x:h.left+window.scrollX+this.transform.e/window.devicePixelRatio+(n*i+i/2)*this.transform.a,y:h.top+window.scrollY+this.transform.f/window.devicePixelRatio+s*i*this.transform.a,data:t,visible:!0})})),l||(l={x:0,y:0,data:"",visible:!1}),l.data!==this.hover.data&&5!==this.search.length&&(this.hover=l,this.handleHover(this.hover))},this.searchHover=()=>{const t=this.el.querySelector(".map-canvas"),s=t.width/window.devicePixelRatio/this.data[0].length,i=t.getBoundingClientRect();let h;this.data.forEach((t,a)=>t.forEach((t,e)=>{if(t.z)for(let l of t.z)("00000"+l.toString()).slice(-5)===this.search&&(h={x:i.left+window.scrollX+this.transform.e/window.devicePixelRatio+(e*s+s/2)*this.transform.a,y:i.top+window.scrollY+this.transform.f/window.devicePixelRatio+a*s*this.transform.a,data:t,visible:!0})})),h||(h={x:0,y:0,data:"",visible:!1}),h.data!==this.hover.data&&(this.hover=h,this.handleHover(this.hover))},this.endHover=()=>{5!==this.search.length&&(this.hover={x:0,y:0,data:"",visible:!1},this.handleHover(this.hover))},this.renderCanvas=()=>{const t=this.el.querySelector(".map-canvas"),s=t.getContext("2d");s.clearRect(0,0,t.width,t.height);const i=t.width/this.data[0].length;s.setTransform(this.transform),o(s,this.data,this.transform,this.width,i,this.search,this.min,this.max,this.highContrast)},this.calcWidth=()=>{this.width=this.el.querySelector(".app-map").clientWidth*window.devicePixelRatio},this.toggleMode=()=>{this.highContrast=!this.highContrast},this.transform={a:1,b:0,c:0,d:1,e:0,f:0},this.highContrast=!1,this.hover={x:0,y:0,data:"",visible:!1},this.dragState={dragging:!1,startX:0,startY:0,lastX:0,lastY:0}}componentDidLoad(){this.calcWidth(),this.attachListeners()}componentDidRender(){clearTimeout(this.debounce),this.debounce=setTimeout(()=>this.renderCanvas(),50),5===this.search.length?this.searchHover():(this.hover={x:0,y:0,data:"",visible:!1},this.handleHover(this.hover))}render(){const t=this.width/window.devicePixelRatio;return s("div",{class:"app-map"},s("canvas",{class:"map-canvas",style:{width:t+"px",height:t/this.data[0].length*this.data.length+"px"},width:this.width,height:this.width/this.data[0].length*this.data.length}),s("div",{class:"toggle-mode",onClick:this.toggleMode},s("div",{class:`modeColor ${this.highContrast?"default":"highContrast"}`}),s("div",{class:"modeLabel"},this.highContrast?"Default":"High Contrast")),s("div",{class:"map-controls"},s("div",{class:"map-move"},s("div",{class:"move up",onClick:()=>this.changeTranslation(0,this.width/5)},"^"),s("div",{class:"move down",onClick:()=>this.changeTranslation(0,-this.width/5)},"^"),s("div",{class:"move left",onClick:()=>this.changeTranslation(this.width/5,0)},"^"),s("div",{class:"move right",onClick:()=>this.changeTranslation(-this.width/5,0)},"^")),s("div",{class:"map-zoom"},s("div",{onClick:()=>this.changeScale(4/3)},"+"),s("div",{onClick:()=>this.changeScale(.75)},"-"))))}get el(){return i(this)}static get style(){return".app-map{position:relative}.toggle-mode{position:absolute;bottom:20px;left:20px;display:-ms-flexbox;display:flex;background:#fff;border-radius:50%;cursor:pointer}.modeColor{width:64px;height:64px;border-radius:50%;border:solid 5px var(--background-light);-webkit-box-sizing:border-box;box-sizing:border-box;z-index:1}.modeColor,.modeLabel{-webkit-box-shadow:var(--shadow-1);box-shadow:var(--shadow-1)}.modeLabel{position:absolute;top:50%;left:calc(100% - 3px);white-space:nowrap;-webkit-transform:translateY(-50%);transform:translateY(-50%);padding:3px 5px 4px 7px;background:var(--background-light);border-radius:0 4px 4px 0}.default{background:-webkit-gradient(linear,left top,right top,from(#0091eb),to(rgba(0,145,235,0)));background:linear-gradient(90deg,#0091eb,rgba(0,145,235,0))}.highContrast{background:-webkit-gradient(linear,left top,right top,from(#e95335),color-stop(#e95335),color-stop(#e99e35),color-stop(#e9e935),color-stop(#9ee935),color-stop(#35e962),color-stop(#35e9ad),color-stop(#35dae9),color-stop(#358fe9),to(#358fe9));background:linear-gradient(90deg,#e95335,#e95335,#e99e35,#e9e935,#9ee935,#35e962,#35e9ad,#35dae9,#358fe9,#358fe9)}.map-controls{position:absolute;bottom:20px;right:20px;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.map-move{height:75px;width:75px;margin-right:15px;background-color:var(--background-light);-webkit-box-shadow:var(--shadow-1);box-shadow:var(--shadow-1);border-radius:50%;position:relative}.move{padding:5px;font-size:24px;font-weight:700;line-height:1;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;position:absolute;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.up{top:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.down{bottom:0;left:50%;-webkit-transform:translateX(-50%) rotate(180deg);transform:translateX(-50%) rotate(180deg)}.left{left:0;top:50%;-webkit-transform:translateY(-50%) rotate(-90deg);transform:translateY(-50%) rotate(-90deg)}.right{right:0;top:50%;-webkit-transform:translateY(-50%) rotate(90deg);transform:translateY(-50%) rotate(90deg)}.map-zoom{background:var(--background-light);border-radius:4px;-webkit-box-shadow:var(--shadow-1);box-shadow:var(--shadow-1)}.map-zoom>div{padding:10px;width:15px;font-size:24px;height:18px;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.map-zoom>div:first-child{border-bottom:1px solid rgba(0,0,0,.2)}\@media screen and (max-width:768px){.map-controls{display:none}}"}}class c{constructor(s){t(this,s)}render(){return s("div",{class:"rankingWrap"},s("div",{class:"rankingBox"},s("div",{class:"ranking about"},s("span",null,"About"),s("p",null,"Using NOAA weather data from 2008 to the last full year, we calculate the average number of pleasant and unpleasant days for each month. We then combine those to display a heatmap of the best places to live by weather."),s("p",null,"We calculate the perceived temperature, which takes into account relative humidity, to more accurately evaluate the temperature."),s("p",null,"A pleasant day is counted when all of the following are met:",s("ul",null,s("li",null,"Average perceived temperature between 60°F and 80°F"),s("li",null,"Maximum perceived temperature below 85°F"),s("li",null,"Minimum perceived temperature above 50°F"),s("li",null,s("a",{href:"https://en.wikipedia.org/wiki/Visibility",target:"_blank",rel:"nofollow"},"Visibility")," of more than 5"),s("li",null,'Less than .05" of precipitation'))),s("p",null,"An unpleasant day is counted when any of the following are met:",s("ul",null,s("li",null,"Average perceived temperature below 40°F"),s("li",null,"Average perceived temperature above 90°F"),s("li",null,s("a",{href:"https://en.wikipedia.org/wiki/Visibility",target:"_blank",rel:"nofollow"},"Visibility")," of less than 5"),s("li",null,"Any snow, hail, thunder, or tornados"),s("li",null,'More than .1" of precipitation'))),s("p",null,"All other days are not counted and are instead considered normal days.")),s("div",{class:"rankingCompare"},s("div",{class:"ranking"},s("span",null,"Top Locations"),s("div",null,this.top.map(t=>s("div",null,s("span",null,this.data[t[1]][t[0]].c,", ",this.data[t[1]][t[0]].s),s("span",null,this.data[t[1]][t[0]].w.m.reduce((t,s,i)=>i%2==0?t+s:t-s,0)))))),s("div",{class:"ranking"},s("span",null,"Worst Locations"),s("div",null,this.bottom.map(t=>s("div",null,s("span",null,this.data[t[1]][t[0]].c,", ",this.data[t[1]][t[0]].s),s("span",null,this.data[t[1]][t[0]].w.m.reduce((t,s,i)=>i%2==0?t+s:t-s,0)))))))))}static get style(){return".rankingWrap{-ms-flex-pack:center;justify-content:center}.rankingBox,.rankingWrap{display:-ms-flexbox;display:flex}.rankingBox{margin:20px;margin-top:40px;background:var(--background-light);border-radius:4px;-webkit-box-shadow:var(--shadow-2);box-shadow:var(--shadow-2);-ms-flex-wrap:wrap;flex-wrap:wrap}.ranking{display:-ms-flexbox;display:flex;padding:20px;-ms-flex-direction:column;flex-direction:column;min-width:300px;-ms-flex-positive:1;flex-grow:1;-webkit-box-sizing:border-box;box-sizing:border-box}.ranking,.ranking.about{-ms-flex-negative:1;flex-shrink:1}.ranking.about{width:100%;max-width:800px;border-right:1px solid #ddd}.ranking>span{font-size:20px;text-align:center;margin-bottom:10px}.ranking>div{-ms-flex-direction:column;flex-direction:column}.ranking>div,.ranking>div>div{display:-ms-flexbox;display:flex}.ranking>div>div{padding:5px 0;-ms-flex-pack:justify;justify-content:space-between}\@media screen and (max-width:1200px){.ranking.about{max-width:100%;border-right:none}.rankingCompare{width:100%;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}}"}}class p{constructor(s){t(this,s),this.changeValue=t=>{this.evalChange(t.target.value)},this.evalChange=t=>{isNaN(parseInt(t))?(this.handleChange(""),this.searchByName(t)):(this.handleChange(t),this.searchByZip(t))},this.searchByName=t=>{if(t.length>2){let s=[];for(let i=0;i<this.zips.length&&10!==s.length;i++)this.zips[i].toLowerCase().indexOf(t.toLowerCase())>-1&&s.push({zip:("00000"+i).slice(-5),name:this.zips[i]});this.results=s}else this.results=[]},this.searchByZip=t=>{if(t.length>1&&t.length<5){let s=[],i=parseInt(t),h=i+1,a=Math.pow(10,5-t.length),e=h*a;for(let t=i*a;t<e&&10!==s.length;t++)this.zips[t].length>0&&s.push({zip:("00000"+t).slice(-5),name:this.zips[t]});this.results=s}else this.results=[]},this.results=[]}render(){return s("div",{class:"searchWrap"},s("div",{class:"searchHold"},this.results.length>0?s("div",{class:"results"},this.results.map(t=>s("div",{onClick:()=>this.evalChange(t.zip)},s("span",null,t.zip),s("span",null,t.name)))):null,s("input",{class:"search",type:"search",value:this.value,onInput:t=>this.changeValue(t),placeholder:"Search"})))}static get style(){return".searchWrap{width:100%;-ms-flex-pack:center;justify-content:center}.searchHold,.searchWrap{display:-ms-flexbox;display:flex}.searchHold{position:relative;width:350px;margin:0 10px}.results{position:absolute;bottom:33px;border-radius:4px 4px 0 0;width:100%;-ms-flex-negative:0;flex-shrink:0;-ms-flex-direction:column;flex-direction:column;padding:5px;-webkit-box-sizing:border-box;box-sizing:border-box;background:var(--background-light);-webkit-box-shadow:var(--shadow-2);box-shadow:var(--shadow-2);z-index:1}.results,.results>div{display:-ms-flexbox;display:flex}.results>div{-ms-flex-pack:justify;justify-content:space-between;padding:10px;cursor:pointer}.search{height:36px;padding:10px;font-size:16px;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-positive:1;flex-grow:1;z-index:2;border:none;-webkit-box-shadow:var(--shadow-1);box-shadow:var(--shadow-1);outline:none;border-radius:4px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}"}}export{h as app_home,l as app_hover,r as app_map,c as app_ranks,p as app_search};