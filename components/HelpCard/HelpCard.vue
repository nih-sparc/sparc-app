<template>
  <div class="event-content">
    <div class="event-content-wrap">
      <nuxt-link
        :to="{ name: 'help-helpId', params: { helpId: helpItem.sys.id } }"
      >
        <h3>{{ helpItem.title }}</h3>
      </nuxt-link>
      <p>{{ helpItem.summary }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpCard',
  props: {
    helpItem: {
      type: Object,
      default: () => {
        return {
          title: ''
        }
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
h3 {
  color: $vagus;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  word-break: break-word;
}
.event-content {
  display: flex;
  flex-direction: row;
  // padding: 16px 16px;
  background-color: white;
  border: 0px;
  margin-bottom: 5px;
  min-height: 100px;

  .event-content-wrap {
    margin-left: 16px;
    padding: 16px 80px;
  }
}
a {
  &:focus {
    color: $vagus;
  }
}
</style>
