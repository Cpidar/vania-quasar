<template>
  <div class="container">
    <calendar-header :date="getSelectedDay$" @next-month='goToNextMonth'  @prev-month='goToPrevMonth'/>

    <!-- <swiper
      dir="rtl"
      ref="mySw"
      :options="swiperOpt"
      @slideChangeTransitionEnd="monthChange"
    >
      <swiper-slide
        v-for="(month, index) of monthList"
        :key="month"
        class="relative-position"
      > -->
      <q-carousel
        animated
        swipeable
        arrows
        transition-next="slide-left"
        transition-prev="slide-right"
        v-model="slide"
      >
        <q-carousel-slide
          v-for="(month, index) of monthList"
          :key="month"
          :name="index"
        >
        <Calendar
          :current="month"
          v-if="(index - slide) < 2 && (index - slide) > -2"
          :key="calendarKey"
        />
        </q-carousel-slide>
      </q-carousel>
        <!-- <q-inner-loading :visible="loading">
          <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
        </q-inner-loading>
      </swiper-slide>
    </swiper> -->
    <calendar-footer />
    <period-handler :currentDate="getSelectedDay$" @period="changePeriod" />
    <event-section :event="getSelectedDay$" />
    <phn-section />
  </div>
</template>

<script>
import {
  dispatch,
  longSelectedDayObj,
  getMonthList,
  calendarReloadHook
  // getDaysHaveEvents,
} from '../state/index'

import Calendar from '../components/calendar-comp.vue'
import CalendarHeader from '../components/calendar-header.vue'
import CalendarFooter from '../components/calendar-footer.vue'
import PeriodHandler from '../components/period-handler.vue'
import PhnSection from '../components/phn-section.vue'
import EventSection from '../components/event-section.vue'

import { Vue, Component } from 'vue-property-decorator'

const subscriptions = () => {
  const monthList = getMonthList(10)
  return {
    getSelectedDay$: longSelectedDayObj,
    monthList,
    calendarKey: calendarReloadHook
  }
}

@Component({
  components: { Calendar, CalendarHeader, CalendarFooter, PeriodHandler, PhnSection, EventSection },
  domStreams: ['select$'],
  subscriptions
})

export default class CalendarPage extends Vue {
  isVisible = 'show'
  swiperOpt = { initialSlide: 10 }
  events = []
  selectedEvents = {}
  sed = this.getSelectedDay$
  loading = false
  slide = 10
  // activeMonth = [10, 11, 9]

  get swiper() {
    return this.$refs.mySw.swiper
  }

  get activeIndex() {
    return this.swiper.activeIndex
  }

  beforeCreate() {
    const payload = { start: '1397/06/31', cycleLength: 18, periodLength: 4 }
    dispatch('init', payload)
  }

  goToNextMonth() {
    this.swiper.slideNext()
  }

  goToPrevMonth() {
    this.swiper.slidePrev()
  }

  monthChange() {
    this.currentDay = this.monthList[this.activeIndex]
    // this.$nextTick(() => this.activeMonth.push(this.monthList[this.activeIndex - 1], this.monthList[this.activeIndex + 1]))
    dispatch('goToMonth', this.currentDay)
  }

  changePeriod(ev) {
    console.log(ev)
    this.loading = true
    setTimeout(function () { this.loading = false }, 100)
    this.calendarKey = ev
    setTimeout(() => { this.loading = false }, 1000)
  }
}
</script>

<style lang="scss" scoped>
@import url("../main.scss");

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: stretch;
}

.container::before {
  content: "";
  width: 100%;
  height: 100%;
  position: fixed;
  background: url("../assets/Back.jpg");
  background-size: auto 100%;
  filter: blur(1px) opacity(30%);
  z-index: -10;
}

footer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  background-color: white;
}

.spacer {
  width: 100%;
  flex-grow: 1;
  justify-items: flex-end;
}

.events :first-child {
  text-decoration: none;
}

.plus {
  font-size: 220%;
}

.sticky {
  top: 0;
  position: fixed;
  background-color: white;
  margin-top: 0;
  animation: all 0.2;
}
</style>
