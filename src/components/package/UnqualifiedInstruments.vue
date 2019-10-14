<template>
  <div id="unqualifiedInstrument">
    <div class="container">
      <h5 class="left">总数:{{cleanQuality.Surface+cleanQuality.Joint+cleanQuality.Tooth+cleanQuality.Ware}}</h5>
      <h6 class="right">总数:{{cleanQuality.Stains+cleanQuality.BloodStain+cleanQuality.RustStain}}</h6>
      <el-table :data="[{}]" :border="false" max-height="162">
        <el-table-column prop>
          <div slot="header">
            <div class="mainTitle">
              器械及器皿
            </div>
          </div>
          <el-table-column prop label="表面" width="100">
            <el-input-number v-model="cleanQuality.Surface" :min="0" :max="999" :controls="false" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'Surface')})"></el-input-number>
          </el-table-column>
          <el-table-column prop label="关节" width="100">
            <el-input-number v-model="cleanQuality.Joint" :min="0" :max="999" :controls="false" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'Joint')})"></el-input-number>
          </el-table-column>
          <el-table-column prop label="齿牙" width="100">
            <el-input-number v-model="cleanQuality.Tooth" :min="0" :max="999" :controls="false" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'Tooth')})"></el-input-number>
          </el-table-column>
          <el-table-column prop label="器皿" width="100">
            <el-input-number v-model="cleanQuality.Ware" :min="0" :max="999" :controls="false" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'Ware')})"></el-input-number>
          </el-table-column>
        </el-table-column>
        <el-table-column>
          <div slot="header">
            <div class="mainTitle">
              清洗质量
            </div>
          </div>
          <el-table-column prop label="血渍" width="100">
            <el-input-number
              v-model="cleanQuality.BloodStain"
              :controls="false"
              :min="0"
              :max="999"
               @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'BloodStain')})"
            ></el-input-number>
          </el-table-column>
          <el-table-column prop label="污渍" width="100">
            <el-input-number v-model="cleanQuality.Stains" :controls="false" :min="0" :max="999" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'Stains')})"></el-input-number>
          </el-table-column>
          <el-table-column prop label="锈迹" width="100">
            <el-input-number v-model="cleanQuality.RustStain" :controls="false" :min="0" :max="999" @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,'RustStain')})"></el-input-number>
          </el-table-column>
        </el-table-column>
      </el-table>
      <p>
        <el-button class="btn88x32empty" @click="cancel">取消</el-button>
        <el-button type="primary" class="btn88x32" @click="comfirm">确认</el-button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cleanQuality: {
        BloodStain: 0,
        Joint: 0,
        RustStain: 0,
        Stains: 0,
        Surface: 0,
        Tooth: 0,
        Ware: 0
      }
    };
  },
  props: ["data", "carrierIndex", "packageIndex", "instrumentIndex", "maxNum"],
  created() {
    this.cleanQuality = Object.assign({}, this.$props.data);
  },
  methods: {
    //取消
    cancel() {
      this.$emit("UnqualifiedInstruments-to-father");
    },
    //确认
    comfirm() {
      if (
        this.cleanQuality.Surface +
          this.cleanQuality.Joint +
          this.cleanQuality.Tooth +
          this.cleanQuality.Ware >
          this.$props.maxNum ||
        this.cleanQuality.BloodStain +
          this.cleanQuality.Stains +
          this.cleanQuality.RustStain >
          this.$props.maxNum ||
        this.cleanQuality.Surface +
          this.cleanQuality.Joint +
          this.cleanQuality.Tooth +
          this.cleanQuality.Ware !=
          this.cleanQuality.BloodStain +
            this.cleanQuality.Stains +
            this.cleanQuality.RustStain
      ) {
        this.showInformation({
          classify: "message",
          msg:
            "<div style='text-align:center;'>填写数字有误！请重新填写！</br>“器械及器皿数”=“清洗质量数”≤“器械总数”</div>",
          dangerouslyUseHTMLString: true
        });
        return;
      }
      this.$emit("UnqualifiedInstruments-to-father", {
        data: this.cleanQuality,
        carrierIndex: this.$props.carrierIndex,
        packageIndex: this.$props.packageIndex,
        instrumentIndex: this.$props.instrumentIndex
      });
    },
    handleNumberChange(newValue,oldValue,origin){
      if(newValue==undefined){
        setTimeout(() => {
          this.cleanQuality[origin]=0;
        }, 0);
      }
    }
  },
};
</script>

<style lang="scss">
#unqualifiedInstrument {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: rgba(51, 51, 51, 0.6);
  z-index: 2;
  .container {
    width: 761px;
    height: 274px;
    background: #fff;
    padding: 30px 30px 20px;
    box-sizing: border-box;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    h5,h6{
      font-size:14px;
      font-family:Microsoft YaHei;
      color:rgba(135,141,159,1);
      line-height: 24px;
      position: absolute;
      top: 44px;
      z-index: 1;
    }
    h5{
      left: 140px;
    }
    h6{
      right: 195px;
    }
    h6{

    }
    .el-table {
      thead {
        tr {
          &:first-child {
            .cell {
              padding: 0;
              height: 24px;
              line-height: 24px;
              font-size: 14px;
              > div {
                padding: 0;
                .mainTitle {
                  line-height: 24px;
                  padding: 0;
                  text-indent: 0;
                }
              }
            }
          }
          th {
            background: #fff;
            .cell {
              font-size: 18px;
              font-family: Microsoft YaHei;
              color: rgba(135, 141, 159, 1);
              text-indent: 10px;
            }
          }
        }
      }
      tbody {
        td {
          padding: 0;
          height: 65px;
          .cell {
            height: 100%;
            padding: 0;
            .el-input-number {
              height: 100%;
              width: 100%;
              .el-input {
                height: 100%;
                input {
                  height: 100%;
                  border: 0;
                  text-indent: 20px;
                  font-size: 18px;
                  font-family: Microsoft YaHei;
                  font-weight: bold;
                  color: rgba(35, 46, 65, 1);
                }
              }
            }
          }
        }
      }
    }
    p {
      text-align: center;
      .el-button--default {
        margin-right: 15px;
      }
      .el-button--primary {
        margin-left: 15px;
      }
    }
  }
}
</style>