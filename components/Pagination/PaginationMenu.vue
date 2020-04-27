<template>
  <el-dropdown
    trigger="click"
    placement="bottom-start"
    @command="$emit('update-page-size', $event)"
    @visible-change="isMenuOpen = $event"
  >
    <button class="dataset-filter-dropdown el-dropdown-link">
      <span class="el-dropdown-text-link">
        {{ paginationItemLabel }} per page {{ pageSize }}
      </span>
      <svg-icon
        class="ml-8"
        name="icon-arrow-up"
        :dir="menuArrowDir"
        height="10"
        width="10"
      />
    </button>
    <el-dropdown-menu
      slot="dropdown"
      class="bf-menu"
    >
      <el-dropdown-item
        v-for="option in pageSizeOptions"
        :key="option"
        class="icon-item"
        :command="option"
      >
        {{ option }}
        <svg-icon
          v-if="pageSize === option"
          icon="icon-check"
          class="item-icon-check"
          width="20"
          height="20"
        />
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'PaginationMenu',

  props: {
    paginationItemLabel: {
      type: String,
      default: 'Items'
    },
    pageSize: {
      type: Number,
      default: 25
    },
    pageSizeOptions: {
      type: Array,
      default: () => {
        return [
          25,
          50,
          100
        ]
      }
    }
  },

  data: function() {
    return {
      isMenuOpen: false
    }
  },

  computed: {
    /**
     * Compute dataset filter arrow direction
     * @returns {String}
     */
    menuArrowDir: function() {
      return this.isMenuOpen ? 'up' : 'down'
    },
  }
}
</script>
