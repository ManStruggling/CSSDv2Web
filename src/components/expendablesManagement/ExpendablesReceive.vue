<template>
  <div class="cssd_box" id="consumableReceive">
    <div class="cssd_title">
      <ul class="cssd_menu">
        <li @click="goBack">
          <p>返回</p>
        </li>
        <router-link to="/expendables/receiveRecord" tag="li">
          <p>领用记录</p>
        </router-link>
      </ul>
      <div class="cssd_title_right">
        <p>
          <span>领用人</span>
          <el-select v-model="submitData.RequestPersonId" filterable class="white24x13">
            <el-option
              v-for="(item,index) in staffs"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
    </div>
    <div class="cssd_table_center cssd_totalBar table_unExpand">
      <div class="table_box">
        <el-table :data="submitData.Products">
          <el-table-column width="240" label="产品名称">
            <template slot-scope="props">
              <el-select
                v-model="props.row.Id"
                class="green18x10"
                @change="((val)=>{consumableChange(val,props.row)})"
              >
                <el-option
                  v-for="(item,index) in consumableProducts"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.forbid"
                >
                  <el-tooltip
                    :content="item.name"
                    placement="right"
                    :disabled="item.name.length<12"
                  >
                    <p class="beyondHiding">{{item.name}}</p>
                  </el-tooltip>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column width="210" label="剩余库存数" prop="RemainInventoryCount"></el-table-column>
          <el-table-column width="210" label="本次领用数">
            <template slot-scope="props">
              <el-input-number
                v-model="props.row.ThisTimeRequestCount"
                :controls="false"
                :min="0"
                :max="props.row.RemainInventoryCount"
                @change="((newValue,oldValue)=>{handleNumberChange(newValue,oldValue,props.row)})"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column width="210" label="操作">
            <template slot-scope="props">
              <a @click="deleteThisItem(props.$index)">删除</a>
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
        </el-table>
        <el-button @click="insertItem" class="btn88x32">新增</el-button>
      </div>
      <div class="cssd_table_bottom">
        <p></p>
        <p>
          <el-button v-if="isChangeMode" @click="cancelChange">取消修改</el-button>
          <el-button type="primary" round @click="submitComplete">{{isChangeMode?"修改完成":"领用完成"}}</el-button>
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
      staffs: [],
      consumableProducts: [],
      isChangeMode: false,
      submitData: {
        RequestPersonId: "",
        Products: []
      }
    };
  },
  created() {
    this.$http
      .all([
        axios({
          url: "/basic",
          method: "POST",
          data: {
            query: `query getStaffs{
                            staff(clinicId:${this.UserInfo.ClinicId}){
                                id,name,clinicId
                            }
                        }`
          }
        }),
        axios({
          url: "/consumable",
          method: "POST",
          data: {
            query: `query getConsumableProduct{
                            product{
                                id,minimumUnit,name,receiveCode,receiveDepartmentId,inventoryCount
                            }
                        }`
          }
        })
      ])
      .then(
        this.$http.spread((acct, perms) => {
          this.staffs = acct.data.data.staff;
          this.consumableProducts = perms.data.data.product;
          if (this.$route.query.recordId) {
            this.isChangeMode = true;
            axios({
              url: `/api/InternalRequest/PendingUpdateInternalRequestRecord/${this.$route.query.recordId}`
            })
              .then(res => {
                if (res.data.Code == 200) {
                  res.data.Data.Products.forEach(element => {
                    this.consumableProducts.forEach(item => {
                      if (element.Id === item.id) {
                        item.inventoryCount += element.ThisTimeRequestCount;
                        element.RemainInventoryCount = item.inventoryCount;
                        return;
                      }
                    });
                  });
                  this.submitData = res.data.Data;
                  this.checkConsumableCanBeUseable();
                } else {
                  this.showInformation({
                    classify: "message",
                    msg: res.data.Msg
                  });
                }
              })
              .catch(err => {});
          }
        })
      );
  },
  mounted() {},
  methods: {
    //检测耗材的可用
    checkConsumableCanBeUseable() {
      let selectedConsumableId = [];
      this.submitData.Products.forEach(element => {
        selectedConsumableId.push(element.Id);
      });
      this.consumableProducts.forEach(element => {
        if (selectedConsumableId.includes(element.id)) {
          element.forbid = true;
        } else {
          element.forbid = false;
        }
      });
    },
    //耗材change
    consumableChange(val, row) {
      for (let i = 0; i < this.consumableProducts.length; i++) {
        if (this.consumableProducts[i].id === val) {
          row.Id = this.consumableProducts[i].id;
          row.Name = this.consumableProducts[i].name;
          row.ReceiveCode = this.consumableProducts[i].receiveCode;
          row.RemainInventoryCount = this.consumableProducts[i].inventoryCount;
          row.ThisTimeRequestCount = 0;
          break;
        }
      }
      this.checkConsumableCanBeUseable();
    },
    //取消修改
    cancelChange() {
      this.$router.push("/expendables/receiveRecord");
    },
    goBack() {
      if (this.isChangeMode) {
        this.cancelChange();
      } else {
        this.$router.push("/");
      }
    },
    //删除
    deleteThisItem(index) {
      this.showInformation({
        classify: "confirm",
        msg: "确定要删除该项吗?",
        confirmCallBack: () => {
          this.submitData.Products.splice(index, 1);
          this.checkConsumableCanBeUseable();
        },
        cancelCallBack: () => {}
      });
    },
    //新增
    insertItem() {
      this.submitData.Products.push({
        Id: "",
        ThisTimeRequestCount: 0
      });
    },
    //提交
    submitComplete() {
      let method = "POST";
      if (this.isChangeMode) {
        method = "PUT";
      }
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.submitData.RequestPersonId,
            type: "StringNotEmpty",
            msg: "领用人不能为空！"
          },
          {
            val: this.submitData.Products,
            type: "ArrayNotEmpty",
            msg: "请领的耗材不能为空！"
          }
        ])
      ) {
        if (
          this.submitData.Products.every(item => item.Id != "") &&
          this.submitData.Products.every(item => item.ThisTimeRequestCount != 0)
        ) {
          axios({
            url: "/api/InternalRequest",
            method: method,
            data: this.submitData
          })
            .then(res => {
              if (res.data.Code == 200) {
                if (this.isChangeMode) {
                  this.$router.push("/expendables/receiveRecord");
                } else {
                  this.reload();
                }
              } else {
                this.showInformation({
                  classify: "message",
                  msg: res.data.Msg
                });
              }
            })
            .catch(err => {});
        } else {
          this.showInformation({
            classify: "message",
            msg: "耗材未选择或请领数不能为0！"
          });
        }
      }
    },
    //数量change事件
    handleNumberChange(newValue, oldValue, rowItem) {
      if (newValue == undefined) {
        setTimeout(() => {
          rowItem.ThisTimeRequestCount = 1;
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

#consumableReceive {
  .cssd_title {
    .cssd_title_right {
      .el-select {
        width: 200px;

        .el-input {
          input {
            border: 2px solid #9ea6b2;
            font-size: 18px;
            font-weight: bold;
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
              width: 60px;

              > .el-input {
                width: 100%;
              }
            }

            input {
              font-size: 16px;
              font-weight: bold;
              color: #232e41;
              display: block;
            }
          }
        }
      }

      .el-button {
        margin-top: 20px;
        color: #fff;
      }
    }

    .cssd_table_bottom {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
