(self.webpackChunkwr_frontend=self.webpackChunkwr_frontend||[]).push([[138],{1595:(e,o,n)=>{(o=n(3645)(!1)).push([e.id,".config-view[data-v-3c079e9b] {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  width: 100%;\n  height: 100%;\n}\n.config-view > header .position[data-v-3c079e9b] {\n  text-align: center;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding: 0.5rem 0;\n}\n.config-view > header .label[data-v-3c079e9b] {\n  width: 1.5rem;\n  line-height: 1.5rem;\n}\n.config-view > section[data-v-3c079e9b] {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  overflow: auto;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.config-view > section .config-title[data-v-3c079e9b] {\n  line-height: 2rem;\n  font-size: 0.8rem;\n  font-weight: 800;\n}\n.config-view > section .config-box[data-v-3c079e9b] {\n  padding: 0.25rem 0 0.5rem;\n}\n.config-view > section .config-box .config-item[data-v-3c079e9b] {\n  line-height: 1.5rem;\n  margin: 0 0.5rem;\n  font-size: 0.7rem;\n  font-weight: 600;\n  border: 0.1rem solid #e9ebec;\n  border-radius: 0.2rem;\n  padding: 0.5rem 1.5rem;\n}\n.config-view > section .config-box .config-item[data-v-3c079e9b]:hover {\n  border: 0.1rem solid #56bdbd;\n}\n.config-view > section .config-box .active[data-v-3c079e9b] {\n  border: 0.1rem solid #56bdbd;\n}\n.config-view > section .el-image[data-v-3c079e9b] {\n  position: relative;\n  display: inline-block;\n  overflow: hidden;\n  margin-top: 0.5rem;\n}\n.config-view > footer[data-v-3c079e9b] {\n  height: 2.5rem;\n  text-align: center;\n  padding: 1rem 0;\n}\n.config-view > footer .config-btn[data-v-3c079e9b] {\n  border-radius: 25rem !important;\n  width: 7.5rem !important;\n  background: #56bdbd;\n  color: #fff;\n}\n.config-view > footer .config-btn[data-v-3c079e9b]:hover {\n  background: #0c2639;\n}\n",""]),e.exports=o},6138:(e,o,n)=>{"use strict";n.r(o),n.d(o,{default:()=>x});var t=n(8133);const i=(0,t.withScopeId)("data-v-3c079e9b");(0,t.pushScopeId)("data-v-3c079e9b");const l={class:"config-view"},a={class:"position"},c=(0,t.createVNode)("label",{class:"label"},"省",-1),r=(0,t.createVNode)("label",{class:"label"},"市",-1),s=(0,t.createVNode)("label",{class:"label"},"区",-1),d={class:"section"},p=(0,t.createVNode)("div",{class:"config-title"},"选购产品类型",-1),b={class:"config-box"},m={class:"footer"},f=(0,t.createTextVNode)("开始配置");(0,t.popScopeId)();const v=i(((e,o,n,v,g,u)=>{const k=(0,t.resolveComponent)("el-option"),w=(0,t.resolveComponent)("el-select"),x=(0,t.resolveComponent)("el-image"),y=(0,t.resolveComponent)("el-button");return(0,t.openBlock)(),(0,t.createBlock)("div",l,[(0,t.createVNode)("header",null,[(0,t.createVNode)("div",a,[c,(0,t.createVNode)(w,{modelValue:e.positionForm.projectProvince,"onUpdate:modelValue":o[1]||(o[1]=o=>e.positionForm.projectProvince=o),size:"small"},{default:i((()=>[((0,t.openBlock)(!0),(0,t.createBlock)(t.Fragment,null,(0,t.renderList)(e.provinceOptions,(e=>((0,t.openBlock)(),(0,t.createBlock)(k,{key:e.value,label:e.label,value:e.value},null,8,["label","value"])))),128))])),_:1},8,["modelValue"]),r,(0,t.createVNode)(w,{modelValue:e.positionForm.projectCity,"onUpdate:modelValue":o[2]||(o[2]=o=>e.positionForm.projectCity=o),size:"small"},{default:i((()=>[((0,t.openBlock)(!0),(0,t.createBlock)(t.Fragment,null,(0,t.renderList)(e.cityOptions,(e=>((0,t.openBlock)(),(0,t.createBlock)(k,{key:e.value,label:e.label,value:e.value},null,8,["label","value"])))),128))])),_:1},8,["modelValue"]),s,(0,t.createVNode)(w,{modelValue:e.positionForm.projectArea,"onUpdate:modelValue":o[3]||(o[3]=o=>e.positionForm.projectArea=o),size:"small"},{default:i((()=>[((0,t.openBlock)(!0),(0,t.createBlock)(t.Fragment,null,(0,t.renderList)(e.areaOptions,(e=>((0,t.openBlock)(),(0,t.createBlock)(k,{key:e.value,label:e.label,value:e.value},null,8,["label","value"])))),128))])),_:1},8,["modelValue"])])]),(0,t.createVNode)("section",d,[p,(0,t.createVNode)("div",b,[((0,t.openBlock)(!0),(0,t.createBlock)(t.Fragment,null,(0,t.renderList)(e.config.list,(o=>((0,t.openBlock)(),(0,t.createBlock)("label",{key:o.label,onClick:n=>e.checkHandel(o),class:{active:o.label===e.positionForm.goodsType,"config-item":!0}},(0,t.toDisplayString)(o.label),11,["onClick"])))),128))]),(0,t.createVNode)(x,{src:e.getActiveImg,fit:"fill"},null,8,["src"])]),(0,t.createVNode)("footer",m,[(0,t.createVNode)(y,{class:"config-btn",size:"large",onClick:e.startConfigHandel},{default:i((()=>[f])),_:1},8,["onClick"])])])}));var g=n(4204),u=n(2119),k=n(5497);const w=(0,t.defineComponent)({name:"Main",setup(){const e=(0,t.inject)("pageConfig",{formData:{},list:[]}),o=(0,u.tv)(),n=(0,u.yj)(),i=(0,t.reactive)({provinceOptions:g.regionData,cityOptions:[],areaOptions:[]}),l=(0,t.reactive)({projectProvince:"",projectCity:"",projectArea:"",goodsType:""});Object.assign(l,e.formData);const a=(0,t.reactive)({list:e.list}),c=(0,t.computed)((()=>{var e;return(null===(e=a.list.find((e=>e.label===l.goodsType)))||void 0===e?void 0:e.imgUrl)||""}));(0,t.watch)((()=>l.projectProvince),(()=>{var e;i.cityOptions=(null===(e=g.regionData.find((e=>e.value===l.projectProvince)))||void 0===e?void 0:e.children)||[];let o=i.cityOptions.map((e=>e.value));""===l.projectCity||o.includes(l.projectCity)||(l.projectCity="")}),{immediate:!0}),(0,t.watch)((()=>l.projectCity),(()=>{var e;i.areaOptions=(null===(e=i.cityOptions.find((e=>e.value===l.projectCity)))||void 0===e?void 0:e.children)||[];let o=i.areaOptions.map((e=>e.value));""===l.projectArea||o.includes(l.projectArea)||(l.projectArea="")}),{immediate:!0}),(0,t.watchEffect)((()=>{e.formData=Object.assign({},l),console.log(e.formData)}));return{...(0,t.toRefs)(i),positionForm:l,config:a,checkHandel:e=>{l.goodsType=e.label},getActiveImg:c,startConfigHandel:()=>{console.log(n.query),l.projectProvince&&l.projectCity&&l.projectArea?(Object.assign(e.formData,l),o.push({path:"/micromodule",query:{activeLabel:l.goodsType}})):(0,k.z8)({showClose:!0,type:"error",message:"请选择省份信息!"})}}}});n(6971);w.render=v,w.__scopeId="data-v-3c079e9b";const x=w},6971:(e,o,n)=>{var t=n(1595);"string"==typeof t&&(t=[[e.id,t,""]]),t.locals&&(e.exports=t.locals);(0,n(5346).Z)("ef4a1414",t,!0,{})}}]);