import createClient from '~/plugins/contentful'

export const state = () => ({
  // array of datasets to compare
  toCompare: [
    // {
    //   name: "Vagus Dataset 1",
    //   id: "156",
    //   // ...
    //   // and so on
    // }
  ]
})

export const mutations = {
  // if you have the full record
  add(state, dataset) {
    state.toCompare.push(dataset)
  },

  remove(state, dataset) {
    console.log("state", state.toCompare)
    const matchIndex = state.toCompare.findIndex(ds => ds.id == dataset.id)
    console.log("match index", matchIndex)

    state.toCompare.splice(matchIndex, 1)
  },
}
