<template>
  <div :class="['facet-label', { disabled: disabled }]">
    <div class="body1 title">
      <span>
        {{ label }}
        <sparc-tooltip placement="left-center">
          <div slot="data" v-html="tooltip"/>
          <svg-icon slot="item" v-show="showHelpIcon" class="purple-fill" icon="icon-help" width="26" height="26" />
        </sparc-tooltip>
      </span>
      <svg-icon
        v-show="showCollapsibleArrow"
        class="ml-8 icon-arrow"
        name="icon-arrow"
        :dir="collapsibleArrowDir"
        height="15"
        width="15"
        @click="onArrowClicked"
      />
    </div>
    <div v-show="showContent" class="light-gray-background">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FacetLabel',

  components: {},

  props: {
    label: {
      type: String,
      default: ''
    },
    collapseByDefault: {
      type: Boolean,
      default: true
    },
    showCollapsibleArrow: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showHelpIcon: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      collapsed: this.collapseByDefault
    }
  },
  computed: {
    collapsibleArrowDir: function() {
      return this.showContent ? 'down' : 'up'
    },
    showContent: function() {
      return !(this.collapsed || this.disabled)
    }
  },
  methods: {
    onArrowClicked() {
      if (!this.disabled) {
        this.collapsed = !this.collapsed
      }
      return this.collapsed
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.light-gray-background {
  background-color: #FAFBFC
}

.facet-label {
  border-top: 1px solid $lineColor2;
}

.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0.5rem 1rem;
  font-weight: 500;
  align-items: center;
  text-transform: uppercase;
  cursor: default;
  svg {
    cursor: pointer
  }
}

.purple-fill {
  fill: $purple;
}

.disabled {
  opacity: 0.5;
  background-color: $background;
}
</style>
