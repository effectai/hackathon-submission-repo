<template>
  <div>
    <div v-if="newcampaign">
      Using the campaign: <a target="_blank" :href="'https://testnet.effect.network/campaigns/' + newcampaign.id">https://testnet.effect.network/campaigns/{{newcampaign.id}}</a>
    </div>
    <h1 class="title mt-5" style="text-align:center;">
        Create your batch of songs
      </h1>
    <form action="#" onsubmit="return false">
        <div class="field">
            <input class="input" @change="searchTrack" autocomplete="off" type="text" name="song" placeholder="Search for a song..">
        </div>
    </form>

    <div>
      <div v-if="currentTrack" class="has-text-centered">
          <div class="mt-5">
              <img :src="currentTrack.album.images[1].url" style="margin: 0 auto; width: 200px" class="mb-2" alt="">
          </div>
          <div>
              <label for="Genre" class="form-label">{{currentTrack.name}}</label>
          </div>
          <div class="mb-2">
              <label for="artist" class="form-label">by {{currentTrack.artists[0].name}}</label>
          </div>
          <button class="button is-primary is-outlined mt-3" @click="addToBatch()">Add Song to Batch</button>
      </div>
    </div>

    <div v-if="tracks && tracks.length > 0" class="mt-6 is-flex is-flex-direction-column">
      <h2 class="is-4 mb-3 title">Batch</h2>
      <table class="table" style="width: 100%">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Artist</th>
            </tr>
        </thead>
        <tbody id="table-body">
          <tr v-for="track in tracks" :key="track.name">
            <td><img :src="track.album.images[2].url" style="width: 40px"></td>
            <td>{{track.name}}</td>
            <td>{{track.artists[0].name}}</td>
          </tr>
        </tbody>
      </table>

      <!-- <input class="input" style="width: 135px;" v-if="!newcampaign" v-model="campaignId" name="campaign-id" type="number" placeholder="Campaign ID"> -->
      <br>
      <button type="submit" class="button is-primary mt-2 is-align-self-flex-end" @click="makeBatch">Submit Batch</button>

      <div class="notification is-primary is-light mt-5" style="font-size: 23px;" v-if="makeBatchSuccess">
        Transaction succesfuly submitted! Transaction ID: {{makeBatchSuccess.transaction_id}}
      </div>

      <a href="/results" v-if="makeBatchSuccess">
        <button class="button is-primary is-outlined" >Results page</button>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['account', 'effectsdk', 'newcampaign'],
  data() {
    return {
      clientId: 'd6dd66c7d97349e1bf930eac35962903',
      clientSecret: 'da865f7bf82c4e6098836c5124800e52',
      token: null,
      currentTrack: null,
      tracks: [],
      campaignId: 198,
      makeBatchSuccess: null,
    }
  },
  components: {},
  methods: {
    async searchTrack (event) {
      if (event.target.value !== '') {
        this.token = await this.getToken();
        const tracks = await this.getTracks(this.token, event.target.value);
        this.currentTrack = tracks[0];
      }
    },
    async getToken () {
      const result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
              'Content-Type' : 'application/x-www-form-urlencoded', 
              'Authorization' : 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
          },
          body: 'grant_type=client_credentials'
      });

      const data = await result.json();
      return data.access_token;
    },
    async getTracks (token, filter) {
      const limit = 1;
      const result = await fetch(`https://api.spotify.com/v1/search?type=track&limit=${limit}&q=${filter}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + this.token}
      });

      const data = await result.json();
      return data.tracks.items;
    },
    addToBatch () {
      this.tracks.push(this.currentTrack)
      this.currentTrack = null
    },
    async makeBatch() {
      try {
        let campaignId = this.newcampaign ? this.newcampaign.id : this.campaignId
        console.log(`Campaign 🚒:\n${campaignId}`)
        
        const embeds = []
        for (let track of this.tracks) {
            embeds.push({
                song_embed: `https://open.spotify.com/embed/track/${track.id}?utm_source=generator`
            })
        }

        const content = {
          'tasks': embeds
        }
        const repetitions = '1'
        const batchResponse = await this.effectsdk.force.createBatch(parseInt(campaignId), content, repetitions)
        
        // await this.effectsdk.force.waitTransaction(batchResponse.transaction.transaction_id)
        
        batchResponse.campaignId = parseInt(campaignId)
        const campaign = await this.effectsdk.force.getCampaign(campaignId)
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