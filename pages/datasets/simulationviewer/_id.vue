<template>
  <div class="simulation-viewer-page">
    <div class="page-wrap container">
      <detail-tabs :active-tab="activeTab" :tabs="tabs" @set-active-tab="activeTab = $event">
        <client-only placeholder="Loading simulation ...">
          <div class="simulation-vuer-container">
            <SimulationVuer :apiLocation="apiLocation" :id="id" />
          </div>
        </client-only>
      </detail-tabs>
    </div>
  </div>
</template>

<script>
import DetailTabs from "@/components/DetailTabs/DetailTabs.vue";

export default {
  name: "SimulationViewerPage",
  components: {
    DetailTabs,
    SimulationVuer: process.client
      ? () => import("@abi-software/simulationvuer").then(m => m.SimulationVuer)
      : null,
  },
  data: function () {
    return {
      activeTab: "simulation",
      apiLocation: process.env.portal_api,
      id: Number(this.$route.query.id),
      tabs: [
        {
          label: "Simulation Viewer",
          type: "simulation",
        }
      ],
    };
  },
};
</script>

<style lang="scss">
.simulation-vuer-container {
  @import '~@abi-software/simulationvuer/dist/simulationvuer';
  min-height: 24px;
}
</style>
