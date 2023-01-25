<script>
import { Bar, mixins } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels';
const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  name: 'BarChart',
  props: {
    chartData: {
      type: Object,
      default: () => {}
    },
    chartOptions: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.addPlugin(ChartDataLabels)
    this.renderChart(this.chartData, this.chartOptions)
  }
}
</script>