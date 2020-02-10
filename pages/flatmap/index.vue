<template>
  <div class="atlas">
    <div class="container">
      <div class="subpage">
        <div style="width:100%;height:1028px">
          <client-only placeholder="Loading viewer...">
            <FlatmapVuer
              entry="NCBITaxon:9606"
              height="100%"
              v-on:resource-selected="logScaffoldInteraction"
            />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@abi-software/flatmapvuer';
import '@abi-software/flatmapvuer/dist/flatmapvuer.css'
export default {
  name: 'AtlasFlatMap',
  methods: {
    logScaffoldInteraction: function(payload) {
      console.log(JSON.stringify(payload, undefined, 2))
    }
  }
}
</script>
