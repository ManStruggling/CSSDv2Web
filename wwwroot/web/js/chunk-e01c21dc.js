(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e01c21dc"],{1429:function(e,t,a){"use strict";var i=a("d43e"),s=a.n(i);s.a},"1a10":function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"photoView"}},[a("div",{staticClass:"container"},[a("div",{staticClass:"view_menu"},[e.$props.viewMode?e._e():a("h3",[a("p",{on:{click:e.switchToTakePhoto}})]),a("el-tabs",{attrs:{type:"card","tab-position":"left"},on:{"tab-click":e.tabClicked},model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},e._l(e.list,function(t,i){return a("el-tab-pane",{key:i,attrs:{name:i+""}},[a("div",{staticClass:"imageListBox",attrs:{slot:"label"},slot:"label"},[a("img",{attrs:{src:t.Path||t.Base64String,alt:""}}),e.$props.viewMode?e._e():a("i",{staticClass:"deleteImg",on:{click:function(t){return t.stopPropagation(),e.deleteImg(i)}}})]),a("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:0==e.mode,expression:"mode==0"}],staticClass:"tab_content"},[a("img",{attrs:{src:t.Path||t.Base64String,alt:""}}),e.$props.viewMode?e._e():a("el-input",{attrs:{type:"textarea",placeholder:"备注",resize:"none"},model:{value:t.Remark,callback:function(a){e.$set(t,"Remark","string"===typeof a?a.trim():a)},expression:"item.Remark"}}),e.$props.viewMode?a("p",[e._v(e._s(t.Remark))]):e._e()],1)])],1)}),1)],1),a("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:1===e.mode,expression:"mode===1"}],staticClass:"view_content"},[a("img",{attrs:{src:e.image,alt:""}}),a("h5",[a("el-button",{staticClass:"btn120x40",on:{click:e.takePhoto}},[e._v("拍照")])],1)])]),a("i",{staticClass:"closePhotoView",on:{click:e.close}})],1)])},s=[],r={props:["data","viewMode","DeletedPicturesId"],data:function(){return{activeName:"-1",mode:0,image:"",list:[]}},created:function(){this.list=null==this.$props.data?[]:this.$props.data,this.list.length>0&&(this.activeName=0),this.$props.viewMode||this.switchToTakePhoto()},beforeDestroy:function(){CSManager.CloseVideo()},methods:{close:function(){this.$emit("viewPhoto-to-father",this.list)},switchToTakePhoto:function(){this.$props.viewMode||CSManager.OpenVideo(50,"",this),this.mode=1},takePhoto:function(){this.list.push({Id:0,Path:"",Base64String:this.image,Remark:""}),this.mode=0,this.activeName=this.list.length-1+""},deleteImg:function(e){var t=this;this.$confirm("您确定要删除该照片?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){0!=t.list[e].Id&&t.$props.DeletedPicturesId.push(t.list[e].Id),t.list.splice(e,1)}).catch(function(){})},tabClicked:function(){this.mode=0}}},n=r,o=(a("68c0"),a("2877")),c=Object(o["a"])(n,i,s,!1,null,null,null);t["a"]=c.exports},4881:function(e,t,a){},"4a71":function(e,t,a){"use strict";var i=a("68216"),s=a.n(i);s.a},65696:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"cssd_box",attrs:{id:"deviceRegistration"}},[a("div",{staticClass:"cssd_title"},[a("ul",{staticClass:"cssd_menu"},[a("li",{on:{click:e.goBack}},[a("p",[e._v("返回")])]),a("li",{on:{click:e.handleShowManualEnter}},[a("p",[e._v("条码手工录入")])])]),a("div",{staticClass:"cssd_title_right"},[a("p",[a("span",[e._v("清洗不合格网篮")]),e._v(":\n        "),a("b",[e._v(e._s(e.cleanFailedCarriers.length))]),a("a",{on:{click:e.handleShowCleanFailedCarriers}},[e._v("查看")])]),a("p",{staticClass:"photoEdit"},[a("span",[e._v("照片")]),e._v(":\n        "),a("b",[e._v(e._s(e.computedPhotoNumber))]),a("a",{on:{click:e.handleShowPhotos}},[e._v("编辑")])]),a("b",[e._v(e._s(e.submitData.DeviceModelName)+":"+e._s(e.submitData.DeviceModelProgramName))]),a("a",{on:{click:e.reSelect}},[e._v("重新选择")])])]),a("div",{staticClass:"cssd_table_center deviceRegistrationCenter tabs_totalBar cssd_totalBar"},[a("el-tabs",{attrs:{type:"border-card","tab-position":"left"},model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},e._l(e.submitData.Carriers,function(t,i){return a("el-tab-pane",{key:i,attrs:{name:i+""}},[a("div",{staticClass:"tab_title",attrs:{slot:"label"},slot:"label"},[a("p",[e._v(e._s(t.Name))]),a("span",{on:{click:e.deleteThisCarrier}})]),a("div",{staticClass:"tab_content table_unExpand"},[a("el-table",{attrs:{data:t.PackageBarCodeDetailList}},[a("el-table-column",{attrs:{label:"包名称",prop:"Name",width:"240"}}),a("el-table-column",{attrs:{label:"回收科室",prop:"ProvideSubClinicName",width:"210"}}),a("el-table-column",{attrs:{label:"数量",prop:"Quantity",width:"100"}}),a("el-table-column")],1)],1)])}),1),a("div",{staticClass:"cssd_table_bottom"},[a("p",[e._v("\n        共计\n        "),a("span",[e._v(e._s(e.countPackageNumber(e.submitData.Carriers)))]),e._v(" 包\n      ")]),a("p",[e.cleanRecordModle?a("el-button",{on:{click:e.cancelChange}},[e._v("取消修改")]):e._e(),a("el-button",{attrs:{type:"primary"},on:{click:e.cleanSubmit}},[e._v(e._s(e.cleanRecordModle?"修改完成":"开始清洗"))])],1)])],1),a("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[e.isShowManualEnter?a("ManualEnter",{attrs:{BarCodeList:e.submitData.Carriers,ApiUrl:"/api/Scanner/Clean"},on:{"to-father":e.packageData2father}}):e._e()],1),a("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[e.isShowCleanSelect?a("CleanSelectBox",{attrs:{deviceId:e.selectedDeviceId},on:{"to-father":e.deviceProgram2father}}):e._e()],1),a("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[e.isShowPhoto?a("PhotoView",{attrs:{data:e.submitData.Pictures},on:{"viewPhoto-to-father":e.viewPhotoToFather}}):e._e()],1),a("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[e.isShowCleanFailedCarrier?a("CarrierList",{attrs:{data:e.cleanFailedCarriers},on:{"cleanFailed-to-father":e.viewCarrierList}}):e._e()],1)],1)},s=[],r=(a("ac6a"),a("1a10")),n=a("d040"),o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"device_select_box",on:{click:function(t){return t.target!==t.currentTarget?null:e.cancelSelect(t)}}},[a("ul",e._l(e.deviceList,function(t,i){return a("li",{key:i},[a("div",{staticClass:"device_box"},[a("dl",{staticClass:"clear_float"},[a("dt",[a("h3",[e._v(e._s(t.Name))]),a("div",{staticClass:"devicePot clear_float"},[a("p",[a("span",[e._v("总锅次：")]),a("u",[e._v(e._s(t.CleanTotalBatch))])]),a("p",[a("span",[e._v("当日锅次：")]),a("u",[e._v(e._s(t.CleanBatch))])])])]),0===t.CleanDeviceType&&2!=t.Status?a("dd",[a("div",{staticClass:"deviceTimebox clear_float"},[a("b",[e._v(e._s(e.timeFormatDuring(t.CurrentTime)))]),a("el-button",{staticClass:"resetTImeBtn",attrs:{disabled:0==t.Status},on:{click:function(t){return e.resetDeviceTime(i)}}})],1)]):e._e(),0===t.CleanDeviceType&&2==t.Status?a("dd",{staticClass:"clear_float"},[a("div",{staticClass:"deviceTimebox clear_float"},[a("b",{staticClass:"progError"},[e._v("程序出错")]),a("el-button",{staticClass:"resetTImeBtn",on:{click:function(t){return e.resetDeviceStatus(i)}}})],1)]):e._e()]),a("ol",{staticClass:"clear_float"},e._l(t.CleanPrograms,function(s,r){return a("li",{key:r},[a("el-button",{class:e.$route.query.deviceId==t.Id&&e.$route.query.programId==s.Id?"is-selected":"",attrs:{disabled:1!==t.CleanDeviceType&&e.$props.deviceId!=t.Id&&0!=t.Status},on:{click:function(t){return e.selectProgram(i,r)}}},[e._v(e._s(s.Name))])],1)}),0)])])}),0)])},c=[],l={props:["deviceId"],data:function(){return{last_select_device_id:0,last_select_program_id:0,deviceList:[]}},created:function(){var e=this;axios({url:"/api/Clean/CleanDevices"}).then(function(t){200==t.data.Code?(e.deviceList=t.data.Data,e.deviceList.forEach(function(t,a){0===t.CleanDeviceType&&t.CurrentTime>0&&(t["Countdown"+a]=setInterval(function(){t.CurrentTime--,t.CurrentTime<=0&&(clearInterval(t["Countdown"+a]),e.$router.go(0))},1e3))})):e.showInformation({classify:"message",msg:t.data.Msg})}).catch(function(e){})},beforeDestroy:function(){this.deviceList.forEach(function(e,t){clearInterval(e["Countdown"+t])})},methods:{selectProgram:function(e,t){this.$emit("to-father",{DeviceName:this.deviceList[e].Name,DeviceId:this.deviceList[e].Id,ProgramName:this.deviceList[e].CleanPrograms[t].Name,ProgramId:this.deviceList[e].CleanPrograms[t].Id})},cancelSelect:function(){this.$emit("to-father","")},resetDeviceStatus:function(e){this.deviceList[e].Status=0},resetDeviceTime:function(e){var t=this;axios({url:"/api/Clean/ReturnDeviceTimeToZero/".concat(this.deviceList[e].Id)}).then(function(e){var a;200==e.data.Code?(a="success",t.$router.go(0)):a="error",t.$message({message:e.data.Msg,type:a,center:!0,duration:500})}).catch(function(e){})}},computed:{timeFormatDuring:function(){return function(e){var t=parseInt(e%86400/3600),a=parseInt(e%3600/60),i=e%60;return t=t<10?"0"+t:t,a=a<10?"0"+a:a,i=i<10?"0"+i:i,t+":"+a+":"+i}}}},d=l,u=(a("4a71"),a("2877")),h=Object(u["a"])(d,o,c,!1,null,"288f35fc",null),m=h.exports,f=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"carrier_list"}},[a("div",{staticClass:"carrier_box"},[a("div",{staticClass:"container table_collapse table_unExpand"},[a("div",{staticClass:"content_title"},[a("p",{staticStyle:{width:"50px"}},[a("el-checkbox",{attrs:{indeterminate:e.isIndeterminate},on:{change:e.handleCheckAllChange},model:{value:e.checkAll,callback:function(t){e.checkAll=t},expression:"checkAll"}})],1),a("p",[e._v("网篮名称")]),a("p",[e._v("网篮条码")])]),a("el-checkbox-group",{on:{change:e.handleCheckedChange},model:{value:e.checkList,callback:function(t){e.checkList=t},expression:"checkList"}},[a("el-collapse",{attrs:{accordion:""}},e._l(e.carrierList,function(t,i){return a("el-collapse-item",{key:i,attrs:{name:i+""}},[a("div",{staticClass:"collapseTh",attrs:{slot:"title"},slot:"title"},[a("div",{staticClass:"collapseTd",staticStyle:{width:"90px"}},[a("div",{staticClass:"checkDiv"},[a("el-checkbox",{attrs:{label:t.BarCode}},[e._v(e._s(""))])],1)]),a("div",{staticClass:"collapseTd"},[a("p",[e._v(e._s(t.Name))])]),a("div",{staticClass:"collapseTd"},[a("p",[e._v(e._s(t.BarCode))])])]),a("el-table",{attrs:{data:t.PackageBarCodeDetailList}},[a("el-table-column",{attrs:{width:"130"}}),a("el-table-column",{attrs:{label:"所属科室",prop:"ProvideSubClinicName",width:"210"}}),a("el-table-column",{attrs:{label:"包名称",prop:"Name",width:"210"}}),a("el-table-column",{attrs:{label:"包数量",prop:"Quantity",width:"100"}}),a("el-table-column")],1)],1)}),1)],1)],1),a("div",{staticClass:"carrier_box_b"},[a("el-button",{staticClass:"btn88x32empty",on:{click:e.cancelSubmit}},[e._v("取消")]),a("el-button",{staticClass:"btn88x32",attrs:{type:"primary"},on:{click:e.saveSubmit}},[e._v("确定")])],1)])])},v=[],p={props:["data"],data:function(){return{checkList:[],carrierList:[],checkAll:!1,isIndeterminate:!1}},created:function(){this.carrierList=this.$props.data},mounted:function(){},methods:{handleCheckAllChange:function(e){var t=this;e?(this.checkList=[],this.carrierList.forEach(function(e){t.checkList.push(e.BarCode)})):this.checkList=[],this.isIndeterminate=!1},handleCheckedChange:function(e){var t=e.length;this.checkAll=t===this.carrierList.length,this.isIndeterminate=t>0&&t<this.carrierList.length},cancelSubmit:function(){this.$emit("cleanFailed-to-father","")},saveSubmit:function(){this.$emit("cleanFailed-to-father",this.checkList)}}},C=p,g=(a("1429"),Object(u["a"])(C,f,v,!1,null,null,null)),_=g.exports,b={data:function(){return{cleanFailedCarriers:[],selectedDeviceId:0,activeName:"0",isShowPhoto:!1,isShowManualEnter:!1,isShowCleanSelect:!1,isShowCleanFailedCarrier:!1,cleanRecordModle:!1,submitData:{DeviceModelName:this.$route.query.deviceName,DeviceModelId:this.$route.query.deviceId-0,DeviceModelProgramName:this.$route.query.programName,DeviceModelProgramId:this.$route.query.programId-0,Carriers:[],Pictures:[]}}},components:{ManualEnter:n["a"],CleanSelectBox:m,PhotoView:r["a"],CarrierList:_},created:function(){var e=this;CSManager.handleDataThis=this,this.$route.query.recordId&&(this.cleanRecordModle=!0,axios({url:"/api/Clean/PendingUpdateCleanRecord/".concat(this.$route.query.recordId)}).then(function(t){if(200==t.data.Code){var a=t.data.Data;e.submitData.DeviceModelName=a.DeviceModelName,e.submitData.DeviceModelId=a.DeviceModelId,e.selectedDeviceId=e.submitData.DeviceModelId,e.submitData.DeviceModelProgramName=a.DeviceModelProgramName,e.submitData.DeviceModelProgramId=a.DeviceModelProgramId,e.submitData.CleanTaskId=a.CleanTaskId,e.submitData.Carriers=a.CarrierForCleanVms}else e.showInformation({classify:"message",msg:t.data.Msg})}).catch(function(e){})),axios({url:"/api/Clean/CleanFailedCarrier"}).then(function(t){200==t.data.Code?e.cleanFailedCarriers=t.data.Data:e.showInformation({classify:"message",msg:t.data.Msg})}).catch(function(e){})},mounted:function(){},beforeDestroy:function(){CSManager.handleDataThis=null},methods:{handleShowCleanFailedCarriers:function(){this.isShowCleanFailedCarrier=!0},viewCarrierList:function(e){var t=this;this.isShowCleanFailedCarrier=!1,e&&e.forEach(function(e){t.handleBarCode(e)})},handleShowPhotos:function(e){this.isShowPhoto=!0},viewPhotoToFather:function(){this.isShowPhoto=!1},goBack:function(){this.cleanRecordModle?this.$router.push("/clean/record"):this.$router.push("/clean/select")},cancelChange:function(){this.$router.push("/clean/record")},handleShowManualEnter:function(){this.isShowManualEnter=!0},cleanSubmit:function(){var e=this,t="",a="";this.cleanRecordModle?(t="/api/Clean/CleanRecordModify",a="PUT"):(t="/api/Clean/CleanComplete",a="POST"),this.GLOBAL.VerificationHandle([{val:this.submitData.Carriers,type:"ArrayNotEmpty",msg:"请至少清洗一个网篮！"}])&&axios({url:t,method:a,data:this.submitData}).then(function(t){var i;200==t.data.Code?(i="success","POST"==a?e.$router.push({path:"/clean/select"}):"PUT"==a&&e.$router.push({path:"/clean/record"})):i="error",e.showInformation({classify:"message",msg:t.data.Msg,type:i})}).catch(function(e){})},reSelect:function(){this.isShowCleanSelect=!0},packageData2father:function(e){this.isShowManualEnter=!1,e&&(e.CarrierBarCodeScannerVm.PackageBarCodeDetailList=e.Packages,this.submitData.Carriers.push(e.CarrierBarCodeScannerVm),this.activeName=this.submitData.Carriers.length-1+"")},deviceProgram2father:function(e){this.isShowCleanSelect=!1,e&&(this.submitData.DeviceModelName=e.DeviceName,this.$route.query.deviceName=e.DeviceName,this.submitData.DeviceModelId=e.DeviceId,this.$route.query.deviceId=e.DeviceId,this.submitData.DeviceModelProgramName=e.ProgramName,this.$route.query.programName=e.ProgramName,this.submitData.DeviceModelProgramId=e.ProgramId,this.$route.query.programId=e.ProgramId)},deleteThisCarrier:function(e){this.submitData.Carriers.splice(e,1)},handleBarCode:function(e){var t=this,a=!0;this.submitData.Carriers.forEach(function(i){if(i.BarCode==e.toUpperCase())return t.showInformation({classify:"message",msg:"该条码已录入！",type:"warning"}),void(a=!1)}),a&&axios({url:"/api/Scanner/Clean/".concat(e)}).then(function(e){200==e.data.Code?t.packageData2father(e.data.Data):t.showInformation({classify:"message",msg:e.data.Msg})}).catch(function(e){})}},computed:{countPackageNumber:function(){var e=this;return function(t){for(var a=0,i=0;i<t.length;i++)for(var s=0;s<t[i].PackageBarCodeDetailList.length;s++)a+=t[i].PackageBarCodeDetailList[s].Quantity;return e.submitData.CleanQuantity=a,a}},computedPhotoNumber:function(){return null==this.submitData.Pictures?0:this.submitData.Pictures.length}}},k=b,D=(a("768a"),Object(u["a"])(k,i,s,!1,null,null,null));t["default"]=D.exports},68216:function(e,t,a){},"68c0":function(e,t,a){"use strict";var i=a("c38f"),s=a.n(i);s.a},"768a":function(e,t,a){"use strict";var i=a("4881"),s=a.n(i);s.a},9460:function(e,t,a){},ac6a:function(e,t,a){for(var i=a("cadf"),s=a("0d58"),r=a("2aba"),n=a("7726"),o=a("32e9"),c=a("84f2"),l=a("2b4c"),d=l("iterator"),u=l("toStringTag"),h=c.Array,m={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},f=s(m),v=0;v<f.length;v++){var p,C=f[v],g=m[C],_=n[C],b=_&&_.prototype;if(b&&(b[d]||o(b,d,h),b[u]||o(b,u,C),c[C]=h,g))for(p in i)b[p]||r(b,p,i[p],!0)}},c38f:function(e,t,a){},d040:function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"manual_enter"}},[a("dl",[a("dt",[a("el-input",{directives:[{name:"focus",rawName:"v-focus"}],attrs:{placeholder:"请扫描或手动录入条码"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.SaveOption(t)}},model:{value:e.input_str,callback:function(t){e.input_str="string"===typeof t?t.trim():t},expression:"input_str"}})],1),a("dd",[a("el-button",{on:{click:e.cancelOption}},[e._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.SaveOption}},[e._v("确定")])],1)])])},s=[],r=(a("ac6a"),{props:["BarCodeList","ApiUrl","task_index","firstRequest"],data:function(){return{input_str:""}},created:function(){},mounted:function(){},methods:{cancelOption:function(){this.$emit("to-father","")},SaveOption:function(){var e=this;this.GLOBAL.VerificationHandle([{val:this.input_str,type:"StringNotEmpty",msg:"扫描条码不能为空！"}])&&(this.$props.firstRequest?axios("".concat(this.$props.ApiUrl,"/").concat(this.input_str)).then(function(t){if(200==t.data.Code)if(e.$props.task_index>=0)e.$emit("to-father",{data:t.data.Data,index:e.$props.task_index});else{if(t.data.Data.PackageBarCodeScannerVm)for(var a=0;a<e.$props.BarCodeList.length;a++)if(e.$props.BarCodeList[a].BarCode==t.data.Data.PackageBarCodeScannerVm.BarCode)return e.showInformation({classify:"message",msg:"该条码已录入！",type:"warning"}),void(e.input_str="");e.$emit("to-father",t.data.Data,e.input_str)}else 300==t.data.Code?(e.input_str="",e.showInformation({classify:"message",msg:t.data.Msg,type:"warning"})):(e.input_str="",e.showInformation({classify:"message",msg:t.data.Msg,type:"error"}))}).catch(function(e){}):(this.$props.BarCodeList.forEach(function(t){if(t.BarCode==e.input_str.toUpperCase())return e.showInformation({classify:"message",msg:"该条码已录入！",type:"warning"}),void(e.input_str="")}),axios("".concat(this.$props.ApiUrl,"/").concat(this.input_str)).then(function(t){200==t.data.Code?e.$props.task_index>=0?e.$emit("to-father",{data:t.data.Data,index:e.$props.task_index}):e.$emit("to-father",t.data.Data,e.input_str):300==t.data.Code?(e.input_str="",e.showInformation({classify:"message",msg:t.data.Msg,type:"warning"})):(e.input_str="",e.showInformation({classify:"message",msg:t.data.Msg,type:"error"}))}).catch(function(e){})))}}}),n=r,o=(a("dda8"),a("2877")),c=Object(o["a"])(n,i,s,!1,null,null,null);t["a"]=c.exports},d43e:function(e,t,a){},dda8:function(e,t,a){"use strict";var i=a("9460"),s=a.n(i);s.a}}]);