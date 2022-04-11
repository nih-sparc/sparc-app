<template>
  <div class="container mb-16">
    <div class="heading2">First name: {{firstName}}</div>
    <div class="heading2">Last name: {{lastName}}</div>
    <div class="heading2">E-mail: {{profileEmail}}</div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'profile',
  computed: {
    ...mapGetters('user', ['firstName', 'lastName', 'profileEmail']),
  },
  middleware: 'authenticated'
}

</script>