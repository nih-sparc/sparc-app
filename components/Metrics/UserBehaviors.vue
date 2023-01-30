<template>
  <div class="p-16">
    <div class="heading2 mb-0">
      Page Views
    </div>
    <BarChart
      :chartData="pageChartData"
      :chartOptions="pageChartOptions"
    />
    <hr class="my-16"/>
    <div class="heading2 mb-0">
      User Types
    </div>
    <BarChart
      :chartData="usersChartData"
      :chartOptions="usersChartOptions"
    />
    <hr class="my-16"/>
    <div class="row">
      <div class="col">
        <div class="col-header heading2 mb-0">
          Total Downloads:
        </div>
        <div class="col-data">
          1375
        </div>
        <div>
          (212 last month)
        </div>
      </div>
      <div class="col">
        <div class="col-header heading2 mb-0">
          Dataset Contributors:
        </div>
        <div class="col-data">
          123
        </div>
        <div>
          (12 new in the last month)
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { propOr } from 'ramda'
import BarChart from '@/components/Charts/BarChart.vue'

export default {
  name: 'UserBehaviors',
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
      pageChartData: {
        labels: [ 'Homepage', 'Find Data', 'Tools & Resources', 'Maps', 'News & Events', 'About' ],
        datasets: [ 
          { 
            label: 'Last Month',
            backgroundColor: [
              '#8300bf',
              '#8300bf',
              '#8300bf',
              '#8300bf',
              '#8300bf',
              '#8300bf',
            ],
            borderColor: '#8300bf',
            data: [237, 162, 99, 147, 133, 300] 
          } 
        ]
      },
      pageChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        drawOnChartArea: false,
        title: {
          display: true,
        },
        legend: {
          labels: {
            boxWidth: 13
          },
          position: 'right',
          align: 'start',
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
              labelString: 'Page Views',
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
      usersChartData: {
        labels: [ 'Returning', 'New' ],
        datasets: [ 
          { 
            label: 'Last Month',
            backgroundColor: [
              '#8300bf',
              '#8300bf',
            ],
            borderColor: '#8300bf',
            data: [460, 324] 
          } 
        ]
      },
      usersChartOptions: {
        responsive: false,
        maintainAspectRatio: false,
        drawOnChartArea: false,
        title: {
          display: true,
        },
        legend: {
          labels: {
            boxWidth: 13
          },
          position: 'right',
          align: 'start',
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
              labelString: 'Users',
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
    userBehaviors() {
      return propOr({}, 'userBehaviors', this.metricsData)
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