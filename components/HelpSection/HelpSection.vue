<template>
  <!-- <div class="event-card"> -->
    <!-- <div class="event-content"> -->
        <div class="event-content-wrap">
            <h3>
                {{ section.fields.title }} 
            </h3>
            <div class="section events">
            <div v-for="(item, index) in section.fields.helpDocuments"
                :key="`${item}-${index}`">
                <help-card :helpItem=item />
            </div> 
        </div>
      </div>
    <!-- </div> -->
  <!-- </div> -->
</template>

<script>
import {
  propOr,
  take
} from 'ramda'

import HelpCard from "@/components/helpCard/HelpCard.vue";

export default {
    name: 'help-section',
    components: {
        HelpCard
    },
    props: {
        section: {
            type: Object,
            default: () => {
                return {
                    title: '',
                    sys: {},
                    summary: ''
                }
            }
        }
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.event-card {
    //   border: solid 1px $pudendal;
  border-radius: 3px 3px 0 0;
  max-width: 800px;
}
h3 {
  color: $vagus;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 8px;
  word-break: break-word;
}
.subtitle {
  color: #000;
  font-size: 14px;
  font-weight: normal;
  line-height: 24px;
  margin-bottom: 16px;
}
.details {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .detail {
    align-items: center;
    display: flex;
    padding-right: 24px;
    color: #404554;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 16px;
    margin-bottom:8px;
    .svg-icon {
      margin-right: 8px;
    }
    .eventinfo {
        margin-top:8px;
    }
  }
}
.event-content {
  display: flex;
  flex-direction: row;
//   padding: 24px 16px;
  img {
    display: block;
    width: 86px;
    height: 86px;
  }

  .image {
      margin: 2px;
  }
  
  .event-content-wrap {
      margin-left: 16px;
  }
}
.meta {
  border-top: solid 1px $pudendal;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 16px;
  .author {
    font-size: 12px;
    line-height: 14px;
  }
  .tags {
    font-size: 12px;
    line-height: 14px;
  }
}
a {
  &:focus {
    color: $vagus;
  }
}
</style>