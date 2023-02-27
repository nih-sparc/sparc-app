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
          8065
          <!-- {{ samples }} -->
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
          2804
          <!-- {{ subjects }} -->
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
      43
      <!-- Get actual numbers-->
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
          24592623576943 bytes 
          <!-- {{ total_size }} bytes -->
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
      //current date in M/DD/YYYY format
      currentDate: new Date().toLocaleDateString(),
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
      samples: 0,
      subjects: 0,
      total_size: 0,
      dataChartData: {
        labels: [ 'All', 'Datasets', 'Anatomical Models', 'Computational Models', 'Embargoed (pending)' ],
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
            data: [235, 173, 36, 26, 0]
            //should be empty initially
            //data: [] 
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
            data: [51, 48, 40, 36, 16] 
            //data: []
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
    //Gets date exactly 1 month ago in DD/MM/YYYY format. Takes date in 'YYYY-MM-DDT00:00:00.000Z' format (ie. Date object)
    subtractMonths(date, months=1) {
      date.setMonth(date.getMonth() - months);
      return date.toLocaleDateString()
    },
    //NOTE: should put this reused behavior in set of external auxillary functions
    //Will get the data for each endpoint for the current month. This data will then be stored as 'data' within each dataSource
    //all 3 data sources data is fetched in parallel and then converted to JSON
        //THE FORMAT FOR OBJECTS FOR ALL DATA SOURCES ARE LISTED BELOW
    /*
    {
  "year_month_source": {
    "S": "2023_01_sparc"
  },
  "source": {
    "S": "sparc"
  },
  "all_sparc_categories_cumulative": {
    "N": "235"
  },
  "all_sparc_categories_last_3_mo": {
    "N": "21"
  },
  "all_sparc_categories_last_mo": {
    "N": "2"
  },
  "anatomical_structures_breakdown": {
    "M": {
      "colon": {
        "N": "48"
      },
      "heart": {
        "N": "40"
      },
      "stomach": {
        "N": "36"
      },
      "urinary bladder": {
        "N": "16"
      },
      "vagus nerve": {
        "N": "51"
      }
    }
  },
  "current_number_of_anatomical_structures": {
    "N": "43"
  },
  "month": {
    "N": "1"
  },
  "new_sparc_computational_models_last_1_mo": {
    "N": "2"
  },
  "new_sparc_datasets_last_1_mo": {
    "N": "0"
  },
  "new_sparc_datasets_last_3_mo": {
    "N": "0"
  },
  "new_sparc_maps_last_1_mo": {
    "N": "0"
  },
  "new_sparc_maps_last_3_mo": {
    "N": "16"
  },
  "new_spar_computational_models_last_3_mo": {
    "N": "5"
  },
  "number_of_samples_cumulative": {
    "N": "8065"
  },
  "number_of_samples_last_3_mo": {
    "N": "0"
  },
  "number_of_samples_last_mo": {
    "N": "0"
  },
  "number_of_subjects_cumulative": {
    "N": "2804"
  },
  "number_of_subjects_last_3_mo": {
    "N": "0"
  },
  "number_of_subjects_last_month": {
    "N": "0"
  },
  "sparc_computational_models_cumulative": {
    "N": "26"
  },
  "sparc_datasets_cumulative": {
    "N": "173"
  },
  "sparc_maps_cumulative": {
    "N": "36"
  },
  "year": {
    "N": "2023"
  }
}

#################################################################################################################

{
  "year_month_source": {
    "S": "2023_01_pennsieve"
  },
  "source": {
    "S": "pennsieve"
  },
  "month": {
    "N": "1"
  },
  "number_of_aws_downloads_last_3_mo": {
    "N": "0"
  },
  "number_of_aws_downloads_last_mo": {
    "N": "0"
  },
  "number_of_new_sparc_teams_last_3_mo": {
    "N": "300"
  },
  "number_of_new_sparc_teams_last_mo": {
    "N": "120"
  },
  "number_of_new_sparc_users_last_3_mo": {
    "N": "11"
  },
  "number_of_new_sparc_users_last_mo": {
    "N": "2"
  },
  "number_of_sparc_downloads_last_3_mo": {
    "N": "118"
  },
  "number_of_sparc_downloads_last_mo": {
    "N": "58"
  },
  "number_of_sparc_teams_overall": {
    "N": "62"
  },
  "number_of_sparc_users_overall)": {
    "N": "515"
  },
  "total_number_gigabytes": {
    "N": "22904"
  },
  "year": {
    "N": "2023"
  }
}

#################################################################################################################

{
  "year_month_source": {
    "S": "2023_01_ga4"
  },
  "source": {
    "S": "ga4"
  },
  "all_about_page_views_last_mo": {
    "N": "365"
  },
  "all_about_page_views_last_quarter": {
    "N": "232"
  },
  "all_find_data_page_views_last_mo": {
    "N": "7689"
  },
  "all_find_data_page_views_last_quarter": {
    "N": "7689"
  },
  "all_help_page_views_last_mo": {
    "N": "6"
  },
  "all_help_page_views_last_quarter": {
    "N": "4"
  },
  "all_home_page_views_last_mo": {
    "N": "13934"
  },
  "all_home_page_views_last_quarter": {
    "N": "13934"
  },
  "all_maps_page_views_last_mo": {
    "N": "506"
  },
  "all_maps_page_views_last_quarter": {
    "N": "506"
  },
  "all_news_events_page_views_last_mo": {
    "N": "968"
  },
  "all_news_events_page_views_last_quarter": {
    "N": "1034"
  },
  "all_screen_page_views_last_mo": {
    "N": "12391"
  },
  "all_screen_page_views_last_quarter": {
    "N": "11392"
  },
  "all_tools_resources_page_views_last_mo": {
    "N": "222"
  },
  "all_tools_resources_page_views_last_quarter": {
    "N": "222"
  },
  "month": {
    "N": "1"
  },
  "new_users_in_last_month": {
    "N": "858"
  },
  "new_users_in_last_quarter": {
    "N": "1186"
  },
  "returning_users_in_last_month": {
    "N": "239"
  },
  "returning_users_in_last_quarter": {
    "N": "283"
  },
  "year": {
    "N": "2023"
  }
}

    */
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
      this.dataChartData.datasets.data.insert(0, dict_for_viz.sparc.all_sparc_categories_last_mo)
      this.dataChartData.datasets.data.insert(1, dict_for_viz.sparc.new_sparc_datasets_last_1_mo)
      this.dataChartData.datasets.data.insert(2, dict_for_viz.sparc.new_sparc_maps_last_1_mo)
      this.dataChartData.datasets.data.insert(3, dict_for_viz.sparc.new_sparc_computational_models_last_1_mo)
      this.samples = dict_for_viz.sparc.number_of_samples_cumulative
      this.subjects = dict_for_viz.sparc.number_of_subjects_cumulative
      this.anatomicalStructuresChartData.datasets.data.insert(0, dict_for_viz.sparc.anatomical_structures_breakdown["vagus nerve"])
      this.anatomicalStructuresChartData.datasets.data.insert(1,dict_for_viz.sparc.anatomical_structures_breakdown["colon"])
      this.anatomicalStructuresChartData.datasets.data.insert(2, dict_for_viz.sparc.anatomical_structures_breakdown["heart"])
      this.anatomicalStructuresChartData.datasets.data.insert(3, dict_for_viz.sparc.anatomical_structures_breakdown["stomach"])
      this.anatomicalStructuresChartData.datasets.data.insert(4, dict_for_viz.sparc.anatomical_structures_breakdown["urinary bladder"])
      this.total_size = dict_for_viz.pennsieve.total_number_gigabytes

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