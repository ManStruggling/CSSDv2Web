<template>
<div id="cssdTest">
    <el-switch v-model="IsTestMode" active-color="#01BF6A" inactive-color="#dbdde6" :active-value="true" :inactive-value="false" @change="switchChange"></el-switch>
</div>
</template>

<script>
export default {
    data() {
        return {
            IsTestMode: false
        }
    },
    created() {
        this.IsTestMode = JSON.parse(sessionStorage.IsTestMode);
    },
    methods: {
        switchChange(val) {
            sessionStorage.IsTestMode = val;
        }
    },
}
</script>

<style>

</style>
