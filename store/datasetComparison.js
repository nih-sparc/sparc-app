import createClient from '~/plugins/contentful'
import {
  assocPath,
  clone,
  compose,
  defaultTo,
  equals,
  flatten,
  find,
  filter,
  head,
  mergeLeft,
  pathOr,
  propEq,
  prop,
  propOr,
  pluck,
  uniqBy,
} from 'ramda'

export const state = () => ({
  // array of datasets to compare. Not necessarily what is currently shown by latest "Discover" button though
  toCompare: [
    // {
    //   name: "Vagus Dataset 1",
    //   id: "156",
    //   // ...
    //   // and so on
    // }
  ],

  // array of datasets to compare. Not necessarily what is currently shown by latest "Discover" button though
  lastJobRun: {
    // {
    //   datasetIds: [64],
    //   // ...
    //   // and so on
    // }
  },

  // stuff returned by our osparc job
  osparcResults: null,

  // what we get back from es when we hit their api (after user clicks "discover")
  // - kind of local cache so we don't have to call more than once
  // - keys are dataset DOI ids, values are the es record (inside the little wrapper we put with
  // some metadata). Though some records will not be found, so not have the es record
  datasetInfoEnrichedByES: {
  },
})

export const mutations = {
  ///////////////////////////
  // for queuing which datasets to compare with each other (ie modifying toCompare key)
  ///////////////////////////
  // if you have the full record
  add(state, dataset) {
    state.toCompare.push(dataset)
  },


  remove(state, dataset) {
    const matchIndex = state.toCompare.findIndex(ds => ds.id == dataset.id)

    state.toCompare.splice(matchIndex, 1)
  },

  ///////////////////////////
  // for keeping track of last job ran
  ///////////////////////////

  // just updates with new values
  setLastJobRan(state, values) {
    state.lastJobRun = clone(values)
  },



  ///////////////////////////
  // for handling osparc results
  ///////////////////////////

  // set what we get back from osparc (through the flask app)
  setOsparcResults(state, osparcResults) {
    state.osparcResults = clone(osparcResults)
  },

  // set to empty object
  clearOsparcResults(state) {
    state.osparcResults = {}
  },
}
