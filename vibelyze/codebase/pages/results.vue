<template>
  <div>
    <div class="container mt-6">
      <div class="has-text-centered pt-6">
        <img src="../assets/img/logo/Logo-wit.png" style="width: 200px">
        <h1 class="title mb-3">Batch Results</h1>
        <p class="mb-6">Download the results of the batches you've created with VIBELYZE</p>
      </div>
      <div class="box block" v-for="batch, index in batches" :key="batch.id + '-' +batch.campaign_id">
        <article class="media" v-if="batch && batch.campaign">
            <div class="media-left mr-5 pt-2">
              <figure class="image" style="width: 80px;">
                <img src="../assets/img/logo/results-logo.jpg">
              </figure>
            </div>
            <div class="media-content pl-2">
              <div class="content">
                <p>
                  <small>Campaign #{{batch.campaign.id}} - {{batch.campaign.info.title}}</small> 
                  <br>
                  <small>Batch #{{batch.id}}</small>
                  <br>
                  <small>Tasks: {{batch.leaves.length}}</small>
                </p>
              </div>
            </div>
            <div>
              <button class="button is-primary mt-4" @click="downloadTaskResults(index)">Download Results</button>
            </div>
          </article>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import * as effectsdk from '@effectai/effect-js'
const jsonexport = require('jsonexport/dist')

export default {
  data() {
    return {
      client: null,
    }
  },
  name: "batch-results",
  components: {},
  computed: {
    batches () {
      console.log('this.$store.state.batch.batches', this.$store.state.batch.batches)
      return this.$store.state.batch.batches;
    },
  },
  mounted() {
    this.generateClient()
    this.getResults()
  },
  methods: {
    generateClient() {
        console.log('Creating SDK...')
        try {
            this.client = new effectsdk.EffectClient('jungle')
            console.log(this.client)
        } catch (error) {
            console.error(error)

        }
    },
    async getResults () {
      if (this.batches) {
        for (let i = 0; i < this.batches.length; i++) {
          const batch = this.batches[i];
          this.getTaskResults(batch)
        }
      }
    },
    async resultsFinished(results) {
      this.$store.dispatch('batch/setResults', results)
    },
    async getTaskResults(batch) {
      console.log('polling in the background for results..')
      // poll results per leaf hash
      for (let a = 0; a < batch.leaves.length; a++) {
        const leafHash = batch.leaves[a]
        this.client.force.pollTaskResult(leafHash.substring(2), this.resultsFinished)
      }
    },
    setAccount (account, sdk) {
      this.effectsdk = sdk
      this.account = account
    },
    async downloadTaskResults (index) {
      try {
        // add columns from data object to the submission object itself
        let parsedSubmissions = []
        for (const key in this.batches[index].results) {
          parsedSubmissions.push(this.batches[index].results[key])
        }

        await jsonexport(parsedSubmissions, (err, csv) => {
          if (err) {
            return console.error(err)
          }
          if (parsedSubmissions.length === 0) {
            return console.error('No submissions found')
          }
          const filename = `task_results_${parsedSubmissions[0].batch_id}.csv`
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename)
          } else {
            const link = document.createElement('a')
            if (link.download !== undefined) { // feature detection
              // Browsers that support HTML5 download attribute
              const url = URL.createObjectURL(blob)
              link.setAttribute('href', url)
              link.setAttribute('download', filename)
              link.style.visibility = 'hidden'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
          }
        })
      } catch (error) {
        console.error(error)
      }
    },
    async prepareResults (x) {
      const sub = {
        data: null
      }
      sub.data = JSON.parse(x.data)

      // add answers as seperate columns
      for (const result of Object.keys(sub.data)) {
        x[result] = sub.data[result]
      }

      // add placeholders
      const taskIndex = await this.client.force.getTaskIndexFromLeaf(this.batch.campaign_id, this.batch.id, x.leaf_hash, this.batch.tasks)
      const task = this.batch.tasks[taskIndex]
      x.placeholders = JSON.stringify(task)

      for (const result of Object.keys(task)) {
        x[result] = task[result]
      }

      // remove unnecassary keys for csv
      delete x.content
      delete x.batch_id
      delete x.id
      delete x.leaf_hash

      // put these attributes first
      const columnOrder = {
        link_id: null,
        account_id: null
      }
      x = Object.assign(columnOrder, x)

      return x
    }
  }

};
</script>
