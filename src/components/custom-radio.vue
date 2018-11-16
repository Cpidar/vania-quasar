<template>
  <div class="ir-container">
    <label>
      <input type="radio" :checked="shouldBeChecked" @change="updateInput" value="value" />
      <img width="50px" height="50px" :src="change" :key="change" />
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
    }
  },
  computed: {
    change () {
      return this.modelValue === this.value
        ? this.checkedIcon
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
.ir-contanier {
  margin: 0 5px;
}
input[type="radio"] {
  display: none;
}
input[type="radio"] > label img {
  display: inline-block;
  vertical-align: middle;
  width: 45px;
  height: 45px;
  transition: all 0.2;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
