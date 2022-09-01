<template>
  <div>
    <breadcrumb :breadcrumb="breadcrumb" title="Profile" />
    <page-hero>
      <h1 class="heading1">SPARC Profile</h1>
    </page-hero>
    <div class="container my-32">
      <div class="heading3">First name: <span class="heading2">{{firstName}}</span></div>
      <div class="heading3">Last name: <span class="heading2">{{lastName}}</span></div>
      <div class="heading3">E-mail: <span class="heading2">{{profileEmail}}</span></div>
      <div class="mt-16">
        <el-button v-if='!isSubscribed' class='secondary' v-on:click='subscribeToNewsletter(profileEmail, firstName, lastName)'>Subscribe to newsletter</el-button>
        <el-button v-else class='secondary' v-on:click='unsubscribeFromNewsletter(profileEmail)'>Un-subscribe from newsletter</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import { propOr } from 'ramda'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import NewsletterMixin from '@/components/ContactUsForms/NewsletterMixin'

export default {
  name: 'profile',

  components: {
    Breadcrumb,
    PageHero
  },

  data: () => {
    return {
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ],
    }
  },

  computed: {
    ...mapGetters('user', ['firstName', 'lastName', 'profileEmail']),
    isSubscribed: function() {
      return propOr('unsubscribed', 'status', this.memberInfo) === 'subscribed'
    }
  },

  middleware: 'authenticated',

  mixins: [NewsletterMixin],

  watch: {
    profileEmail: {
      handler: async function(newValue) {
        if (newValue !== '') {
          this.getMemberInfo(newValue)
        }
      },
      immediate: true
    }
  }
}

</script>
