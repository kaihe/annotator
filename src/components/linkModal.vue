<template>
    <el-dialog
        title="Link类型"
        :visible="value"
        :destroy-on-close="true"
        @update:visible="$emit('input', $event)"
        @close="onClose"
        width="260px">
        <ul class="category-list">
            <list-item
              v-for="item in categories"
              :key="item.id"
              :class="{ active: item.id === value }"
              :value="item.text"
              @click.native="select(item)"
              @change="$emit('renameCategory', item, $event)"
              @delete="$emit('removeCategory', item)">{{ item.text }}</list-item>
        </ul>
        <div class="add-link-wrap">
            <el-button v-if="!inputing" size="mini" @click="inputing=true">
              <i class="el-icon-view el-icon-circle-plus-outline"></i> 添加
            </el-button>
            <el-input v-if="inputing" v-model="inputValue" :autofocus="true" :clearable="true" size="mini">
              <span slot="append" class="ok-btn" @click="addCategory">ok</span>
            </el-input>
        </div>
    </el-dialog>
</template>
<script lang="ts">
import Vue from 'vue'
import { Dialog, Input, Button, Message } from 'element-ui'
import { ConnectionCategory } from '@/views/DataModel'
import listItem from './listItem.vue'
export default Vue.extend({
  components: {
    elDialog: Dialog,
    elInput: Input,
    elButton: Button,
    listItem
  },
  props: ['value', 'categories', 'current', 'confirm', 'cancel'],
  data () {
    return {
      inputing: false,
      inputValue: ''
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    select (item: ConnectionCategory) {
      this.confirm(item)
      this.close()
    },
    addCategory () {
      if (this.inputValue) {
        const categories: ConnectionCategory[] = this.categories
        if (categories.find(item => item.text === this.inputValue)) {
          Message.error(`“${this.inputValue}”已存在`)
        } else {
          this.$emit('addCategory', this.inputValue)
        }
      }
    },

    onClose () {
      this.cancel()
      this.inputing = false
      this.inputValue = ''
    }
  }
})
</script>
<style lang="less" scoped>
.category-list {
    padding: 0;
    margin: 0;
    max-height: 189px;
    overflow-y: auto;
    li {
        list-style: none;
        padding: 4px 6px;
        cursor: pointer;
        &:hover{
            background: #eee;
        }
        &.active{
            background: rgb(155, 155, 248);
        }
    }
}
.add-link-wrap {
    margin-top: 20px;
}
.ok-btn {
    cursor: pointer;
}
</style>
