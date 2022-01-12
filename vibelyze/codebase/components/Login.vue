<template>
  <div>
    <div id="connect-buttons" v-if="!accountConnected" class="buttons is-justify-content-center is-flex">
      <button class="button is-primary" @click="login()" id="btn-login" style="background-color: #f6851b">Connect with Metamask</button>
      <button class="button is-link" @click="loginEOS()" id="btn-login-eos" style="background-color: #3750A2">Connect with Anchor</button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Web3 from 'web3'
import * as effectsdk from '@effectai/effect-js'
import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'

export default Vue.extend({
  data() {
    return {
      client: null,
      campaignid: null,
      batchidentification: null,
      connectAccount: { 
        providerName: null, 
        provider: null, 
        account: null
      },
      connectResponse: null,
      message: null,
      accountConnected: false
    }
  },
  components: {},
  methods: {
    async login() {
        this.generateClient()
        await this.connectMetamask()
        await this.connectEffectAccount()
    },

    async loginEOS() {
        this.generateClient()
        await this.connectAnchor()
        await this.connectEffectAccount()
    },

    /**
    * SDK Client
    * Create a new Effect SDK client.
    * Note how the entry name is `effectsdk`!.
    */
    generateClient() {
        console.log('Creating SDK...')
        try {
            this.client = new effectsdk.EffectClient('jungle')
            console.log(this.client)
        } catch (error) {
            console.error(error)
        }
    },

    /**
    * EOS Anchor Wallet
    */
    async connectAnchor() {
        try {
            const transport = new AnchorLinkBrowserTransport()
            const alink = new AnchorLink({
                transport,
                chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
                rpc: 'https://jungle3.greymass.com'
            })
            // Perform the login, which returns the users identity
            const identity = await alink.login('hackathon-boilerplate')

            const { session } = identity
            const signatureProvider = session.makeSignatureProvider()
            const account = { accountName: session.auth.actor.toString(), permission: session.auth.permission.toString() }
            console.log(`Logged in as`, account)
            this.connectAccount.provider = signatureProvider
            this.connectAccount.account = account
            this.connectAccount.providerName = 'anchor'                

        } catch (error) {
            alert('Something went wrong. See console for error message')
            console.error(error)
        }
    },

    /**
    * Metamask
    * Generate web3 instance from account with private key.
    * Could also be the web3 object with a metamask connection. 
    * 
    * Here we will also make a call to make sure we are on the correct chain.
    * Bsc-Mainnet: 0x38 (hex), 56 (decimal)
    * Bsc-Testnet: 0x61 (hex), 97 (decimal)
    * 
    */
    async connectMetamask() {
        console.log('Connecting to metamask wallet.')
        // @ts-ignore
        if (window.ethereum) {
            try {
                // @ts-ignore
                const ethAccount = await ethereum.request({ method: 'eth_requestAccounts' });
                // @ts-ignore
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }] // 0x38 is the chainId of bsc testnet.    
                })

                // @ts-ignore
                this.connectAccount.provider = new Web3(window.ethereum)
                this.connectAccount.account = null
                this.connectAccount.providerName = 'metamask'
            } catch (error) {
                alert('Something went wrong. See console for error message')
                console.error(error)
            }
        } else {
            alert('Metamask not installed.')
        }
    },

    /**
    * Connect to Effect Account using burnerwallet, metamask or anchor
    */
    async connectEffectAccount() {
      console.log('Connecting to account with wallet.')
      try {
          if (this.connectAccount.provider) {
              this.connectResponse = await this.client.connectAccount(this.connectAccount.provider, this.connectAccount.account)
          } else {
              alert('Login with on of the wallet.')
          }
          this.accountConnected = true
          this.$emit('account', this.connectResponse, this.client)
      } catch (error) {
          alert('Something went wrong. See console for error message')
          console.error(error)
      }
    },
  }
})
</script>