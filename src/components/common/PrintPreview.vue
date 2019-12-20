<template>
<div id="printPreviewBox">
    <div class="container">
        <div class="title">
            <div class="title_left">打印预览</div>
            <div class="title_right">
                <el-button class="btn88x32empty" @click="rotatePaper">旋转</el-button>
                <el-button class="btn88x32empty" @click="cancelPrint">取消</el-button>
                <el-button type="primary" class="btn88x32" @click="confirmPrint">确定</el-button>
            </div>
        </div>
        <div class="content">
            <div id="hiprint-printTemplate"></div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    inject: ['closePrintView','startPrinting','printDesign','rotatePrintPaper'],
    data() {
        return {

        }
    },
    mounted() {
        this.printDesign();
    },
    methods: {
        rotatePaper() {
            this.rotatePrintPaper();
        },
        cancelPrint() {
            this.closePrintView();
        },
        confirmPrint() {
            this.startPrinting();
        }
    }
}
</script>

<style lang="scss">
#printPreviewBox {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    background: rgba(51, 51, 51, 0.6);
    z-index: 99;
    overflow-y: auto;

    .container {
        width: 1200px;
        height: auto;
        position: absolute;
        left: 0;
        right: 0;
        top: 20px;
        margin: auto;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
        border: 1px solid rgba(0, 0, 0, .2);

        .title {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #F2F4F7;
            padding: 15px;
        }
        .content{
            padding: 15px;
        }
    }
}
</style>
