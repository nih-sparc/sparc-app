<template>
  <div class="controls">
    <div class="control control-search-input" v-if="isSearchVisible">
      <el-input
        v-model="terms"
        placeholder="Search Documentation..."
        suffix-icon="el-icon-search"
        @keyup.native.enter="submit"
      />
    </div>
    <div class="search-button" v-if="isSearchVisible">
      <el-button
        type="primary"
        class="view-search-results"
        @click.native="submit"
      >
        {{ submitText }}
      </el-button>
      <el-button
        v-if="isClearSearchVisible"
        class="btn-clear-search"
        @click.native="clearSearch"
      >
        Clear search
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  pathOr
} from 'ramda'

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
      terms: null,
    };
  },
  watch: {
    
  },

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
      // this.terms = ''
      // this.submit()
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
      this.$emit('query', this.terms);
    }
  }
};
</script>

<style lang="scss" scoped>
.controls {
  align-items: center;
  display: flex;
  width:100%;
  display: flex;
  max-width: 900px;
}

.control {
  display: inline-block;

  :selected {
    color:red
  }
}

.search-control {
  border: 0;
  -webkit-appearance: none;
  width: 100%;
  height: 100%;
}

.control-search-type {
  margin-right: 8px;
  // width: 180px;
}
.control-search-input {
  flex: 1;
  margin-right: 16px;
  width: 100%
}

.search-button {

  .view-search-results {
    background: #24245b;
    border: 0;
    height: 40px;
  }
}

.btn-clear-search {
  background: none;
  border: none;
  color: #8300bf;
  padding: 0;
}
</style>
