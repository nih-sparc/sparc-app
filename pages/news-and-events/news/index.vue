<template>
<div>
<breadcrumb :breadcrumb="breadcrumb" />
    <page-hero>
      <h1>Latest News</h1>
      <p>
        Check out the latest announcements about the SPARC portal and the latest news about the SPARC program.
      </p>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <news-list-item v-for="item in this.items" :key="item.sys.id" :item="item" />
      </div>
    </div>
</div>

</template>

<script lang="ts">
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import PageHero from '@/components/PageHero/PageHero'
import NewsListItem from '@/components/NewsListItem/NewsListItem.vue'

import createClient from '@/plugins/contentful.js';

import { fetchData, fetchNews, NewsCollection } from '../model';

const client = createClient()
const MAX_PAST_EVENTS = 8

    export default {
        name: 'News',
        components: {
            Breadcrumb,
            PageHero,
            NewsListItem
        },

         asyncData() {
            return fetchNews(client, '', 10)
        },

        data() {
            return {
              breadcrumb: [
             {
                label: 'Home',
                 to: {
                    name: 'index'
                 }
             },
             {
                label: 'News & Events',
                to: {
                  name: 'news-and-events'
                }
             },
             {
                label: 'News',
                to: {
                  name: 'news'
                }
             }
            ],
            news: {} as NewsCollection
            }
        },
    }
</script>

<style lang="scss" scoped>
.news-list-item {
  border-bottom: 2px solid #d8d8d8;
  padding: 1.5em 0;
  &:first-child {
    padding-top: 0;
  }
}
</style>