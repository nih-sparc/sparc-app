<template>
  <div class="search-form" @keyup.enter="$emit('search', term)">
    <div class="input-wrap">
      <el-input 
        v-model="term" 
        :placeholder="placeholder"
        @keyup.enter="$emit('search', term)"
      />
      <button v-if="term" class="btn-clear-search" @click="clear">
        <svg-icon
          icon="icon-clear"
          color="#909399"
          height="22"
          width="22"
        />
      </button>
    </div>
    <el-button class="btn-submit-search" title="Search" @click="$emit('search', term)">
      <svg-icon
        icon="icon-magnifying-glass"
        height="25"
        width="25"
        dir="left"
      />
      <span>
        Search
      </span>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'SearchForm',

  props: {
    defaultValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Enter search criteria'
    }
  },

  watch: {
    defaultValue: function(newValue) {
      this.term = newValue
    }
  },

  data() {
    return {
      term: this.defaultValue
    }
  },

  methods: {
    clear() {
      this.$emit('clear')
      this.term = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';

.search-form {
  display: flex;
  width: 100%;
}
.input-wrap {
  display: flex;
  position: relative;
  width: 100%;
  border-radius: .2rem;
  margin-right: 0.5rem;
}
input {
  background: #fff;
  border-radius: .2rem;
  box-sizing: border-box;
  border: none;
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
.btn-submit-search {
  height: 2.5rem;
  padding: 0 1.5rem;
  @media screen and (max-width: 28rem) {
    padding: 0 .5rem;
    span {
      display: none;
    }
  }
}
</style>
