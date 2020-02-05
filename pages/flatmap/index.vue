<template>
  <div class="atlas">
    <div class="container">
      <div class="subpage">
        <div style="width:100%;height:1028px">
          <FlatmapVuer
            entry="NCBITaxon:9606"
            height="100%"
            v-on:resource-selected="logScaffoldInteraction"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '@abi-software/flatmapvuer';
  export default {
    name: 'AtlasFlatMap',
    methods: {
      logScaffoldInteraction: function(payload) {
        console.log(JSON.stringify(payload, undefined, 2))
      }
    }
  }
</script>
