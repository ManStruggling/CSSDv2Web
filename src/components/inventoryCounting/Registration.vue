<template>
  <div class="cssd_box" id="inventory_counting">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/" tag="li">
          <p>返回</p>
        </router-link>
        <li @click="handleShowManualEnter">
          <p>手工录入</p>
        </li>
        <router-link to="/inventoryCounting/disposableProduct" tag="li">
          <p>一次性物品盘库</p>
        </router-link>
        <router-link to="/inventoryCounting/record" tag="li">
          <p>盘库记录</p>
        </router-link>
      </ul>
      <div class="cssd_title_right">
        <p>
          <span>盘库科室</span>
          <el-select v-model="submitData.SubClinicId" class="white24x13">
            <el-option
              v-for="(item,index) in clinicList"
              :key="index"
              :label="item.SubClinicName"
              :value="item.SubClinicId"
            ></el-option>
          </el-select>
        </p>
      </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
      <div class="table_box">
        <el-table :data="submitData.Packages">
          <el-table-column width="240" label="包名称" prop="ProductName" show-overflow-tooltip></el-table-column>
          <el-table-column width="210" label="包条码" prop="BarCode"></el-table-column>
          <el-table-column width="210" label="操作">
            <template slot-scope="props">
              <a @click="deletePackage(props.$index)">删除</a>
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </div>
      <div class="cssd_table_bottom">
        <p>
          共计
          <span>{{submitData.Packages.length}}</span> 包
        </p>
        <p>
          <el-button type="primary" round @click="submitComplete">盘库完成</el-button>
        </p>
      </div>
    </div>
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 手工录入 -->
      <ManualEnter
        v-if="isShowManualEnter"
        @to-father="packageData2father"
        :ApiUrl="'/api/Scanner/CheckInventory'"
        :BarCodeList="submitData.Packages"
      ></ManualEnter>
    </transition>
  </div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
export default {
  props: {
    UserInfo: Object
  },
  inject: ["reload"],
  data() {
    return {
      isShowManualEnter: false,
      submitData: {
        SubClinicId: "",
        Packages: []
      },
      clinicList: []
    };
  },
  components: {
    ManualEnter
  },
  created() {
    CSManager.handleDataThis = this;
    axios({
      url: `/api/Clinic/SubClinicsBy/${this.UserInfo.ClinicId}`
    })
      .then(res => {
        if (res.data.Code == 200) {
          this.clinicList = res.data.Data;
          if (this.clinicList.length === 1) {
            this.submitData.SubClinicId = this.clinicList[0].SubClinicId;
          }
        } else {
          this.showInformation({
            classify: "message",
            msg: res.data.Msg
          });
        }
      })
      .catch(err => {});
  },
  mounted() {},
  beforeDestroy() {
    CSManager.handleDataThis = null;
  },
  methods: {
    //删除包
    deletePackage(index) {
      this.showInformation({
        classify: "confirm",
        msg: "您确定要删除该包?",
        confirmCallBack: () => {
          this.submitData.Packages.splice(index, 1);
        },
        cancelCallBack: () => {}
      });
    },
    //提交完成
    submitComplete() {
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.submitData.SubClinicId,
            type: "StringNotEmpty",
            msg: "请选择盘库科室！"
          },
          {
            val: this.submitData.Packages,
            type: "ArrayNotEmpty",
            msg: "至少扫入一个包！"
          }
        ])
      ) {
        axios({
          url: `/api/Inventory/CheckInventory`,
          method: "POST",
          data: this.submitData
        })
          .then(res => {
            let type;
            if (res.data.Code == 200) {
              type = "success";
              this.reload();
            } else {
              type = "error";
            }
            this.showInformation({
              classify: "message",
              msg: res.data.Msg,
              type: type
            });
          })
          .catch(err => {});
      }
    },
    //处理手工录入
    handleShowManualEnter() {
      this.isShowManualEnter = true;
    },
    //手工录入与父组件的通信
    packageData2father(data) {
      this.isShowManualEnter = false;
      if (data) {
        this.submitData.Packages.push(data);
      }
    },
    //处理扫描枪条码
    handleBarCode(msg) {
      for (let i = 0; i < this.submitData.Packages.length; i++) {
        if (this.submitData.Packages.BarCode == msg) {
          this.showInformation({
            classify: "message",
            msg: "该条码已录入！",
            type: "warning"
          });
          return;
        }
      }
      axios({
        url: `/api/Scanner/CheckInventory/${msg}`
      })
        .then(res => {
          if (res.data.Code == 200) {
            this.packageData2father(res.data.Data);
          } else {
            this.showInformation({
              classify: "message",
              msg: res.data.Msg
            });
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#inventory_counting {
  .cssd_title_right {
    p {
      .el-select {
        width: 200px;

        .el-input {
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(208, 212, 218, 1);

          input {
            color: #fff;
          }
        }
      }
    }
  }

  .cssd_table_center {
    overflow: hidden;

    .table_box {
      padding: 30px 40px;
      height: 100%;
      box-sizing: border-box;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 10px;
      }

      .el-table {
        tbody {
          .cell {
            font-size: 18px;
            color: #232e41;
            font-weight: bold;

            a {
              cursor: pointer;
              color: #f93e3e;
              font-weight: bold;
            }
          }
        }
      }
    }

    .cssd_table_bottom {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
