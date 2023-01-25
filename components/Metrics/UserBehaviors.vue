<template>
  <div class="p-16">
    <div class="heading2 mb-0">
      Page Views
    </div>
    <BarChart
      :chartData="chartData"
      :chartOptions="chartOptions"
    />
    <hr class="my-16"/>
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
      chartData: {
        labels: [ 'Homepage', 'Find Data', 'Tools & Resources', 'Maps', 'News & Events', 'About' ],
        datasets: [ 
          { 
            label: 'Monthly Views',
            backgroundColor: [
              '#bc00fc',
              '#bc00fc',
              '#bc00fc',
              '#bc00fc',
              '#bc00fc',
              '#bc00fc',
            ],
            borderColor: '#bc00fc',
            data: [237, 162, 99, 147, 133, 300] 
          } 
        ]
      },
      chartOptions: {
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
hr {
  border-bottom: none;
  border-left: none;
  border-right: none;
}
</style>