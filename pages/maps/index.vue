<template>
  <div class="maps">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>Maps</h1>
      <div class="sideText">
         SPARC is creating a detailed PNS map based on SPARC data and 
         information available from the literature. The map you see 
         represents the current state of the SPARC connectivity 
         database and is not comprehensive. New connectivity will be 
         added as the SPARC program progresses.
      </div>
    </page-hero>
    <div class="page-wrap portalmapcontainer" ref="mappage">
      <client-only placeholder="Loading...">
        <div class="mapClass">
          <MapContent ref="map" :state="state" :api="api" :shareLink="shareLink" @updateShareLinkRequested="updateUUID" />
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb.vue";
import PageHero from "@/components/PageHero/PageHero.vue";

export default {
  name: "Maps",
  components: {
    Breadcrumb,
    PageHero,
    MapContent: process.client
      ? () => import("@abi-software/mapintegratedvuer").then(m => m.MapContent)
      : null
  },
  data() {
    return {
      resources: [],
      title: "Maps",
      breadcrumb: [
        {
          to: {
            name: "index"
          },
          label: "Home"
        }
      ],
      uuid: undefined,
      prefix: "/maps",
      state: undefined,
      api: process.env.portal_api,
    };
  },
  computed: {
    shareLink: function() {
      if (this.uuid)
        return this.prefix +"?id=" + this.uuid ;
      return this.prefix;
    }
  },
  methods: {
    updateUUID: function() {
      let xmlhttp = new XMLHttpRequest();
      let url = this.api + `/map/getsharelink`;
      let state = this.$refs.map.getState();
      xmlhttp.open('POST', url, true);
      //Send the proper header information along with the request
      xmlhttp.setRequestHeader('Content-type', 'application/json');
      xmlhttp.onreadystatechange = () => {//Call a function when the state changes.
          if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let state = JSON.parse(xmlhttp.responseText);
            this.uuid = state.uuid;
          }
      }
      xmlhttp.send(JSON.stringify({"state": state}));

    }
  },
  beforeMount: function() {
    this.uuid = this.$route.query.id;
    if (window) {
      this.prefix = window.location.origin + window.location.pathname;
    }
    if (this.uuid) {
      let xmlhttp = new XMLHttpRequest();
      let url = this.api + `map/getstate`;
      xmlhttp.open('POST', url, true);
      //Send the proper header information along with the request
      xmlhttp.setRequestHeader('Content-type', 'application/json');
      xmlhttp.onreadystatechange = () => {//Call a function when the state changes.
          if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let state = JSON.parse(xmlhttp.responseText);
            this.state = state.state[0];
          }
      }
      xmlhttp.send(JSON.stringify({"uuid": this.uuid}));
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.maps {

  .sideText {
    top: 0px;
    font-size: 0.8em;
    position: absolute;
    line-height: 1.2em;
    width: 50em;
    margin-left: 6em;
  }

  .sideTextRight {
    top: 0px;
    padding-left: 8px;
    background-color: lightblue;
    color: black;
    font-size: 0.7em;
    position: absolute;
    line-height: 1.2em;
    left: 57em;
    width: 23em;
    text-align:center;
  }

  .portalmapcontainer {
    margin-top: 1.5rem;
    height: 90vh;
    max-width: calc(100% - 48px);
    padding-left: 24px;
  }

  .page-wrap {
    &__results {
      font-size: 0.875em;
      font-weight: normal;
      line-height: 1em;

      @media screen and (max-width: 768px) {
        margin-left: 0.9375rem;
      }

      p {
        margin-top: 1.5rem;
      }
    }
    @media (min-width: 48em) {
      padding-top: 0;
    }
  }
}
</style>
<style lang="scss">
  .mapClass {
    position: relative;
    width: 100%;
    height: 100%;
    border: solid 1px #dcdfe6;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.06);
    @import "~@abi-software/mapintegratedvuer/dist/mapintegratedvuer"
  }
</style>
<style  src="@abi-software/mapintegratedvuer/assets/mapicon-species-style.css">
</style>
