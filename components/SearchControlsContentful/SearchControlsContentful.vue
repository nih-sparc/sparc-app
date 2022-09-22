<template>
  <div class="search-form" @keyup.enter="submit">
    <div class="input-wrap">
      <el-input
        v-model="terms"
        :placeholder="placeholder"
        @keyup.enter="submit"
      />
      <button v-if="terms" class="btn-clear-search" @click="clear">
        <svg-icon
          icon="icon-clear"
          color="#909399"
          height="22"
          width="22"
        />
      </button>
    </div>
    <el-button :class="['px-8', 'py-0', searchButtonClass]" title="Search" @click="submit">
      <svg-icon
        icon="icon-magnifying-glass"
        height="25"
        width="25"
        dir="left"
      />
      <span class="search-text pr-2" v-if="showSearchText">Search</span>
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    showSearchText: {
      type: Boolean,
      default: false
    },
    searchButtonClass: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      loading: false,
      terms: this.$route.query.search
    }
  },

  watch: {
    '$route.query.search': function() {
      this.terms = this.$route.query.search
    }
  },

  methods: {
    submit() {
      this.$router.push({ path: this.path, query: { ...this.$route.query, search: this.terms } })
    },
    clear() {
      this.$router.push({ path: this.path, query: { ...this.$route.query, search: undefined } })
      this.terms = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.search-form {
  display: flex;
  min-width: 275px;
  margin: 0;
}
.input-wrap {
  display: flex;
  margin-right: 0.5rem;
  position: relative;
  @media (min-width: 768px) {
    width: 28.0625rem;
  }
}
input {
  background: #fff;
  border: 1px solid #909399;
  border-radius: 4px;
  box-sizing: border-box;
  color: #909399;
  flex: 1;
  font-size: 0.875rem;
  outline: none;
  margin: 0;
  padding: 0.5rem 2.25rem 0.5rem 0.8125rem;
  &:focus {
    border-color: $median;
  }
  &::-ms-clear {
    display: none;
  }
}
.btn-clear-search {
  background: none;
  border: none;
  cursor: pointer;
  height: 100%;
  outline: none;
  margin: 0;
  position: absolute;
  right: 0;
  top: 0;
  &:hover,
  &:active {
    opacity: 0.75;
  }
}
.search-text {
  vertical-align: middle !important;
}
</style>
