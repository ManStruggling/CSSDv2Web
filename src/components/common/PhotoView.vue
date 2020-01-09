<template>
<div id="photoView">
    <div class="container">
        <div class="view_menu">
            <h3 v-if="!$props.viewMode">
                <p @click="switchToTakePhoto"></p>
            </h3>
            <el-tabs type="card" tab-position="left" v-model="activeName" @tab-click="tabClicked">
                <el-tab-pane v-for="(item,index) in list" :key="index" :name="index+''">
                    <div slot="label" class="imageListBox">
                        <img :src="item.Path||item.Base64String" alt />
                        <i v-if="!$props.viewMode" class="deleteImg" @click.stop="deleteImg(index)"></i>
                    </div>
                    <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
                        <div class="tab_content" v-show="mode==0">
                            <div class="img_box">
                                <img :src="item.Path||item.Base64String" alt />
                            </div>
                            <el-input v-if="!$props.viewMode" type="textarea" v-model.trim="item.Remark" placeholder="备注" resize="none"></el-input>
                            <p v-if="$props.viewMode">{{item.Remark}}</p>
                        </div>
                    </transition>
                </el-tab-pane>
            </el-tabs>
        </div>
        <transition name="fade" enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
            <div class="view_content" v-show="mode===1">
                <img :src="image" alt />
                <h5>
                    <el-upload action="" :auto-upload="false" :on-change="handleFileChange" :multiple="false" :limit="1" accept=".jpg, .jpeg, .png" :on-exceed="handleFileExceed">
                        <el-button slot="trigger">上传</el-button>
                    </el-upload>
                    <el-button type="primary" class="btn120x40" @click="takePhoto">拍照</el-button>
                </h5>
            </div>
        </transition>
        <i class="closePhotoView" @click="close"></i>
    </div>
</div>
</template>

<script>
export default {
    props: ["data", "viewMode", "DeletedPicturesId"],
    data() {
        return {
            activeName: "-1",
            mode: 0, //0 查看    1拍照
            image: "",
            list: []
        };
    },
    created() {
        this.list = this.$props.data == null ? [] : this.$props.data;
        if (this.list.length > 0) {
            this.activeName = 0;
        }
        if (!this.$props.viewMode) {
            this.switchToTakePhoto();
        }
    },
    beforeDestroy() {
        CSManager.CloseVideo();
    },
    methods: {
        //关闭组件
        close() {
            this.$emit("viewPhoto-to-father", this.list);
        },
        // 切换到拍照
        switchToTakePhoto() {
            if (!this.$props.viewMode) {
                CSManager.OpenVideo(50, "", this);
            }
            this.mode = 1;
        },
        //拍照
        takePhoto() {
            this.list.push({
                Id: 0,
                Path: "",
                Base64String: this.image,
                Remark: ""
            });
            this.image = '';
            this.mode = 0;
            this.activeName = this.list.length - 1 + "";
        },
        //文件状态change
        handleFileChange(file, fileList) {
            this.handleFileReader(file.raw);
        },
        //文件超过限制
        handleFileExceed(files, fileList) {
            this.handleFileReader(files[0]);
        },
        //读取文件
        handleFileReader(file) {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                this.image = fileReader.result;
                this.takePhoto();
            }
        },
        //删除图片
        deleteImg(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '您确定要删除该照片?',
                confirmCallBack: () => {
                    if (this.list[index].Id != 0) {
                        this.$props.DeletedPicturesId.push(this.list[index].Id);
                    }
                    this.list.splice(index, 1);
                },
                cancelCallBack: () => {}
            });
        },
        //tab click
        tabClicked() {
            this.mode = 0;
        }
    }
};
</script>

<style lang="scss">
#photoView {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: rgba(51, 51, 51, 0.6);
    z-index: 6;

    .container {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        width: 849px;
        height: 610px;
        background: #fff;
        border-radius: 8px;
        display: flex;

        .view_menu {
            width: 149px;
            height: 100%;
            display: flex;
            flex-direction: column;

            h3 {
                padding: 10px;
                width: 149px;
                box-sizing: border-box;
                border-right: 1px solid #f2f4f7;

                p {
                    height: 40px;
                    background: #00c16b url("../../assets/images/add.png") no-repeat center;
                    background-size: 24px 24px;
                    margin: 0 auto;
                    cursor: pointer;
                    border-radius: 4px;
                }
            }

            .el-tabs {
                width: 100%;
                flex: 1;
                border: 0;
                border-radius: 8px 0 0 8px;

                .el-tabs__header {
                    width: 100%;
                    box-sizing: border-box;
                    background: #fff;
                    margin: 0;
                    border: 0;

                    .el-tabs__nav-wrap {
                        width: 100%;
                        padding: 0;
                        margin: 0;

                        .el-tabs__nav-prev,
                        .el-tabs__nav-next {
                            display: none;
                        }

                        .el-tabs__nav-scroll {
                            overflow-y: scroll;
                            display: flex;
                            flex-direction: column;

                            &::after {
                                content: "";
                                flex: 1;
                                border-right: 1px solid #f2f4f7;
                            }

                            .el-tabs__nav {
                                border-bottom: 0;

                                .el-tabs__item {
                                    padding: 10px;
                                    height: 110px;
                                    border-bottom: 1px solid #f2f4f7;

                                    &:focus.is-active.is-focus:not(:active) {
                                        box-shadow: 0 0 2px 2px #00c16b inset;
                                    }

                                    &.is-left.is-active {
                                        border-right-color: #fff;
                                    }

                                    &.is-left {
                                        border-right: 1px solid #f2f4f7;
                                        border-top: 0;
                                    }

                                    &:hover {
                                        .imageListBox {
                                            .deleteImg {
                                                display: block;
                                            }
                                        }
                                    }

                                    .imageListBox {
                                        position: relative;

                                        img {
                                            display: block;
                                            width: 128px;
                                            height: 90px;
                                            border-radius: 4px;
                                        }

                                        .deleteImg {
                                            position: absolute;
                                            width: 24px;
                                            height: 24px;
                                            right: 4px;
                                            top: 4px;
                                            background: url("../../assets/images/closeRound.png") no-repeat;
                                            background-size: 100% 100%;
                                            transition: 0.3s;
                                            cursor: pointer;
                                            display: none;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .el-tabs__content {
                    background: #fff;
                    position: absolute;
                    padding: 20px 30px;
                    left: 150px;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    border-radius: 0 0 8px 0;

                    .el-tab-pane {
                        .img_box{
                            width: 100%;
                            height: 450px;
                            overflow: auto;
                            img {
                                display: block;
                                width: 100%;
                            }
                        }

                        .el-textarea {
                            height: 100px;
                            margin-top: 20px;

                            &::after {
                                display: none;
                            }

                            textarea {
                                height: 100% !important;
                                padding: 10px !important;
                                font-size: 16px;
                                font-family: Microsoft YaHei;
                                font-weight: bold;
                                color: rgba(51, 51, 51, 1);
                            }
                        }

                        p {
                            padding: 10px;
                            margin-top: 20px;
                            height: 100px;
                            box-sizing: border-box;
                            font-size: 16px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: rgba(51, 51, 51, 1);
                        }
                    }
                }
            }
        }

        .view_content {
            background: #fff;
            flex: 1;
            padding: 20px 30px 50px;
            position: absolute;
            left: 150px;
            right: 0;
            bottom: 0;
            top: 0;
            margin: auto;
            border-radius: 0 0 8px 0;

            img {
                display: block;
                width: 100%;
                height: 450px;
                background: rgba(0, 0, 0, 0.8);
            }

            h5 {
                margin-top: 50px;
                text-align: center;
                display: flex;
                justify-content: center;

                .el-upload-list {
                    display: none;
                }

                .el-button {
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    color: rgba(255, 255, 255, 1);
                    width: 120px;
                    height: 40px;
                    background: #fff;
                    color: #00c16b;
                    border-color: #00c16b;

                    &.el-button--primary {
                        background: rgba(0, 193, 107, 1);
                        border: 1px solid #00c16b;
                        font-size: 18px;
                        color: #fff;
                        margin-left: 10px;
                    }

                }
            }
        }

        .closePhotoView {
            position: absolute;
            right: -13px;
            top: -15px;
            width: 30px;
            height: 30px;
            background: url("../../assets/images/close_green.png") no-repeat;
            cursor: pointer;
        }
    }
}
</style>
