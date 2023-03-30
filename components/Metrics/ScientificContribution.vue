<template>
  <div class="p-16">
    <div class="heading2 mb-0">
      Data
    </div>
    <BarChart
      :chartData="dataChartData"
      :chartOptions="dataChartOptions"
    />
    <hr class="my-16"/>
    <div class="row">
      <div class="col">
        <div class="col-header heading2 mb-0">
          Samples: <span class="col-data">{{ totalSamples }}</span> <span class="body1">Across all Data</span>
        </div>
      </div>
      <div class="col">
        <div class="col-header heading2 mb-0">
          Subjects: <span class="col-data">{{ totalSubjects }}</span> <span class="body1">Across all Data</span>
        </div>
      </div>
    </div>
    <hr class="my-16"/>
    <div class="heading2 mb-0">
      Anatomical Structures
    </div>
    <span class="col-data pl-32">
      {{ totalAnatomicalStructures }}
    </span><span>Different Anatomical Structures</span>
    <div class="heading3 chart-title">Top 5 Anatomical Structures</div>
    <BarChart
      :chartData="anatomicalStructuresChartData"
      :chartOptions="anatomicalStructuresChartOptions"
    />
    <hr class="my-16"/>
    <div class="row">
      <div class="col">
        <div class="col-header heading2 mb-0">
          File Storage: <span class="col-data">{{ totalFileStorage }} GB </span><span class="body1">Across all Data</span>
        </div>
      </div>
      <div v-if="totalProtocols" class="col">
        <div class="col-header heading2 mb-0">
          Number of Protocols: <span class="col-data">{{ totalProtocols }}</span> <span class="body1"> overall</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { pathOr, propOr } from 'ramda'
import BarChart from '@/components/Charts/BarChart.vue'

export default {
  name: 'ScientificContribution',
  components: {
    BarChart
  },
  props: {
    metricsData: {
      type: Object,
      default: () => {}
    },
  },
  watch: {
    scientificContribution: {
      handler: function(contribution) {
        if (!contribution) {
          return
        }
        this.dataChartData = {
          labels: contribution.dataChartLabels,
          datasets: [ 
            {
              backgroundColor: [
                'rgba(131, 0, 191, .5)',
                'rgba(131, 0, 191, .5)',
                'rgba(131, 0, 191, .5)',
                'rgba(131, 0, 191, .5)',
                'rgba(131, 0, 191, .5)',
              ],
              borderColor: 'rgba(131, 0, 191, .5)',
              data: contribution.dataChartData.total
            },
          ]
        },
        this.anatomicalStructuresChartData = {
          labels: contribution.anatomicalStructuresChartLabels,
          datasets: [ 
            {
              backgroundColor: [
                'rgba(131, 0, 191, .5)',
                'rgba(131, 0, 191, .5)',
                'rgba(131, 0, 191, .5)',
                'rgba(131, 0, 191, .5)',
                'rgba(131, 0, 191, .5)'
              ],
              borderColor: 'rgba(131, 0, 191, .5)',
              data: contribution.anatomicalStructuresChartData
            } 
          ]
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      dataChartData: {},
      dataChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        drawOnChartArea: false,
        title: {
          display: true,
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            gridLines: {
              drawTicks: true,
              drawOnChartArea: false,
              lineWidth: 2
            },
            ticks: {
              display: true,
              padding: 3,
              callback: (value, index, values) => {
                // we only want to show the greatest value tick
                if (values[0] == value) {
                  return value
                }
              }
            },
            scaleLabel: {
              display: false,
            }
          }],
          xAxes: [{
            gridLines: {
              drawTicks: false,
              drawOnChartArea: false,
              lineWidth: 2
            },
            ticks: {
              padding: 8,
              fontFamily: 'sans-serif',
              fontSize: 16,
              fontStyle: 'bold'
            },
          }]
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: {
                weight: 'bold',
                size: 16
            }
          }
        }    
      },
      anatomicalStructuresChartData: {},
      anatomicalStructuresChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        drawOnChartArea: false,
        title: {
          display: false,
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            gridLines: {
              drawTicks: true,
              drawOnChartArea: false,
              lineWidth: 2
            },
            ticks: {
              display: true,
              padding: 3,
              callback: (value, index, values) => {
                // we only want to show the greatest value tick
                if (values[0] == value) {
                  return value
                }
              }
            },
            scaleLabel: {
              display: false,
            }
          }],
          xAxes: [{
            gridLines: {
              drawTicks: false,
              drawOnChartArea: false,
              lineWidth: 2
            },
            ticks: {
              padding: 8,
              fontFamily: 'sans-serif',
              fontSize: 16,
              fontStyle: 'bold'
            },
          }]
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: {
                weight: 'bold',
                size: 16
            }
          }
        }    
      }
    }
  },
  computed: {
    scientificContribution() {
      return propOr({}, 'scientificContribution', this.metricsData)
    },
    totalAnatomicalStructures() {
      return pathOr('', ['anatomicalStructures', 'total'], this.scientificContribution)
    },
    totalSamples() {
      return pathOr('', ['samples', 'total'], this.scientificContribution)
    },
    totalSubjects() {
      return pathOr('', ['subjects', 'total'], this.scientificContribution)
    },
    totalFileStorage() {
      return pathOr('', ['fileStorage', 'totalGB'], this.scientificContribution)
    },
    totalProtocols() {
      return pathOr(undefined, ['protocols', 'total'], this.scientificContribution)
    }
  },
}

</script>
<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

hr {
  border-top: none;
  border-left: none;
  border-right: none;
  border-width: 2px;
  border-color: $lineColor1;
}

.row {
  display: flex;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
}

.col {
  text-align: center;
  width: 50%;
  @media screen and (max-width: 767px) {
    width: 100%;
  }
}

.col-header {
  text-align: left;
}

.col-data {
  font-size: 2rem;
  line-height: 2.75rem;
  color: $purple;
  font-weight: bold;
}

.chart-title {
  text-align: center;
}
</style>
