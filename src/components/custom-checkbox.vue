<template>
<div class="ic-container">
    <label>
    <input type="checkbox"
        :checked="shouldBeChecked"
        @change="updateInput"
    />
        <img
        width="50px"
        height="50px"
        :src="change"
        :key="change"
        />
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
      default: false
    },
    label: {
      type: String
    },
    // We set `true-value` and `false-value` to the default true and false so
    // we can always use them instead of checking whether or not they are set.
    // Also can use camelCase here, but hyphen-separating the attribute name
    // when using the component will still work
    trueValue: {
      default: true
    },
    falseValue: {
      default: false
    },
    checkedIcon: {
      type: String
    },
    uncheckedIcon: {
      type: String
    }
  },
  data: () => ({
    checked: false
  }),
  computed: {
    change () {
      if (this.modelValue instanceof Array) {
        return this.modelValue.indexOf(this.value) === -1
          ? this.uncheckedIcon
          : this.checkedIcon
      }
      return this.modelValue
        ? this.uncheckedIcon
        : this.checkedIcon
    },
    shouldBeChecked () {
      if (this.modelValue instanceof Array) {
        return this.modelValue.includes(this.value)
      }
      // Note that `true-value` and `false-value` are camelCase in the JS
      return this.modelValue === this.trueValue
    }
  },
  methods: {
    updateInput (event) {
      let isChecked = event.target.checked

      if (this.modelValue instanceof Array) {
        let newValue = [...this.modelValue]

        if (isChecked) {
          newValue.push(this.value)
        } else {
          newValue.splice(newValue.indexOf(this.value), 1)
        }

        this.$emit('change', newValue)
      } else {
        this.$emit('change', isChecked ? this.trueValue : this.falseValue)
      }
    }
  }
}
</script>

<style>
.ic-contanier {
  margin: 0 5px;
}
input[type=checkbox] {
    display: none;
}
input[type="checkbox"] > label img {
    display: inline-block;
    vertical-align: middle;
    width: 45px;
    height: 45px;
    transition: all 0.2;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
