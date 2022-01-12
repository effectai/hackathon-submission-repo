<template>
  <div id="app">
    <Navbar />
    <div
      style="
        position: fixed;
        left: 50%;
        bottom: 5%;
        z-index: 999999;
        transform: translate(-50%, 0);
      "
    >
      <b-button
        block
        variant="primary"
        size="sm"
        v-on:click="create"
        style="box-shadow: 0px 8px 16px black"
      >
        <b-icon stacked icon="plus" size="sm"></b-icon>
        Create Batch
      </b-button>
    </div>
    <b-overlay
      :show="show"
      spinner-type="grow"
      rounded="sm"
      variant="transparent"
      blur="10px"
    >
      <template #overlay>
        <div
          class="text-center"
          style="
            top: 50%;
            color: #fff;
            text-shadow: 2px 2px 4px black, inset 1px 1px 2px black;
          "
        >
          <b-icon icon="stopwatch" font-scale="5" animation="fade"></b-icon>
          <h3 id="cancel-label">Please wait...</h3>
          <b-icon icon="three-dots" animation="cylon" font-scale="5"></b-icon>
        </div>
      </template>

      <div class="color-header" id="container1">
        <Task
          :color="selected.color[0]"
          style="
            width: auto;
            margin: 2em;
            margin-bottom: 0.5em;
            margin-top: 0.5em;
          "
        >
          <b-container class="p-3 pt-5">
            <b-row class="my-1">
              <b-col sm="2">
                <label for="input-title">Title</label>
              </b-col>
              <b-col sm="10">
                <b-form-input
                  id="input-title"
                  :state="null"
                  placeholder="Title"
                  v-model="selected.title"
                  style="box-shadow: 1px 2px 2px black"
                ></b-form-input>
              </b-col>
            </b-row>

            <b-row class="my-1">
              <b-col sm="2">
                <label for="input-description">Description:</label>
              </b-col>
              <b-col sm="10">
                <b-form-textarea
                  id="input-description"
                  v-model="selected.description"
                  placeholder="Enter description..."
                  rows="3"
                  max-rows="8"
                  style="box-shadow: 1px 2px 2px black"
                ></b-form-textarea>
              </b-col>
            </b-row>

            <b-row class="my-1">
              <b-col sm="2">
                <label for="input-image">Image:</label>
              </b-col>
              <b-col sm="6">
                <b-form-input
                  id="input-image"
                  :state="null"
                  placeholder="Image URL"
                  v-model="selected.image"
                  style="box-shadow: 1px 2px 2px black"
                ></b-form-input>
              </b-col>
              <b-col sm="1">OR</b-col>
              <b-col sm="2">
                <b-form-file
                  name="imageFile"
                  v-model="selected.imageFile"
                  :state="Boolean(selected.imageFile)"
                  placeholder=""
                  drop-placeholder=""
                ></b-form-file>
              </b-col>
            </b-row>
            <b-row class="mx-auto my-0" style="width: 100px">
              <b-col sm="3" style="">
                <b-button
                  v-on:click="done"
                  style="box-shadow: 2px 2px 2px black"
                >
                  <b-icon stacked icon="check"></b-icon>
                  Done
                </b-button>
              </b-col>
            </b-row>
          </b-container>
        </Task>
      </div>
      <grid
        :center="true"
        :draggable="true"
        :sortable="true"
        :items="tasks"
        :cellWidth="300"
        :cellHeight="150"
        @change="change"
        @remove="remove"
        @click="click"
        @sort="sort"
      >
        <template slot="cell" slot-scope="props">
          <Task
            :color="props.item.color[0]"
            :item="props.item"
            :index="props.index"
            :sort="props.sort"
            :with-button="true"
            @remove="props.remove()"
          />
        </template>
      </grid>
    </b-overlay>
  </div>
</template>

<script>
import Task from "./components/Task.vue";
import Navbar from "./components/Navbar.vue";
import { createBatch } from "./utils/sendRequest";
import { generateRGBColors } from "./utils/color.js";
export default {
  name: "app",
  components: {
    Task,
    Navbar,
  },
  data() {
    return {
      show: false,
      tasks: [],
      selected: {
        color: generateRGBColors(),
        image: "",
        imageFile: null,
        title: "",
        description: "",
      },
    };
  },
  methods: {
    click({ items, index }) {
      let value = items.find((v) => v.index === index);
      this.selected = value.item;
      // console.log(value.item);
    },
    change() {
      // console.log("change", event);
    },
    remove() {
      // console.log("remove", event);
    },
    sort(event) {
      console.log("sort", event.items);
      // this.tasks = event.items.map(e => e.item);
    },
    done() {
      this.tasks.push(JSON.parse(JSON.stringify(this.selected)));
      this.selected = {
        color: generateRGBColors(1),
        image:
          "https://user-images.githubusercontent.com/72940291/139529370-48a644a4-711e-4e41-8cf7-d855bed806a1.png",
        title: "Some False Information",
        description: "Some False Information trying to adversely effect.",
        imageFile: null,
      };
    },
    create() {
      this.show = true;
      createBatch(
        this.tasks.map(({ image, title, description, imageFile }) => ({
          image,
          title,
          description,
          imageFile,
        }))
      ).then((res) => {
        console.log(res);
        this.show = false;
      });
    },
  },
};
</script>

<style>
body {
  background: #fafafa;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#container1 {
  text-shadow: 0px 1px 1px rgb(26, 5, 5);
}
.color-header {
  position: relative;
  padding: 10px 0;
  box-sizing: border-box;
}
</style>
