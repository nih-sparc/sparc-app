<template>
  <div class="indicator-container">
    <div
      v-for="(number, index) in count"
      :key="'indicator_' + number"
      :class="['indicator', { active: current === index }]"
      @click="$emit('clicked', index)"
    >
      {{ number }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexIndicator',
  props: {
    count: {
      type: Number,
      default: 0,
    },
    current: {
      type: Number,
      default: 0,
    }
  }
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.indicator-container {
  display: flex;
  justify-content: center;
}
.indicator {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: #f9f2fc;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  color: $purple;
  border: 1px solid $purple;
}
.indicator.active {
  background-color: $purple;
  color: white;
}
</style>
