<template>
  <div>
    <section class="calendarday">
      <div>شنبه</div>
      <div>یکشنبه</div>
      <div>دوشنبه</div>
      <div>سه شنبه</div>
      <div>چهارشنبه</div>
      <div>پنج شنبه</div>
      <div>جمعه</div>
    </section>
    <section class="calendar">
      <Day
        v-for="(day) of month"
        v-model="selectedDay"
        :key="day.jDate"
        :date="day.jDate"
        :today="day.isToday"
        :inactive="day.currentMonthCond"
        :event-type="events[day.jDate]"
      >
        {{day.day}}
      </Day>
    </section>
  </div>
</template>

<script>

import { daysInMonth, getDaysHaveEvents } from '../state/index'
import Day from './day.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import * as R from 'ramda'
import { bufferTime } from 'rxjs/operators'

@Component({
  components: { Day }
})
export default class Calendar extends Vue {
  @Prop({ type: String, required: true }) current
  events = {}
  selectedDay = ''
  month = []

  beforeMount() {
    this.$subscribeTo(daysInMonth(this.current),
      (d) => {
        this.month = [...this.month, d]
        if (d.isToday) { this.selectedDay = d.jDate }
      },
      function (err) { console.log(err) },
      () => { console.log('complete') }
    )
    this.$subscribeTo(getDaysHaveEvents(this.current).pipe(bufferTime(500)), (ev) => {
      this.events = R.reduce(R.mergeDeepRight, this.events, ev)
    })
  }

  mounted() {
    this.selectedDay = this.selectedDay || this.current
  }
}
</script>

<style lang="scss" scoped>
@import url("../main.scss");

.calendar {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin: 0 auto;
}

.calendarday > div {
  width: (100% / 7);
  height: 100%;
  float: left;
  font-size: 12px;
  text-align: center;
  line-height: var(--cell-height);
}

.todaycal {
  grid-row: 1/3;
  grid-column: 1;
}

.sticky {
  top: 0;
  position: fixed;
  background-color: white;
  margin-top: 0;
  animation: all 0.2;
}
</style>
