<template>
  <div>
    <breadcrumb :breadcrumb="breadcrumb" :title=title />
    <page-hero>
      <h1>{{ title }}</h1>
      <p>
        The SPARC Portal account allows you to fully utilize portal functionality. <a href="https://docs.sparc.science/docs/sparc-portal-login" target="_blank">Learn more</a> about which features require login and find out more details about why a Pennsieve account is created for you in the process.
      </p>
    </page-hero>
    <div class="container my-24">
      <div class="heading2 py-8">
        My Information
      </div>
      <div class="body1">First name: <span class="heading3">{{firstName}}</span></div>
      <div class="body1">Last name: <span class="heading3">{{lastName}}</span></div>
      <div class="body1">E-mail: <span class="heading3">{{profileEmail}}</span></div>
      <div class="heading2 py-8">
        Communication Preferences
        <div class="body1">
          SPARC Newsletter: 
          <template v-if="!isSubscribed">
            <span class="heading3">You are not subscribed.</span>
            <div class="body1">
              Keep up to date with all the latest news and events from the SPARC Portal by subscribing to our newsletter. View all past newsletters <a href="//us2.campaign-archive.com/home/?u=e60c48f231a30b544eed731ea&id=c81a347bd8" target="_blank">here</a>.
            </div>
            <div class="mt-8">
              <el-button class='secondary' v-on:click='subscribeToNewsletter(profileEmail, firstName, lastName)'>Subscribe to newsletter</el-button>
            </div>
          </template>
          <template v-else>
            <span class="heading3">You are currently subscribed.</span>
            <div class="body1">
              View all past newsletters <nuxt-link to="/news-and-events#stayConnected">here</nuxt-link>.
            </div>
            <div class="mt-8">
              <el-button class='secondary' v-on:click='unsubscribeFromNewsletter(profileEmail)'>Un-subscribe from newsletter</el-button>
            </div>
          </template>
        </div>
        
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
import AuthenticatedMixin from '@/mixins/authenticated/index'

export default {
  name: 'profile',

  components: {
    Breadcrumb,
    PageHero
  },

  data: () => {
    return {
      title: "SPARC Profile",
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

  head() {
    return {
      title: this.title
    }
  },

  computed: {
    ...mapGetters('user', ['firstName', 'lastName', 'profileEmail']),
    isSubscribed: function() {
      return propOr('unsubscribed', 'status', this.memberInfo) === 'subscribed'
    }
  },

  mixins: [AuthenticatedMixin, NewsletterMixin],

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

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

a {
  text-decoration: underline;
}

</style>
