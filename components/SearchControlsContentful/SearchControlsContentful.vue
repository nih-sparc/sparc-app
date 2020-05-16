<template>
  <div class="search-form" @keyup.enter="submit">
    <input
      v-model="terms"
      :placeholder="placeholder"
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
    placeholder: {
      type: String,
      default: ''
    },
    path: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.search-form {
  display: flex;
  min-width: 275px;
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
  width: 100%;
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
