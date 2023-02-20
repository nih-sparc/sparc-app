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
      //This will hold the data that will be used to generate the bars
      dict_for_viz: {},
      dataChartData: {
        labels: [ 'All', 'Datasets', 'Anatomical Models', 'Computational Models', 'Embargoed' ],
        datasets: [ 
          { 
            label: 'Last Month',
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
  mounted() {
  this.fetchMetricsData()
},
  computed: {
    scientificContribution() {
      return propOr({}, 'scientificContribution', this.metricsData)
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
          this.unpackMetricsDataSci()
        })
        .catch(error => console.log(error))
    },
    //Function takes all of the data from each dataSource and places it in the dict_for_viz
    unpackMetricsDataSci() {
      //dict_for viz has name of data source as key and its reuturn object as the value
      this.dict_for_viz = this.dataSources.reduce((accumulator, dataSource) => {
        accumulator[dataSource.name] = dataSource.data
        return accumulator
      }, {})
      .then(this.populateDataArraySci())
    },
    //Take the data out of the dict, and place the data into the proper sequence for the visualization
    populateDataArraySci() {
      //For minimal instance. Will have 3 month bins as well.
      //json_dict_for_viz = JSON.parse(dict_for_viz)
      //assign entry in list that viz uses to specific dictionary item in return
      //chart_data[0] = dict_for_viz.sparc.metrics["All SPARC Categories over 1 month"]
      //chart_data[1] = dict_for_viz.sparc.metrics["SPARC datasets over 1 month"]
      //chart_data[2] = dict_for_viz.sparc.metrics["SPARC maps over 1 month"]
      //chart_data[3] = dict_for_viz.sparc.metrics["SPARC computational models over 1 month"]
      //samples = dict_for_viz.sparc.metrics.M["Current number of samples (cumulative)"]
      //samples = dict_for_viz.sparc.metrics.M["Current nymber of subjects (cumulative)"]
      //anatomical_structs.insert(0, dict_for_viz.sparc.metrics["Anatomical structures breakdown"]["vagus nerve"])
      //anatomical_structs.insert(1,dict_for_viz.sparc.metrics["Anatomical structures breakdown"]["colon"])
      //anatomical_structs.insert(2, dict_for_viz.sparc.metrics["Anatomical structures breakdown"]["heart"])
      //anatomical_structs.insert(3, dict_for_viz.sparc.metrics["Anatomical structures breakdown"]["stomach"])
      //anatomical_structs.insert(4, dict_for_viz.sparc.metrics["Anatomical structures breakdown"]["urinary bladder"])
      //size_across_all_data = dict_for_viz.pennsieve.metrics["Total Number of Bytes"]
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