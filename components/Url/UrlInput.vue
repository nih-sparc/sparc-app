<template>
  <div>
    <div class="url-input mr-16">
      <el-input :disabled="disabled" :placeholder="placeholder" v-model="value">
          <template slot="prepend">
            <slot name="prepend" />
          </template>
      </el-input>
    </div>
    <span v-on:click="addLinkClicked" class="add-link-button link1" v-if="showAddLink && !disabled">
      + Add URL
    </span>
  </div>
</template>

<script>
export default {
  name: 'UrlInput',
  props: {
    showAddLink: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: String
  },
  watch: {
    value() {
      this.$emit("input", this.value)
    }
  },
  methods: {
    addLinkClicked() {
      this.$emit('add-link')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.url-input {
  display: inline-block;
  min-width: 75%;
}
.add-link-button {
  display: inline-block;
  text-decoration: none;
}
.add-link-button:hover {
  cursor: pointer;
}
::v-deep .is-disabled .el-input-group__prepend
{
  border-color: $lineColor1 !important;
  color: #c0c4cc !important;
}
</style>
