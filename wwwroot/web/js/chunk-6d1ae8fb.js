(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6d1ae8fb"],{"21c9":function(t,a,i){"use strict";var e=i("3bff"),s=i.n(e);s.a},"2fdb":function(t,a,i){"use strict";var e=i("5ca1"),s=i("d2c8"),n="includes";e(e.P+e.F*i("5147")(n),"String",{includes:function(t){return!!~s(this,t,n).indexOf(t,arguments.length>1?arguments[1]:void 0)}})},"3bff":function(t,a,i){},5147:function(t,a,i){var e=i("2b4c")("match");t.exports=function(t){var a=/./;try{"/./"[t](a)}catch(i){try{return a[e]=!1,!"/./"[t](a)}catch(s){}}return!0}},6762:function(t,a,i){"use strict";var e=i("5ca1"),s=i("c366")(!0);e(e.P,"Array",{includes:function(t){return s(this,t,arguments.length>1?arguments[1]:void 0)}}),i("9c6c")("includes")},"82c0":function(t,a,i){"use strict";i.r(a);var e=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{staticClass:"cssd_box",attrs:{id:"clinicApply"}},[i("div",{staticClass:"cssd_title"},[i("ul",{staticClass:"cssd_menu"},[i("router-link",{attrs:{to:"/",tag:"li"}},[i("p",[t._v("返回")])]),i("li",{on:{click:t.handleShowManualEnter}},[i("p",[t._v("手工录入")])]),t.isChangeMode?t._e():i("router-link",{attrs:{to:"/apply/record",tag:"li"}},[i("p",[t._v("使用记录")])])],1)]),i("div",{staticClass:"cssd_table_center cssd_totalBar table_unExpand"},[i("div",{staticClass:"table_box"},[t.isChangeMode?t._e():i("ol",{staticClass:"search_box"},[i("li",[i("span",{staticClass:"font16gray"},[t._v("住院号")]),i("p",[i("el-input",{nativeOn:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.searchOuterPackage(a)}},model:{value:t.search_HospitalId,callback:function(a){t.search_HospitalId="string"===typeof a?a.trim():a},expression:"search_HospitalId"}})],1)]),i("li",[i("el-button",{staticClass:"btn120x40",attrs:{type:"primary"},on:{click:t.searchOuterPackage}},[t._v("查询")])],1)]),"TONGJI"==t.GLOBAL.UserInfo.HospitalVersion?i("ul",[i("li",[i("p",{staticClass:"font16gray"},[t._v("住院号")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:!0},model:{value:t.submitData.Patient.HospitalId,callback:function(a){t.$set(t.submitData.Patient,"HospitalId",a)},expression:"submitData.Patient.HospitalId"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("床号")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.BedId,callback:function(a){t.$set(t.submitData.Patient,"BedId","string"===typeof a?a.trim():a)},expression:"submitData.Patient.BedId"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("病人姓名")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.PatientName,callback:function(a){t.$set(t.submitData.Patient,"PatientName","string"===typeof a?a.trim():a)},expression:"submitData.Patient.PatientName"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("病区")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.SubClinic,callback:function(a){t.$set(t.submitData.Patient,"SubClinic","string"===typeof a?a.trim():a)},expression:"submitData.Patient.SubClinic"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("手术名称")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.SurgicalName,callback:function(a){t.$set(t.submitData.Patient,"SurgicalName","string"===typeof a?a.trim():a)},expression:"submitData.Patient.SurgicalName"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("手术时间")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-date-picker",{attrs:{editable:!1,clearable:!1,type:"date",placeholder:"选择日期",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",disabled:t.forbid},model:{value:t.submitData.Patient.SurgicalDate,callback:function(a){t.$set(t.submitData.Patient,"SurgicalDate",a)},expression:"submitData.Patient.SurgicalDate"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("手术间")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.SurgicalRoom,callback:function(a){t.$set(t.submitData.Patient,"SurgicalRoom","string"===typeof a?a.trim():a)},expression:"submitData.Patient.SurgicalRoom"}})],1)]),i("li",{staticClass:"font16gray"},[i("p",[t._v("台次")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.Stage,callback:function(a){t.$set(t.submitData.Patient,"Stage","string"===typeof a?a.trim():a)},expression:"submitData.Patient.Stage"}})],1)])]):t._e(),"TONGJI"!=t.GLOBAL.UserInfo.HospitalVersion?i("ul",[i("li",[i("p",{staticClass:"font16gray"},[t._v("住院号")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:!0},model:{value:t.submitData.Patient.HospitalId,callback:function(a){t.$set(t.submitData.Patient,"HospitalId",a)},expression:"submitData.Patient.HospitalId"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("床号")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.BedId,callback:function(a){t.$set(t.submitData.Patient,"BedId","string"===typeof a?a.trim():a)},expression:"submitData.Patient.BedId"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("病人姓名")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.PatientName,callback:function(a){t.$set(t.submitData.Patient,"PatientName","string"===typeof a?a.trim():a)},expression:"submitData.Patient.PatientName"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("病区")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.SubClinic,callback:function(a){t.$set(t.submitData.Patient,"SubClinic","string"===typeof a?a.trim():a)},expression:"submitData.Patient.SubClinic"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("性别")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.Gender,callback:function(a){t.$set(t.submitData.Patient,"Gender","string"===typeof a?a.trim():a)},expression:"submitData.Patient.Gender"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("年龄")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.Age,callback:function(a){t.$set(t.submitData.Patient,"Age","string"===typeof a?a.trim():a)},expression:"submitData.Patient.Age"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("入院时间")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-date-picker",{attrs:{editable:!1,clearable:!1,type:"date",placeholder:"选择日期",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",disabled:t.forbid},model:{value:t.submitData.Patient.AdmissionDate,callback:function(a){t.$set(t.submitData.Patient,"AdmissionDate",a)},expression:"submitData.Patient.AdmissionDate"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("手术时间")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-date-picker",{attrs:{editable:!1,clearable:!1,type:"date",placeholder:"选择日期",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",disabled:t.forbid},model:{value:t.submitData.Patient.SurgicalDate,callback:function(a){t.$set(t.submitData.Patient,"SurgicalDate",a)},expression:"submitData.Patient.SurgicalDate"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("手术名称")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.SurgicalName,callback:function(a){t.$set(t.submitData.Patient,"SurgicalName","string"===typeof a?a.trim():a)},expression:"submitData.Patient.SurgicalName"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("手术间")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.SurgicalRoom,callback:function(a){t.$set(t.submitData.Patient,"SurgicalRoom","string"===typeof a?a.trim():a)},expression:"submitData.Patient.SurgicalRoom"}})],1)]),i("li",{staticClass:"font16gray"},[i("p",[t._v("台次")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.Stage,callback:function(a){t.$set(t.submitData.Patient,"Stage","string"===typeof a?a.trim():a)},expression:"submitData.Patient.Stage"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("科室")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.Clinic,callback:function(a){t.$set(t.submitData.Patient,"Clinic","string"===typeof a?a.trim():a)},expression:"submitData.Patient.Clinic"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("手术医生")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.SurgicalDoctor,callback:function(a){t.$set(t.submitData.Patient,"SurgicalDoctor","string"===typeof a?a.trim():a)},expression:"submitData.Patient.SurgicalDoctor"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("手术部位")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.SurgicalSite,callback:function(a){t.$set(t.submitData.Patient,"SurgicalSite","string"===typeof a?a.trim():a)},expression:"submitData.Patient.SurgicalSite"}})],1)]),i("li",[i("p",{staticClass:"font16gray"},[t._v("挂号科室")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-input",{attrs:{disabled:t.forbid},model:{value:t.submitData.Patient.RegisteredClinic,callback:function(a){t.$set(t.submitData.Patient,"RegisteredClinic","string"===typeof a?a.trim():a)},expression:"submitData.Patient.RegisteredClinic"}})],1)]),i("li",{staticClass:"font16gray"},[i("p",[t._v("挂号时间")]),i("div",{staticClass:"el_input_box font16blod"},[i("el-date-picker",{attrs:{editable:!1,clearable:!1,type:"date",placeholder:"选择日期",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",disabled:t.forbid},model:{value:t.submitData.Patient.RegisteredDate,callback:function(a){t.$set(t.submitData.Patient,"RegisteredDate",a)},expression:"submitData.Patient.RegisteredDate"}})],1)])]):t._e(),i("el-table",{attrs:{data:t.submitData.Packages}},[i("el-table-column",{attrs:{label:"包条码",prop:"BarCode",width:"240"}}),i("el-table-column",{attrs:{label:"包名称",prop:"ProductName",width:"210"}}),i("el-table-column",{attrs:{label:"有效日期",prop:"ValidDate",width:"210"}}),i("el-table-column",{attrs:{label:"操作",width:"210"},scopedSlots:t._u([{key:"default",fn:function(a){return[i("el-button",{on:{click:function(i){return i.stopPropagation(),t.deletePackage(a.$index)}}},[t._v("删除")])]}}])}),i("el-table-column")],1)],1),i("div",{staticClass:"cssd_table_bottom"},[i("p",[t._v("\n        共计\n        "),i("span",[t._v(t._s(t.countPackageNumber(t.submitData.Packages)))]),t._v(" 包\n      ")]),i("p",[t.isChangeMode?i("el-button",{on:{click:t.cancelChange}},[t._v("取消修改")]):t._e(),i("el-button",{attrs:{type:"primary"},on:{click:t.applySubmit}},[t._v(t._s(t.isChangeMode?"修改完成":"确认使用"))])],1)])]),i("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[t.isShowManualEnter?i("ManualEnter",{attrs:{BarCodeList:t.submitData.Packages,ApiUrl:"/api/Scanner/Apply"},on:{"to-father":t.packageData2father}}):t._e()],1)],1)},s=[],n=(i("ac6a"),i("6762"),i("2fdb"),i("d040")),o={data:function(){return{forbid:!0,search_HospitalId:"",isShowManualEnter:!1,isChangeMode:!1,submitData:{Patient:{HospitalId:"",PatientName:"",Gender:"",Age:"",AdmissionDate:"",Clinic:"",SubClinic:"",BedId:"",SurgicalName:"",SurgicalDoctor:"",RegisteredClinic:"",RegisteredDate:"",SurgicalRoom:"",SurgicalSite:"",SurgicalDate:"",Stage:""},Packages:[]}}},components:{ManualEnter:n["a"]},beforeRouteEnter:function(t,a,i){sessionStorage.userInfo?UserInfo.JobAndCompetence.includes("271")||UserInfo.JobAndCompetence.includes("272")||UserInfo.JobAndCompetence.includes("000")||UserInfo.JobAndCompetence.includes("200")||UserInfo.JobAndCompetence.includes("202")?i():(i(a.path),VueVm.$message({type:"warning",message:"您没有使用模块访问权限！",center:!0,duration:2e3,showClose:!0})):i("/login")},created:function(){var t=this;CSManager.handleDataThis=this,this.$route.query.recordId&&(this.isChangeMode=!0,axios({url:"/api/Apply/PendingUpdateApplyingRecord/".concat(this.$route.query.recordId)}).then(function(a){200==a.data.Code?(t.submitData=a.data.Data,t.collapseChange("0")):t.showInformation({classify:"message",msg:a.data.Msg})}).catch(function(t){}))},mounted:function(){},beforeDestroy:function(){CSManager.handleDataThis=null},methods:{searchOuterPackage:function(){var t=this;this.GLOBAL.VerificationHandle([{val:this.search_HospitalId,type:"StringNotEmpty",msg:"查询的住院号不能为空！"}])&&axios({url:"/api/Apply/MessageOfPatient/".concat(this.search_HospitalId)}).then(function(a){var i;t.forbid=!1,200==a.data.Code?(i="success",t.submitData.Patient=a.data.Data.Patient):300==a.data.Code?i="warning":(i="error",t.submitData.Patient={HospitalId:t.search_HospitalId,PatientName:"",Gender:"",Age:"",AdmissionDate:"",Clinic:"",SubClinic:"",BedId:"",SurgicalName:"",SurgicalDoctor:"",RegisteredClinic:"",RegisteredDate:"",SurgicalRoom:"",SurgicalSite:"",SurgicalDate:"",Stage:""}),t.showInformation({classify:"message",msg:a.data.Msg,type:i})}).then(function(t){})},cancelChange:function(){this.$router.push({path:"/apply/record"})},applySubmit:function(){var t=this,a="/api/Apply/ApplyCheck",i="POST";this.isChangeMode&&(i="PUT",a="/api/Apply/ApplyModify"),this.GLOBAL.VerificationHandle([{val:this.submitData.Patient.HospitalId,type:"StringNotEmpty",msg:"住院号不能为空！"},{val:this.submitData.Patient.BedId,type:"StringNotEmpty",msg:"床号不能为空！"},{val:this.submitData.Patient.PatientName,type:"StringNotEmpty",msg:"病人姓名不能为空！"},{val:this.submitData.Packages,type:"ArrayNotEmpty",msg:"您还没有录入包，请至少录入一个包！"}])&&axios({url:a,method:i,data:this.submitData}).then(function(a){var i;200==a.data.Code?(i="success",t.isChangeMode?t.$router.push({path:"/apply/record"}):t.$router.go(0)):i="error",t.showInformation({classify:"message",msg:a.data.Msg,type:i})}).catch(function(t){})},deletePackage:function(t){this.submitData.Packages.splice(t,1)},handleShowManualEnter:function(){this.isChangeMode||this.submitData.Patient.HospitalId?this.isShowManualEnter=!0:this.showInformation({classify:"message",msg:"您还没有查询住院号！请查询住院号再录入包！"})},packageData2father:function(t){var a=this;this.isShowManualEnter=!1,t&&(t.PatientHospitalId&&t.PatientHospitalId!=this.submitData.Patient.HospitalId?this.$confirm("该外来器械包绑定的住院号与本次使用的病人住院号不同，您确定要使用该包吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){a.submitData.Packages.push(t),a.$alert(msg,"警告",{confirmButtonText:"确定",callback:function(t){a.showInformation({classify:"message",msg:"您使用的外来器械包和该病人的住院号不同，请重打包条码！",type:"warning"})}})}).catch(function(){}):this.submitData.Packages.push(t))},handleBarCode:function(t){var a=this;if(this.submitData.Patient.HospitalId){var i=!0;this.submitData.Packages.forEach(function(e){if(e.BarCode==t.toUpperCase())return a.showInformation({classify:"message",msg:"该条码已录入！",type:"warning"}),void(i=!1)}),i&&axios({url:"/api/Scanner/Apply/".concat(t)}).then(function(t){200==t.data.Code?a.packageData2father(t.data.Data):a.showInformation({classify:"message",msg:t.data.Msg})}).catch(function(t){})}else this.showInformation({classify:"message",msg:"您还没有查询住院号，请查询住院号再扫描包条码！",type:"warning"})}},computed:{countPackageNumber:function(){return function(t){return t.length}}}},l=o,r=(i("21c9"),i("2877")),c=Object(r["a"])(l,e,s,!1,null,null,null);a["default"]=c.exports},9460:function(t,a,i){},ac6a:function(t,a,i){for(var e=i("cadf"),s=i("0d58"),n=i("2aba"),o=i("7726"),l=i("32e9"),r=i("84f2"),c=i("2b4c"),u=c("iterator"),d=c("toStringTag"),p=r.Array,m={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},f=s(m),b=0;b<f.length;b++){var g,y=f[b],h=m[y],v=o[y],_=v&&v.prototype;if(_&&(_[u]||l(_,u,p),_[d]||l(_,d,y),r[y]=p,h))for(g in e)_[g]||n(_,g,e[g],!0)}},d040:function(t,a,i){"use strict";var e=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{attrs:{id:"manual_enter"}},[i("dl",[i("dt",[i("el-input",{directives:[{name:"focus",rawName:"v-focus"}],attrs:{placeholder:"请扫描或手动录入条码"},nativeOn:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.SaveOption(a)}},model:{value:t.input_str,callback:function(a){t.input_str="string"===typeof a?a.trim():a},expression:"input_str"}})],1),i("dd",[i("el-button",{on:{click:t.cancelOption}},[t._v("取消")]),i("el-button",{attrs:{type:"primary"},on:{click:t.SaveOption}},[t._v("确定")])],1)])])},s=[],n=(i("ac6a"),{props:["BarCodeList","ApiUrl","task_index","firstRequest"],data:function(){return{input_str:""}},created:function(){},mounted:function(){},methods:{cancelOption:function(){this.$emit("to-father","")},SaveOption:function(){var t=this;this.GLOBAL.VerificationHandle([{val:this.input_str,type:"StringNotEmpty",msg:"扫描条码不能为空！"}])&&(this.$props.firstRequest?axios("".concat(this.$props.ApiUrl,"/").concat(this.input_str)).then(function(a){if(200==a.data.Code)if(t.$props.task_index>=0)t.$emit("to-father",{data:a.data.Data,index:t.$props.task_index});else{if(a.data.Data.PackageBarCodeScannerVm)for(var i=0;i<t.$props.BarCodeList.length;i++)if(t.$props.BarCodeList[i].BarCode==a.data.Data.PackageBarCodeScannerVm.BarCode)return t.showInformation({classify:"message",msg:"该条码已录入！",type:"warning"}),void(t.input_str="");t.$emit("to-father",a.data.Data,t.input_str)}else 300==a.data.Code?(t.input_str="",t.showInformation({classify:"message",msg:a.data.Msg,type:"warning"})):(t.input_str="",t.showInformation({classify:"message",msg:a.data.Msg,type:"error"}))}).catch(function(t){}):(this.$props.BarCodeList.forEach(function(a){if(a.BarCode==t.input_str.toUpperCase())return t.showInformation({classify:"message",msg:"该条码已录入！",type:"warning"}),void(t.input_str="")}),axios("".concat(this.$props.ApiUrl,"/").concat(this.input_str)).then(function(a){200==a.data.Code?t.$props.task_index>=0?t.$emit("to-father",{data:a.data.Data,index:t.$props.task_index}):t.$emit("to-father",a.data.Data,t.input_str):300==a.data.Code?(t.input_str="",t.showInformation({classify:"message",msg:a.data.Msg,type:"warning"})):(t.input_str="",t.showInformation({classify:"message",msg:a.data.Msg,type:"error"}))}).catch(function(t){})))}}}),o=n,l=(i("dda8"),i("2877")),r=Object(l["a"])(o,e,s,!1,null,null,null);a["a"]=r.exports},d2c8:function(t,a,i){var e=i("aae3"),s=i("be13");t.exports=function(t,a,i){if(e(a))throw TypeError("String#"+i+" doesn't accept regex!");return String(s(t))}},dda8:function(t,a,i){"use strict";var e=i("9460"),s=i.n(e);s.a}}]);