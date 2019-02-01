<template>
  <section>
    <q-list>
      <q-item v-if="isVisibleGotButton">
        <q-item-main>
          <q-item-tile label>شروع پریود</q-item-tile>
        </q-item-main>
        <q-item-side right>
          <q-toggle
            v-model="gotPeriod"
            checked-icon="sentiment very dissatisfied"
            unchecked-icon="sentiment very satisfied"
          />
        </q-item-side>
      </q-item>
      <q-item v-if="!isVisibleGotButton">
        <q-item-main>
          <q-item-tile label>پایان پریود</q-item-tile>
        </q-item-main>
        <q-item-side right>
          <q-toggle
            v-model="endPeriod"
            checked-icon="sentiment very satisfied"
            unchecked-icon="sentiment very dissatisfied"
          />
        </q-item-side>
      </q-item>
    </q-list>
  </section>
</template>

<script>
import { Vue, Component, Watch, Emit } from 'vue-property-decorator'
// import { putToDB } from '../events/event'
import { dispatch, possibleClosePeriod } from '../state'

@Component({})
export default class PeriodHandler extends Vue {
  diff = 0
  gotPeriod = false
  endPeriod = false
  startPeriodDate = ''
  isVisibleGotButton = true

  created() {
    this.$subscribeTo(possibleClosePeriod, (d) => {
      this.isVisibleGotButton = d.canPeriod
      this.diff = d.diff
      this.gotPeriod = false
      this.endPeriod = false
    })
  }

  @Watch('gotPeriod')
  Period() {
    if (this.gotPeriod === true) {
      dispatch('gotPeriod')
      this.changePeriod()
    } else {
      dispatch('removePeriod')
    }
  }

  @Emit('period')
  changePeriod() {
    return this.diff
  }
}
</script>

<style lang="scss" scoped>
</style>
