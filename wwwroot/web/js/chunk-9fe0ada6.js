(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9fe0ada6"],{"757a":function(t,a,e){},9460:function(t,a,e){},ac6a:function(t,a,e){for(var i=e("cadf"),n=e("0d58"),s=e("2aba"),r=e("7726"),o=e("32e9"),c=e("84f2"),l=e("2b4c"),u=l("iterator"),d=l("toStringTag"),f=c.Array,p={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},m=n(p),h=0;h<m.length;h++){var g,b=m[h],v=p[b],_=r[b],C=_&&_.prototype;if(C&&(C[u]||o(C,u,f),C[d]||o(C,d,b),c[b]=f,v))for(g in i)C[g]||s(C,g,i[g],!0)}},ad7d:function(t,a,e){"use strict";e.r(a);var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"cssd_box",attrs:{id:"borrowPackageRegistration"}},[e("div",{staticClass:"cssd_title"},[e("ul",{staticClass:"cssd_menu"},[e("router-link",{attrs:{to:"/provide/registration",tag:"li"}},[e("p",[t._v("返回")])]),e("li",{on:{click:t.handleShowManualEnter}},[e("p",[t._v("手工录入")])]),e("router-link",{attrs:{to:"/provide/borrowRecord",tag:"li"}},[e("p",[t._v("借包记录")])])],1),e("div",{staticClass:"cssd_title_right"},[e("p",[e("span",[t._v("借包科室")]),e("el-select",{staticClass:"white24x13",attrs:{filterable:"","default-first-option":"",placeholder:"选择科室"},model:{value:t.submitData.BorrowedSubClinicId,callback:function(a){t.$set(t.submitData,"BorrowedSubClinicId",a)},expression:"submitData.BorrowedSubClinicId"}},t._l(t.clinicList,function(t){return e("el-option",{key:t.ProvideSubClinicId,attrs:{label:t.ProvideSubClinicName,value:t.ProvideSubClinicId}})}),1)],1),e("p",[e("span",[t._v("借包人")]),e("el-select",{staticClass:"white24x13",attrs:{filterable:"","allow-create":"","default-first-option":"",placeholder:"选择人员"},model:{value:t.submitData.Borrower,callback:function(a){t.$set(t.submitData,"Borrower",a)},expression:"submitData.Borrower"}},t._l(t.staffList,function(t,a){return e("el-option",{key:a,attrs:{label:t.name,value:t.name}})}),1)],1)])]),e("div",{staticClass:"cssd_table_center cssd_totalBar table_unExpand"},[e("div",{staticClass:"table_box"},[e("el-table",{attrs:{data:t.submitData.Packages}},[e("el-table-column",{attrs:{label:"包条码",prop:"BarCode",width:"240"}}),e("el-table-column",{attrs:{label:"包名称",prop:"ProductName",width:"210"}}),e("el-table-column",{attrs:{label:"配包日期",prop:"PackageDate",width:"210"}}),e("el-table-column",{attrs:{label:"有效日期",prop:"ValidDate",width:"210"}}),e("el-table-column",{attrs:{label:"操作",width:"60"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("a",{on:{click:function(e){return t.deleteProvidePackage(a.$index)}}},[t._v("删除")])]}}])}),e("el-table-column")],1)],1),e("div",{staticClass:"cssd_table_bottom"},[e("p",[t._v("\n        共计\n        "),e("span",[t._v(t._s(t.submitData.Packages.length))]),t._v(" 包\n      ")]),e("p",[e("el-button",{attrs:{type:"primary"},on:{click:t.submitComplete}},[t._v("借包完成")])],1)])]),e("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[t.isShowManualEnter?e("ManualEnter",{attrs:{BarCodeList:t.submitData.Packages,ApiUrl:"/api/Scanner/IncludePackages/Provide"},on:{"to-father":t.packageData2father}}):t._e()],1)],1)},n=[],s=(e("ac6a"),e("d040")),r={data:function(){return{isShowManualEnter:!1,clinicList:[],staffList:[{name:"张三"}],submitData:{Borrower:"",BorrowedSubClinicId:"",Packages:[]}}},components:{ManualEnter:s["a"]},created:function(){var t=this;CSManager.handleDataThis=this,axios({url:"/api/Clinic/SubClinic"}).then(function(a){200==a.data.Code?t.clinicList=a.data.Data:t.showInformation({classify:"message",msg:a.data.Msg})}).catch(function(t){})},mounted:function(){},beforeDestroy:function(){CSManager.handleDataThis=null},methods:{submitComplete:function(){var t=this;this.GLOBAL.VerificationHandle([{val:this.submitData.BorrowedSubClinicId,type:"StringNotEmpty",msg:"请选择借包科室"},{val:this.submitData.Packages,type:"ArrayNotEmpty",msg:"请至少录入一个包！"}])&&axios({url:"/api/Provide/BorrowedPackageComplete",method:"POST",data:this.submitData}).then(function(a){var e;200==a.data.Code?(e="success",t.$router.go(0)):e="error",t.showInformation({classify:"message",msg:a.data.Msg,type:e})}).catch(function(t){})},deleteProvidePackage:function(t){var a=this;this.$confirm("您确定要删除该包?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){a.submitData.Packages.splice(t,1)}).catch(function(){})},packageData2father:function(t){var a=this;this.isShowManualEnter=!1,t&&t.forEach(function(t){a.submitData.Packages.push(t)})},handleBarCode:function(t){var a=this,e=!0;this.submitData.Packages.forEach(function(i){if(i.BarCode==t.toUpperCase())return a.showInformation({classify:"message",msg:"该条码已录入！",type:"warning"}),void(e=!1)}),e&&axios({url:"/api/Scanner/IncludePackages/Provide/".concat(t)}).then(function(t){200==t.data.Code?a.packageData2father(t.data.Data):a.showInformation({classify:"message",msg:t.data.Msg})}).catch(function(t){})},handleShowManualEnter:function(){this.isShowManualEnter=!0}}},o=r,c=(e("bf4f"),e("2877")),l=Object(c["a"])(o,i,n,!1,null,null,null);a["default"]=l.exports},bf4f:function(t,a,e){"use strict";var i=e("757a"),n=e.n(i);n.a},d040:function(t,a,e){"use strict";var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{attrs:{id:"manual_enter"}},[e("dl",[e("dt",[e("el-input",{directives:[{name:"focus",rawName:"v-focus"}],attrs:{placeholder:"请扫描或手动录入条码"},nativeOn:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.SaveOption(a)}},model:{value:t.input_str,callback:function(a){t.input_str="string"===typeof a?a.trim():a},expression:"input_str"}})],1),e("dd",[e("el-button",{on:{click:t.cancelOption}},[t._v("取消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.SaveOption}},[t._v("确定")])],1)])])},n=[],s=(e("ac6a"),{props:["BarCodeList","ApiUrl","task_index","firstRequest"],data:function(){return{input_str:""}},created:function(){},mounted:function(){},methods:{cancelOption:function(){this.$emit("to-father","")},SaveOption:function(){var t=this;this.GLOBAL.VerificationHandle([{val:this.input_str,type:"StringNotEmpty",msg:"扫描条码不能为空！"}])&&(this.$props.firstRequest?axios("".concat(this.$props.ApiUrl,"/").concat(this.input_str)).then(function(a){if(200==a.data.Code)if(t.$props.task_index>=0)t.$emit("to-father",{data:a.data.Data,index:t.$props.task_index});else{if(a.data.Data.PackageBarCodeScannerVm)for(var e=0;e<t.$props.BarCodeList.length;e++)if(t.$props.BarCodeList[e].BarCode==a.data.Data.PackageBarCodeScannerVm.BarCode)return t.showInformation({classify:"message",msg:"该条码已录入！",type:"warning"}),void(t.input_str="");t.$emit("to-father",a.data.Data,t.input_str)}else 300==a.data.Code?(t.input_str="",t.showInformation({classify:"message",msg:a.data.Msg,type:"warning"})):(t.input_str="",t.showInformation({classify:"message",msg:a.data.Msg,type:"error"}))}).catch(function(t){}):(this.$props.BarCodeList.forEach(function(a){if(a.BarCode==t.input_str.toUpperCase())return t.showInformation({classify:"message",msg:"该条码已录入！",type:"warning"}),void(t.input_str="")}),axios("".concat(this.$props.ApiUrl,"/").concat(this.input_str)).then(function(a){200==a.data.Code?t.$props.task_index>=0?t.$emit("to-father",{data:a.data.Data,index:t.$props.task_index}):t.$emit("to-father",a.data.Data,t.input_str):300==a.data.Code?(t.input_str="",t.showInformation({classify:"message",msg:a.data.Msg,type:"warning"})):(t.input_str="",t.showInformation({classify:"message",msg:a.data.Msg,type:"error"}))}).catch(function(t){})))}}}),r=s,o=(e("dda8"),e("2877")),c=Object(o["a"])(r,i,n,!1,null,null,null);a["a"]=c.exports},dda8:function(t,a,e){"use strict";var i=e("9460"),n=e.n(i);n.a}}]);