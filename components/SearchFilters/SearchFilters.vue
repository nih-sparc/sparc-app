<template>
  <div>
    <h2>Filters</h2>
    <template v-for="filter in value">
      <div :key="filter.category">
        <h3>
          {{ filter.category }}
        </h3>
        <div class="filter__checkbox__wrap">
          <el-checkbox
            v-for="item in filter.items"
            :key="`${item.category}_${item.key}`"
            v-model="item.value"
            @change="$emit('input', value)"
          >
            {{ item.label }}
          </el-checkbox>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SearchFilters',

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
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 0.875em;
  font-weight: 500;
  margin-bottom: 1em;
}
h3 {
  font-size: 0.75em;
  font-weight: 500;
  margin-bottom: 0.5em;
}
.filter__checkbox__wrap {
  display: block;
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
</style>
