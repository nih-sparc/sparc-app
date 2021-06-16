<template>
  <div class="help-page">
    <breadcrumb :breadcrumb="breadcrumb" :title="allHelpData.title" />
    <help-hero :title="allHelpData.title" :summary="allHelpData.summary" />
    <div>
      Welcome to the community page!
      <div v-for="field in helpData.fields" :key="field">
        {{ field }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
//import { Route } from 'vue-router';
import createClient from '@/plugins/contentful.js'
import HelpHero from "@/components/HelpHero/HelpHero.vue";
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'

const client = createClient()

const getHelpItem = async id => {
  try {
    const isSlug = id.split('-').length > 1

    const item = isSlug
      ? await client.getEntries({
          content_type: process.env.ctf_help_id,
          'fields.slug': id
        })
      : await client.getEntry(id)
    return isSlug ? item.items[0] : item
  } catch (error) {
    return {}
  }
}


export default {
  name: 'CommunityPage',

  components: {
    Breadcrumb,
    HelpHero
  },

  async asyncData() {
    // const successData = await client.getEntries({
    //   content_type: process.env.ctf_success_stories_id,
    // })
    const successData = await client.getEntry('1W2BabYIEBIMq12Pg2WAtB', {
      include: 2
    })
    console.dir(successData)
    return {
      helpData: successData
    }
  },

  data() {
    return {
      allHelpData: {},
      helpData: {},
      isLoadingSearch: false,
      breadcrumb: [
        {
          label: 'Home',
          to: {
            name: 'index'
          }
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.page-hero {
  background-color: #292b66;
  background-image: none;
  h2 {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
}
::v-deep h2 {
  font-size: 1.5em;
  font-weight: 500;
  line-height: 2rem;
  margin-bottom: 2rem;
  @media (min-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 2rem;
  }
}
</style>
