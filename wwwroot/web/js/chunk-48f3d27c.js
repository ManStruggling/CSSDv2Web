(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-48f3d27c"],{bb0d:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"basic_main"},[e("div",{staticClass:"basic_main_head"},[e("p"),e("el-button",{staticClass:"basic_ipt_add",attrs:{type:"primary"},on:{click:t.addTableTr}},[t._v("新增物流人员")])],1),e("div",{staticClass:"basic_table table_unExpand"},[e("el-table",{attrs:{data:t.table_data}},[e("el-table-column",{attrs:{label:"员工姓名",prop:"StaffName",width:"240"}}),e("el-table-column",{attrs:{label:"员工工号",prop:"StaffJobNumber",width:"210"}}),e("el-table-column",{attrs:{label:"员工条码编号",prop:"StaffBarCode",width:"210"}}),e("el-table-column",{attrs:{label:"登录密码",prop:"Password",width:"210"}}),e("el-table-column",{attrs:{label:"操作",width:"210"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("a",{staticClass:"delete_this_tr",on:{click:function(e){return e.stopPropagation(),t.deleteThisTr(a.$index)}}},[t._v("删除")])]}}])}),e("el-table-column")],1)],1),e("transition",{attrs:{name:"fade","enter-active-class":"animated fadeIn faster","leave-active-class":"animated fadeOut faster"}},[t.showEditBox?e("LogisticsStaffBox",{on:{"to-father":t.child2father}}):t._e()],1)],1)},i=[],n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"logisticsStaffBox",attrs:{id:"editBox"}},[e("div",{staticClass:"editContainer"},[e("div",{staticClass:"editContent"},[e("div",{staticClass:"Staff_search"},[e("el-input",{attrs:{placeholder:"请输入人员条码"},nativeOn:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.searchData(a)}},model:{value:t.search_str,callback:function(a){t.search_str="string"===typeof a?a.trim():a},expression:"search_str"}}),e("el-button",{staticClass:"btn120x40",attrs:{type:"primary"},on:{click:t.searchData}},[t._v("查询")])],1),e("ul",{staticClass:"clear_float"},[e("li",[e("p",[t._v("员工姓名")]),e("span",[t._v(t._s(t.editBoxData.StaffName))])]),e("li",[e("p",[t._v("员工工号")]),e("span",[t._v(t._s(t.editBoxData.StaffJobNumber))])]),e("li",[e("p",[t._v("登录密码")]),e("span",[t._v(t._s(t.editBoxData.Password))])])])]),e("div",{staticClass:"editBoxOption"},[e("el-button",{on:{click:t.editBoxCancelSave}},[t._v("取消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.editBoxSave}},[t._v("完成")])],1)])])},o=[],c={props:["data"],data:function(){return{search_str:"",editBoxData:{StaffId:0,StaffName:"",StaffJobNumber:"",Password:""}}},created:function(){},methods:{searchData:function(){var t=this;this.GLOBAL.VerificationHandle([{val:this.search_str,type:"StringNotEmpty",msg:"搜索员工条码不能为空！"}])&&axios({url:"/api/Logistics/NewDrivers/Search/".concat(this.search_str)}).then(function(a){200==a.data.Code?t.editBoxData=a.data.Data:t.showInformation({classify:"message",msg:a.data.Msg})}).catch(function(t){})},editBoxCancelSave:function(){this.$emit("to-father","")},editBoxSave:function(){var t=this;this.GLOBAL.VerificationHandle([{val:this.editBoxData.StaffId,type:"NumberNotZero",msg:"您还未查询人员！请查询人员！"}])&&axios({url:"/api/Logistics/SettingStaffToDriver",method:"Post",data:this.editBoxData}).then(function(a){var e;200==a.data.Code?(e="success",t.$emit("to-father",a.data.Data)):e="error",t.showInformation({classify:"message",msg:a.data.Msg,type:e})}).catch(function(t){})}}},r=c,l=(e("debf"),e("2877")),d=Object(l["a"])(r,n,o,!1,null,null,null),f=d.exports,u={data:function(){return{basic_search:"",table_data:[],showEditBox:!1}},components:{LogisticsStaffBox:f},created:function(){var t=this;axios({url:"/api/Logistics/Drivers"}).then(function(a){200==a.data.Code?t.table_data=a.data.Data:t.showInformation({classify:"message",msg:a.data.Msg})}).catch(function(t){})},mounted:function(){},methods:{searchThisTableData:function(){},addTableTr:function(){this.showEditBox=!0},deleteThisTr:function(t){var a=this;this.$confirm("您是否确定删除该项?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then(function(){axios.delete("/api/Logistics/CancelDriverOfStaff/".concat(a.table_data[t].StaffId)).then(function(t){var e;200==t.data.Code?(e="success",a.table_data=t.data.Data):e="error",a.showInformation({classify:"message",msg:t.data.Msg,type:e})}).catch(function(t){})}).catch(function(){})},child2father:function(t){this.showEditBox=!1,t&&(this.table_data=t)}}},h=u,p=Object(l["a"])(h,s,i,!1,null,null,null);a["default"]=p.exports},debf:function(t,a,e){"use strict";var s=e("f7de"),i=e.n(s);i.a},f7de:function(t,a,e){}}]);