export default {
  namespaced: true,
  modules: {},
  mutations: {
    ADD_BATCH (state, batch) {
      if (state.batches === null) { state.batches = [] }
      if (state.batches) {
        state.batches.push(batch)
      }
    },
    SET_BATCH_RESULTS (state, results) {
      try {
        const batchId = state.batches.findIndex(e => e.leaves.findIndex(ee => ee === '0x' + results.leaf_hash)!= -1)
        if(batchId !== null) {
          if(!state.batches[batchId].results) {
            state.batches[batchId].results = {}
          }
          state.batches[batchId].results[results.leaf_hash] = results
        }
      } catch (error) {
        console.error(error)
      }
    },
    SET_BATCH_CAMPAIGN (state, { batch, campaign}) {
      try {
        const batchId = state.batches.findIndex((e) => {
          console.log('e', e.id, batch.id)
          console.log('2', campaign.id, batch.campaignId)
          return e.id === batch.id && campaign.id === batch.campaignId
        })
        console.log('batchId', batchId)
        state.batches[batchId].campaign = campaign
      } catch (error) {
        console.error(error)
      }
    }
  },
  getters: {
    allBatches (state) {
      return id => state.batches ? state.batches : null
    }
  },
  actions: {
    addBatch ({ commit }, batch) {
      if (batch) {
        commit('ADD_BATCH', batch)
      }
    },
    setResults ({ commit }, results) {
      if (results) {
        commit('SET_BATCH_RESULTS', results)
      }
    },
    setCampaign ({ commit }, {batch, campaign}) {
      if (batch && campaign) {
        commit('SET_BATCH_CAMPAIGN', {batch, campaign})
      }
    }
  },
  state: () => {
    return {
      batches: null
    }
  }
}
