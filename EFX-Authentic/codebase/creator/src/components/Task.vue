<template>
  <div class="task" :style="taskStyle">
    <slot>
      <div v-if="item" style="color: black">
        <b-card
          v-bind:title="item.title"
          v-bind:img-src="item.image"
          img-alt="Image"
          img-top
          :style="cardStyle"
          tag="article"
          class="mb-2"
        >
          <b-card-text>
            #{{ item.index }}: &nbsp;{{ item.description }}
          </b-card-text>
        </b-card>
      </div>
      <b-icon
        icon="x-circle"
        scale="2"
        variant="danger"
        class="task-delete-btn"
        v-if="withButton"
        @mousedown="remove"
      ></b-icon>
    </slot>
  </div>
</template>

<script>
export default {
  name: "Task",
  props: {
    index: {
      type: Number,
    },
    sort: {
      type: Number,
    },
    withButton: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
    },
    color: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  computed: {
    brightness() {
      // console.log(this.item);

      let { r, g, b } = this.color;
      return 0.299 * r + 0.587 * g + 0.114 * b;
    },
    cardStyle() {
      if (this.color) {
        let { r, g, b } = this.color;
        let background = `rgba(${r}, ${g}, ${b}, 0.4)`;
        return {
          border: `2px solid ${background}`,
        };
      }
      return null;
    },
    taskStyle() {
      if (this.color) {
        let { r, g, b } = this.color;
        let background = `rgba(${r}, ${g}, ${b}, 0.7)`;
        let shadow = `rgba(${r}, ${g}, ${b}, 0.3)`;
        return {
          "min-width": "250px",
          "background-color": background,
          "box-shadow": `0px 8px 10px ${shadow}`,
          color: this.brightness > 150 ? "#000" : "#fff",
          "font-size": "1.2em",
        };
      }
      return null;
    },
  },
  methods: {
    remove() {
      this.$emit("remove", {
        index: this.index,
      });
    },
  },
};
</script>

<style>
@keyframes shake {
  from {
    transform: rotate(-4deg);
  }
  to {
    transform: rotate(4deg);
  }
}
.task {
  position: relative;
  background-color: transparent;
  margin: 5px;
  color: "black";
  border-radius: 10px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.07);
  font-size: 12px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}
.task .task-delete-btn {
  display: block;
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 8px;
  right: 8px;
  top: 8px;
}

.v-grid-item-dragging .icon {
  animation-name: shake;
  animation-duration: 0.07s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
</style>
