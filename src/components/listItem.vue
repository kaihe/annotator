<template>
  <li class="list-item">
    <div v-if="!inputing" class="content">
      <slot></slot>
    </div>
    <div v-if="!inputing" class="btns" @click.stop>
      <i class="el-icon-edit" @click="inputing=true"></i>
      <i class="el-icon-delete" @click="$emit('delete')"></i>
    </div>
    <div v-if="inputing" class="input-wrap" @click.stop>
      <el-input v-model="inputValue" :autofocus="true" :clearable="true" size="mini">
          <span slot="append" class="ok-btn" @click="ok">ok</span>
      </el-input>
    </div>
  </li>
</template>
<script lang="ts">
import Vue from 'vue'
import { Input } from 'element-ui'
export default Vue.extend({
  components: {
    elInput: Input
  },
  props: {
    value: String
  },
  data () {
    return {
      inputing: false,
      inputValue: this.value
    }
  },
  methods: {
    ok () {
      if (this.inputValue && this.inputValue !== this.value) {
        this.$emit('change', this.inputValue)
      }
      this.inputing = false
    }
  }
})
</script>
<style lang="less" scoped>
.list-item {
    display: flex;
    .content {
        flex: 1;
    }
    .btns {
        visibility: hidden;
        i {
            margin-right: 10px;
        }
    }
    &:hover {
        .btns {
            visibility: initial;
        }
    }
    .input-wrap {
        flex: 1;
        cursor: initial;
        .ok-btn {
            cursor: pointer;
        }
    }
}
</style>
