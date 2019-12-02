<template>
<!-- 编辑弹出框 -->
<div id="biologyCheck">
    <div class="editContainer">
        <div class="editContent">
            <div class="sterilize_search">
                <el-input v-model.trim="search_str" placeholder="请输入灭菌编号" @keyup.enter.native="searchData" v-focus></el-input>
                <el-button type="primary" @click="searchData" class="btn120x40">查询</el-button>
            </div>
            <ul>
                <li>
                    <p>灭菌开始时间</p>
                    <span>{{data.SterilizeStartDate}}</span>
                </li>
                <li>
                    <p>灭菌结束时间</p>
                    <span>{{data.SterilizeEndDate}}</span>
                </li>
                <li>
                    <p>灭菌设备</p>
                    <span>{{data.SterilizeDevice}}</span>
                </li>
                <li>
                    <p>灭菌程序</p>
                    <span>{{data.SterilizeProgram}}</span>
                </li>
                <li>
                    <p>灭菌人</p>
                    <span>{{data.SterilizePerson}}</span>
                </li>
                <li>
                    <p>当日锅次</p>
                    <span>{{data.SterilizeTodayBatch}}</span>
                </li>
                <li>
                    <p>总锅次</p>
                    <span>{{data.SterilizeTotalBatch}}</span>
                </li>
                <li>
                    <p>生物检测结果</p>
                    <el-select v-model="status" class="green18x10">
                        <el-option label="不合格" :value="false"></el-option>
                        <el-option label="合格" :value="true"></el-option>
                    </el-select>
                </li>
            </ul>
            <div class="photoOption">
                <span>已拍照片</span>
                <p>
                    <s>{{computedPhotoNumber}}</s>
                    <a @click="handleShowPhotos">拍照</a>
                </p>
            </div>
            <!-- 照片 -->
            <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
                <!-- 拍照 -->
                <PhotoView v-if="isShowPhoto" @viewPhoto-to-father="viewPhotoToFather" :data="data.Pictures"></PhotoView>
            </transition>
        </div>
        <div class="boxOption">
            <el-button @click="CancelSave" class="btn88x32empty">取消</el-button>
            <el-button type="primary" @click="BoxSave" class="btn88x32">审核完成</el-button>
        </div>
    </div>
</div>
</template>

<script>
import PhotoView from "../common/PhotoView";
export default {
    inject: ['reload'],
    data() {
        return {
            status: true,
            isShowPhoto: false,
            search_str: "",
            data: {
                SterilizeTaskId: 0,
                SterilizeStartDate: "",
                SterilizeEndDate: "",
                SterilizeDevice: "",
                SterilizeProgram: "",
                SterilizePerson: "",
                SterilizeTodayBatch: "",
                SterilizeTotalBatch: "",
                Pictures: []
            }
        };
    },
    components: {
        PhotoView
    },
    created() {
        CSManager.handleDataThis = this;
    },
    mounted() {},
    methods: {
        //图片数据传递
        viewPhotoToFather() {
            this.isShowPhoto = false;
        },
        //处理显示图片
        handleShowPhotos(index) {
            this.isShowPhoto = true;
        },
        //搜索数据
        searchData() {
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.search_str,
                    type: "StringNotEmpty",
                    msg: "搜索灭菌编号不能为空！"
                }])
            ) {
                axios({
                        url: `/api/Sterilize/BiologicalReviewSearch/${this.search_str}`
                    })
                    .then(res => {
                        if (res.data.Code == 200) {
                            Object.assign(this.data, res.data.Data)
                        } else {
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg
                            });
                        }
                    })
                    .catch(err => {});
            }
        },
        //取消编辑
        CancelSave() {
            this.$emit("biology-to-father", "");
        },
        //保存编辑
        BoxSave() {
            if (
                this.GLOBAL.VerificationHandle([{
                    val: this.data.SterilizeTaskId,
                    type: "NumberNotZero",
                    msg: "您还没有查询灭菌编号！请查询灭菌编号！"
                }])
            ) {
                if (this.status) {
                    axios({
                        url: `/api/Sterilize/BiologicalReviewSuccess`,
                        method: "POST",
                        data: {
                            SterilizeTaskId: this.data.SterilizeTaskId,
                            Pictures: this.data.Pictures
                        }
                    }).then(res => {
                        if (res.data.Code == 200) {
                            this.reload();
                        } else {
                            this.showInformation({
                                classify: "message",
                                msg: res.data.Msg
                            });
                        }
                    });
                } else {
                    this.$confirm("确认生物检测不合格,并发起一键召回吗?", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        })
                        .then(() => {
                            this.$router.push({
                                path: "/sterilize/recall",
                                query: {
                                    sterilizeTaskId: this.data.SterilizeTaskId
                                }
                            });
                        })
                        .catch(() => {});
                }
            }
        },
        handleBarCode(msg) {
            this.search_str = msg;
            this.searchData();
        }
    },
    computed: {
        computedPhotoNumber() {
            return this.data.Pictures.length;
        }
    }
};
</script>

<style lang="scss">
#biologyCheck {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: rgba(51, 51, 51, 0.6);
    z-index: 2;

    .editContainer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        width: 700px;
        height: 350px;
        border-radius: 8px;
        background: #fff;
        padding: 20px 30px;
        box-sizing: border-box;

        .editContent {
            overflow-y: scroll;
            height: 265px;

            .sterilize_search {
                margin-bottom: 20px;

                .el-input {
                    width: 160px;
                    margin-right: 20px;
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(51, 51, 51, 1);

                    input {
                        padding: 0 5px 0 10px;
                    }
                }

                .el-button {
                    background: #00c16b;
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    color: rgba(255, 255, 255, 1);
                }
            }

            >ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                li {
                    display: flex;
                    width: 296px;
                    justify-content: space-between;

                    p {
                        width: 126px;
                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        color: rgba(135, 141, 159, 1);
                        text-align: right;
                        line-height: 40px;
                    }

                    span {
                        width: 160px;
                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: rgba(51, 51, 51, 1);
                        line-height: 40px;
                    }

                    .el-select {
                        width: 160px;

                        input {
                            font-size: 16px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: rgba(51, 51, 51, 1);
                        }
                    }
                }
            }

            .photoOption {
                display: flex;
                padding: 10px;
                line-height: 22px;
                border-bottom: 0;

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

        .boxOption {
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
