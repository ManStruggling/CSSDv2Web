<template>
  <!-- 组件的样式 -->
  <div id="cssd_table">
    <!-- 页头 -->
    <div class="head_box">
      <router-link
        to="/"
        tag="p"
      >{{UserInfo.Configuration.Company?UserInfo.Configuration.Company.Name:'上海倍而纳医疗器械科技有限公司'}}</router-link>
      <div class="head_user">
        <p>{{UserInfo.ClinicName}}</p>
        <p>{{UserInfo.UserName}}</p>
        <a @click="GLOBAL.logOut" class="logOut"></a>
      </div>
    </div>
    <div :class="{basic_content:true,displayNav:displayNav}">
      <!-- 侧导航 -->
      <transition
        name="slide"
        enter-active-class="animated slideInLeft"
        leave-active-class="animated slideOutLeft"
        :duration="{enter:5000,leave:1000}"
      >
        <div class="basic_nav" v-show="displayNav">
          <div class="basic_menu_box">
            <el-menu
              class="el-menu-demo"
              mode="vertical"
              @select="handleSelect"
              :unique-opened="true"
              :default-openeds="openedArr"
            >
              <div v-for="(item,index) in navData" :key="index">
                <el-submenu v-if="item.isHasSubmenu" :index="index+''">
                  <template slot="title">{{item.label}}</template>
                  <el-menu-item v-for="(val,idx) in item.children" :key="idx" :index="val.index">
                    <router-link :to="val.href" :active-class="'isActive'">{{val.label}}</router-link>
                  </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="index+''">
                  <router-link
                    :to="item.href"
                    :active-class="'isActive'"
                    :class="'sub-item'"
                  >{{item.label}}</router-link>
                </el-menu-item>
              </div>
            </el-menu>
            <div class="shrinkNavBox">
              <div class="border_div"></div>
              <i @click="displayNav=!displayNav" class="el-icon-d-arrow-left"></i>
            </div>
          </div>
        </div>
      </transition>
      <div class="expandNavBox" @click="displayNav=!displayNav"></div>
      <router-view :UserInfo="UserInfo"></router-view>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
export default {
  data() {
    return {
      displayNav: true,
      openedArr: [],
      navData: [
        {
          label: "产品",
          isHasSubmenu: true,
          children: [
            {
              label: "追溯的无菌包",
              index: "80",
              href: "/dataSource/product/80"
            },
            {
              label: "外来器械包",
              index: "81",
              href: "/dataSource/product/81"
            },
            {
              label: "高水平消毒包",
              index: "82",
              href: "/dataSource/product/82"
            },
            {
              label: "追溯的辅料包",
              index: "83",
              href: "/dataSource/product/83"
            },
            {
              label: "一次性物品",
              index: "84",
              href: "/dataSource/disposable"
            },
            {
              label: "代消包",
              index: "85",
              href: "/dataSource/product/85"
            }
          ]
        },
        {
          label: "包组成",
          isHasSubmenu: true,
          children: [
            {
              label: "器械",
              index: "0",
              href: "/dataSource/instrument"
            },
            {
              label: "原料",
              index: "1",
              href: "/dataSource/material"
            },
            {
              label: "外包装",
              index: "2",
              href: "/dataSource/externalPackage"
            }
          ]
        },
        {
          label: "网篮",
          isHasSubmenu: true,
          children: [
            {
              label: "清洗网篮",
              index: "0",
              href: "/dataSource/carrier/0"
            },
            {
              label: "灭菌网篮",
              index: "1",
              href: "/dataSource/carrier/1"
            },
            {
              label: "单包网篮",
              index: "3",
              href: "/dataSource/carrier/3"
            }
          ]
        },
        {
          label: "生产商",
          isHasSubmenu: true,
          children: [
            {
              label: "设备",
              index: "0",
              href: "/dataSource/producer/0"
            }
          ]
        },
        {
          label: "供应商",
          isHasSubmenu: true,
          children: [
            {
              label: "设备",
              index: "0",
              href: "/dataSource/supplier/0"
            },
            {
              label: "外来器械",
              index: "1",
              href: "/dataSource/supplier/1"
            }
          ]
        },
        {
          label: "设备",
          isHasSubmenu: true,
          children: [
            {
              label: "灭菌设备",
              index: "0",
              href: "/dataSource/device/0"
            },
            {
              label: "清洗设备",
              index: "1",
              href: "/dataSource/device/1"
            }
          ]
        },
        {
          label: "车辆",
          isHasSubmenu: true,
          children: [
            {
              label: "污车",
              index: "0",
              href: "/dataSource/car/0"
            },
            {
              label: "洁车",
              index: "1",
              href: "/dataSource/car/1"
            }
          ]
        },
        {
          label: "排班班种",
          isHasSubmenu: true,
          children: [
            {
              label: "常日班",
              index: "0",
              href: "/dataSource/period/0"
            },
            {
              label: "休假",
              index: "1",
              href: "/dataSource/period/1"
            },
            {
              label: "备班",
              index: "2",
              href: "/dataSource/period/2"
            }
          ]
        },
        {
          label: "耗材",
          isHasSubmenu: true,
          children: [
            {
              label: "产品",
              index: "0",
              href: "/dataSource/consumableProduct"
            },
            {
              label: "请领部门",
              index: "1",
              href: "/dataSource/receiveDepartment"
            }
          ]
        },
        {
          label: "工作区域",
          isHasSubmenu: false,
          href: "/dataSource/workArea"
        },
        {
          label: "科室",
          isHasSubmenu: false,
          href: "/dataSource/clinic"
        },
        {
          label: "员工",
          isHasSubmenu: false,
          href: "/dataSource/staff"
        },
        {
          label: "失败原因",
          isHasSubmenu: false,
          href: "/dataSource/failedCause"
        },
        {
          label: "物流人员",
          isHasSubmenu: false,
          href: "/dataSource/logisticsStaff"
        }
      ]
    };
  },
  //路由前置守卫
  beforeRouteEnter(to, from, next) {
    if (sessionStorage.userInfo) {
      if (
        UserInfo.JobAndCompetence.includes("000") ||
        UserInfo.JobAndCompetence.includes("100")
      ) {
        next();
      } else {
        next(from.path);
        VueVm.$message({
          type: "warning",
          message: "您没有基础资料模块访问权限！",
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
    for (let i = 0; i < this.navData.length; i++) {
      if (this.navData[i].isHasSubmenu) {
        for (let j = 0; j < this.navData[i].children.length; j++) {
          if (this.$route.path === this.navData[i].children[j].href) {
            this.openedArr.splice(0, 1, i + "");
            return;
          }
        }
      }
    }
  },
  methods: {
    handleSelect(key, keyPath) {}
  },
  computed: {
    ...mapState({
      UserInfo: state => state.UserInfo
    })
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableHead";

#cssd_table {
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
    box-sizing: border-box;
    padding-left: 0;
    transition: padding 1s;

    &.displayNav {
      padding-left: 240px;
    }

    .basic_nav {
      position: absolute;
      left: 0;
      top: 0;
      width: 250px;
      height: 100%;
      z-index: 6;

      .basic_menu_box {
        background: #182b37;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        width: 100%;
        box-sizing: border-box;
        padding-bottom: 60px;

        &::after {
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 10px;
          background: #fff;
        }

        .el-menu {
          background-color: transparent;
          border: 0;
          position: relative;
          z-index: 3;
          height: 100%;

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
                background-color: transparent;
              }

              .el-submenu__icon-arrow {
                display: none;
              }
            }

            .el-menu-item {
              height: 40px;

              a {
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

              &.sub-item {
                padding-left: 20px;
              }
            }
          }
        }

        .shrinkNavBox {
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: 4;
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

    .expandNavBox {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 5;
    }
  }
}

//组件的样式
.basic_main {
  overflow-y: auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 30px 40px;

  &::-webkit-scrollbar {
    width: 10px;
  }

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

    p {
      &:last-child {
        display: flex;

        a {
          color: #00c16b;
          line-height: 40px;
          margin-right: 10px;
        }
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

    .importData {
      span {
        position: relative;
        height: 100%;
        display: block;
        cursor: pointer;

        &::after {
          position: absolute;
          content: "批量导入";
          left: 0;
          right: 0;
          margin: auto;
          line-height: 38px;
          cursor: pointer;
        }

        #fileUploader {
          opacity: 0;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          z-index: 1;
          cursor: pointer;
        }
      }
    }

    .el-button--default {
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
              overflow: hidden;
              font-size: 18px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: rgba(35, 46, 65, 1);
              &.el-tooltip{
                overflow: hidden;
              }

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
    background: rgba(51, 51, 51, 0.6);
    z-index: 7;

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
          width: 456px;
          height: 40px;

          textarea {
            height: 40px;
            resize: none;
            padding: 5px 15px 5px;
          }

          .el-input__count {
            line-height: 36px;
            bottom: 2px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: normal;
            color: #c4c9d1;
          }
        }

        > ul,
        .ul_form_style {
          padding: 0 0px 20px 30px;

          li {
            float: left;
            width: 266px;
            display: flex;
            margin: 20px 30px 0 0;
            justify-content: space-between;

            &.textareaBox {
              width: 562px;

              .el-textarea {
                width: 456px;
              }
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

            .el-input-number {
              input {
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
                  background: url("../../assets/images/arrow_green24x13.png")
                    no-repeat;
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

        ul.ul_form_style {
          padding: 0;
          display: flex;
          flex-wrap: wrap;
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
