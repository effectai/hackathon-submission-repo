<template>
  <b-navbar toggleable="lg" type="dark" variant="success" class="px-3">
    <b-icon
      style="cursor: pointer"
      icon="menu-button-wide"
      scale="1.5"
      type="dark"
      color="white"
      class="mx-3"
    ></b-icon>
    <b-navbar-brand href="#" class="mx-3">Authentic</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse">
      <b-icon
        style="cursor: pointer"
        icon="menu-button-wide"
        scale="1.5"
        type="dark"
        color="white"
        class="mx-3"
      ></b-icon>
    </b-navbar-toggle>

    <b-navbar-nav class="ml-auto" style="position: fixed; left: 45%">
      <b-nav-item v-if="campaignTitle"
        >Campaign: {{ campaignTitle }}</b-nav-item
      >
    </b-navbar-nav>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto" style="position: fixed; right: 3%">
        <b-form-input
          v-model="campaignId"
          size="sm"
          class="mr-sm-2"
          placeholder="Campaign ID"
        ></b-form-input>
        <b-button
          size="sm"
          class="my-0 my-sm-0"
          type="submit"
          v-on:click="getCampaignData"
          >OK</b-button
        >

        <b-nav-item href="#">Home</b-nav-item>
        <b-nav-item href="#">Code</b-nav-item>
        <b-nav-item href="#">
          <b-icon icon="github" scale="1.5" type="dark" color="white"></b-icon>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { getCampaign } from "../utils/sendRequest";
export default {
  name: "Navbar",
  data() {
    getCampaign().then((data) => {
      this.campaignId = data.data.id;
      this.campaignTitle = data.data.title;
    });
    return {
      campaignId: "",
      campaignTitle: "",
    };
  },
  methods: {
    getCampaignData() {
      this.campaignTitle = this.campaignId;
      getCampaign().then((data) => {
        this.campaignId = data.data.id;
        this.campaignTitle = data.data.title;
      });
    },
  },
};
</script>
