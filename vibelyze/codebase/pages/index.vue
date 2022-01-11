<template>
  <div>
    <img src="../assets/img/logo/Logo-wit.png" class="mt-6 pt-6" style="width: 200px; margin: 0 auto; display: block;">
    <div class="container mt-5 block p-6">
        <div class="has-text-centered">
          <p v-if="!account" class="mb-6">
            <span class="title">Get started with VIBELYZE!</span><br>
            Vibelyze is an app that investigates music nuance. Vibelyze obtains information suitable for training your music-related machine algorithm or designing your DJ setlist by handing songs to thousands of Effect workers.
          </p>
        </div>
      <login v-if="!account" @account="setAccount"></login>
      <search :effectsdk="effectsdk" :account="account" :newcampaign="newcampaign" v-if="account"></search>
    </div>

    <div class="mb-6 has-text-centered" v-if="account">
      <p class="has-text-success" style="font-size: 18px;">Connected Effect Account: {{account.accountName}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Login from '../components/Login.vue'
import Search from '../components/Search.vue'
import CreateCampaign from '../components/CreateCampaign.vue'

export default Vue.extend({
  data() {
    return {
      account: null,
      effectsdk: null,
      search: false,
      newcampaign: null
    }
  },
  components: { Login, Search, CreateCampaign },
  methods: {
    setAccount (account, sdk) {
      this.effectsdk = sdk
      this.account = account
    }
  }

})
</script>
