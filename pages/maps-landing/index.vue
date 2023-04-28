<template>
  <div class="maps">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>Maps</h1>
      <p>
        SPARC is creating detailed PNS maps based on SPARC data and information
        available from the literature. The flatmaps you see here are not yet
        comprehensive and are largely derived from regions of the nervous system
        where SPARC data has been published on this site, supplemented in some
        regions by published knowledge of rat anatomy. New connectivity and
        species specificity will be added as the SPARC program progresses.
      </p>
    </page-hero>
    <portal-features :features="entries" title="What can I do with Maps?" :icon-is-top-element="false" />
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'

import PortalFeatures from '@/components/PortalFeatures/PortalFeatures.vue'

export default {
  name: 'MapsLandingPage',
  components: {
    Breadcrumb,
    PageHero,
    PortalFeatures,
  },
  async fetch() {
    //Get human scaffold location
  },
  data() {
    return {
      resources: [],
      title: 'Maps Landing Page',
      breadcrumb: [
        {
          to: {
            name: 'index',
          },
          label: 'Home',
        },
      ],
      entries: [
        {
          fields: {
            buttonLink: '/maps',
            buttonText: 'View AC Map',
            description:
              'The Anatomical Connectivity (AC) flatmaps show physical connectivity derived from SCKAN in an anatomical schematic context.',
            title: 'Anatomical Connectivity',
            icon: {
              fields: {
                file: {
                  url: 'undefined',
                },
              },
            },
          },
        },
        {
          fields: {
            buttonLink: '/maps',
            buttonText: 'View FC Map',
            description:
              'The Functional Connectivity (FC) flatmap provides a visualisation of semantic connectivity for a mammalian body.',
            title: 'Functional Connectivity',
            icon: {
              fields: {
                file: {
                  url: 'undefined',
                },
              },
            },
          },
        },
        {
          fields: {
            buttonLink: '/maps',
            buttonText: 'View 3D Body',
            description:
              'The 3D whole-body shows physical connectivity derived from SCKAN in an anatomically realistic context.',
            title: '3D Whole Body',
            icon: {
              fields: {
                file: {
                  url: 'undefined',
                },
              },
            },
          },
        },
      ],
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
