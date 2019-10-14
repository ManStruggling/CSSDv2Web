<template>
  <!-- 
    组件的样式 
  -->
  <div id="cssd_table" class="management">
    <!-- 页头 -->
    <div class="head_box">
      <router-link to="/" tag="p">上海倍而纳医疗器械科技有限公司</router-link>
      <div class="head_user">
        <p>{{GLOBAL.UserInfo.ClinicName}}</p>
        <p>{{GLOBAL.UserInfo.UserName}}</p>
        <a @click="GLOBAL.logOut" class="logOut"></a>
      </div>
    </div>
    <div class="basic_content">
      <!-- 侧导航 -->
      <div class="basic_nav">
        <div class="basic_menu_box">
          <el-menu
            class="el-menu-demo"
            mode="vertical"
            @select="handleSelect"
            :unique-opened="true"
          >
            <el-menu-item index="0">
                <router-link to="/management/control" :active-class="'isActive'">我的桌面</router-link>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">数据报表</template>
              <el-menu-item index="1-1">
                <router-link to="/management/viewReportForm" :active-class="'isActive'">查看报表</router-link>
              </el-menu-item>
              <el-menu-item index="1-2">
                <router-link to="/management/reportForm" :active-class="'isActive'">编辑报表</router-link>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </div>
      <transition
        name="fade"
        enter-active-class="animated  faster fadeIn"
        leave-active-class="animated  faster fadeOut"
      >
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  beforeRouteEnter(to, from, next) {
    if (sessionStorage.userInfo) {
      if (
        UserInfo.JobAndCompetence.includes("000")||UserInfo.JobAndCompetence.includes("100")
      ) {
        next();
      } else {
        next(from.path);
        VueVm.$message({
          type: "warning",
          message: "您没有控制台模块访问权限！",
          center: true,
          duration: 2000,
          showClose: true
        });
      }
    } else {
      next("/login");
    }
  },
  created() {
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    handleChange(val) {
      console.log(val);
    },
    handleSelect(key, keyPath) {
      console.log(key);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableHead";
#cssd_table.management {
  input:focus {
    border-color: #00c16b;
  }
  .el-menu-item,
  .el-submenu {
    min-width: auto;
  }
  width: 100%;
  height: 100%;
  padding-top: 40px;
  box-sizing: border-box;
  position: relative;
  .basic_head {
    height: 40px;
    background: #0d202c;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    color: #fff;
    font-family: Microsoft YaHei;
    p {
      margin-left: 40px;
      font-size: 16px;
      font-weight: bold;
    }
    .head_user {
      margin-right: 40px;
    }
  }
  .basic_content {
    position: relative;
    width: 100%;
    height: 100%;
    padding-left: 240px;
    box-sizing: border-box;
    .basic_nav {
      position: absolute;
      left: 0;
      top: 0;
      width: 250px;
      height: 100%;
      z-index: 1;
      .basic_menu_box {
        background: url("../../assets/images/background.png") repeat-y;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        width: 100%;

        .el-menu {
          background-color: transparent;
          border: 0;
          .el-submenu {
            position: relative;
            width: 240px;
            background-image: url("../../assets/images/arrow_white.png");
            background-repeat: no-repeat;
            background-position: 200px 28px;
            &.is-opened {
              background-image: url("../../assets/images/arrow_white_flip.png");
            }
            .el-submenu__title {
              line-height: 60px;
              height: 60px;
              font-size: 20px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(255, 255, 255, 1);
              &:hover {
                background-color:transparent;
              }
              .el-submenu__icon-arrow {
                display: none;
              }
            }
            .el-menu-item{
              height: 40px;
              a{
                line-height: 40px;
              }
            }
          }
          .el-menu-item {
            padding: 0 !important;
            min-width: auto;
            height: 60px;
            &:focus,
            &:hover {
              background-color: transparent;
            }
            a {
              padding-left: 40px;
              display: block;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              font-size: 20px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(255, 255, 255, 1);
              line-height: 60px;
              &.isActive {
                background: #00c16b;
                width: 250px;
                border-radius: 0px 4px 4px 0px;
              }
            }
          }
        }
        > .el-menu {
          > .el-menu-item {
            a {
              padding-left: 20px;
            }
          }
        }
      }
    }
  }
}
//组件的样式
.basic_main {
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 30px 40px;
  .basic_main_head {
    height: 40px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .basic_ipt_search {
      width: 160px;
      input {
        font-size: 16px;
        font-family: Microsoft YaHei;
        color: #232e41;
        font-weight: bold;
      }
    }
    .basic_ipt_add {
      width: 120px;
      height: 40px;
      background: #00c16b;
      color: #fff;
      border: 0;
      font-size: 18px;
      font-family: Microsoft YaHei;
      color: rgba(255, 255, 255, 1);
    }
    .el-button--default{
      width: 120px;
      height: 40px;
      background: #fff;
      color: #fff;
      border: 1px solid #00c16b;
      font-size: 18px;
      font-family: Microsoft YaHei;
      color: #00c16b;
    }
  }
  .basic_table.table_unExpand {
    .el-table {
      font-size: 18px;
      font-family: Microsoft YaHei;
      th {
        color: rgba(135, 141, 159, 1);
        height: 60px;
        background: rgba(247, 248, 250, 1);
        &:nth-child(1) {
          div {
            padding-left: 40px;
          }
        }
      }
      tbody {
        color: rgba(35, 46, 65, 1);
        tr {
          height: 65px;
          &:hover {
            > td {
              background: transparent;
            }
          }
          td {
            &:nth-child(1) {
              > div {
                padding-left: 40px;
              }
            }
            .cell {
              overflow: visible;
              font-size: 18px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(35, 46, 65, 1);
              .el-input-number {
                width: 40px;
                height: 24px;
                .el-input {
                  width: 100%;
                  height: 100%;
                  input {
                    padding: 0;
                    &:focus {
                      border-color: rgba(0, 193, 107, 1);
                    }
                  }
                }
              }
              a {
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                cursor: pointer;
              }
              .change_this_tr {
                color: #00c16b;
                margin-right: 20px;
              }
              .delete_this_tr {
                color: #f93e3e;
              }
            }
          }
        }
      }
    }
  }
  #editBox {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background:rgba(51,51,51,0.6);
    z-index: 2;
    .editContainer {
      position: absolute;
      z-index: 2;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 1214px;
      height: 700px;
      border-radius: 8px;
      background: #fff;
      padding-bottom: 60px;
      box-sizing: border-box;
      .editContent {
        overflow-y: scroll;
        height: 100%;
        box-sizing: border-box;
        .el-textarea {
          position: relative;
          width:456px;
          height: 40px;
          textarea {
            height: 40px;
            min-height: 40px !important;
            resize: none;
            padding: 5px 15px 5px;
          }
          .el-input__count{
            line-height: 36px;
            bottom: 2px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: normal;
            color: #C4C9D1;
          }
        }
        > ul {
          padding: 0 0px 20px 30px;
          li {
            float: left;
            width: 266px;
            display: flex;
            margin: 20px 30px 0 0;
            justify-content: space-between;
            &.textareaBox{
              width: 562px;
            }
            p {
              width: 96px;
              text-align: left;
              line-height: 40px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: right;
              font-size: 16px;
              font-family: Microsoft YaHei;
              color: rgba(135, 141, 159, 1);
            }
            .el-input,
            .el-input-number,
            > div,
            .el-select,
            .el-date-editor {
              width: 160px;
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(51, 51, 51, 1);
              line-height: 40px;
              input::-webkit-input-placeholder {
                font-weight: normal;
              }
            }
            .el-input-number{
              input{
                padding: 0 9px;
              }
            }
            .el-date-editor {
              input {
                padding: 0 10px 0 30px;
              }
            }
            .el-textarea {
              textarea {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
                &::-webkit-input-placeholder {
                  font-weight: normal;
                }
              }
            }
            .el-cascader {
              .el-input {
                position: relative;
                &.is-focus {
                  &::after {
                    transform: rotate(-180deg);
                  }
                }
                &::after {
                  content: "";
                  position: absolute;
                  right: 10px;
                  top: 15px;
                  width: 24px;
                  height: 13px;
                  background: url("../../assets/images/arrow_green24x13.png") no-repeat;
                  background-size: 24px 13px;
                }
                .el-input__suffix {
                  display: none;
                }
              }
              .el-cascader__label {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
              }
            }
          }
        }
      }
      .editBoxOption {
        box-sizing: border-box;
        position: absolute;
        left: 0;
        bottom: 0;
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        box-shadow: 0px 0px 20px 0px rgba(0, 54, 125, 0.2);
        justify-content: flex-end;
        .el-button--primary {
          width: 150px;
          height: 40px;
          background: rgba(0, 193, 107, 1);
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          border: 0;
          margin: 0 40px 0 0;
        }
        .el-button--default {
          border: 0;
          color: #00c16b;
          font-size: 20px;
          font-family: Microsoft YaHei;
          margin-right: 40px;
          &:hover {
            background: transparent;
          }
        }
      }
    }
  }
}
</style>