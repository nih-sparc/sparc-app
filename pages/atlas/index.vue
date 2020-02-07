<template>
  <div class="atlas">
    <div class="container">
      <div class="subpage">
        <div style="height:1028px;width:100%">
          <client-only placeholder="Loading viewer...">
            <ScaffoldVuer
              url="https://mapcore-bucket1.s3-us-west-2.amazonaws.com/others/a3/a3_metadata.json"
              v-on:scaffold-selected="logScaffoldInteraction"
            />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@abi-software/scaffoldvuer';
import '@abi-software/scaffoldvuer/dist/scaffoldvuer.css';
export default {
  name: 'Atlas',
  methods: {
    logScaffoldInteraction: function(payload) {
      console.log(JSON.stringify(payload, undefined, 2))
    }
  }
}
</script>
