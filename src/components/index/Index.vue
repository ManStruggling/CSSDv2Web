<template>
  <div id="cssd_table" class="cssd_home">
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
    <div class="cssd_index">
      <!-- 1 供应室      2 科室 -->
      <dl v-if="UserInfo.ClinicType===1">
        <dt>消毒供应中心</dt>
        <dd>
          <ul>
            <router-link
              to="/outerPackage/Registration"
              v-if="UserInfo.JobAndCompetence.includes('111')||UserInfo.JobAndCompetence.includes('112')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('102')"
            >
              <li>
                <p class="cssd_index_outerPackage"></p>
                <span>外来器械登记</span>
              </li>
            </router-link>
            <router-link
              to="/recovery/newPurchasing"
              v-if="UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('111')"
            >
              <li>
                <p class="cssd_index_newPurchasing"></p>
                <span>新购入包登记</span>
              </li>
            </router-link>
            <router-link
              to="/recovery/registration"
              v-if="UserInfo.JobAndCompetence.includes('111')||UserInfo.JobAndCompetence.includes('112')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('102')"
            >
              <li>
                <p class="cssd_index_recycle"></p>
                <span>回收</span>
              </li>
            </router-link>
            <router-link
              to="/clean/select"
              v-if="UserInfo.JobAndCompetence.includes('121')||UserInfo.JobAndCompetence.includes('122')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('102')"
            >
              <li>
                <p class="cssd_index_clean"></p>
                <span>清洗消毒</span>
              </li>
            </router-link>
            <router-link
              to="/package/taskList"
              v-if="UserInfo.JobAndCompetence.includes('131')||UserInfo.JobAndCompetence.includes('132')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('102')"
            >
              <li>
                <p class="cssd_index_package"></p>
                <span>配包</span>
              </li>
            </router-link>
            <router-link
              to="/sterilize/select"
              v-if="UserInfo.JobAndCompetence.includes('141')||UserInfo.JobAndCompetence.includes('142')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('102')"
            >
              <li>
                <p class="cssd_index_sterilize"></p>
                <span>灭菌</span>
              </li>
            </router-link>
            <router-link
              to="/provide/registration"
              v-if="UserInfo.JobAndCompetence.includes('151')||UserInfo.JobAndCompetence.includes('152')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('102')"
            >
              <li>
                <p class="cssd_index_provide"></p>
                <span>发放</span>
              </li>
            </router-link>
            <router-link
              to="/provide/reserveCheck"
              v-if="UserInfo.JobAndCompetence.includes('151')||UserInfo.JobAndCompetence.includes('152')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('102')"
            >
              <li>
                <p class="cssd_index_reserveCheck"></p>
                <span>预定审核</span>
              </li>
            </router-link>
            <router-link to="/inventory/productBasicQuantityCheck">
              <li>
                <p class="cssd_index_basicQuantityCheck"></p>
                <span>包基数审核</span>
              </li>
            </router-link>
            <router-link to="/publicModule/reprint">
              <li>
                <p class="cssd_index_reprint"></p>
                <span>重新打印包条码</span>
              </li>
            </router-link>
            <!-- <router-link to="/publicModule/instrumentReplenishment">
                        <li>
                            <p class="cssd_index_instrument"></p>
                            <span>器械补货</span>
                        </li>
            </router-link>-->
          </ul>
        </dd>
      </dl>
      <dl
        v-if="UserInfo.ClinicType===2||UserInfo.ClinicType===3"
        v-show="UserInfo.JobAndCompetence.includes('272')||UserInfo.JobAndCompetence.includes('271')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('200')||UserInfo.JobAndCompetence.includes('202')"
      >
        <dt>临床医疗科室</dt>
        <dd>
          <ul>
            <router-link to="/apply/unqualifiedPackageRegistration">
              <li>
                <p class="cssd_index_unqualified"></p>
                <span>不合格包登记</span>
              </li>
            </router-link>
            <router-link to="/apply/registration">
              <li>
                <p class="cssd_index_apply"></p>
                <span>使用登记</span>
              </li>
            </router-link>
            <router-link to="/apply/reserve">
              <li>
                <p class="cssd_index_reserve"></p>
                <span>预定</span>
              </li>
            </router-link>
            <router-link to="/publicModule/reprint">
              <li>
                <p class="cssd_index_reprint"></p>
                <span>重新打印包条码</span>
              </li>
            </router-link>
            <router-link to="/apply/recycleInClinic">
              <li>
                <p class="waiting_for_recycling"></p>
                <span>待回收包登记</span>
              </li>
            </router-link>
            <router-link to="/inventory/productBasicQuantityRequest">
              <li>
                <p class="cssd_index_basicQuantityRequest"></p>
                <span>包基数申请</span>
              </li>
            </router-link>
          </ul>
        </dd>
      </dl>
      <dl
        v-if="UserInfo.JobAndCompetence.includes('161')||UserInfo.JobAndCompetence.includes('162')||UserInfo.JobAndCompetence.includes('261')||UserInfo.JobAndCompetence.includes('262')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('200')||UserInfo.JobAndCompetence.includes('202')"
      >
        <dt>库存管理</dt>
        <dd>
          <ul>
            <router-link to="/inventory/hasBarCode">
              <li>
                <p class="cssd_index_inventory"></p>
                <span>库存</span>
              </li>
            </router-link>
            <router-link to="/inventoryCounting/registration">
              <li>
                <p class="cssd_index_inventoryCounting"></p>
                <span>盘库</span>
              </li>
            </router-link>
            <router-link
              to="/apply/putInInventory"
              v-if="UserInfo.ClinicType===2||UserInfo.ClinicType===3"
              v-show="UserInfo.JobAndCompetence.includes('262')||UserInfo.JobAndCompetence.includes('261')||UserInfo.JobAndCompetence.includes('200')||UserInfo.JobAndCompetence.includes('000')||UserInfo.JobAndCompetence.includes('202')"
            >
              <li>
                <p class="cssd_index_putInInventory"></p>
                <span>入库确认</span>
              </li>
            </router-link>
          </ul>
        </dd>
      </dl>
      <dl v-if="UserInfo.ClinicType===1">
        <dt>追溯管理</dt>
        <dd>
          <ul>
            <router-link to="/track/package">
              <li>
                <p class="cssd_index_packageTrack"></p>
                <span>包追溯</span>
              </li>
            </router-link>
            <router-link to="/track/patient">
              <li>
                <p class="cssd_index_patientTrack"></p>
                <span>病人追溯</span>
              </li>
            </router-link>
            <router-link to="/track/opration">
              <li>
                <p class="cssd_index_oprationTrack"></p>
                <span>操作日志</span>
              </li>
            </router-link>
          </ul>
        </dd>
      </dl>
      <dl
        v-if="(UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('000'))&&UserInfo.ClinicType===1"
      >
        <dt>基础资料管理</dt>
        <dd>
          <ul>
            <router-link to="/dataSource">
              <li>
                <p class="cssd_index_basicResource"></p>
                <span>基础资料</span>
              </li>
            </router-link>
          </ul>
        </dd>
      </dl>
      <dl
        v-if="(UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('000'))&&UserInfo.ClinicType===1"
      >
        <dt>物流系统</dt>
        <dd>
          <ul>
            <router-link to="/logistics/driverSchedule">
              <li>
                <p class="cssd_index_schedule"></p>
                <span>行程制定</span>
              </li>
            </router-link>
            <router-link to="/logistics/look">
              <li>
                <p class="cssd_index_searchSchedule"></p>
                <span>行程查询</span>
              </li>
            </router-link>
          </ul>
        </dd>
      </dl>
      <dl v-if="UserInfo.ClinicType===1">
        <dt>耗材系统</dt>
        <dd>
          <ul>
            <router-link to="/expendables/request">
              <li>
                <p class="cssd_index_request"></p>
                <span>耗材请领</span>
              </li>
            </router-link>
            <router-link to="/expendables/receive">
              <li>
                <p class="cssd_index_receive"></p>
                <span>耗材领用</span>
              </li>
            </router-link>
          </ul>
        </dd>
      </dl>
      <dl
        v-if="(UserInfo.JobAndCompetence.includes('100')||UserInfo.JobAndCompetence.includes('000'))&&UserInfo.ClinicType===1"
      >
        <dt>管理控制台</dt>
        <dd>
          <ul>
            <router-link to="/management/control">
              <li>
                <p class="cssd_index_management"></p>
                <span>管理控制台</span>
              </li>
            </router-link>
          </ul>
        </dd>
      </dl>
      <!-- <dl>
            <dt>帮助</dt>
            <dd>
                <ul>
                    <router-link to="/help/userManual">
                        <li>
                            <p class="cssd_index_userManual"></p>
                            <span>使用手册</span>
                        </li>
                    </router-link>
                </ul>
            </dd>
      </dl>-->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  beforeRouteEnter(to, from, next) {
    if (sessionStorage.userInfo) {
      next();
    } else {
      next("/login");
    }
  },
  created() {},
  computed: {
    ...mapState({
      UserInfo: state => state.UserInfo
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/tableHead.scss";

#cssd_table.cssd_home {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;

  .cssd_index {
    height: 100%;
    padding-bottom: 40px;
    box-sizing: border-box;
    overflow-y: scroll;

    dl {
      dt {
        padding-left: 40px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(35, 46, 65, 1);
        line-height: 32px;
        margin: 40px 0 20px;
      }

      dd {
        ul {
          display: flex;
          flex-wrap: wrap;
          padding-left: 40px;

          a {
            margin: 0 40px 20px 0;

            li {
              width: 200px;
              height: 240px;
              box-shadow: 0px 0px 10px 0px rgba(70, 79, 131, 0.2);
              border-radius: 10px;
              padding: 30px 25px;
              box-sizing: border-box;
              transition: 0.3s;

              &:hover {
                box-shadow: 0px 0px 10px 0px rgba(0, 193, 107, 0.2);
              }

              p {
                width: 150px;
                height: 150px;
                background-size: 150px 150px;

                &.cssd_index_outerPackage {
                  background-image: url("/images/outerpackage.png");
                }

                &.cssd_index_newPurchasing {
                  background-image: url("/images/newpurchasing.png");
                }

                &.cssd_index_recycle {
                  background-image: url("/images/recycle.png");
                }

                &.cssd_index_clean {
                  background-image: url("/images/clean.png");
                }

                &.cssd_index_package {
                  background-image: url("/images/package.png");
                }

                &.cssd_index_sterilize {
                  background-image: url("/images/sterilize.png");
                }

                &.cssd_index_provide {
                  background-image: url("/images/provide.png");
                }

                &.cssd_index_unqualified {
                  background-image: url("/images/unqualified.png");
                }

                &.cssd_index_apply {
                  background-image: url("/images/apply.png");
                }

                &.cssd_index_inventory {
                  background-image: url("/images/inventory.png");
                }

                &.cssd_index_inventoryCounting {
                  background-image: url("/images/inventoryCounting.png");
                }

                &.cssd_index_packageTrack {
                  background-image: url("/images/packageTrack.png");
                }

                &.cssd_index_patientTrack {
                  background-image: url("/images/patientTrack.png");
                }

                &.cssd_index_oprationTrack {
                  background-image: url("/images/oprationTrack.png");
                }

                &.cssd_index_basicResource {
                  background-image: url("/images/basicResource.png");
                }

                &.cssd_index_schedule {
                  background-image: url("/images/searchSchedule.png");
                }

                &.cssd_index_searchSchedule {
                  background-image: url("/images/Schedule.png");
                }

                &.cssd_index_reserve {
                  background-image: url("/images/reserve.png");
                }

                &.cssd_index_putInInventory {
                  background-image: url("/images/putInInventory.png");
                }

                &.cssd_index_reserveCheck {
                  background-image: url("/images/reserveCheck.png");
                }

                &.cssd_index_reprint {
                  background-image: url("/images/reprint.png");
                }

                &.cssd_index_management {
                  background-image: url("/images/management.png");
                }

                &.waiting_for_recycling {
                  background-image: url("/images/waiting_for_recycling.png");
                }
              }

              span {
                display: block;
                margin-top: 9px;
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: rgba(35, 46, 65, 1);
                line-height: 21px;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
