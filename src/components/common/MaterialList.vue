<template>
<div class="basic_instrument" id="basic_material">
    <div class="instrument_box">
        <h3>
            <el-input v-model="searchShortCode" placeholder="请输入拼音简码" @input="materialSearch"></el-input>
        </h3>
        <el-table ref="multipleTable" :data="materialList" tooltip-effect="dark" height="380" @selection-change="handleSelectionChange" @row-click="handleRowClick" :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="Name" label="名称" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="Specification" label="规格" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="Quantity" label="数量">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.Quantity" :min="1" :max="999" :controls="false" @click.native.stop="GLOBAL.cancelBubble" @change="((newValue,oldValue)=>{handleCountNumberPackage(newValue,oldValue,scope.$index)})"></el-input-number>
                </template>
            </el-table-column>
        </el-table>
        <h4>
            <el-button type="primary" @click="cancelSend" class="btn88x32empty">取消</el-button>
            <el-button type="primary" @click="sendToFather" class="btn88x32">确定</el-button>
        </h4>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            searchShortCode: "", //简码搜索字段
            materialList: [], //显示的器械列表
            multipleSelection: []
        };
    },
    created() {
        this.getMaterialsData(`/odata/productmaterials`);
    },
    methods: {
        //点击当前行选择数据
        handleRowClick(row, column, event) {
            if (column) {
                this.$refs.multipleTable.toggleRowSelection(row);
            }
        },
        handleCountNumberPackage(newValue, oldValue, index) {
            if (newValue == undefined) {
                setTimeout(() => {
                    this.materialList[index].Quantity = 1;
                }, 0);
            }
        },
        //确认事件
        sendToFather() {
            this.$emit("to-father", this.multipleSelection);
        },
        //取消事件
        cancelSend() {
            this.$emit("to-father", false);
        },
        //搜索事件
        materialSearch() {
            //code
            axios({
                    url: `/odata/productmaterials?$filter=contains(name,${"'" +
          encodeURIComponent(this.searchShortCode) +
          "'"}) or contains(shortcode,${"'" + encodeURIComponent(this.searchShortCode) + "'"})`
                })
                .then(res => {
                    this.resetQuantity(res.data.value);
                    this.materialList = res.data.value;
                })
                .catch(err => {});
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getRowKeys(row) {
            return row.Id;
        },
        //默认原料数量
        resetQuantity(arr) {
            for (let i = 0; i < arr.length; i++) {
                arr[i].Quantity = 1;
                for (let j = 0; j < this.multipleSelection.length; j++) {
                    if (arr[i].Id === this.multipleSelection[j].Id) {
                        arr[i] = this.multipleSelection[j];
                        break;
                    }
                }
            }
        },
        //获取原料数据
        getMaterialsData(url) {
            axios(url)
                .then(res => {
                    this.resetQuantity(res.data.value);
                    this.materialList = res.data.value;
                })
                .catch(err => {
                    //error
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.basic_instrument {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 3;

    .instrument_box {
        background: #fff;
        width: 500px;
        height: 520px;
        box-shadow: 0px 0px 10px 0px rgba(51, 62, 80, 0.2);
        border-radius: 8px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        box-sizing: border-box;
        padding: 20px 30px 30px;

        h3 {
            display: flex;
        }

        .el-table {
            th {
                .cell {
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    color: rgba(135, 141, 159, 1);
                }
            }

            td {
                .cell {
                    font-size: 18px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: rgba(35, 46, 65, 1);

                    .el-input-number {
                        width: 60px;

                        input {
                            font-size: 18px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: rgba(35, 46, 65, 1);
                            padding: 0;
                        }
                    }
                }
            }
        }

        h4 {
            text-align: center;
            margin-top: 30px;
        }
    }
}
</style>
