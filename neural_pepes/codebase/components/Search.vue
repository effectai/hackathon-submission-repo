<template>
  <div>
    <div class="mb-3 has-text-centered">
      <p class="has-text-success">Connected Effect Account: {{account.accountName}}</p>
    </div>

    <h1 class="title is-4 mt-6">
        Create your batch of Neural Pepe's!
      </h1>
    <form action="#" onsubmit="return false">
        <div class="field mb-5">
            <input class="input" type="number" v-model="idInput" min="1" max="7777" name="pepe" placeholder="Pepe ID">
        </div>
        <div class="buttons is-justify-content-center	">
          <button @click="searchPepe" class="button is-primary is-light">Search Pepe</button>
          <button @click="addRandomPepe" class="button is-link is-light">I'm feeling lucky!</button>
        </div>
    </form>

    <div>
      <div v-if="currentPepe" class="has-text-centered">
          <hr>
          <div>
              <img :src="currentPepe.url" style="margin: 0 auto; width: 250px" class="mb-2" alt="">
          </div>
          <div>
              <label for="pepe" class="form-label">#{{currentPepe.id}}</label>
          </div>
          <button class="button is-primary is-outlined mt-3" @click="addToBatch()">Add Pepe to Batch</button>
      </div>
    </div>

    <div v-if="pepes && pepes.length > 0">
      <hr>
      <h2 class="subtitle is-4 mb-3">Batch</h2>
      <table class="table" style="width: 100%; max-width: 300px;">
        <thead>
          <tr>
            <th>Preview</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody id="table-body">
          <tr v-for="npepe in pepes" :key="npepe.id">
            <td><img :src="npepe.url" style="width:50px; height: 50px;"></td>            
            <td>{{npepe.id}}</td>
          </tr>
        </tbody>
      </table>
      <button type="submit" class="button is-primary mt-2" @click="makeBatch">Submit Batch</button>

      <div class="notification is-primary is-light" v-if="makeBatchSuccess">
        Transaction succesfuly submitted! Transaction ID: {{makeBatchSuccess.transaction_id}}
      </div>

      <a href="/results" v-if="makeBatchSuccess">
        <button class="button is-primary is-outlined" >Results page ></button>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['account', 'effectsdk'],
  data() {
    return {
      currentPepe: null,
      pepes: [],
      campaignId: 89,
      makeBatchSuccess: null,
      idInput: null,
    }
  },
  components: {},
  methods: {
    searchPepe () {
      if (this.idInput > 0 && this.idInput < 7776) {
        this.currentPepe = {}
        this.currentPepe.id = this.idInput;
        this.currentPepe.url = `https://neuralpepe.com/api/pepe/avatar/${this.currentPepe.id}`;
      }
    },
    addRandomPepe () {
      this.currentPepe = {}
      this.currentPepe.id =  Math.floor(Math.random() * 7776) + 1;
      this.currentPepe.url = `https://neuralpepe.com/api/pepe/avatar/${this.currentPepe.id}`;
    },
    addToBatch () {
      this.pepes.push(this.currentPepe)
      this.currentPepe = null
    },
    async makeBatch() {
      try {
        const embeds = []
        for (let pepe of this.pepes) {
            embeds.push({
              url: pepe.url
            })
        }

        const content = {
          'tasks': embeds
        }
        const repetitions = '1'
        const batchResponse = await this.effectsdk.force.createBatch(parseInt(this.campaignId), content, repetitions)
        
        batchResponse.campaignId = parseInt(this.campaignId)
        const campaign = await this.effectsdk.force.getCampaign(this.campaignId)
        batchResponse.campaign = campaign;
        console.log('add this to store', batchResponse)
        this.$store.dispatch('batch/addBatch', batchResponse)
        this.makeBatchSuccess = batchResponse.transaction;
      } catch (error) {
          alert('Something went wrong. See console for error message')
          console.error(error)
      }
    }
  }
})
</script>
<style>
    table, td {
        vertical-align: middle !important;
        text-align: left !important;
    }
</style>