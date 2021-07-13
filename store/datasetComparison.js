import createClient from '~/plugins/contentful'

export const state = () => ({
  toCompare: [
    // {
    //   name: "Vagus Dataset 1",
    //   id: "156",
    //   text: "test",
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

  remove(state, { dataset }) {
    const index = state.toCompare.indexOf(dataset)
    state.toCompare.splice(index, 1)
  },
}
