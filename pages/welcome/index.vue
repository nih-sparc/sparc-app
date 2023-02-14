<template>
  <div class="container mb-16">
    <setup-new-user />
  </div>
</template>

<script>
import SetupNewUser from '@/components/SetupNewUser/SetupNewUser.vue'

export default {
  name: 'welcome',
  components: {
    SetupNewUser
  },
  middleware: 'authenticated',
  head() {
    return {
      title: "Welcome"
    }
  },
}
</script>

<style scoped lang="scss">
</style>
