<template>
<div id="test2">
    <el-table :data="submitData.Staffs" border style="width:100%;">
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
            }
        };
    },
    created() {

    },
    mounted() {
        const tbody = document.querySelector(
            "#test2 .el-table__body-wrapper tbody"
        );
        var sortable = new Sortable(tbody, {
            handle: '.draggable',
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

    },
}
</script>

<style>

</style>
