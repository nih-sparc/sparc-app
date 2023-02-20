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
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear(),
      dataSources: [
        {
          name: 'pennsieve',
          url: `https://metrics.sparc.science/pennsieve?year=${this.currentYear}&month=${this.currentMonth}`,
          data: null
        },
        {
          name: 'ga4',
          url: `https://metrics.sparc.science/ga4?year=${this.currentYear}&month=${this.currentMonth}`,
          data: null
        },
        {
          name: 'sparc',
          url: `https://metrics.sparc.science/sparc?year=${this.currentYear}&month=${this.currentMonth}`,
          data: null
        }
      ],
      dict_for_viz: {},
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
mounted() {
  this.fetchMetricsData()
},
  computed: {
    userBehaviors() {
      return propOr({}, 'userBehaviors', this.metricsData)
    }
  },
  methods: {
    //NOTE: should put this reused behavior in set of external auxillary functions
    //Will get the data for each endpoint for the current month. This data will then be stored as 'data' within each dataSource
    //all 3 data sources data is fetched in parallel and then converted to JSON
    fetchMetricsData() {
      Promise.all(this.dataSources.map(dataSource => fetch(dataSource.url)))
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
          this.dataSources.forEach((dataSource, index) => {
            dataSource.data = data[index]
          })
          this.unpackMetricsDataUser()
        })
        .catch(error => console.log(error))
    },
    //Function takes all of the data from each dataSource and places it in the dict_for_viz
    unpackMetricsDataUser() {
      //dict_for viz has name of data source as key and its reuturn object as the value
      this.dict_for_viz = this.dataSources.reduce((accumulator, dataSource) => {
        accumulator[dataSource.name] = dataSource.data
        return accumulator
      }, {})
      //should make this a promise & verify this works
      .then(this.populateDataArrayUser())
    },
    //Take the data out of the dict, and place the data into the proper sequence for the visualization
    populateDataArrayUser() {
      //page chart data = data: [homepage, find, tools, maps, new and ev, about] ... will omit the rest
      //users chart data =  data: [returning users, new users]
      //total downloads (and last month)
      //dataset contributors (and last month)
      //page_chart_data = data_viz_dict.ga4.metrics["All screen page views in the last month"]
      //users_chart_data.insert(0, data_viz_dict.ga4.metrics["Returning users in the last month"])
      //users_chart_data.insert(1, data_viz_dict.ga4.metrics["New users in the last month"])
      //total_downloads_last_3 = data_viz_dict.pennsieve["Number of SPARC portal downloads (3 month aggregation)"]
      //total_downloads_last_month = data_viz_dict.pennsieve["Number of monthly SPARC portal downloads "]
      //contributors. Use users??
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