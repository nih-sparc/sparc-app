import Vue from "vue"
import TSViewer from 'tsviewer'

export default function ({store}) {
  Vue.use(TSViewer, { store })
}