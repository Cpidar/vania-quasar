<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component()
export default class App extends Vue {
  name = 'App'
}
</script>

<style>
</style>
