<template>
  <!-- 审核清洗不合格包
        根据合格器械数算出不合格数最小值(外来器械直接填写不合格包数量)
  -->
  <div
    :class="{cssd_totalBar:true, tabs_totalBar:true,displayNav:displayNav}"
    id="cleanFailedPackageList"
  >
    <el-tabs type="border-card" :tab-position="'left'">
      <el-tab-pane v-for="(item,index) in carrierList" :key="index" :name="index+''">
        <div slot="label">
          <p>{{item.BarCode}}</p>
        </div>
        <div class="tab_content table_collapse table_unExpand">
          <div class="content_title">
            <p>包名称</p>
            <p>包数量</p>
            <p>回收科室</p>
            <p>不合格包数量</p>
          </div>
          <el-collapse accordion>
            <el-collapse-item
              v-for="(value,collapseIndex) in item.Packages"
              :key="collapseIndex"
              :name="collapseIndex+''"
              :class="value.IsOuterProduct?'collapseUnExpand':''"
            >
              <!-- 包名称 -->
              <div slot="title" class="collapseTh">
                <div class="collapseTd">
                  <el-tooltip
                    :content="value.ProductName"
                    placement="top-start"
                    :disabled="value.ProductName.length<10"
                  >
                    <p>{{value.ProductName}}</p>
                  </el-tooltip>
                </div>
                <!-- 包数量 -->
                <div class="collapseTd">
                  <p>
                    {{value.OriginalQuantity}}
                    <span
                      class="expeditedTag"
                      v-if="value.ExpeditedPackageQuantity!=0"
                    >加急 : {{value.ExpeditedPackageQuantity}}</span>
                  </p>
                </div>
                <!-- 回收科室 -->
                <div class="collapseTd">
                  <el-tooltip
                    :content="value.SubClinicName"
                    placement="right"
                    :disabled="value.SubClinicName.length<11"
                  >
                    <p class="beyondHiding">{{value.SubClinicName}}</p>
                  </el-tooltip>
                </div>
                <!-- 不合格包数量 -->
                <div class="collapseTd">
                  <!-- 外来器械包or松江南院直接填写数量 -->
                  <el-input-number
                    v-if="UserInfo.HospitalVersion=='SONGJIANGNANYUAN' || value.IsOuterProduct"
                    v-model="value.CanNotBePackagedCount"
                    :controls="false"
                    :min="0"
                    :max="value.OriginalQuantity"
                    @change="((newValue,oldValue)=>{handelNumberChange(newValue,oldValue,value)})"
                  ></el-input-number>
                  <p v-else>{{value.CanNotBePackagedCount}}</p>
                </div>
              </div>
              <!-- 以器械为审核对象 -->
              <el-table v-show="!value.IsOuterProduct" :data="value.Instruments">
                <el-table-column
                  label="器械名称"
                  prop="InstrumentName"
                  width="240"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="规格" prop="Specification" width="210"></el-table-column>
                <el-table-column label="器械总数" width="210">
                  <template slot-scope="props">{{props.row.InstrumentCount*value.OriginalQuantity}}</template>
                </el-table-column>
                <el-table-column label="不合格器械总数" width="210">
                  <template slot-scope="props">
                    <span class="failedNumberSpan">{{props.row.FailedInstrumentCount}}</span>
                    <a @click="editCleanQuality(index,collapseIndex,props.$index)">编辑</a>
                  </template>
                </el-table-column>
                <el-table-column></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="shrinkNavBox">
      <div class="border_div"></div>
      <i @click="displayNav=!displayNav" class="el-icon-d-arrow-left"></i>
    </div>
    <div class="expandNavBox" @click="displayNav=!displayNav"></div>
    <div class="cssd_table_bottom">
      <p>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </p>
    </div>
    <transition
      name="fade"
      enter-active-class="animated  faster fadeIn"
      leave-active-class="animated  faster fadeOut"
    >
      <UnqualifiedInstruments
        v-if="isShowUnqualifiedInstruments"
        @UnqualifiedInstruments-to-father="UnqualifiedInstruments"
        :data="cleanQuality"
        :carrierIndex="carrier_index"
        :packageIndex="package_index"
        :instrumentIndex="instrument_index"
        :maxNum="max_num"
        :UserInfo="UserInfo"
      ></UnqualifiedInstruments>
    </transition>
  </div>
</template>

<script>
import UnqualifiedInstruments from "./UnqualifiedInstruments";
export default {
  data() {
    return {
      displayNav: true,
      isShowUnqualifiedInstruments: false, //不合格器械质量卡
      carrierList: [],
      cleanQuality: {}, //清洗质量
      carrier_index: 0, //网篮索引
      package_index: 0, //包索引
      instrument_index: 0, //器械索引
      max_num: 0 //最大数量
    };
  },
  props: ["failedCarriers", "taskId", "UserInfo"],
  components: {
    UnqualifiedInstruments
  },
  created() {
    if (this.$props.failedCarriers == "") {
      if (this.$props.taskId) {
        axios({
          url: `/api/Clean/CleanCarriers/${this.$props.taskId}`
        })
          .then(res => {
            if (res.data.Code == 200) {
              this.carrierList = res.data.Data;
            } else {
              this.showInformation({
                classify: "message",
                msg: res.data.Msg
              });
            }
          })
          .catch(err => {});
      }
    } else {
      this.carrierList = this.$props.failedCarriers.concat([]);
    }
  },
  methods: {
    //保存
    saveData() {
      this.$emit("cleanFailed-to-father", this.carrierList);
    },
    //取消
    cancel() {
      this.$emit("cleanFailed-to-father");
    },
    //编辑,传递索引和最大限制数
    editCleanQuality(index, collapseIndex, $index) {
      this.cleanQuality = this.carrierList[index].Packages[
        collapseIndex
      ].Instruments[$index].FailedInstrumentForClean.CleanInstrumentRecord;
      this.carrier_index = index;
      this.package_index = collapseIndex;
      this.instrument_index = $index;
      this.max_num =
        this.carrierList[index].Packages[collapseIndex].OriginalQuantity *
        this.carrierList[index].Packages[collapseIndex].Instruments[$index]
          .InstrumentCount;
      this.isShowUnqualifiedInstruments = true;
    },
    //清洗质量卡与父组件数据通信
    UnqualifiedInstruments(data) {
      this.isShowUnqualifiedInstruments = false;
      if (data) {
        this.carrierList[data.carrierIndex].Packages[
          data.packageIndex
        ].Instruments[
          data.instrumentIndex
        ].FailedInstrumentForClean.CleanInstrumentRecord = Object.assign(
          {},
          data.data
        );
        if (this.UserInfo.HospitalVersion == "SONGJIANGNANYUAN") {
          this.carrierList[data.carrierIndex].Packages[
            data.packageIndex
          ].Instruments[data.instrumentIndex].FailedInstrumentCount = 0;
        } else {
          //根据清洗质量计算不合格器械数量
          this.carrierList[data.carrierIndex].Packages[
            data.packageIndex
          ].Instruments[data.instrumentIndex].FailedInstrumentCount =
            data.data.BloodStain + data.data.Stains + data.data.RustStain;
          this.getTheMaximumNumberOfFailedPackages(data);
        }
      }
    },
    //获取不合格器械最大值
    getTheMaximumNumberOfFailedPackages(data) {
      let max_number = 0;
      this.carrierList[data.carrierIndex].Packages[
        data.packageIndex
      ].Instruments.forEach(element => {
        if (
          Math.ceil(element.FailedInstrumentCount / element.InstrumentCount) >
          max_number
        ) {
          max_number = Math.ceil(
            element.FailedInstrumentCount / element.InstrumentCount
          );
        }
      });
      this.carrierList[data.carrierIndex].Packages[
        data.packageIndex
      ].CanNotBePackagedCount = max_number;
    },
    handelNumberChange(newValue, oldValue, value) {
      if (newValue == undefined) {
        setTimeout(() => {
          value.CanNotBePackagedCount = 0;
        }, 0);
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/tabsTotalBar";
@import "../../assets/css/tableTotalBottomBar";
@import "../../assets/css/tableCollapse";
@import "../../assets/css/tableUnExpand";

#cleanFailedPackageList {
  .el-tabs {
    .el-tabs__item {
      height: 80px;
      padding: 0 20px;

      p {
        line-height: 80px;
        text-align: left;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #fff;
      }
    }

    .el-tabs__content {
      .el-collapse {
        .el-collapse-item {
          .el-collapse-item__header {
            &.is-active {
            }

            .collapseTh {
              .collapseTd {
                .el-input-number {
                  line-height: 65px;

                  .el-input {
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

      .el-table {
        tbody {
          .failedNumberSpan {
            width: 32px;
            display: inline-block;
          }

          a {
            font-size: 18px;
            font-family: Microsoft YaHei;
            color: rgba(0, 193, 107, 1);
            margin-left: 20px;
            cursor: pointer;
          }

          .cell {
            font-size: 18px;
            font-family: Microsoft YaHei;
            color: rgba(35, 46, 65, 1);
          }
        }
      }
    }
  }

  .cssd_table_bottom {
    flex-direction: row-reverse;
  }
}
</style>
