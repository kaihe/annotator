<template>
    <popover
        :value="value"
        ref="pupover"
        @input="$emit('input', $event)"
        @mousedown.native.stop
        @mouseup.native.stop
        class="el-pipover-box"
        :style="{ lseft:  `${point.x}px`, top: `${point.y}px`}"
        placement="right"
        title="选择标记类型"
        width="200"
        transition="el-zoom-in-top"
        trigger="manual">
        <ul class="category-list">
            <li v-for="(item, index) in list" :key="index" @click="_confirm(item, index)">{{ item.text}}</li>
        </ul>
    </popover>
</template>
<script lang="ts">
import Vue from 'vue'
import { Popover } from 'element-ui'
import { LabelCategory } from '../views/DataModel'

export default Vue.extend({
  props: ['list', 'value', 'confirm'],
  components: {
    Popover
  },
  data () {
    return {
      point: {
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    _confirm (item: LabelCategory, index:number) {
      this.confirm(item, index)
      this.$emit('input', false)
    }
  },
  mounted () {
    const vm = this as any
    vm.mouseupEventHandler = (e:MouseEvent) => {
      if (this.value) {
        const popoverWidth = 230
        const popoverHeight = 140
        const popover = this.$refs.popover as any
        if (popover) {
          const container = popover.$el.closet('.mark-data-wrap') as HTMLElement
          const maxWidth = Math.max(container.clientWidth, window.innerWidth)
          const maxHeight = Math.max(container.clientHeight, window.innerHeight)
          this.point.x = Math.min(e.pageX, maxWidth - 230)
          this.point.y = Math.min(e.pageY, maxHeight - 140)
        } else {
          this.point.x = e.pageX
          this.point.y = e.pageY
        }
      }
    }

    vm.mousedownEventHandler = (e: MouseEvent) => {
      this.$emit('input', false)
    }
    document.removeEventListener('mouseup', vm.mouseupEventHandler)
    document.removeEventListener('mousedown', vm.mousedownEventHandler)
  }
})
</script>
<style lang="less" scoped>
.el-popover-box{
    display: block;
    position: absolute;
    /deep/.el-popover{
        background: white;
        box-shadow: 0 0px 15px #ccc;
    }
}
.category-list{
    list-style: none;
    padding: 0;
    margin: 0;
    li{
        padding: 5px;
        &:hover{
            background: #ccc;
        }
    }
}
</style>
