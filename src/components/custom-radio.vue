<template>
  <div class="ir-container">
    <label>
      <input type="radio" :checked="shouldBeChecked" @change="updateInput" value="value" />
      <div :class="{box: styled && shouldBeChecked}" :style="{backgroundColor: shouldBeChecked ? bgColor : 'transparent'}">
        <img width="50px" height="50px" :src="change" :key="change" :class="{icon: styled && shouldBeChecked}" />
      </div>
      <div>{{label}}</div>
    </label>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    styled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String
    },
    modelValue: {
      default: ''
    },
    label: {
      type: String
    },

    checkedIcon: {
      type: String
    },
    uncheckedIcon: {
      type: String
    },
    bgColor: {
      type: String
    }
  },
  computed: {
    change () {
      return this.modelValue === this.value
        ? this.checkedIcon || this.uncheckedIcon
        : this.uncheckedIcon
    },
    shouldBeChecked () {
      return this.modelValue === this.value
    }
  },
  methods: {
    updateInput (event) {
      this.$emit('change', this.value)
    }
  }
}
</script>

<style>
.icon {
  border-radius: 50%;
}
.box {
  position: relative;
  width: 55px;
  height: 55px;
  border-radius: 50%;
}
.box::after {
  position: absolute;
  background-image: url("../assets/icons/ic_selected_green.png");
  background-size: 18px 18px;
  display: inline-block;
  width: 22px;
  height: 22px;
  left: 3px;
  bottom: 9px;
  content: "";
}

input[type="radio"] {
  display: none;
}
input[type="radio"] > label img {
  display: inline-block;
  vertical-align: middle;
  width: 45px;
  height: 45px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
