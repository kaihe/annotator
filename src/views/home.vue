<template>
    <div class="container">
        <file-selector v-if="!markData.length" :selectFile="selectFile"></file-selector>
        <div v-if="markData.length" class="mark-data-wrap">
            <intersection-observer v-for="(item, index) in markData" :key="`${index}-${changeFlag}`">
                <poplar-annotation slot ="in" ref="annotator" :data="item" @change="markChanged($event, index)" :setLinkType="setLinkType"></poplar-annotation>
            </intersection-observer>
        </div>
        <div v-if="markData.length" class="bottom-btns">
            <button class="btn" @click="selectFile">重新选择文件</button>
            <button class="btn" @click="exportData">导出数据</button>
            <button class="btn" @click="importData">导入数据</button>
            <button class="btn" @click="showSPO">查看SPO</button>
        </div>
        <spo-viewer v-model="spoShown" :data="spoData" :download="exportSPO"></spo-viewer>
        <link-modal
            v-model="linkModalVisible"
            :categories="connectionCategories"
            :current="currentLinkCategory"
            :confirm="linkModalConfirm"
            :cancel="linkModalCancel"
            @addCategory="addCategory"
            @renameCategory="renameCategory"
            @removeCatetory="removeCategory"></link-modal>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import poplarAnnotation from '@/components/poplarAnnotation.vue'
import fileSelector from '@/components/fileSelector.vue'
import spoViewer from '@/components/spoViewer.vue'
import * as fs from '@/libs/fileSystem'
import { MarkData, SPO, ExportMarkData, ExportSPO, StoragedMarkData, Connection, ConnectionCategory } from './DataModel'
import { findSPO, findDS, makeMarkData, loadMarkData, transformMarkData, retransformMarkData } from './helper'
import { currentVersion } from './upgrades/index'
import intersectionObserver from '@/components/intersectionObserver.vue'
import linkModal from '@/components/linkModal.vue'

export default Vue.extend({
  components: {
    intersectionObserver,
    poplarAnnotation,
    fileSelector,
    spoViewer,
    // eslint-disable-next-line vue/no-unused-components
    linkModal
  },
  data () {
    return {
      changeFlag: 0,
      version: currentVersion,
      content: '',
      markData: [] as MarkData[],
      spoShown: false,
      spoData: [] as ExportSPO,
      linkModalVisible: false,
      currentLinkCategory: null as ConnectionCategory | null,
      connectionCategories: [] as ConnectionCategory[],
      linkModalConfirm: null as Function | null,
      linkModalCancel: null as Function | null
    }
  },
  methods: {
    async selectFile () {
      const file = await fs.selectFile()
      const fileContent: string = await fs.readFile(file)
      const markData = fileContent.split('\n').map(makeMarkData)
      this.markData = markData
      this.content = fileContent
      this.changeFlag++
      this.setStorage(fileContent)
    },

    markChanged (data: MarkData, index: number) {
      Vue.set(this.markData, index, data)
      this.setStorage()
    },

    setStorage (content? :string) {
      if (content) {
        localStorage.setItem('wordMarkContentCache', content)
      }
      const exportData = retransformMarkData(this.markData, this.content, this.connectionCategories)
      const { markData, labelCategories, connectionCategories, version } = exportData
      const storagedData: StoragedMarkData = { markData, labelCategories, connectionCategories, version }
      localStorage.setItem('wordMarkCache', JSON.stringify(storagedData))
    },

    readFromStorage () {
      const cache = localStorage.getItem('wordMarkCache')
      const content = localStorage.getItem('wordMarkContentCache')
      if (!cache) {
        return
      }
      const cacheData = JSON.parse(cache)
      const data:any = content ? { ...cacheData, content } : cacheData
      const exportMarkData = loadMarkData(data)
      if (exportMarkData) {
        this.markData = transformMarkData(exportMarkData)
        this.content = exportMarkData.content
        this.connectionCategories = exportMarkData.connectionCategories
        this.setStorage(this.content)
      }
    },

    exportData () {
      if (this.markData.length) {
        const exportData = retransformMarkData(this.markData, this.content, this.connectionCategories)
        fs.download(`data-${Date.now()}.json`, JSON.stringify(exportData))
      }
    },

    async importData () {
      const file = await fs.selectFile()
      const fileContent = await fs.readFile(file)
      const json = JSON.parse(fileContent)
      const data = loadMarkData(json)
      if (data) {
        this.markData = transformMarkData(data)
        this.content = data.content
        this.changeFlag++
        this.setStorage(data.content)
      } else {
        alert('数据版本一场，无法导入')
      }
    },

    showSPO () {
      if (this.markData.length) {
        this.spoData = this.markData
          .map(markData => {
            const content = markData.content
            const spo = findSPO(markData)
            const ds = findDS(markData)
            return (spo.length || ds.length) ? { content, spo, ds } : null
          })
          .filter(Boolean) as ExportSPO
      } else {
        this.spoData = []
      }
      this.$nextTick(() => {
        this.spoShown = true
      })
    },

    exportSPO () {
      fs.download(`SPO-${Date.now()}.json`, JSON.stringify(this.spoData))
    },

    setLinkType (linkCatetory: ConnectionCategory): Promise<ConnectionCategory> {
      if (linkCatetory) {
        this.currentLinkCategory = linkCatetory
      }
      this.linkModalVisible = true
      return new Promise((resolve, reject) => {
        this.linkModalConfirm = resolve
        this.linkModalCancel = reject
      })
    },

    addCategory (text: string) {
      const id = this.connectionCategories[this.connectionCategories.length - 1].id + 1
      const category = { id, text }
      this.connectionCategories.push(category)
            this.linkModalConfirm!(category)
            this.linkModalVisible = false
    },

    grabAnnotator () {
      let annotatorVms = this.$refs.annotator
      if (!annotatorVms) {
        return []
      }
      if (Array.isArray(annotatorVms)) {
        annotatorVms = annotatorVms as Vue[]
      } else {
        annotatorVms = [annotatorVms] as Vue[]
      }
      console.log(annotatorVms)
      return annotatorVms
    },

    renameCategory (category: ConnectionCategory, text: string) {
      const target = this.connectionCategories.find(item => item.id === category.id)!
      target.text = text

      const annotatorVms = this.grabAnnotator()
      annotatorVms.forEach((vm:any) => {
        const data: MarkData = vm.data
        const target = data.connectionCategories.find(item => item.id === category.id)
        if (target) {
          target.text = text
        }

        if (data.connections.find(item => item.categoryId === category.id)) {
          vm.refresh()
        }
      })
    },

    removeCategory (category: ConnectionCategory) {
      const index = this.connectionCategories.findIndex(item => item.id === category.id)
      this.connectionCategories.splice(index, 1)
      const annotatorVms = this.grabAnnotator()
      annotatorVms.forEach((vm:any) => {
        const data: MarkData = vm.data
        const target = data.connectionCategories.find(item => item.id === category.id)
        if (target) {
          const index = data.connectionCategories.indexOf(target)
          data.connectionCategories.splice(index, 1)
        }
        if (data.connections.find(item => item.categoryId === category.id)) {
          data.connections = data.connections.filter(item => item.categoryId !== category.id)
          vm.refresh()
          vm.emitChange()
        }
      })
    }
  },

  created () {
    this.readFromStorage()
    if (!this.connectionCategories.length) {
      this.connectionCategories = makeMarkData('').connectionCategories
    }
  }
})
</script>
<style lang="less" scoped>
.bottom-btns {
    position: fixed;
    right: 50px;
    bottom: 20px;
    .btn {
        margin-left: 10px
    }
}
</style>
