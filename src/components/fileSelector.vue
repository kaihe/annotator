<template>
    <div class="wrap">
        <button class="btn" @click="selectFile"> 选择文件</button>
        <p class="desc">支持<em>.txt</em>文件</p>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['selectFile']
})
</script>
<style lang="less" scoped>
.wrap {
    padding: 50px;
}
.desc {
    font-size: 14px;
    color: #ccc;
    em {
        padding: 0 2px;
        &::before, &::after {
            content: "\"";
        }
    }
}
.btn{
    margin-right: 10px;
}
</style>
