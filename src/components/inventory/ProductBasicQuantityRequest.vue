<template>
  <div class="cssd_box" id="productBasicQuantityRequest">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <router-link to="/" tag="li">
          <p>返回</p>
        </router-link>
      </ul>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
      <div class="table_box">
        <el-table :data="submitData.Products">
          <el-table-column width="240" label="包名称" prop="ProductName"></el-table-column>
          <el-table-column width="210" label="原包基数" prop="OriginalQuantity"></el-table-column>
          <el-table-column width="210" label="本次调整数">
            <template slot-scope="props">
              <el-input-number
                v-model="props.row.AdjustQuantity"
                :min="-props.row.OriginalQuantity"
                @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.row)})"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </div>
      <div class="cssd_table_bottom">
        <p></p>
        <p>
          <el-button type="primary" round @click="submitComplete">申请完成</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    UserInfo: Object
  },
  inject: ["reload"],
  data() {
    return {
      submitData: {
        Products: []
      }
    };
  },
  created() {
    axios({
      url: `/api/ProductBasicQuantity/Clinic/${this.UserInfo.ClinicId}`
    }).then(res => {
      if (res.data.Code == 200) {
        Object.assign(this.submitData, res.data.Data);
        this.submitData.Products.sort((a, b) =>
          a.OriginalQuantity > b.OriginalQuantity ? -1 : 1
        );
      } else {
        this.showInformation({
          classify: "message",
          msg: res.data.Msg
        });
      }
    });
  },
  mounted() {},
  methods: {
    //提交完成
    submitComplete() {
      if (this.submitData.Products.every(item => item.AdjustQuantity === 0)) {
        this.showInformation({
          classify: "message",
          msg: "调整数不能全为0！"
        });
        return;
      }
      let method = "POST";
      if (this.submitData.ApplyRecordId) {
        method = "PUT";
      }
      axios({
        url: "/api/ProductBasicQuantity/ApplyAdjustQuantity",
        method: method,
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
    },
    handleNumberChange(newValue, oldValue, row) {
      if (newValue === undefined) {
        setTimeout(() => {
          row.AdjustQuantity = oldValue;
        }, 0);
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tableNav";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableUnExpand";

#productBasicQuantityRequest {
  .cssd_table_center {
    overflow: hidden;

    .table_box {
      padding: 30px 40px;
      height: 100%;
      box-sizing: border-box;
      overflow-y: scroll;

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

            .el-select {
              width: 160px;
            }

            .el-date-editor {
              width: 160px;
            }

            .el-input {
              width: 160px;
            }

            .el-input-number {
              width: 140px;
              height: 40px;

              > .el-input {
                width: 100%;
              }
            }

            input {
              font-size: 16px;
              font-weight: bold;
              color: #232e41;
              display: block;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
