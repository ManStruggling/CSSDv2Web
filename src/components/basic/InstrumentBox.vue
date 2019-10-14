<template>
  <div id="editBox" class="instrumentBox">
    <div class="editContainer">
      <div class="editContent">
        <ul class="clear_float">
          <li>
            <p>器械名称</p>
            <el-input type="text" placeholder="器械名称(必填)" v-model.trim="editBoxData.Name" maxlength="10"></el-input>
          </li>
          <li>
            <p>器械简码</p>
            <el-input type="text" v-model="editBoxData.ShortCode" :disabled="true"></el-input>
          </li>
          <li>
            <p>规格</p>
            <el-input type="text" placeholder="规格" v-model.trim="editBoxData.Specification"></el-input>
          </li>
          <li>
            <p>标准名称</p>
            <el-input type="text" placeholder="标准名称" v-model.trim="editBoxData.StandardName"></el-input>
          </li>
          <li>
            <p>成本价格</p>
            <el-input-number
              placeholder="成本价格"
              v-model="editBoxData.CostPrice"
              :min="1"
              :max="99999999"
              :controls="false"
              @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'CostPrice')})"
            ></el-input-number>
          </li>
          <li>
            <p>清算价格</p>
            <el-input-number
              placeholder="清算价格"
              v-model="editBoxData.ClearingPrice"
              :min="1"
              :max="99999999"
              :controls="false"
              @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'ClearingPrice')})"
            ></el-input-number>
          </li>
          <li>
            <p>发放供应室</p>
            <el-select v-model="editBoxData.ProvideCssdId" placeholder="请选择" class="green24x13">
              <el-option
                v-for="item in opetionCssdList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <p>安全库存</p>
            <el-input-number
              type="text"
              placeholder="安全库存"
              v-model="editBoxData.SafeInventory"
              :min="1"
              :max="99999999"
              :controls="false"
              @change="((newValue,oldValue)=>{numberChange(newValue,oldValue,'SafeInventory')})"
            ></el-input-number>
          </li>
          <li class="textareaBox">
            <p>备注</p>
            <el-input
              type="textarea"
              maxlength="20"
              placeholder="备注"
              v-model.trim="editBoxData.Remark"
              show-word-limit
            ></el-input>
          </li>
        </ul>
        <div class="photoOption">
          <span>已拍照片</span>
          <p>
            <s>{{computedPhotoNumber}}</s>
            <a @click="handleShowPhotos">拍照</a>
          </p>
        </div>
        <transition
          name="fade"
          enter-active-class="animated fadeIn faster"
          leave-active-class="animated fadeOut faster"
        >
          <!-- 拍照 -->
          <PhotoView
            v-if="isShowPhoto"
            @viewPhoto-to-father="viewPhotoToFather"
            :data="editBoxData.InstrumentPictures"
            :DeletedPicturesId="editBoxData.DeletedPicturesId"
          ></PhotoView>
        </transition>
      </div>
      <div class="editBoxOption">
        <el-button @click="editBoxCancelSave">取消</el-button>
        <el-button type="primary" @click="editBoxSave">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import PhotoView from "../common/PhotoView";
export default {
  props: ["data"],
  data() {
    return {
      isShowPhoto: false,
      editBoxData: {},
      selectedCssd: "",
      opetionCssdList: []
    };
  },
  components: {
    PhotoView
  },
  methods: {
    viewPhotoToFather() {
      this.isShowPhoto = false;
    },
    //处理显示图片
    handleShowPhotos() {
      this.isShowPhoto = true;
    },
    //el-input-number change 事件
    numberChange(newValue, oldValue, origin) {
      if (newValue == undefined) {
        setTimeout(() => {
          this.editBoxData[origin] = 1;
        }, 0);
      }
    },
    //取消编辑
    editBoxCancelSave() {
      this.$emit("to-father", "");
    },
    //保存编辑
    editBoxSave() {
      //before submit must to do： 数据转换 表单验证;
      let axiosMethod;
      if (this.editBoxData.Id == 0) {
        //新增模式
        axiosMethod = "post";
      } else {
        //更新模式
        axiosMethod = "put";
      }
      if (
        this.GLOBAL.VerificationHandle([
          {
            val: this.editBoxData.Name,
            type: "StringNotEmpty",
            msg: "器械名称不能为空！"
          }
        ])
      ) {
        axios({
          url: "/api/Instrument",
          method: axiosMethod,
          data: this.editBoxData
        })
          .then(res => {
            let type;
            if (res.data.Code == 200) {
              //操作成功
              type = "success";
              this.$emit("to-father", res.data.Data);
            } else {
              type = "error";
            }
            this.showInformation({
              classify: "message",
              msg: res.data.Msg,
              type: type
            });
          })
          .catch(error => {});
      }
    }
  },
  computed: {
    computedPhotoNumber() {
      return this.editBoxData.InstrumentPictures == null
        ? 0
        : this.editBoxData.InstrumentPictures.length;
    }
  },
  created() {
    this.editBoxData = this.$props.data;
    axios({ url: `/api/Instrument/InstrumentDetail/${this.editBoxData.Id}` })
      .then(res => {
        if (res.data.Code == 200) {
          this.opetionCssdList = res.data.Data.Cssd;
          if(this.editBoxData.ProvideCssdId===0&&this.opetionCssdList.length>0){
            this.editBoxData.ProvideCssdId = this.opetionCssdList[0].value;
          }
          this.editBoxData.InstrumentPictures =
            res.data.Data.InstrumentPictures;
        } else {
          this.showInformation({ classify: "message", msg: res.data.Msg });
        }
      })
      .catch(err => {});
  }
};
</script>

<style lang="scss">
#editBox.instrumentBox {
  .editContent {
    > ul {
      border-bottom: 1px solid #f2f4f7;
    }
    .photoOption {
      display: flex;
      padding: 20px 0 0 30px;
      line-height: 40px;
      span {
        margin-right: 20px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        color: rgba(135, 141, 159, 1);
      }
      p {
        s {
          font-size: 16px;
          font-family: Microsoft YaHei;
          color: #333333;
          font-weight: bold;
        }
        a {
          margin: 0 10px;
          font-size: 16px;
          cursor: pointer;
          font-family: Microsoft YaHei;
          color: #00c16b;
          font-weight: bold;
        }
        b {
          font-family: Microsoft YaHei;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          color: #00c16b;
        }
      }
    }
  }
}
</style>