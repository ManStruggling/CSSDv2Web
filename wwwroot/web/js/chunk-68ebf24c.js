(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-68ebf24c"],{"0a51":function(t,a,e){},a859:function(t,a,e){"use strict";e.r(a);var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"basic_main"},[e("div",{staticClass:"basic_main_head"},[e("p"),e("el-button",{staticClass:"basic_ipt_add",attrs:{type:"primary"},on:{click:t.addTableTr}},[t._v("新增供应商")])],1),e("div",{staticClass:"basic_table table_unExpand"},[e("el-table",{attrs:{data:t.table_data}},[e("el-table-column",{attrs:{label:"供应商名称",prop:"Name",width:"240"}}),e("el-table-column",{attrs:{label:"传真",prop:"FaxNumber",width:"210"},scopedSlots:t._u([{key:"default",fn:function(a){return[t._v("\n          "+t._s(""==a.row.FaxNumber?"-":a.row.FaxNumber)+"\n        ")]}}])}),e("el-table-column",{attrs:{label:"联系人",prop:"ContactPerson",width:"210"},scopedSlots:t._u([{key:"default",fn:function(a){return[t._v("\n          "+t._s(""==a.row.ContactPerson?"-":a.row.ContactPerson)+"\n        ")]}}])}),e("el-table-column",{attrs:{label:"联系人号码",prop:"ContactNumber",width:"210"},scopedSlots:t._u([{key:"default",fn:function(a){return[t._v("\n          "+t._s(""==a.row.ContactNumber?"-":a.row.ContactNumber)+"\n        ")]}}])}),e("el-table-column",{attrs:{label:"操作",width:"210"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("a",{staticClass:"change_this_tr",on:{click:function(e){return e.stopPropagation(),t.editThisTr(a.$index)}}},[t._v("编辑")]),e("a",{staticClass:"delete_this_tr",on:{click:function(e){return e.stopPropagation(),t.deleteThisTr(a.$index)}}},[t._v("删除")])]}}])}),e("el-table-column")],1)],1),e("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[t.showEditBox?e("SupplierBox",{attrs:{data:t.toChildData,Type:t.Type},on:{"to-father":t.child2father}}):t._e()],1)],1)},o=[],n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"supplierBox",attrs:{id:"editBox"}},[e("div",{staticClass:"editContainer"},[e("div",{staticClass:"editContent"},[e("ul",{staticClass:"clear_float"},[e("li",[e("p",[t._v("供应商名称")]),e("el-input",{attrs:{type:"text",placeholder:"供应商名称(必填)",maxlength:"10"},model:{value:t.editBoxData.Name,callback:function(a){t.$set(t.editBoxData,"Name","string"===typeof a?a.trim():a)},expression:"editBoxData.Name"}})],1),e("li",[e("p",[t._v("传真")]),e("el-input",{attrs:{type:"text",placeholder:"传真"},model:{value:t.editBoxData.FaxNumber,callback:function(a){t.$set(t.editBoxData,"FaxNumber","string"===typeof a?a.trim():a)},expression:"editBoxData.FaxNumber"}})],1),e("li",[e("p",[t._v("公司电话")]),e("el-input",{attrs:{type:"text",placeholder:"公司电话"},model:{value:t.editBoxData.PhoneNumber,callback:function(a){t.$set(t.editBoxData,"PhoneNumber","string"===typeof a?a.trim():a)},expression:"editBoxData.PhoneNumber"}})],1),e("li",[e("p",[t._v("联系人")]),e("el-input",{attrs:{type:"text",placeholder:"联系人"},model:{value:t.editBoxData.ContactPerson,callback:function(a){t.$set(t.editBoxData,"ContactPerson","string"===typeof a?a.trim():a)},expression:"editBoxData.ContactPerson"}})],1),e("li",[e("p",[t._v("联系人号码")]),e("el-input",{attrs:{type:"text",placeholder:"联系人号码"},model:{value:t.editBoxData.ContactNumber,callback:function(a){t.$set(t.editBoxData,"ContactNumber","string"===typeof a?a.trim():a)},expression:"editBoxData.ContactNumber"}})],1),e("li",[e("p",[t._v("供应商地址")]),e("el-input",{attrs:{type:"text",placeholder:"供应商地址"},model:{value:t.editBoxData.Address,callback:function(a){t.$set(t.editBoxData,"Address","string"===typeof a?a.trim():a)},expression:"editBoxData.Address"}})],1),e("li",{staticClass:"textareaBox"},[e("p",[t._v("备注")]),e("el-input",{attrs:{type:"textarea",maxlength:"20",placeholder:"备注","show-word-limit":""},model:{value:t.editBoxData.Remark,callback:function(a){t.$set(t.editBoxData,"Remark","string"===typeof a?a.trim():a)},expression:"editBoxData.Remark"}})],1)]),1!=t.editBoxData.Type?e("div",{staticClass:"multiSelectBox"},[e("h3",[e("el-select",{staticClass:"green18x10",attrs:{multiple:"",placeholder:"请选择(必填)"},model:{value:t.editBoxData.RelatedManufacturerIds,callback:function(a){t.$set(t.editBoxData,"RelatedManufacturerIds",a)},expression:"editBoxData.RelatedManufacturerIds"}},t._l(t.supplierList,function(t){return e("el-option",{key:t.Id,attrs:{label:t.Name,value:t.Id}})}),1)],1)]):t._e()]),e("div",{staticClass:"editBoxOption"},[e("el-button",{on:{click:t.editBoxCancelSave}},[t._v("取消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.editBoxSave}},[t._v("完成")])],1)])])},s=[],r={props:["data","Type"],data:function(){return{editBoxData:{},supplierList:[]}},created:function(){var t=this;this.editBoxData=this.$props.data,axios("/api/Manufacturer/NameByType/".concat(this.$props.Type)).then(function(a){200==a.data.Code?t.supplierList=a.data.Data:t.showInformation({classify:"message",msg:a.data.Msg})}).catch(function(t){})},mounted:function(){$("#editBox.supplierBox h3 .el-select .el-input__inner").val("生产商(必填)")},methods:{editBoxCancelSave:function(){this.$emit("to-father","")},editBoxSave:function(){var t=this,a="";a=0==this.editBoxData.SupplierId?"post":"put";var e=[{val:this.editBoxData.Name,type:"StringNotEmpty",msg:"供应商名称不能为空！"}];0==this.editBoxData.Type&&e.push({val:this.editBoxData.RelatedManufacturerIds,type:"ArrayNotEmpty",msg:"您还没有关联生产商！请至少关联一个生产商！"}),this.GLOBAL.VerificationHandle(e)&&axios({url:"/api/Supplier",method:a,data:this.editBoxData}).then(function(a){var e;200==a.data.Code?(e="success",t.$emit("to-father",a.data.Data)):e="error",t.showInformation({classify:"message",msg:a.data.Msg,type:e})}).catch(function(t){})}}},l=r,c=(e("d41b"),e("2877")),d=Object(c["a"])(l,n,s,!1,null,null,null),u=d.exports,p={data:function(){return{Type:0,model:"add",basic_search:"",table_data:[],showEditBox:!1,toChildData:{}}},components:{SupplierBox:u},created:function(){},watch:{$route:{handler:function(t,a,e){var i=this;this.Type=t.params.Type-0,axios("/api/Supplier/ByType/"+this.Type).then(function(t){200==t.data.Code?i.table_data=t.data.Data:i.showInformation({classify:"message",msg:t.data.Msg})}).catch(function(t){})},immediate:!0}},mounted:function(){},methods:{searchThisTableData:function(){},addTableTr:function(){this.toChildData={SupplierId:0,Name:"",FaxNumber:"",PhoneNumber:"",ContactPerson:"",ContactNumber:"",Address:"",Remark:"",Type:this.Type,RelatedManufacturerIds:[]},this.showEditBox=!0},deleteThisTr:function(t){var a=this;this.$confirm("您是否确定删除该项?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then(function(){axios.delete("/api/Supplier/".concat(a.Type,"/").concat(a.table_data[t].SupplierId)).then(function(t){var e;200==t.data.Code?(e="success",a.table_data=t.data.Data):e="error",a.showInformation({classify:"message",msg:t.data.Msg,type:e})}).catch(function(t){})}).catch(function(){})},editThisTr:function(t){this.toChildData=JSON.parse(JSON.stringify(this.table_data[t])),this.showEditBox=!0},child2father:function(t){this.showEditBox=!1,t&&(this.table_data=t)}}},h=p,m=Object(c["a"])(h,i,o,!1,null,null,null);a["default"]=m.exports},d41b:function(t,a,e){"use strict";var i=e("0a51"),o=e.n(i);o.a}}]);