const mutations = {
  showSpinning: (state) => {
    state.spinning++
  },
  hideSpinning: (state) => {
    state.spinning--
  }
}

export default mutations
