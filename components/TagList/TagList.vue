<template>
  <ul class="tag-list unstyled">
    <li
      v-for="tag in tags"
      :key="tag"
    >
      <span class="tag-list-tag">
        {{ tag }}
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TagList',

  props: {
    tags: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
.tag-list {
  margin: 0;
  padding: 0;
  li {
    display: inline-block;
    margin: 0 8px 8px 0;
  }
}
.tag-list-tag {
  border-radius: 4px;
  background-color: #f2f6fc;
  color: #24245b;
  display: block;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  padding: 8px;
  text-align: center;
  text-decoration: none;
}
</style>
