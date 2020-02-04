<template>
  <el-dialog :visible="visible" :show-close="false" @close="closeDialog">
    <bf-dialog-header slot="title" :title="dialogHeader" />

    <dialog-body>
      <div v-if="activeFilters.length" class="active__filters-wrap">
        <div class="active__filters">
          <div
            v-for="(filter, filterIdx) in value"
            :key="filter.category"
            class="active__filters__category"
          >
            <template v-for="(item, itemIdx) in filter.filters">
              <el-tag
                v-if="item.value"
                :key="`${item.key}`"
                closable
                @close="clearFilter(filterIdx, itemIdx)"
              >
                {{ item.label }}
              </el-tag>
            </template>
          </div>
        </div>
      </div>
      <template v-for="filter in value">
        <div :key="filter.category">
          <h3>
            {{ filter.category }}
          </h3>
          <div class="filter__checkbox__wrap">
            <el-checkbox
              v-for="item in filter.filters"
              :key="`${item.category}_${item.key}`"
              v-model="item.value"
              @change="$emit('input', value)"
            >
              {{ item.label }}
            </el-checkbox>
          </div>
        </div>
      </template>
    </dialog-body>

    <div slot="footer" class="dialog-footer">
      <bf-button class="ghost" @click="closeDialog">
        Clear All
      </bf-button>
      <bf-button>
        Apply
      </bf-button>
    </div>
  </el-dialog>
</template>

<script>
import { assocPath, compose, filter, propEq, flatten, pluck } from 'ramda'
import BfDialogHeader from '@/components/bf-dialog-header/BfDialogHeader.vue'
import DialogBody from '@/components/dialog-body/DialogBody.vue'
import BfButton from '@/components/shared/BfButton/BfButton.vue'

export default {
  name: 'SearchFilters',

  components: { BfButton, BfDialogHeader, DialogBody },

  props: {
    value: {
      type: Array,
      default: () => [
        {
          category: '',
          items: [
            {
              label: '',
              value: null
            }
          ]
        }
      ]
    },
    visible: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    /**
     * Compute active filters
     * @returns {Array}
     */
    activeFilters: function() {
      return compose(
        filter(propEq('value', true)),
        flatten,
        pluck('filters')
      )(this.value)
    },

    /**
     * Compute dialog header based on how many active filters
     * @returns {String}
     */
    dialogHeader: function() {
      const activeFilterLength = this.activeFilters.length
      return activeFilterLength ? `Filters (${activeFilterLength})` : `Filters`
    }
  },

  methods: {
    /**
     * Clear filter's value
     * @param {Number} filterIdx
     * @param {Number} itemIdx
     */
    clearFilter: function(filterIdx, itemIdx) {
      const filters = assocPath(
        [filterIdx, 'filters', itemIdx, 'value'],
        false,
        this.value
      )
      this.$emit('input', filters)
    },

    /**
     * Closes the dialog
     */
    closeDialog: function() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .dialog-body,
  .el-dialog__body {
    font-size: inherit;
  }
}
h2 {
  font-size: 0.875em;
  font-weight: 500;
  margin-bottom: 1em;
}
h3 {
  color: #000;
  font-size: 0.75em;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 0.8125em;
}
.filter__checkbox__wrap {
  display: block;
  padding-left: 1em;
}
.el-checkbox {
  display: flex;
  margin-bottom: 1em;
}
::v-deep .el-checkbox__label {
  font-size: 0.75rem;
  font-weight: 400;
  white-space: normal;
}
.active__filters-wrap {
  margin-bottom: 1em;
}
.active__filters,
.active__filters__category {
  display: inline;
}
.active__filters .el-tag {
  margin: 0.5em 1em 0.5em 0;
}
</style>
