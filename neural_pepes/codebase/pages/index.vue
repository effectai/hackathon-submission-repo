<template>
  <div>
    <div class="container mt-6">
        <div class="has-text-centered pt-6">
          <h1 class="title is-2 mb-5">🐸 Effect Network Neural Pepe 🐸</h1>
          <img v-if="!account" src="https://neuralpepe.com/api/pepe/avatar/793" style="width:400px; height:auto;" class="mb-5">
          <p v-if="!account" class="mb-6">
            The first AI-(de)generated collectibles on BSC. ⛓ <br>
            Only 7777 neural Pepe's will ever exist. 🤯 <br>
            Create your batches of Neural Pepe's here for the Effect Network!

          </p>
        </div>
      <login v-if="!account" @account="setAccount"></login>
      <search :effectsdk="effectsdk" :account="account" v-if="account"></search>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Login from '../components/Login.vue'
import Search from '../components/Search.vue'

export default Vue.extend({
  data() {
    return {
      account: null,
      effectsdk: null,
    }
  },
  components: { Login, Search },
  methods: {
    setAccount (account, sdk) {
      this.effectsdk = sdk
      this.account = account
    },
  }

})
</script>
