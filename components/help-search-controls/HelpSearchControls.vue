<template>
  <div class="search-form" @keyup.enter="submit">
    <input
      v-model="terms"
      placeholder="Search help topics"
      suffix-icon="el-icon-search"
      @keyup.enter="submit"
    />
    <button title="Search" @click="submit">
      <span class="visuallyhidden">Search</span>
      <svg-icon name="icon-magnifying-glass" height="20" width="20" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    searchOnLoad: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: 'View Results'
    },
    isClearSearchVisible: {
      type: Boolean,
      default: false
    },
    isSearchVisible: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      loading: false,
      terms: null
    }
  },
  watch: {},

  mounted: function() {
    if (this.searchOnLoad) {
      // this.setSearchOnLoad()
    }
  },

  methods: {
    /**
     * Clear search
     */
    clearSearch: function() {
      this.terms = ''
      this.submit()
    },

    /**
     * Set search and execute search
     */
    setSearchOnLoad: function() {
      // const terms = pathOr('', ['query', 'searchTerms'], this.$route)
      // const type = pathOr('datasets', ['query', 'searchType'], this.$route)
      // this.selectedType = type
      // this.terms = terms
      // this.submit()
    },

    submit() {
      this.$emit('query', this.terms)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/_variables.scss';
  .search-form {
    display: flex;
    margin: 0 0 1rem;
  }
  input {
    border: 1px solid #909399;
    border-radius: 4px;
    box-sizing: border-box;
    color: #909399;
    font-size: 0.875rem;
    margin-right: 0.5rem;
    outline: none;
    padding: 0.5rem 0.8125rem;
    width: 28.0625rem;
    &:focus {
      border-color: $median;
    }
  }
  button {
    background: #f9f2fc;
    border: 1px solid $median;
    border-radius: 4px;
    cursor: pointer;
    height: 2.5rem;
    width: 2.5rem;
  }
</style>
