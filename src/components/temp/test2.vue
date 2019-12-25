<template>
<div>{{test}}</div>
</template>

<script>
import {MessagePack} from 'assert';
import {encode,decode} from '@msgpack/msgpack';
export default {
    data() {
        return {
            test: ''
        };
    },
    created() {
        axios({
            url:`/system`,
            method: 'POST',
            data: {
                operationName: "TestQuery",
                query: `query TestQuery{
                    storedEvent(id:${location.href.split('?')[1]}){
                        id,aggregate,aggregateId,timestamp,commandViewData
                    }
                }`,
                variables: {}
            }
        }).then(res=>{
            console.log(decode(res.data.data.storedEvent[0].commandViewData))
            this.test = decode(res.data.data.storedEvent[0].commandViewData);
        })
    },
    methods: {
        
    },
}
</script>

<style>

</style>
