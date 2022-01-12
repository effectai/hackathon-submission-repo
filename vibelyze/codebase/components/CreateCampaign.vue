<template>
  <div class="mb-6">
    <div class="mb-3 has-text-centered">
      <p class="has-text-success">Connected Effect Account: {{account.accountName}}</p>
    </div>
    <div v-if="loading" class="loader-wrapper is-active">
        <div class="loader is-loading" />
        <br>Waiting for the transaction to complete...
      </div>
      <p class="is-pulled-right">
        <span class="has-text-info"><b>*</b></span>
        <i> is required</i>
      </p>
      <h1 class="title is-4 mt-6">
        Step 1: Customize your campaign
      </h1>
      <p>
        Create your Song Task Analyser campaign here. You can use the default campaign by simply clicking 'Save Campaign', or customize your campaign for your needs!
      </p><br>
      <p>Already have a campaign? <a href="#" @click.prevent="$emit('search')">Continue to batch creation</a></p><br>
      <div v-if="errors.length">
        <div v-for="error in errors" :key="toString(error)" class="notification is-danger is-light">
          {{ error }}
        </div>
      </div>
      <div class="tabs">
        <ul>
          <li :class="{'is-active': formGroup === 'basic-info'}">
            <a @click.prevent="formGroup = 'basic-info'">Basic Information</a>
          </li>
          <li :class="{'is-active': formGroup === 'instructions'}">
            <a @click.prevent="formGroup = 'instructions'">Instructions</a>
          </li>
          <li :class="{'is-active': formGroup === 'tasks'}">
            <a @click.prevent="formGroup = 'tasks'">Design Tasks</a>
          </li>
        </ul>
      </div>
      <form @submit.prevent="createCampaign">
        <div v-show="formGroup === 'basic-info'" class="block basic-info-group">
          <div class="field">
            <label class="label">
              Title
              <span class="has-text-info">*</span>
            </label>
            <div class="control">
              <input v-model="campaignIpfs.title" class="input" type="text" placeholder="My Campaign Title">
            </div>
          </div>
          <div class="field">
            <label class="label">
              Description
              <span class="has-text-info">*</span>
            </label>
            <div class="control">
              <textarea v-model="campaignIpfs.description" class="textarea" />
            </div>
          </div>
          <div class="field">
            <label class="label">Image</label>
            <div class="control">
              <input v-model="campaignIpfs.image" class="input" type="text" placeholder="Image URL">
            </div>
          </div>
          <label class="label">
            Reward per task
            <span class="has-text-info">*</span>
          </label>
          <div class="field has-addons">
            <div class="control">
              <input v-model="campaignIpfs.reward" class="input" type="number" placeholder="Reward per task">
            </div>
            <div class="control">
              <a class="button is-primary">
                EFX
              </a>
            </div>
          </div>
        </div>
        <div v-show="formGroup === 'instructions'" class="block instructions-group">
          <div class="columns">
            <div class="column is-two-fifths">
              <div class="field">
                <label class="label">
                  Instructions
                  <span class="has-text-info">*</span>
                </label>
                <div v-if="campaign && campaignIpfs" class="control">
                  <textarea v-model="campaignIpfs.instructions" required class="textarea"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="formGroup === 'tasks'" class="block task-group">
          <div class="field">
            <label class="label">Template</label>
            <div class="control">
              <textarea v-model="campaignIpfs.template" class="textarea" />
            </div>
          </div>
          <div v-if="Object.keys(campaignIpfs.example_task).length" class="field">
            <label class="label">Example Task</label>
          </div>
          <div v-else>
            When you customize the template make sure to add the song_embed template in there!
            <pre>${song_embed}</pre>
          </div>
          <div>
            To learn more about templates and placeholders, visit the <a href="https://effectai.github.io/developer-docs/effect_network/template.html" target="_blank">documentation</a>.
          </div>
          <div v-for="(placeholder, key) in campaignIpfs.example_task" :key="key" class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{ key }}</label>
            </div>
            <div class="field-body is-small">
              <div class="field">
                <div class="control">
                  <input v-model="campaignIpfs.example_task[key]" class="input is-small" type="text">
                </div>
              </div>
            </div>
          </div>
          <h2 class="subtitle mt-5">
            Task Preview
          </h2>
          <template-media
            :html="renderTemplate(
              campaignIpfs.template || 'No template found..',
              campaignIpfs.example_task || {})"
          />
        </div>
        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button type="submit" class="button is-primary is-wide" :class="{'is-loading': loading}">
              Save Campaign
            </button>
          </div>
        </div>
      </form>
      <!-- SuccessModal -->
    <success-modal v-if="successMessage" :message="successMessage" :title="successTitle" />
    <br>
    </div>
  </div>
</template>

<script lang="ts">
// import VueSimplemde from 'vue-simplemde'
import Vue from 'vue'
import * as effectsdk from '@effectai/effect-js'
import { Template } from '@effectai/effect-js'
import SuccessModal from './SuccessModal.vue'
import TemplateMedia from './Template.vue'

function getMatches (string, regex) {
  let index = 1
  const matches = []
  let match
  while ((match = regex.exec(string))) {
    matches.push(match[index])
  }
  return matches
}

export default Vue.extend({
  props: ['account', 'effectsdk'],
  components: {
    TemplateMedia,
    SuccessModal
  },
  data () {
    return {
      advanced: false,
      success: false,
      ipfsExplorer: process.env.NUXT_ENV_IPFS_EXPLORER,
      loading: false,
      preview: false,
      campaignIpfs: {
        title: 'Song Analyses 🎶',
        description: 'Song Analyses 🎶 <br> Earn EFX by listening to songs and answer questions about them! <br> Rock & Roll🤘 🎸 <br> - Created with the Song Analyser dApp',
        instructions: 'Song Analyses 🎶 \n Listen to the given songs and answer questions about them.',
        template: '<section class="section"> <div class="container has-text-centered"> <div id="tweet"> <h1 class="title mb-3">Song Analyses 🎶</h1> </div><div class="question question-sentiment"> <h2 class="subtitle">Answer the questions down below about this song</h2> <iframe src="${song_embed}" width="400" height="350" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe> <br><div class="field"> <br><p class="mb-2">What kind of genre would you define this song?</p><div class="select is-primary"> <select name="genre"> <option disabled selected>-</option> <option value="pop">Pop</option> <option value="rock">Rock</option> <option value="hiphop">Hip Hop</option> <option value="latin">Latin</option> <option value="dance">Dance/Electronic</option> <option value="rb">R&B</option> <option value="country">Country</option> <option value="folk">Folk/Acoustic</option> <option value="classical">Classical</option> <option value="metal">Metal</option> <option value="jazz">Jazz</option> <option value="blues">Blues</option> <option value="punk">Punk</option> <option value="indie">Indie</option> <option value="techno">techno</option> <option value="other">Other</option> </select> </div></div><hr> <div class="field"> <p class="mb-2">In which language is the lyrics & title of this song?</p><input class="input" type="text" name="language" placeholder="Language" value="English" style="width:350px"/> </div><hr> <div class="field"> <p class="mb-2">What is the dominant instrument?</p><div class="select is-primary"> <select name="instrument"> <option disabled selected>-</option> <option value="accguitar">Acoustic Guitar</option> <option value="elecguitar">Electric Guitar</option> <option value="bass">Bass Guitar</option> <option value="synth">Synthesizer</option> <option value="piano">Piano</option> <option value="drums">Drums</option> <option value="other">Other</option> </select> </div></div><hr> <div class="field"> <p class="mb-2">If you had to describe the song with a color, which color would you give it?</p><div class="select is-primary"> <input type="color" name="color"> </div></div></div><button type="submit" class="button is-primary is-large mt-6">Submit</button> </div></section><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma-checkradio@2.1.2/dist/css/bulma-checkradio.min.css">',
        image: 'https://media.istockphoto.com/vectors/vector-cartoon-music-note-icon-in-comic-style-sound-media-concept-vector-id1026452194?k=20&m=1026452194&s=612x612&w=0&h=FJgvA5S73ABtyruI7JDnhSngSIeyuTF0ny4dNZD5HpE=',
        category: 'captions',
        example_task: {
          song_embed: 'https://open.spotify.com/embed/track/3zBhihYUHBmGd2bcQIobrF?utm_source=generator'
        },
        version: 1,
        reward: 1
      },
      campaign: {
        content_hash: null
      },
      formGroup: 'basic-info',
      cachedFormData: null,
      uploadingFile: false,
      selectedFile: null,
      submitted: false,
      errors: [],
      successMessage: null,
      successTitle: null
    }
  },

  watch: {
    'campaignIpfs.template' (template) {
      const placeholders = getMatches(
        template,
        /\$\{\s?(\w+)\s?\|?\s?(\w*)\s?\}/g
      )
      const newPlaceholders = {}
      placeholders.forEach((placeholder) => {
        newPlaceholders[placeholder] = this.campaignIpfs.example_task[placeholder] || ''
      })
      this.campaignIpfs.example_task = newPlaceholders
    },
  },
  filters: {
    formatBytes (bytes, decimals = 2) {
      if (bytes === 0) {
        return '0 Bytes'
      }
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }
  },
  methods: {
    renderTemplate (template, placeholders = {}, options = {}) {
      return new Template(template, placeholders, options).render()
    },
    checkForm () {
      this.errors = []
      if (
        this.campaignIpfs.title && this.campaignIpfs.description &&
        this.campaignIpfs.reward && this.campaignIpfs.category &&
        this.campaignIpfs.instructions && this.campaignIpfs.template
      ) {
        return true
      }
      if (!this.campaignIpfs.title) {
        this.errors.push('Title is required.')
      }
      if (!this.campaignIpfs.description) {
        this.errors.push('Description is required.')
      }
      if (!this.campaignIpfs.reward) {
        this.errors.push('Reward per task is required.')
      }
      if (!this.campaignIpfs.category) {
        this.errors.push('Category is required.')
      }
      if (!this.campaignIpfs.instructions) {
        this.errors.push('Instructions is required.')
      }
      if (!this.campaignIpfs.template) {
        this.errors.push('Template is required.')
      }
      return false
    },
    async createCampaign () {
      let createdCampaign
      try {
        if (this.checkForm()) {
          this.loading = true
          const campaignIpfs = { ...this.campaignIpfs }
          const hash = await this.effectsdk.force.uploadCampaign(campaignIpfs)
          const result = await this.effectsdk.force.createCampaign(hash, this.campaignIpfs.reward)

          // Wait for transaction and reload campaigns
          this.successTitle = 'Campaign submitted successfully'
          this.successMessage = 'Waiting for transaction to complete before continuing'
          await this.effectsdk.force.waitTransaction(result)
          createdCampaign = await this.effectsdk.force.getMyLastCampaign()
          console.log('createdCampaign', createdCampaign)
          
          this.$emit('search', createdCampaign)
          this.loading = false
          this.submitted = true
        }
      } catch (error) {
        this.loading = false
        this.errors.push(error)
      }
    },
    // Helper method that generates JSON for string comparison
    formDataForComparison () {
      return JSON.stringify({ campaign: this.campaign, campaignIpfs: this.campaignIpfs })
    },
  }
})
</script>