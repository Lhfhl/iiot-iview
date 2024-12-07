<template>
    <div slot="body" style="height:100%; width:100%;">
        <div style="height:100%;"> 
            <iframe :src="flowSrc" style="height:100%; width:100%;margin:0;border:0;"> </iframe>
        </div>
    </div>
</template>
 
 
<script>
export default {
    data() {
        return {
            flowSrc: null
        } 
    },
    created() {
        this.preview();
    },
    methods: {
        preview() {
            this.flowSrc = 'http://10.112.196.200:1880';  //直接给flowSrc赋值链接
        }
    }
}
</script>