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
        :key="day.jDate"
        :date="day.jDate"
        :today="day.isToday"
        :inactive="day.currentMonthCond"
        v-model="selectedDay"
        :event-type="eventType(day.jDate)"
      >
        {{day.day}}
      </Day>
    </section>
  </div>
</template>

<script>

import { dayInMonth } from '../state/helper'
import Day from './day.vue'
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({
  components: { Day }
})
export default class Calendar extends Vue {
  @Prop({ type: String, required: true }) current
  @Prop({default: () => [{date: '', type: ''}]}) events
  selectedDay = ''

  get month () {
    return dayInMonth(this.current)
  }

  eventType (date) {
    const evType = this.events.filter(ev => ev.date === this.selectedDay).map(ev => ev.type)
    return evType[0]
  }

  @Emit('event')
  selectedEvent () {
    const event = this.events.filter(ev => ev.date === this.selectedDay)
    return event
  }

  mounted () {
    this.selectedDay = this.month.filter(d => d.isToday).map(d => d.jDate)[0]
  }
}
</script>

<style lang="scss" scoped>
@import url("../main.scss");

// .fix {
//   position: fixed;
//   top: 58px;
//   z-index: 100;
//   height: 45px;
// }

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
