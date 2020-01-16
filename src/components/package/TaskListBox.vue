<template>
<div id="packageTaskListBox">
    <ul>
        <li>
            <h4>包名称</h4>
            <el-tooltip :content="submitData.Packages[0].ProductName" placement="right" :disabled="submitData.Packages[0].ProductName.length<11">
                <p class="beyondHiding">{{submitData.Packages[0].ProductName}}</p>
            </el-tooltip>
        </li>
        <li>
            <h4>所属科室</h4>
            <el-tooltip :content="submitData.Packages[0].SubClinicName" placement="right" :disabled="submitData.Packages[0].SubClinicName.length<11">
                <p class="beyondHiding">{{submitData.Packages[0].SubClinicName}}</p>
            </el-tooltip>
        </li>
        <li>
            <h4>本次配包数量</h4>
            <p>{{submitData.Packages[0].ThisTimePackageQuantity}}</p>
        </li>
        <li>
            <h4>已拍照片</h4>
            <p>
                <span>{{computedPhotoNumber(submitData.Pictures)}}</span>
                <a @click="handleShowPhotos">编辑</a>
            </p>
        </li>
        <li>
            <h4 class="reviewerText">配包审核人</h4>
            <p>
                <el-input v-model.trim="submitData.ReviewerBarCode" placeholder="扫描或手动输入条码" @keyup.enter.native="submitConfirm" v-focus></el-input>
            </p>
        </li>
        <li style="display:block;">
            <el-button @click="cancelSubmit" class="btn88x32empty" style="margin:0 20px 0 31px;">取消</el-button>
            <el-button type="primary" @click="submitConfirm" class="btn88x32" :disabled="forbid">确认</el-button>
        </li>
    </ul>
    <!-- 照片 -->
    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
        <!-- 拍照 -->
        <PhotoView v-if="isShowPhoto" @viewPhoto-to-father="viewPhotoToFather" :data="submitData.Pictures"></PhotoView>
    </transition>
</div>
</template>

<script>
import PhotoView from "../common/PhotoView";
export default {
    inject: ['reload'],
    data() {
        return {
            forbid: false,
            alreadyRequested: false,
            isShowPhoto: false,
            submitData: {
                Pictures: [],
                ReviewerBarCode: "",
                Packages: [{
                    ProductName: "",
                    SubClinicName: "",
                    ThisTimePackageQuantity: 0,
                }]
            }
        };
    },
    props: ["data", "origin", "tabIndex"],
    components: {
        PhotoView
    },
    created() {
        CSManager.handleDataThis = this;
    },
    mounted() {
        this.$props.data.Pictures = [];
        this.$props.data.ReviewerBarCode = "";
        Object.assign(this.submitData.Packages[0], this.data);
        this.submitData.Packages[0].ThisTimePackageQuantity =
            this.submitData.Packages[0].NumberProductQuantity > 0 ?
            this.submitData.Packages[0].ThisTimePackageQuantity *
            this.submitData.Packages[0].NumberProductQuantity >
            this.submitData.Packages[0].CanBePackagedQuantity ?
            this.submitData.Packages[0].CanBePackagedQuantity :
            this.submitData.Packages[0].ThisTimePackageQuantity *
            this.submitData.Packages[0].NumberProductQuantity :
            this.submitData.Packages[0].ThisTimePackageQuantity;
    },
    methods: {
        //图片数据传递
        viewPhotoToFather() {
            this.isShowPhoto = false;
        },
        //处理显示图片
        handleShowPhotos() {
            this.isShowPhoto = true;
        },
        //取消提交
        cancelSubmit() {
            this.$route.query.origin = this.origin;
            this.reload();
        },
        //确定提交
        submitConfirm() {
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.submitData.ReviewerBarCode,
                    type: "StringNotEmpty",
                    msg: "配包审核人不能为空！"
                }])
            ) {
                this.forbid = true;
                if (this.alreadyRequested == false) {
                    this.alreadyRequested = true;
                    axios({
                            url: "/api/Package/PackageTaskReceiveAndReturnPrintModel",
                            method: "POST",
                            data: this.submitData
                        })
                        .then(res => {
                            let type;
                            if (res.data.Code == 200) {
                                type = "success";
                                res.data.Data.forEach(element => {
                                    CSManager.PrintBarcode(JSON.stringify(element));
                                });
                                this.$emit("to-father", {
                                    CssdId: this.GLOBAL.UserInfo.ClinicId,
                                    ReserveCheckState: false,
                                    PackageState: true,
                                    ProvideState: false,
                                }, this.$props.origin, this.$props.tabIndex);
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
            }
        },
        handleBarCode(msg) {
            this.submitData.ReviewerBarCode = msg;
            this.submitConfirm();
        }
    },
    computed: {
        computedPhotoNumber() {
            return list => {
                return list.length;
            };
        }
    }
};
</script>

<style lang="scss" scoped>
#packageTaskListBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    background: rgba(51, 51, 51, 0.6);
    z-index: 4;

    ul {
        width: 328px;
        height: 316px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        background: #fff;
        padding: 20px 30px 30px;
        box-sizing: border-box;
        border-radius: 8px;

        li {
            display: flex;
            justify-content: space-between;
            line-height: 30px;
            margin-bottom: 20px;

            h4 {
                width: 96px;
                font-size: 16px;
                line-height: 21px;
                font-family: Microsoft YaHei;
                color: rgba(135, 141, 159, 1);
                text-align: right;

                &.reviewerText {
                    line-height: 40px;
                }
            }

            p {
                font-size: 16px;
                line-height: 21px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
                width: 160px;

                .el-input {
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                }

                span {
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(51, 51, 51, 1);
                }

                a {
                    margin-left: 10px;
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(0, 193, 107, 1);
                    cursor: pointer;
                }
            }

            .el-button.is-disabled {
                background: #ccc;
            }
        }
    }
}
</style>
