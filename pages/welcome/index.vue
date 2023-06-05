<template>
  <div class="container mb-16">
    <setup-new-user />
  </div>
</template>

<script>
import AuthenticatedMixin from '@/mixins/authenticated/index'
import SetupNewUser from '@/components/SetupNewUser/SetupNewUser.vue'

export default {
  name: 'welcome',
  components: {
    SetupNewUser
  },
  mixins: [AuthenticatedMixin],
  head() {
    return {
      title: "Welcome"
    }
  },
}
</script>

<style scoped lang="scss">
</style>
