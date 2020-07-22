<template>
    <div class="wrap" :class="{ active} ">
        <div ref="container" class="annotator-container" @mouseenter="active = true" @mouseleave="active = false "></div>
        <popover v-model="showPopover" :list="categories" :confirm="selectType"></popover>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Annotator, Action } from 'poplar-annotation'
import 'element-ui/lib/theme-chalk/index.css'
import Popover from './popover.vue'
import { MarkData, LabelCategory, Connection } from '../views/DataModel'

export default Vue.extend({
  props: ['data', 'setLinkType'],
  components: {
    Popover
  },
  data () {
    return {
      showPopover: false,
      selected: null as { startIndex: number, endIndex: number } | null,
      active: false,
      annotator: null as Annotator | null
    }
  },
  computed: {
    categories () {
      const data = this.data as MarkData
      return data.labelCategories
    }
  },
  methods: {
    init () {
      const annotator = new Annotator(JSON.stringify(this.data), this.$refs.container as HTMLElement, {
        allowMultipleLabel: 'differentCategory',
        contentEditable: false
      });
      (window as any).annotator = this.annotator = annotator

      annotator.on('textSelected', (startIndex, endIndex) => {
        const data: MarkData = this.data
        console.log(data.content.slice(startIndex, endIndex))
        this.showPopover = true
        this.selected = { startIndex, endIndex }
      })

      // right click to delete
      annotator.on('labelRightClicked', id => {
        this.annotator!.applyAction(Action.Label.Delete(id))
        this.emitChange()
      })

      // connection
      annotator.on('twoLabelsClicked', async (fromId: number, toId: number) => {
        const data: MarkData = this.data
        const typeMap: { [key:number]: string } = {
          0: 'S',
          1: 'P',
          2: 'O',
          3: 'D'
        }
        const fromLabel = data.labels.find(label => label.id === fromId)!
        const toLabel = data.labels.find(label => label.id === toId)!

        const category = await this.setLinkType()
        const linkTypeId = category.id

        // 如果类型不存在需要添加
        if (!annotator.store.connectionCategoryRepo.get(linkTypeId)) {
          data.connectionCategories.push(category)
          this.refresh()
        }

        // 生成连线
        const action = Action.Connection.Create(linkTypeId, fromId, toId)
        this.annotator!.applyAction(action)
        this.emitChange()
      })

      // 右键删除（连线）
      annotator.on('connectionRightClicked', (id: number) => {
        annotator.applyAction(Action.Connection.Delete(id))
        this.emitChange()
      })

      // 点击连线（重选类型）
      annotator.on('connectionClicked', async (id: number) => {
        const data: MarkData = this.data
        const link = data.connections.find(link => link.id === id)!
        let category = data.connectionCategories.find(item => item.id === link.categoryId)
        category = await this.setLinkType(category)
      })
    },

    // 提交更改
    emitChange () {
      const data = this.annotator!.store.json
      this.$emit('change', data)
    },

    // 选择标注类型
    selectType (item: LabelCategory) {
      const { startIndex, endIndex } = this.selected!
      const label = Action.Label.Create(item.id, startIndex, endIndex)
      this.annotator!.applyAction(label)
      this.emitChange()
    },

    refresh () {
      try {
        this.annotator!.remove()
      } catch (error) {
      }
      this.init()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy () {
    if (this.annotator) {
      try {
        this.annotator.remove()
      } catch (error) {

      }
    }
  }
})
</script>

<style lang="less" scoped>
.wrap{
    border: 1px solid transparent;
    transition: all .3s;
    .annotator-btn{
      display: none;
    }
    &:hover{
      .annotator-btn{
          display: inline;
      }
    }
    .edit-input{
      width: 260px;
    }

    &.active{
      border-radius: 5px;
      box-shadow: 0 0 5px rgba(97, 157, 255, 0.9);
      border: 1px solid rgba(97, 157, 255, 0.9);
    }
}
.annotator-btn{
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
}

.annotator-container {
  /deep/svg {
      width: 100%;
  }

  /deep/textarea.poplar-annotation-content {
      width: 0 !important;
  }
}

</style>
