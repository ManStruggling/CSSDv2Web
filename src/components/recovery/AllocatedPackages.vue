<template>
<div id="allocatedPackages">
    <div class="container table_unExpand">
        <el-table :data="$props.list" height="500" tooltip-effect="dark">
            <el-table-column width="240" label="包名称" prop="ProductName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column width="170" label="包条码" prop="BarCode"></el-table-column>
            <el-table-column width="180" label="回收科室">
                <template slot-scope="props">
                    <el-select v-model="props.row.ProvideSubClinicId" class="green18x10" @change="((val)=>{provideClinicChange(val,props.row)})">
                        <el-option v-for="(item,index) in clinicList" :key="index" :label="item.ProvideSubClinicName" :value="item.ProvideSubClinicId"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column width="100" label="操作">
                <template slot-scope="props">
                    <a @click="deletePackage(props.$index)">删除</a>
                </template>
            </el-table-column>
        </el-table>
        <p class="operation">
            <el-button @click="cancelSubmit" class="btn88x32empty">取消</el-button>
            <el-button type="primary" class="btn88x32" @click="confirmSubmit">确定</el-button>
        </p>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            clinicList: []
        };
    },
    props: ["list"],
    created() {
        axios({
                url: `/api/Clinic/SubClinic`
            })
            .then(res => {
                if (res.data.Code == 200) {
                    this.clinicList = res.data.Data;
                } else {
                    this.showInformation({
                        classify: "message",
                        msg: res.data.Msg
                    });
                }
            })
            .catch(err => {});
    },
    methods: {
        //删除包
        deletePackage(index) {
            this.showInformation({
                classify: 'confirm',
                msg: '确定要删除该包?',
                confirmCallBack: () => {
                    this.$props.list.splice(index, 1);
                },
                cancelCallBack: () => {}
            });
        },
        //取消
        cancelSubmit() {
            this.$emit("allocated-to-father", "");
        },
        //确定
        confirmSubmit() {
            this.$props.list.forEach(element => {
                element.SelectAgain = true;
            });
            this.$emit("allocated-to-father", true);
        },
        //改变科室
        provideClinicChange(val, row) {
            for (let i = 0; i < this.clinicList.length; i++) {
                if (row.ProvideSubClinicId === this.clinicList[i].ProvideSubClinicId) {
                    row.ProvideSubClinicName = this.clinicList[i].ProvideSubClinicName;
                    row.ProvideClinicName = this.clinicList[i].ProvideClinicName;
                    return;
                }
            }
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/tableUnExpand";

#allocatedPackages {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: rgba(51, 51, 51, 0.6);
    z-index: 3;

    .container {
        width: 690px;
        height: 500px;
        background: #fff;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        border-radius: 8px;
        margin: auto;
        padding: 20px 30px 60px;

        .el-table {
            tbody {
                .cell {
                    font-weight: bold;

                    &:first-child {
                        overflow: hidden;
                    }
                }
            }

            .el-select {
                width: 160px;

                .el-input {
                    input {
                        font-size: 16px;
                        font-weight: bold;
                    }
                }
            }

            a {
                cursor: pointer;
                color: #F93E3E;
            }
        }

        .operation {
            position: absolute;
            bottom: 20px;
            left: 30px;
            right: 30px;
            text-align: center;

            .el-button--default {
                margin-right: 15px;
            }

            .el-button--primary {
                margin-left: 15px;
            }
        }
    }
}
</style>
