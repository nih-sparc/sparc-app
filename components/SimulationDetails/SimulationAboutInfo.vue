<template>
  <div class="simulation-about-info">
    <p>
      The workflow integrates multistep single-cell, 1D and 2D model simulations
      in a single automated process. The model formulation for ventricular cells
      from rabbits (Soltis-Saucerman*) was implemented in the workflow. The
      model contains beta-adrenergic signaling pathways, and the firing rate
      model (unpublished Lewis model).
    </p>

    <p>
      Reference: *Soltis, A. R., & Saucerman, J. J. (2010). Synergy between
      CaMKII substrates and Î²-adrenergic signaling in regulation of cardiac
      myocyte Ca2+ handling. Biophysical journal, 99(7), 2038-2047.
    </p>

    <p>
      This work is also based on previous research using Kepler flows to model
      cardiac physiology: https://data.sparc.science/browse/#/datasets/23.
    </p>
  </div>
</template>

<script>
export default {
  name: 'SimulationAboutInfo'
}
</script>

<style lang="scss" scoped>
.simulation-about-info {
    p {
        font-size: 1em;
        font-weight: normal;
        line-height: 24px;

    }
}
</style>
