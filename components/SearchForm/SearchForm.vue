<template>
  <div class="search-form" @keyup.enter="$emit('search')">
    <div class="input-wrap">
      <input :value="value" @input="$emit('input', $event.target.value)" />
      <button v-if="q" class="btn-clear-search" @click="$emit('clear')">
        <svg-icon
          name="icon-clear"
          stroke="red"
          color="#909399 #fff"
          height="22"
          width="22"
        />
      </button>
    </div>
    <el-button class="mr-8 btn-submit-search" @click="$emit('search')">
      Search
    </el-button>
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
  margin: 0 0 1rem;
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
  border: none;
  color: #909399;
  flex: 1;
  font-size: 0.875rem;
  outline: none;
  margin: 0;
  padding: 0.5rem 2.25rem 0.5rem 0.8125rem;
  &:focus {
    border-color: $median;
  }
}
.btn-clear-search {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  margin: 0;
  position: absolute;
  right: 0;
  top: 0.4375rem;
  &:hover,
  &:active {
    opacity: 0.75;
  }
}
.btn-submit-search {
  background: #f9f2fc;
  border: 1px solid $median;
  border-radius: 4px;
  cursor: pointer;
  height: 2.5rem;
  padding-left: 1.6875rem;
  padding-right: 1.6875rem;
}

.clear-search {
  background-color: transparent;
  display: inline-block;
  border: none;
  width: fit-content;
  color: $cochlear;
  font-size: 1rem;
  font-family: $font-family;
}
</style>
