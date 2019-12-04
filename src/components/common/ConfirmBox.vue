<template>
<div>
    <ul>
        <li>{{message}}</li>
        <li>
            <input type="button" value="确定" @click="open">
            <input type="button" value="取消">
        </li>
    </ul>
</div>
</template>

<script>
export default {
    data() {
        return {
            message: "你确定要删除xxx吗?"
        };
    },
    methods: {
        open() {
            this.showInformation({
                classify: 'confirm',
                msg: '是否删除胜多负少是的发送到胜多负少包?',
                confirmCallBack: () => {

                },
                cancelCallBack: () => {}
            });
        }
    }
};
</script>

<style lang="scss" scoped>
div {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);

    ul {
        width: 300px;
        height: 200px;
        background: #fff;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        box-shadow: 0px 0px 30px 0px rgba(0, 92, 244, 0.1);
        border-radius: 7px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 10px 20px;

        li {
            height: 60px;
            font-size: 20px;
            line-height: 30px;
            color: #99f;
            text-align: center;
            text-indent: 20px;

            &:nth-child(2) {
                display: flex;
                justify-content: center;

                input {
                    background: #99f;
                    border: 0;
                    color: #fff;
                    line-height: 30px;
                    width: 50px;
                    height: 30px;
                    font-size: 16px;
                    border-radius: 5px;
                    margin: 0 30px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
