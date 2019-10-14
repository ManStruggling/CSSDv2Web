<template>
  <div id="management">
    <div class="management_left">
      <div class="management_menu">
        <div class="management_logo">
          <i></i>
          <span>管理工作台</span>
        </div>
        <el-menu mode="vertical" :unique-opened="true" @select="handleSelect" class="platmenu">
          <!-- 控制台首页 -->
          <el-menu-item index="0">
            <router-link to="/management/control" :active-class="'isActive'">我的桌面</router-link>
          </el-menu-item>
          <!-- 数据报表 -->
          <el-submenu index="1">
            <template slot="title">数据报表</template>
            <el-menu-item index="1-1">
              <router-link to="/management/test" :active-class="'isActive'">查看报表</router-link>
            </el-menu-item>
            <el-menu-item index="1-2">
              <router-link to="/management/test" :active-class="'isActive'">编辑报表</router-link>
            </el-menu-item>
          </el-submenu>
          <!-- 库存管理 -->
          <el-submenu index="2">
            <template slot="title">库存管理</template>
            <el-menu-item index="2-1">
              <router-link to="/management/1" :active-class="'isActive'">库存管理</router-link>
            </el-menu-item>
          </el-submenu>
          <!-- 追溯管理 -->
          <el-submenu index="3">
            <template slot="title">追溯管理</template>
            <el-menu-item index="3-1">
              <router-link to="/management/2" :active-class="'isActive'">库存管理</router-link>
            </el-menu-item>
          </el-submenu>
          <!-- 日志管理 -->
          <el-submenu index="4">
            <template slot="title">日志管理</template>
            <el-menu-item index="4-1">
              <router-link to="/management/3" :active-class="'isActive'">日志管理</router-link>
            </el-menu-item>
          </el-submenu>
          <!-- 人员排班 -->
          <el-submenu index="5">
            <template slot="title">人员排班</template>
            <el-menu-item index="5-1">
              <router-link to="/management/4" :active-class="'isActive'">人员排班</router-link>
            </el-menu-item>
          </el-submenu>
          <!-- 基础资料管理 -->
          <el-submenu index="6">
            <template slot="title">基础资料管理</template>
            <el-menu-item index="6-1">
              <router-link to="/management/5" :active-class="'isActive'">基础资料管理</router-link>
            </el-menu-item>
          </el-submenu>
          <!-- 系统配置 -->
          <el-submenu index="7">
            <template slot="title">系统配置</template>
            <el-menu-item index="7-1">
              <router-link to="/management/6" :active-class="'isActive'">系统配置</router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="management_right">
      <div class="management_head"></div>
      <div class="management_content"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  beforeRouteEnter(to, from, next) {
    if (sessionStorage.userInfo) {
      if(UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')){
        next();
      }else{
        next(from.path);
        VueVm.$message({
          type:'warning',
          message:'您没有控制台模块访问权限！',
          center:true,
          duration:2000,
          showClose:true
        })    
      }
    } else {
      next("/login");
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="scss">
#management {
  height: 100%;
  .management_left {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 330px;
    z-index: 3;
    .management_menu {
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;
      position: relative;
      background: url("../../assets/images/platFormBackground.png") no-repeat;
      .management_logo {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 100px;
        margin: auto;
        display: flex;
        align-items: center;
        i {
          width: 30px;
          height: 30px;
          margin: 0 10px 0 65px;
        }
        span {
          font-size: 30px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #fff;
        }
      }
      .platmenu {
        width: 330px;
        background: url("../../assets/images/platFormBackground.png") no-repeat;
        height: 100%;
        overflow-y: scroll;
        border: 0;
        a {
          display: block;
          width: 320px;
          height: 100%;
          box-sizing: border-box;
          &.isActive {
            width: 330px;
            border-radius: 0 8px 8px 0;
            background: #00c16b;
          }
        }
        .el-menu-item {
          padding: 0 !important;
          &:hover {
            background: transparent;
          }
        }
        > .el-menu-item {
          height: 80px;
          line-height: 80px;
          font-size: 24px;
          a {
            color: #fff;
            padding-left: 112px;
            font-weight: bold;
          }
        }
        .el-submenu {
          width: 320px;
          background: url("../../assets/images/arrow_white.png") no-repeat;
          background-size: 18px 10px;
          background-position: 278px 32px;
          &.is-opened {
            background-image: url("../../assets/images/arrow_white_flip.png");
          }
          .el-submenu__title {
            color: rgba(255, 255, 255, 1);
            height: 80px;
            line-height: 80px;
            box-sizing: border-box;
            padding: 0 0 0 112px !important;
            font-size: 24px;
            font-weight: bold;
            &:hover {
              background: transparent;
            }
            .el-submenu__icon-arrow {
              display: none;
            }
          }
          .el-menu {
            background: transparent;
            .el-menu-item {
              height: 60px;
              line-height: 60px;
              a {
                padding-left: 132px;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
  .management_right {
    position: absolute;
    left: 320px;
    right: 0;
    top: 0;
    bottom: 0;
    .management_head {
      height: 100px;
      box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>