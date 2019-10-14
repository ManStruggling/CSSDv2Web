<template>
  <div class="cssd_box CleanCheckRecordChange">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/package/cleanCheckRecord" tag="li">
          <p>返回</p>
        </router-link>
      </ul>
    </div>
    <div class="cssd_table_center">
      <div class="table_box">
        <div class="checkStatusBox">
          <p>清洗审核结果:</p>
          <el-select v-model="data.CleanReviewResult" filterable allow-create disabled>
            <el-option label="合格" :value="2"></el-option>
            <el-option label="不合格" :value="3"></el-option>
            <el-option label="部分合格" :value="4"></el-option>
          </el-select>
        </div>
        <ul class="clear_float">
          <li>
            <p>清洗开始时间 :</p>
            <span>{{data.CleanStartTime}}</span>
          </li>
          <li>
            <p>清洗结束时间 :</p>
            <span>{{data.CleanEntTime}}</span>
          </li>
          <li>
            <p>清洗人 :</p>
            <span>{{data.Cleaner}}</span>
          </li>
          <li>
            <p>清洗设备 :</p>
            <span>{{data.CleanDeviceModel}}</span>
          </li>
          <li>
            <p>清洗程序 :</p>
            <span>{{data.CleanDeviceModelProgram}}</span>
          </li>
        </ul>
        <el-table :data="[{}]" style="width: 100%">
          <el-table-column prop label="器械及器皿">
            <el-table-column prop label="表面">
              <el-input-number v-model="data.CleaningQualityRecord.Surface" :min="0" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'Surface')})"></el-input-number>
            </el-table-column>
            <el-table-column prop label="关节">
              <el-input-number v-model="data.CleaningQualityRecord.Joint" :min="0" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'Joint')})"></el-input-number>
            </el-table-column>
            <el-table-column prop label="齿牙">
              <el-input-number v-model="data.CleaningQualityRecord.Tooth" :min="0" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'Tooth')})"></el-input-number>
            </el-table-column>
            <el-table-column prop label="器皿">
              <el-input-number v-model="data.CleaningQualityRecord.Ware" :min="0" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'Ware')})"></el-input-number>
            </el-table-column>
          </el-table-column>
          <el-table-column label="清洗质量">
            <el-table-column prop label="血渍">
              <el-input-number v-model="data.CleaningQualityRecord.BloodStain" :min="0" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'BloodStain')})"></el-input-number>
            </el-table-column>
            <el-table-column prop label="污渍">
              <el-input-number v-model="data.CleaningQualityRecord.Stains" :min="0" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'Stains')})"></el-input-number>
            </el-table-column>
            <el-table-column prop label="锈迹">
              <el-input-number v-model="data.CleaningQualityRecord.RustStain" :min="0" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'RustStain')})"></el-input-number>
            </el-table-column>
          </el-table-column>
          <el-table-column label="质量卡记录">
            <!-- 0未选 1通过 2未通过 -->
            <el-radio v-model="data.CleaningQualityRecord.CleaningQualityCard" :label="1">通过</el-radio>
            <el-radio v-model="data.CleaningQualityRecord.CleaningQualityCard" :label="2">不通过</el-radio>
          </el-table-column>
          <el-table-column label="备注">
            <el-input type="textarea" v-model="data.CleaningQualityRecord.Remark"></el-input>
          </el-table-column>
        </el-table>

      </div>
      <div class="cssd_table_bottom">
        <el-button @click="cancelChange">取消修改</el-button>
        <el-button @click="changeComplete">修改完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        CleaningQualityRecord: {}
      }
    };
  },
  created() {
    if (this.$route.query.recordId) {
      axios({
        url: `/api/Clean/GetPendingUpdateCleanReviewRecord/${this.$route.query.recordId}`
      })
        .then(res => {
          if (res.data.Code == 200) {
            this.data = res.data.Data;
          } else {
            this.showInformation({classify:"message",msg:res.data.Msg});
          }
        })
        .catch(err => {});
    }
  },
  methods: {
    //el-input-number change事件
    handleNumberChange(newValue,oldValue,origin){
      if(newValue==undefined){
        setTimeout(() => {
          this.data.CleaningQualityRecord[origin] = 0;
        }, 0);
      }
    },
    //取消修改
    cancelChange() {
      this.$router.push({ path: "/package/cleanCheckRecord" });
    },
    //修改完成
    changeComplete() {
      if(this.data.CleanReviewResult==4){
        if(!this.GLOBAL.VerificationHandle([{val:this.data.FailedCarriersId,type:'ArrayNotEmpty',msg:'您的审核结果为部分不合格！请至少添加一个不合格网篮！'}])){
          return;
        }
      }
      axios({
        url: "/api/Clean/CleanReviewModify",
        method: "POST",
        data: this.data
      })
        .then(res => {
          let type;
          if (res.data.Code == 200) {
            type='success';
            this.$router.push({ path: "/package/cleanCheckRecord" });
          } else {
            type='error';
          }
          this.showInformation({classify:"message",msg:res.data.Msg,type: type});
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
.CleanCheckRecordChange {
  .cssd_table_center {
    .table_box {
      padding: 40px 20px 0;
      height: 100%;
      box-sizing: border-box;
      overflow-y: scroll;
      .checkStatusBox{
        display: flex;
      }
      th,
      td {
        text-align: center;
      }
      .myTableTitle {
        display: flex;
        text-align: center;
        p {
          flex: 1;
        }
      }
      ul {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        li {
          display: flex;
          text-align: center;
          margin: 20px 50px;
          p {
            flex: 1;
            width: 120px;
          }
        }
      }
      .el-table {
        tbody {
          .table_option {
            a {
              cursor: pointer;
              margin: 0 10px;
            }
            .editThisRow {
            }
            .deleteThisRow {
              color: red;
            }
          }
        }
      }
    }
    .cssd_table_bottom {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>