<template>
  <div id="FailedInstruments">
    <div class="container table_collapse table_unExpand">
      <div class="content_title">
        <p>器械名称</p>
        <p>规格</p>
        <p>不合格器械数</p>
      </div>
      <div class="content_box">
        <el-collapse accordion>
          <el-collapse-item
            v-for="(item,collapseIndex) in data"
            :key="collapseIndex"
            :name="collapseIndex+''"
          >
            <div slot="title" class="collapseTh">
              <div class="collapseTd">
                <p>{{item.InstrumentName}}</p>
              </div>
              <div class="collapseTd">
                <p>{{item.InstrumentSpecification}}</p>
              </div>
              <div class="collapseTd">
                <p>{{item.FailedCount}}</p>
              </div>
            </div>
            <el-table :data="item.CleanInstrumentRecord">
              <el-table-column prop label="器械及器皿">
                <el-table-column prop="Surface" label="表面" width="100"></el-table-column>
                <el-table-column prop="Joint" label="关节" width="100"></el-table-column>
                <el-table-column prop="Tooth" label="齿牙" width="100"></el-table-column>
                <el-table-column prop="Ware" label="器皿" width="100"></el-table-column>
              </el-table-column>
              <el-table-column label="清洗质量">
                <el-table-column prop="BloodStain" label="血渍" width="100"></el-table-column>
                <el-table-column prop="Stains" label="污渍" width="100"></el-table-column>
                <el-table-column prop="RustStain" label="锈迹" width="100"></el-table-column>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
      <span class="closeFailedPackages" @click="close"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["record_id"],
  data() {
    return {
      data: []
    };
  },
  created() {
    axios({
      url: `/api/Clean/CleanReviewFailedInstruments/${this.$props.record_id}`
    }).then(res => {
      if (res.data.Code == 200) {
        res.data.Data.forEach(element => {
          element.CleanInstrumentRecord = [element.CleanInstrumentRecord];
        });
        this.data = res.data.Data;
      } else {
        this.showInformation({ classify: "message", msg: res.data.Msg });
      }
    });
  },
  methods: {
    close() {
      this.$emit("to-father");
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableCollapse";
@import "../../assets/css/tableUnExpand";
#FailedInstruments {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: rgba(51, 51, 51, 0.6);
  z-index: 1;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    width: 767px;
    height: 396px;
    border-radius: 8px;
    background: #fff;
    padding-top: 60px;
    box-sizing: border-box;
    .content_title {
      border-radius: 8px 8px 0 0;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 60px;
    }
    .el-collapse-item__content{
      padding: 20px 30px;
      box-sizing: border-box;
    }
    .content_box {
      height: 100%;
      overflow-y: scroll;
      border-radius: 0 0 8px 8px;
      .el-table {
        width: 701px;
        th {
          background: #fff;
        }
        tbody {
          tr:hover {
            td {
              background: transparent;
            }
          }
        }
      }
    }
    .closeFailedPackages {
      position: absolute;
      width: 30px;
      height: 30px;
      top: -15px;
      right: -13px;
      background: url("../../assets/images/close_green.png");
      cursor: pointer;
    }
  }
}
</style>