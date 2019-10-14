<template>
  <div class="cssd_box" id="unqualifiedPackageRegistration">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
        <li @click="handleShowManualEnter">
          <p>手工录入</p>
        </li>
        <router-link to="/apply/unqualifiedRecord" tag="li" v-if="!isChangeMode">
          <p>登记记录</p>
        </router-link>
      </ul>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
      <div class="table_box">
        <el-table :data="packages.FailedPackages">
          <el-table-column label="包条码" prop="BarCode" width="240"></el-table-column>
          <el-table-column label="包名称" prop="ProductName" width="210"></el-table-column>
          <el-table-column label="不合格原因" width="210">
            <template slot-scope="props">
              <el-select v-model="props.row.FailedPackageCause" class="green18x10">
                <el-option label="包内卡不合格" :value="0" width="210"></el-option>
                <el-option label="湿包" :value="1"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="照片" width="210">
            <template slot-scope="props">
              <a @click="handleShowPhotos(props.$index)">拍照</a>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="210">
            <template slot-scope="props">
              <el-button @click="deletePackage(props.$index)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </div>
      <div class="cssd_table_bottom">
        <p>
          共计
          <span>{{countPackageNumber(packages.FailedPackages)}}</span> 包
        </p>
        <p>
          <el-button @click="cancelChange" v-if="isChangeMode">取消修改</el-button>
          <el-button type="primary" @click="registrationComplete">{{isChangeMode?'修改完成':'登记完成'}}</el-button>
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
        :BarCodeList="packages.FailedPackages"
        :ApiUrl="'/api/Scanner/Apply'"
      ></ManualEnter>
    </transition>
    <!-- 照片 -->
    <transition
      name="fade"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <!-- 拍照 -->
      <PhotoView v-if="isShowPhoto" @viewPhoto-to-father="viewPhotoToFather" :data="photoData" :DeletedPicturesId="deleteIds"></PhotoView>
    </transition>
  </div>
</template>

<script>
import ManualEnter from "../common/ManualEnter";
import PhotoView from "../common/PhotoView";
export default {
  data() {
    return {
      deleteIds:[],
      isShowPhoto: false, //照片
      isShowManualEnter: false, //手工录入
      isChangeMode: false, //修改
      photoData: [],
      packages: {
        FailedPackages: []
      }
    };
  },
  components: {
    ManualEnter,
    PhotoView
  },
  created() {
    CSManager.handleDataThis = this;
    if (this.$route.query.recordId) {
      this.isChangeMode = true;
      axios({
        url: `/api/FailedPackage/PendingUpdatePackagesBy/${this.$route.query.recordId}`
      })
        .then(res => {
          if (res.data.Code == 200) {
            this.packages = res.data.Data;
          } else {
            this.showInformation({ classify: "message", msg: res.data.Msg });
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
  },
  beforeDestroy() {
    CSManager.handleDataThis = null;
  },
  methods: {
    viewPhotoToFather() {
      this.isShowPhoto = false;
    },
    handleShowPhotos(index) {
      this.photoData = this.packages.FailedPackages[
        index
      ].FailedPackagePictures;
      this.deleteIds = this.packages.FailedPackages[index].DeletedPicturesId;
      this.isShowPhoto = true;
    },
    //返回
    goBack() {
      if (this.isChangeMode) {
        this.$router.push("/apply/unqualifiedRecord");
      } else {
        this.$router.push("/");
      }
    },
    //取消修改
    cancelChange() {
      this.$router.push("/apply/unqualifiedRecord");
    },
    //删除包
    deletePackage(index) {
      this.packages.FailedPackages.splice(index, 1);
    },
    //登记完成
    registrationComplete() {
      let method = "POST";
      let url = "/api/FailedPackage/FailedPackageRegister";
      if (this.isChangeMode) {
        method = "PUT";
        url = "/api/FailedPackage/FailedPackageModify";
      }
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.packages.FailedPackages,
            type: "ArrayNotEmpty",
            msg: "您还没有录入不合格包，请至少添加一个不合格包！"
          }
        ])
      ) {
        axios({ url: url, method: method, data: this.packages })
          .then(res => {
            let type;
            if (res.data.Code == 200) {
              type = "success";
              if (this.isChangeMode) {
                this.$router.push("/apply/unqualifiedRecord");
              } else {
                this.$router.go(0);
              }
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
    //手工录入数据传递
    packageData2father(data) {
      this.isShowManualEnter = false;
      if (data) {
        data.FailedPackageCause = 0;
        this.packages.FailedPackages.push(data);
      }
    },
    handleBarCode(msg){
      let onOff = true;
      this.packages.FailedPackages.forEach(item => {
        //发现已录入
        if (item.BarCode == msg.toUpperCase()) {
          this.showInformation({classify:"message",msg:"该条码已录入！",type: "warning"});
          onOff = false;
          return;
        }
      });
      if(onOff){
        axios({url:`/api/Scanner/Apply/${msg}`}).then(res=>{
          if(res.data.Code==200){
            this.packageData2father(res.data.Data);
          }else{
            this.showInformation({classify:"message",msg:res.data.Msg});
          }
        }).catch(err=>{})
      }
    }
  },
  computed: {
    countPackageNumber() {
      return list => {
        return list.length;
      };
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";
#unqualifiedPackageRegistration {
  .cssd_table_center {
    padding: 30px 40px;
    height: 100%;
    overflow-y: scroll;
    box-sizing: border-box;
    .el-table {
      tbody {
        tr:hover{
          td{
            background-color: transparent;
          }
        }
        .cell {
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(35, 46, 65, 1);
          .el-select {
            width: 160px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            .el-input {
              font: inherit;
              input {
                padding: 0 15px 0 10px;
              }
            }
          }
          a{
            cursor: pointer;
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #00C16B;
          }
          .el-button {
            border: 0;
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(249, 62, 62, 1);
            &:hover {
              background: none;
            }
          }
        }
      }
    }
  }
}
</style>