<template>
<div id="test2">
    <el-table :data="submitData.Staffs" row-key="StaffId" border style="width:100%;">
        <el-table-column label="序号" width="50" class-name="draggable">
            <template slot-scope="props">
                <div class="cell_index draggable">{{props.$index+1}}</div>
            </template>
        </el-table-column>
        <el-table-column label="姓名" class-name="draggable">
            <template slot-scope="props">
                <div class="cell_name draggable">{{props.row.StaffName}}</div>
            </template>
        </el-table-column>
        <el-table-column class-name="filterHeader" width="150">
            <template slot="header">
                <el-select v-model="filteredByPeriodType" class="green24x13" @change="$forceUpdate()" placeholder="选择班类型">
                    <el-option label="常日班" :value="0"></el-option>
                    <el-option label="休假" :value="1"></el-option>
                    <el-option label="备班" :value="2"></el-option>
                </el-select>
            </template>
            <template slot-scope="props">
                <div class="computedCell">{{props.$index}}</div>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import Sortable from "sortablejs";
export default {
    data() {
        return {
            submitData: {
                Staffs: [{
                    StaffId: 1,
                    StaffName: '系统管理员'
                }, {
                    StaffId: 2,
                    StaffName: '张三'
                }]
            },
            filteredByPeriodType: null
        };
    },
    created() {
        document.cookie = "name1=1111;expires="+new Date("2020-03-18")
    },
    mounted() {
        const tbody = document.querySelector(
            "#test2 .el-table__body-wrapper tbody"
        );
        Sortable.create(tbody, {
            animation: 180,
            delay: 0,
            onEnd: ({
                newIndex,
                oldIndex
            }) => {
                const currRow = this.submitData.Staffs.splice(oldIndex, 1)[0];
                this.submitData.Staffs.splice(newIndex, 0, currRow);
            }
        });
    },
    methods: {
        setCookie(name,value,n){
            var oDate = new Date();
            oDate.setDate(oDate.getDate()+n);
            document.cookie = name+"="+value+";expires="+oDate;
        },
        getCookie(name){
            var str = document.cookie;
            var arr = str.split("; ");
            for(var i = 0; i < arr.length; i++){
                //console.log(arr[i]);
                var newArr = arr[i].split("=");
                if(newArr[0]==name){
                    return newArr[1];
                }
            }
        },
        removeCookie(name){
            setCookie(name,1,-1);
        }

    },
}
</script>

<style>

</style>
