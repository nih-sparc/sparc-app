<template>
  <div class="atlas">
    <div class="container">
      <div class="subpage">
        <div>
          Atlas....here we go...
        </div>
        <div style="height:512px;width:768px">
          <ScaffoldVuer url="https://mapcore-bucket1.s3-us-west-2.amazonaws.com/others/a3/a3_metadata.json" ref="scaffold" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Atlas'
}
</script>
