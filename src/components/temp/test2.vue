<template>
<div>test2组件</div>
</template>

<script>
export default {
    data() {
        let {
            year,
            month,
            day
        } = this.getNewDate(new Date());
        return {
            currentSelect: `${year}-${month + 1}`, //当前月份
            currentDate: {
                year,
                month,
                day
            },
            currentSelectMonth: {
                year,
                month
            },
            visibleCalendar: []
        };
    },
    methods: {
        //获取年月日
        getNewDate(date) {
            let year = date.getFullYear();
            let month = date.getMonth();
            let day = date.getDate();
            return {
                year,
                month,
                day
            };
        },
    },
}
</script>

<style>

</style>
