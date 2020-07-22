<template>
    <drawer class="header" title="SPO" :visible="value" @update:visible="$emit('input', $event)">
        <p slot="title">SPO<button class="download-btn" @click="download">下载</button></p>
        <div class="spo-wrap">
            <section class="section" v-for="(item, index) in data" :key="index">
                <p class="content">{{ item.content }}</p>
                <div class="spo-item" v-for="(spo, spoIndex) in item.spo" :key="spoIndex">
                    <div class="flex-item"><span class="label">S</span><span class="field">{{ spo.sub[0] }}</span></div>
                    <div class="flex-item"><span class="label">P</span><span class="field">{{ spo.pre[0] }}</span></div>
                    <div class="flex-item"><span class="label">O</span><span class="field">{{ spo.obj[0] }}</span></div>
                </div>
                <div class="ds-item" v-for="(ds, dsIndex) in item.ds" :key="dsIndex">
                    <div class="flex-item"><span class="label">D</span><span class="field">{{ ds.desc[0] }}</span></div>
                    <div class="flex-item"><span class="label">S</span><span class="field">{{ ds.sub[0] }}</span></div>
                </div>
            </section>
        </div>
    </drawer>
</template>
<script lang="js">
import Vue from 'vue'
import { Drawer } from 'element-ui'
export default Vue.extend({
  props: ['value', 'data', 'download'],
  components: {
    Drawer
  }
})
</script>
<style lang="less" scoped>
.header {
    /deep/[role="heading"] {
        outline: none;
    }
    /deep/.el-drawer__body {
        overflow: auto;
    }
}
.spo-wrap {
    padding: 0 20px;
}
.section{
    padding: 10px 0;
    margin-bottom: 10px;
    border-top: 1px solid #eee;
}
.content{
    font-size: 14px;
    color: gray;
}
.spo-item, .ds-item {
    margin-bottom: 10px;
    display: flex;
    .flex-item {
        flex: 1;
    }
    .label {
        font-size: 1.4em;
        padding-right: 10px;
        color: rgba(97, 157, 255, 0.9);
    }
    .field {
        color: gray;
    }
}
.ds-item {
    color: rgba(255, 157, 97, 0.9)
}
.download-btn {
    margin-left: 20px;
}
</style>
