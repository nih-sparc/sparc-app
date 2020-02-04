<template>
  <div class="bf-dialog-header">
    <span class="bf-dialog-header-title">{{ title }}</span>
    <button v-if="!this.$slots.tabs" class="icon-close" @click="onClose">
      <svg-icon icon="icon-remove" height="12" width="12" />
    </button>
    <slot name="tabs" />
  </div>
</template>

<script>
export default {
  name: 'BfDialogHeader',

  props: {
    title: {
      type: String,
      default: ''
    }
  },

  methods: {
    /**
     * Trigger el-dialog close event
     */
    onClose: function() {
      this.$parent.handleClose()
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/_variables.scss';

.bf-dialog-header {
  align-items: center;
  display: flex;
  position: relative;
  .icon-close {
    color: $glial;
    cursor: pointer;
  }
}
.bf-dialog-header-title {
  flex: 1;
  font-size: 18px;
  font-weight: 400;
  line-height: 1;
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000;
}
.tabs {
  bottom: -25px;
  right: 40px;
  position: absolute;
}
</style>
