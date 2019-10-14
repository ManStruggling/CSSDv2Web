(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e12d7482"],{"4cf6":function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"basic_package_box",attrs:{id:"reserveProductList"}},[a("div",{staticClass:"package_box"},[a("h3",[a("el-select",{staticClass:"green24x13",on:{change:t.packageClassChange},model:{value:t.packageBoxClassSelect,callback:function(e){t.packageBoxClassSelect=e},expression:"packageBoxClassSelect"}},[a("el-option",{attrs:{label:"全部",value:"all"}}),a("el-option",{attrs:{label:"追溯的无菌包",value:"追溯的无菌包"}}),a("el-option",{attrs:{label:"高水平消毒包",value:"高水平消毒包"}}),a("el-option",{attrs:{label:"追溯的辅料包",value:"追溯的辅料包"}})],1),a("el-input",{attrs:{placeholder:"请输入拼音简码"},on:{input:t.packageSearch},model:{value:t.searchShortCode,callback:function(e){t.searchShortCode=e},expression:"searchShortCode"}})],1),a("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.list,"tooltip-effect":"dark","max-height":"300",width:"400","row-key":t.getRowKeys},on:{"row-click":t.handleRowClick,"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55","reserve-selection":!0}}),a("el-table-column",{staticClass:"product_name",attrs:{prop:"ProductName",label:"包名称",width:"201",sortable:"","sort-by":"ProductShortCode","show-overflow-tooltip":!0}}),a("el-table-column",{attrs:{prop:"ProductQuantity",label:"数量",sortable:"","sort-by":"ProductQuantity"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-input-number",{attrs:{min:1,max:999,controls:!1,size:"mini"},on:{change:function(a,s){t.handleNumberChange(a,s,e.$index)}},nativeOn:{click:function(e){return e.stopPropagation(),t.GLOBAL.cancelBubble(e)}},model:{value:e.row.ProductQuantity,callback:function(a){t.$set(e.row,"ProductQuantity",a)},expression:"scope.row.ProductQuantity"}})]}}])})],1),a("h4",[a("el-button",{on:{click:t.cancelSend}},[t._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:t.sendToFather}},[t._v("确定")])],1)],1)])},o=[],i={data:function(){return{getUrl:"",packageBoxClassSelect:"all",searchShortCode:"",list:[],multipleSelection:[]}},props:["cssdId"],created:function(){var t=this;axios({url:"/odata/AllProducts?$filter=type ne '外来器械包' and type ne '一次性物品' and ProvideGenerateType eq '预定生成'",headers:{CssdId:this.$props.cssdId}}).then(function(e){t.list=e.data.value}).catch(function(t){})},methods:{handleNumberChange:function(t,e,a){var s=this;void 0==t&&setTimeout(function(){s.list[a].ProductQuantity=1},0)},sendToFather:function(){this.$emit("productList-to-father",this.multipleSelection)},cancelSend:function(){this.$emit("productList-to-father",!1)},handleRowClick:function(t){this.$refs.multipleTable.toggleRowSelection(t)},packageSearch:function(){var t,e=this;t="/odata/AllProducts?$filter=type ne '外来器械包' and type ne '一次性物品' and ProvideGenerateType eq '预定生成' and (contains(ProductShortCode,".concat("'"+this.searchShortCode+"'",") or  contains(ProductName,").concat("'"+this.searchShortCode+"'","))"),axios({url:t,headers:{CssdId:this.$props.cssdId}}).then(function(t){e.list=t.data.value}).catch(function(t){})},handleSelectionChange:function(t){this.multipleSelection=t},getRowKeys:function(t){return t.ProductId},packageClassChange:function(){this.getUrl="all"==this.packageBoxClassSelect?"/odata/AllProducts?$filter=type ne '外来器械包' and type ne '一次性物品' and ProvideGenerateType eq '预定生成":"/odata/AllProducts?$filter=type ne '外来器械包' and type ne '一次性物品' and ProvideGenerateType eq '预定生成' and type eq ".concat(encodeURI("'"+this.packageBoxClassSelect+"'")),this.getPackagesData(this.getUrl)},getPackagesData:function(t){var e=this;axios({url:t,headers:{CssdId:this.$props.cssdId}}).then(function(t){e.list=t.data.value}).catch(function(t){})}}},n=i,l=(a("85b6"),a("2877")),c=Object(l["a"])(n,s,o,!1,null,null,null);e["a"]=c.exports},"5d9d":function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"basic_package_box",attrs:{id:"disposableList"}},[a("div",{staticClass:"package_box"},[a("h3",[a("el-input",{attrs:{placeholder:"请输入拼音简码"},on:{input:t.packageSearch},model:{value:t.searchShortCode,callback:function(e){t.searchShortCode=e},expression:"searchShortCode"}})],1),a("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.list,"tooltip-effect":"dark","max-height":"300",width:"400","row-key":t.getRowKeys},on:{"row-click":t.handleRowClick,"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55","reserve-selection":!0}}),a("el-table-column",{staticClass:"product_name",attrs:{prop:"ProductName",label:"一次性物品名称",width:"201",sortable:"","sort-by":"ProductShortCode","show-overflow-tooltip":!0}}),a("el-table-column",{attrs:{prop:"Specification",label:"规格",width:"150",sortable:"","sort-by":"Specification"}}),a("el-table-column",{attrs:{prop:"ProductQuantity",label:"数量",width:"80",sortable:"","sort-by":"ProductQuantity"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-input-number",{attrs:{min:1,max:999,controls:!1,size:"mini"},on:{change:function(a,s){t.handleNumberChange(a,s,e.$index)}},nativeOn:{click:function(e){return e.stopPropagation(),t.GLOBAL.cancelBubble(e)}},model:{value:e.row.ProductQuantity,callback:function(a){t.$set(e.row,"ProductQuantity",a)},expression:"scope.row.ProductQuantity"}})]}}])})],1),a("h4",[a("el-button",{on:{click:t.cancelSend}},[t._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:t.sendToFather}},[t._v("确定")])],1)],1)])},o=[],i={data:function(){return{getUrl:"",searchShortCode:"",list:[],multipleSelection:[]}},props:["cssdId"],created:function(){var t=this;axios({url:"/odata/AllProducts?$filter=type eq '一次性物品'",headers:{CssdId:this.$props.cssdId}}).then(function(e){t.list=e.data.value}).catch(function(t){})},methods:{handleNumberChange:function(t,e,a){var s=this;void 0==t&&setTimeout(function(){s.list[a].ProductQuantity=1},0)},sendToFather:function(){this.$emit("disposableList-to-father",this.multipleSelection)},cancelSend:function(){this.$emit("disposableList-to-father",!1)},handleRowClick:function(t){this.$refs.multipleTable.toggleRowSelection(t)},packageSearch:function(){var t,e=this;t="/odata/AllProducts?$filter=type eq '一次性物品' and (contains(ProductShortCode,".concat("'"+this.searchShortCode+"'",") or contains(ProductName,").concat("'"+this.searchShortCode+"'","))"),axios({url:t,headers:{CssdId:this.$props.cssdId}}).then(function(t){e.list=t.data.value}).catch(function(t){})},handleSelectionChange:function(t){this.multipleSelection=t},getRowKeys:function(t){return t.ProductId}}},n=i,l=(a("a299"),a("2877")),c=Object(l["a"])(n,s,o,!1,null,null,null);e["a"]=c.exports},6142:function(t,e,a){"use strict";var s=a("80c2"),o=a.n(s);o.a},"64a0":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"cssd_box",attrs:{id:"clinicReserve"}},[a("div",{staticClass:"cssd_title"},[a("ul",{staticClass:"cssd_menu"},[a("li",{on:{click:t.goBack}},[a("p",[t._v("返回")])])])]),a("div",{staticClass:"cssd_table_center cssd_totalBar"},[a("div",{staticClass:"table_box table_unExpand"},[a("ul",[a("li",[a("p",{staticClass:"font16gray"},[t._v("需用日期")]),a("div",{staticClass:"el_input_box font16blod"},[a("el-date-picker",{staticClass:"font16blod",attrs:{editable:!1,clearable:!1,type:"date",placeholder:"选择日期",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",disabled:!0},model:{value:t.submitData.BookDateTime,callback:function(e){t.$set(t.submitData,"BookDateTime",e)},expression:"submitData.BookDateTime"}})],1)]),a("li",[a("p",{staticClass:"font16gray"},[t._v("供应室")]),a("div",{staticClass:"el_input_box font16blod"},[a("el-select",{staticClass:"green24x13",attrs:{disabled:!0},model:{value:t.submitData.BookCssdId,callback:function(e){t.$set(t.submitData,"BookCssdId",e)},expression:"submitData.BookCssdId"}},t._l(t.cssdList,function(t,e){return a("el-option",{key:e,attrs:{label:t.BookCssdName,value:t.BookCssdId}})}),1)],1)]),a("li",[a("p",{staticClass:"font16gray"},[t._v("预定科室")]),a("div",{staticClass:"el_input_box font16blod"},[a("el-select",{staticClass:"green24x13",attrs:{disabled:!0},model:{value:t.submitData.BookSubClinicId,callback:function(e){t.$set(t.submitData,"BookSubClinicId",e)},expression:"submitData.BookSubClinicId"}},t._l(t.subClinicList,function(t,e){return a("el-option",{key:e,attrs:{label:t.BookSubClinicName,value:t.BookSubClinicId}})}),1)],1)]),a("li",{staticClass:"myTextarea"},[a("p",{staticClass:"font16gray"},[t._v("备注")]),a("div",{staticClass:"el_input_box font16blod"},[a("el-input",{staticClass:"font16blod",attrs:{type:"textarea",resize:"none",placeholder:"请输入备注",maxlength:"20","show-word-limit":"",disabled:!0},model:{value:t.submitData.Remark,callback:function(e){t.$set(t.submitData,"Remark","string"===typeof e?e.trim():e)},expression:"submitData.Remark"}})],1)])]),a("h3"),a("el-tabs",{model:{value:t.tabActiveName,callback:function(e){t.tabActiveName=e},expression:"tabActiveName"}},[a("el-tab-pane",{attrs:{label:"无菌物品",name:"0"}},[a("el-table",{attrs:{data:t.submitData.Products}},[a("el-table-column",{attrs:{label:"名称",prop:"ProductName",width:"240"}}),a("el-table-column",{attrs:{label:"数量",width:"210"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-input-number",{attrs:{min:1,max:999,controls:!1},on:{change:function(a){return t.handleNumberChange(e.row)}},model:{value:e.row.ProductQuantity,callback:function(a){t.$set(e.row,"ProductQuantity",a)},expression:"props.row.ProductQuantity"}})]}}])}),a("el-table-column",{attrs:{label:"操作",width:"210"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("a",{on:{click:function(a){return t.productsDelete(e.$index)}}},[t._v("删除")])]}}])}),a("el-table-column")],1),a("el-button",{staticClass:"btn88x32",on:{click:t.handleSterileProduct}},[t._v("新增")])],1),a("el-tab-pane",{attrs:{label:"一次性物品",name:"1"}},[a("el-table",{attrs:{data:t.submitData.DisposableItems}},[a("el-table-column",{attrs:{label:"名称",prop:"ProductName",width:"240"}}),a("el-table-column",{attrs:{label:"规格",prop:"Specification",width:"210"}}),a("el-table-column",{attrs:{label:"数量",width:"210"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-input-number",{attrs:{min:1,max:999,controls:!1},on:{change:function(a){return t.handleNumberChange(e.row)}},model:{value:e.row.ProductQuantity,callback:function(a){t.$set(e.row,"ProductQuantity",a)},expression:"props.row.ProductQuantity"}})]}}])}),a("el-table-column",{attrs:{label:"操作",width:"210"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("a",{on:{click:function(a){return t.disposableDelete(e.$index)}}},[t._v("删除")])]}}])}),a("el-table-column")],1),a("el-button",{staticClass:"btn88x32",on:{click:t.handleDisposable}},[t._v("新增")])],1)],1)],1),a("div",{staticClass:"cssd_table_bottom"},[a("p"),a("p",[a("el-button",{on:{click:t.cancelChange}},[t._v("取消修改")]),a("el-button",{attrs:{type:"primary"},on:{click:t.submitComplete}},[t._v("修改完成")])],1)])]),a("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[t.isShowProductList?a("ReserveProductList",{attrs:{cssdId:t.submitData.BookCssdId},on:{"productList-to-father":t.productListToFather}}):t._e()],1),a("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[t.isShowDisposableList?a("DisposableList",{attrs:{cssdId:t.submitData.BookCssdId},on:{"disposableList-to-father":t.disposableListToFather}}):t._e()],1)],1)},o=[],i=(a("a481"),a("4cf6")),n=a("5d9d"),l={data:function(){return{tabActiveName:"0",isShowProductList:!1,isShowDisposableList:!1,submitData:{BookDateTime:"",BookCssdId:"",BookSubClinicId:"",Remark:"",Products:[],DisposableItems:[]},cssdList:[],subClinicList:[]}},components:{ReserveProductList:i["a"],DisposableList:n["a"]},created:function(){var t=this;this.$route.query.recordId&&axios({url:"/api/Book/PendingUpdateBookTask/".concat(this.$route.query.recordId)}).then(function(e){200==e.data.Code?t.submitData=e.data.Data:t.showInformation({classify:"message",msg:e.data.Msg})}).catch(function(t){}),axios({url:"/api/Book/InitialData"}).then(function(e){200==e.data.Code?(t.cssdList=e.data.Data.Cssds,t.subClinicList=e.data.Data.SubClinics,t.submitData.BookCssdId=t.cssdList[0].BookCssdId,t.submitData.BookSubClinicId=t.subClinicList[0].BookSubClinicId):t.showInformation({classify:"message",msg:e.data.Msg})}).catch(function(t){})},mounted:function(){this.GLOBAL.initWebSorcket(this)},methods:{handleNumberChange:function(t){void 0==t.ProductQuantity&&setTimeout(function(){t.ProductQuantity=1},0)},cancelChange:function(){this.goBack()},goBack:function(){this.$router.replace("/provide/reserveCheck")},submitComplete:function(){var t=this,e=[];e=e.concat(this.submitData.Products),e=e.concat(this.submitData.DisposableItems),this.submitData.Products=e,this.GLOBAL.VerificationHandle([{val:this.submitData.Products,type:"ArrayNotEmpty",msg:"请至少预定一个无菌物品或一次性物品！"}])&&axios({url:"/api/Book",method:"PUT",data:this.submitData}).then(function(e){var a;200==e.data.Code?(a="success",t.websocket.send(JSON.stringify({CssdId:t.submitData.BookCssdId,ReserveCheckState:!0,PackageState:!1,ProvideState:!1})),t.$router.replace("/provide/reserveCheck")):a="error",t.showInformation({classify:"message",msg:e.data.Msg,type:a})}).catch(function(t){})},productsDelete:function(t){var e=this;this.$confirm("您确定要删除该物品?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.submitData.Products.splice(t,1)}).catch(function(){})},disposableDelete:function(t){var e=this;this.$confirm("您确定要删除该物品?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.submitData.DisposableItems.splice(t,1)}).catch(function(){})},handleSterileProduct:function(){this.isShowProductList=!0},handleDisposable:function(){this.isShowDisposableList=!0},productListToFather:function(t){if(this.isShowProductList=!1,t)for(var e=0;e<t.length;e++){for(var a=!0,s=0;s<this.submitData.Products.length;s++)if(t[e].ProductId===this.submitData.Products[s].ProductId){a=!1,this.submitData.Products[s].ProductQuantity+=t[e].ProductQuantity;break}a&&this.submitData.Products.push(t[e])}},disposableListToFather:function(t){if(this.isShowDisposableList=!1,t)for(var e=0;e<t.length;e++){for(var a=!0,s=0;s<this.submitData.DisposableItems.length;s++)if(t[e].ProductId===this.submitData.DisposableItems[s].ProductId){a=!1,this.submitData.DisposableItems[s].ProductQuantity+=t[e].ProductQuantity;break}a&&this.submitData.DisposableItems.push(t[e])}}}},c=l,r=(a("6142"),a("2877")),u=Object(r["a"])(c,s,o,!1,null,null,null);e["default"]=u.exports},"80c2":function(t,e,a){},"85b6":function(t,e,a){"use strict";var s=a("9887"),o=a.n(s);o.a},9887:function(t,e,a){},a299:function(t,e,a){"use strict";var s=a("f78d"),o=a.n(s);o.a},a481:function(t,e,a){"use strict";var s=a("cb7c"),o=a("4bf8"),i=a("9def"),n=a("4588"),l=a("0390"),c=a("5f1b"),r=Math.max,u=Math.min,d=Math.floor,h=/\$([$&`']|\d\d?|<[^>]*>)/g,b=/\$([$&`']|\d\d?)/g,p=function(t){return void 0===t?t:String(t)};a("214f")("replace",2,function(t,e,a,f){return[function(s,o){var i=t(this),n=void 0==s?void 0:s[e];return void 0!==n?n.call(s,i,o):a.call(String(i),s,o)},function(t,e){var o=f(a,t,this,e);if(o.done)return o.value;var d=s(t),h=String(this),b="function"===typeof e;b||(e=String(e));var v=d.global;if(v){var k=d.unicode;d.lastIndex=0}var C=[];while(1){var g=c(d,h);if(null===g)break;if(C.push(g),!v)break;var y=String(g[0]);""===y&&(d.lastIndex=l(h,i(d.lastIndex),k))}for(var S="",P=0,w=0;w<C.length;w++){g=C[w];for(var x=String(g[0]),D=r(u(n(g.index),h.length),0),I=[],_=1;_<g.length;_++)I.push(p(g[_]));var B=g.groups;if(b){var $=[x].concat(I,D,h);void 0!==B&&$.push(B);var L=String(e.apply(void 0,$))}else L=m(x,h,D,I,B,e);D>=P&&(S+=h.slice(P,D)+L,P=D+x.length)}return S+h.slice(P)}];function m(t,e,s,i,n,l){var c=s+t.length,r=i.length,u=b;return void 0!==n&&(n=o(n),u=h),a.call(l,u,function(a,o){var l;switch(o.charAt(0)){case"$":return"$";case"&":return t;case"`":return e.slice(0,s);case"'":return e.slice(c);case"<":l=n[o.slice(1,-1)];break;default:var u=+o;if(0===u)return a;if(u>r){var h=d(u/10);return 0===h?a:h<=r?void 0===i[h-1]?o.charAt(1):i[h-1]+o.charAt(1):a}l=i[u-1]}return void 0===l?"":l})}})},f78d:function(t,e,a){}}]);