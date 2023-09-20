"use strict";class t{constructor(){this.listeners={}}on(t,e){return this.listeners[t]||(this.listeners[t]=new Set),this.listeners[t].add(e),()=>this.un(t,e)}once(t,e){const i=this.on(t,e),n=this.on(t,(()=>{i(),n()}));return i}un(t,e){this.listeners[t]&&(e?this.listeners[t].delete(e):delete this.listeners[t])}unAll(){this.listeners={}}emit(t,...e){this.listeners[t]&&this.listeners[t].forEach((t=>t(...e)))}}class e extends t{constructor(t){super(),this.subscriptions=[],this.options=t}onInit(){}init(t){this.wavesurfer=t,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach((t=>t()))}}function i(t,e,i,n,s=5){let r=()=>{};if(!t)return r;const o=o=>{if(2===o.button)return;o.preventDefault(),o.stopPropagation();let l=o.clientX,a=o.clientY,h=!1;const d=n=>{n.preventDefault(),n.stopPropagation();const r=n.clientX,o=n.clientY;if(h||Math.abs(r-l)>=s||Math.abs(o-a)>=s){const{left:n,top:s}=t.getBoundingClientRect();h||(h=!0,null==i||i(l-n,a-s)),e(r-l,o-a,r-n,o-s),l=r,a=o}},u=t=>{h&&(t.preventDefault(),t.stopPropagation())},c=()=>{h&&(null==n||n()),r()};document.addEventListener("pointermove",d),document.addEventListener("pointerup",c),document.addEventListener("pointerleave",c),document.addEventListener("click",u,!0),r=()=>{document.removeEventListener("pointermove",d),document.removeEventListener("pointerup",c),document.removeEventListener("pointerleave",c),setTimeout((()=>{document.removeEventListener("click",u,!0)}),10)}};return t.addEventListener("pointerdown",o),()=>{r(),t.removeEventListener("pointerdown",o)}}class n extends t{constructor(t,e){var i,n,s,r,o,l;super(),this.totalDuration=e,this.minLength=0,this.maxLength=1/0,this.id=t.id||`region-${Math.random().toString(32).slice(2)}`,this.start=t.start,this.end=null!==(i=t.end)&&void 0!==i?i:t.start,this.drag=null===(n=t.drag)||void 0===n||n,this.resize=null===(s=t.resize)||void 0===s||s,this.color=null!==(r=t.color)&&void 0!==r?r:"rgba(0, 0, 0, 0.1)",this.minLength=null!==(o=t.minLength)&&void 0!==o?o:this.minLength,this.maxLength=null!==(l=t.maxLength)&&void 0!==l?l:this.maxLength,this.element=this.initElement(t.content),this.renderPosition(),this.initMouseEvents()}initElement(t){const e=document.createElement("div"),i=this.start===this.end;if(e.setAttribute("part",`${i?"marker":"region"} ${this.id}`),e.setAttribute("style",`\n      position: absolute;\n      height: 100%;\n      background-color: ${i?"none":this.color};\n      border-left: ${i?"2px solid "+this.color:"none"};\n      border-radius: 2px;\n      box-sizing: border-box;\n      transition: background-color 0.2s ease;\n      cursor: ${this.drag?"grab":"default"};\n      pointer-events: all;\n    `),t&&("string"==typeof t?(this.content=document.createElement("div"),this.content.style.padding=`0.2em ${i?.2:.4}em`,this.content.textContent=t):this.content=t,this.content.setAttribute("part","region-content"),e.appendChild(this.content)),!i){const t=document.createElement("div");t.setAttribute("data-resize","left"),t.setAttribute("style",`\n        position: absolute;\n        z-index: 2;\n        width: 6px;\n        height: 100%;\n        top: 0;\n        left: 0;\n        border-left: 2px solid rgba(0, 0, 0, 0.5);\n        border-radius: 2px 0 0 2px;\n        cursor: ${this.resize?"ew-resize":"default"};\n        word-break: keep-all;\n      `),t.setAttribute("part","region-handle region-handle-left");const i=t.cloneNode();i.setAttribute("data-resize","right"),i.style.left="",i.style.right="0",i.style.borderRight=i.style.borderLeft,i.style.borderLeft="",i.style.borderRadius="0 2px 2px 0",i.setAttribute("part","region-handle region-handle-right"),e.appendChild(t),e.appendChild(i)}return e}renderPosition(){const t=this.start/this.totalDuration,e=(this.totalDuration-this.end)/this.totalDuration;this.element.style.left=100*t+"%",this.element.style.right=100*e+"%"}initMouseEvents(){const{element:t}=this;if(!t)return;t.addEventListener("click",(t=>this.emit("click",t))),t.addEventListener("mouseenter",(t=>this.emit("over",t))),t.addEventListener("mouseleave",(t=>this.emit("leave",t))),t.addEventListener("dblclick",(t=>this.emit("dblclick",t))),i(t,(t=>this.onMove(t)),(()=>this.onStartMoving()),(()=>this.onEndMoving()));i(t.querySelector('[data-resize="left"]'),(t=>this.onResize(t,"start")),(()=>null),(()=>this.onEndResizing()),1),i(t.querySelector('[data-resize="right"]'),(t=>this.onResize(t,"end")),(()=>null),(()=>this.onEndResizing()),1)}onStartMoving(){this.drag&&(this.element.style.cursor="grabbing")}onEndMoving(){this.drag&&(this.element.style.cursor="grab",this.emit("update-end"))}_onUpdate(t,e){if(!this.element.parentElement)return;const i=t/this.element.parentElement.clientWidth*this.totalDuration,n=e&&"start"!==e?this.start:this.start+i,s=e&&"end"!==e?this.end:this.end+i,r=s-n;n>=0&&s<=this.totalDuration&&n<=s&&r>=this.minLength&&r<=this.maxLength&&(this.start=n,this.end=s,this.renderPosition(),this.emit("update"))}onMove(t){this.drag&&this._onUpdate(t)}onResize(t,e){this.resize&&this._onUpdate(t,e)}onEndResizing(){this.resize&&this.emit("update-end")}_setTotalDuration(t){this.totalDuration=t,this.renderPosition()}play(){this.emit("play")}setOptions(t){var e,i;if(t.color&&(this.color=t.color,this.element.style.backgroundColor=this.color),void 0!==t.drag&&(this.drag=t.drag,this.element.style.cursor=this.drag?"grab":"default"),void 0!==t.resize&&(this.resize=t.resize,this.element.querySelectorAll("[data-resize]").forEach((t=>{t.style.cursor=this.resize?"ew-resize":"default"}))),void 0!==t.start||void 0!==t.end){const n=this.start===this.end;this.start=null!==(e=t.start)&&void 0!==e?e:this.start,this.end=null!==(i=t.end)&&void 0!==i?i:n?this.start:this.end,this.renderPosition()}}remove(){this.emit("remove"),this.element.remove(),this.element=null}}class s extends e{constructor(t){super(t),this.regions=[],this.regionsContainer=this.initRegionsContainer()}static create(t){return new s(t)}onInit(){if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");this.wavesurfer.getWrapper().appendChild(this.regionsContainer);let t=[];this.subscriptions.push(this.wavesurfer.on("timeupdate",(e=>{const i=this.regions.filter((t=>t.start<=e&&t.end>=e));i.forEach((e=>{t.includes(e)||this.emit("region-in",e)})),t.forEach((t=>{i.includes(t)||this.emit("region-out",t)})),t=i})))}initRegionsContainer(){const t=document.createElement("div");return t.setAttribute("style","\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      z-index: 3;\n      pointer-events: none;\n    "),t}getRegions(){return this.regions}avoidOverlapping(t){if(!t.content)return;const e=t.content,i=e.getBoundingClientRect().left,n=t.element.scrollWidth,s=this.regions.filter((e=>{if(e===t||!e.content)return!1;const s=e.content.getBoundingClientRect().left,r=e.element.scrollWidth;return i<s+r&&s<i+n})).map((t=>{var e;return(null===(e=t.content)||void 0===e?void 0:e.getBoundingClientRect().height)||0})).reduce(((t,e)=>t+e),0);e.style.marginTop=`${s}px`}saveRegion(t){this.regionsContainer.appendChild(t.element),this.avoidOverlapping(t),this.regions.push(t);const e=[t.on("update-end",(()=>{this.avoidOverlapping(t),this.emit("region-updated",t)})),t.on("play",(()=>{var e,i;null===(e=this.wavesurfer)||void 0===e||e.play(),null===(i=this.wavesurfer)||void 0===i||i.setTime(t.start)})),t.on("click",(e=>{this.emit("region-clicked",t,e)})),t.on("dblclick",(e=>{this.emit("region-double-clicked",t,e)})),t.once("remove",(()=>{e.forEach((t=>t())),this.regions=this.regions.filter((e=>e!==t))}))];this.subscriptions.push(...e),this.emit("region-created",t)}addRegion(t){if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");const e=this.wavesurfer.getDuration(),i=new n(t,e);return e?this.saveRegion(i):this.subscriptions.push(this.wavesurfer.once("ready",(t=>{i._setTotalDuration(t),this.saveRegion(i)}))),i}enableDragSelection(t){var e,s;const r=null===(s=null===(e=this.wavesurfer)||void 0===e?void 0:e.getWrapper())||void 0===s?void 0:s.querySelector("div");if(!r)return()=>{};let o=null,l=0;return i(r,((t,e,i)=>{o&&o._onUpdate(t,i>l?"end":"start")}),(e=>{if(l=e,!this.wavesurfer)return;const i=this.wavesurfer.getDuration(),s=this.wavesurfer.getWrapper().clientWidth,r=e/s*i,a=(e+5)/s*i;o=new n(Object.assign(Object.assign({},t),{start:r,end:a}),i),this.regionsContainer.appendChild(o.element)}),(()=>{o&&(this.saveRegion(o),o=null)}))}clearRegions(){this.regions.forEach((t=>t.remove()))}destroy(){this.clearRegions(),super.destroy()}}module.exports=s;
