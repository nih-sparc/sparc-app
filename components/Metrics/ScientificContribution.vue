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
          Samples:
        </div>
        <div class="col-data">
          79,340
        </div>
        <div>
          Across all Data
        </div>
      </div>
      <div class="col">
        <div class="col-header heading2 mb-0">
          Subjects:
        </div>
        <div class="col-data">
          11,474
        </div>
        <div>
          Across all Data
        </div>
      </div>
    </div>
    <hr class="my-16"/>
    <div class="heading2 mb-0">
      Anatomical Structures
    </div>
    <span class="col-data pl-32">
      24
    </span><span>Different Anatomical Structures</span>
    <BarChart
      :chartData="anatomicalStructuresChartData"
      :chartOptions="anatomicalStructuresChartOptions"
    />
    <hr class="my-16"/>
    <div class="row">
      <div class="col">
        <div class="col-header heading2 mb-0">
          File Storage:
        </div>
        <div class="col-data">
          642Gb
        </div>
        <div>
          Across all Data
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { propOr } from 'ramda'
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
  data() {
    return {
      dataChartData: {
        labels: [ 'All', 'Datasets', 'Anatomical Models', 'Computational Models', 'Embargoed' ],
        datasets: [ 
          { 
            backgroundColor: [
              '#8300bf',
              '#8300bf',
              '#8300bf',
              '#8300bf',
              '#8300bf',
            ],
            borderColor: '#8300bf',
            data: [214, 157, 35, 22, 3] 
          } 
        ]
      },
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
              drawTicks: false,
              drawOnChartArea: false,
              lineWidth: 2
            },
            ticks: {
              display: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Total number',
              fontFamily: 'sans-serif',
              fontSize: 16,
              fontStyle: 'bold'
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
      anatomicalStructuresChartData: {
        labels: [ 'Vagus Nerve', 'Colon', 'Heart', 'Stomach', 'Urinary Bladder' ],
        datasets: [ 
          { 
            backgroundColor: [
              '#8300bf',
              '#8300bf',
              '#8300bf',
              '#8300bf',
              '#8300bf'
            ],
            borderColor: '#8300bf',
            data: [37, 34, 27, 25, 12] 
          } 
        ]
      },
      anatomicalStructuresChartOptions: {
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
              drawTicks: false,
              drawOnChartArea: false,
              lineWidth: 2
            },
            ticks: {
              display: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Top 5',
              fontFamily: 'sans-serif',
              fontSize: 16,
              fontStyle: 'bold'
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
    }
  }
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
</style>