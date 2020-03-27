<template>
  <div class="search-form" @keyup.enter="$emit('search')">
    <input :value="value" @input="$emit('input', $event.target.value)" />
    <button class="mr-16" title="Search" @click="$emit('search')">
      <span class="visuallyhidden">Search</span>
      <svg-icon name="icon-magnifying-glass" height="20" width="20" />
    </button>
    <a v-if="q" class="clear-link" @click="$emit('clear')">Clear Search</a>
  </div>
</template>

<script>
export default {
  name: 'SearchForm',

  props: {
    value: {
      type: String,
      default: ''
    },
    q: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';

.search-form {
  display: flex;
  align-items: center;
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

.clear-link {
  color: $cochlear;
  font-size: 1rem
}
</style>
