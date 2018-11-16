<template>
    <div class="container">
        <header class="month">
            <h6 class="todaycal">{{day$}} {{monthName$}} {{year$}}</h6>
            <q-btn flat color="secondary" icon="keyboard_arrow_right" @click="goToPrevMonth"/>
            <h4 class="monthname">{{monthName$}}</h4>
            <h6 class="yearname">{{year$}}</h6>
            <q-btn flat color="secondary" icon="keyboard_arrow_left" @click="goToNextMonth" />
            <h4 class="chart">نمودار</h4>
        </header>
        <section class="calendarday">
            <div>شنبه</div>
            <div>یکشنبه</div>
            <div>دوشنبه</div>
            <div>سه شنبه</div>
            <div>چهارشنبه</div>
            <div>پنج شنبه</div>
            <div>جمعه</div>
        </section>
        <section class="calendar" v-touch-swipe.righ="goToNextMonth">
            <section class="week" v-for="(week, i) of month$" :key="'week' + i">
                <div v-for="(day, index) of week" :key="day.jDate"
                :ref="day.jDate"
                :class="{
                        today: day.isToday,
                        period: day.isPeriod,
                        'has-note': phnState[7*i + index],
                        'has-note': badTimeState[7*i + index],
                    }"
                v-stream:click="{subject: select$, data: day.jDate}">
                    <span style="pointer-events: none;">{{day.day}}</span></div>
            </section>
        </section>

        <section class="calnav">
            <!-- <svg class="line">
                        <line x1="0" x2="100%"/>
                    </svg> -->
            <div><i style=color:#EB4986 class="fas fa-circle"></i> & پریود</div>
            <div><i style=color:#6CC4D9 class="fas fa-circle"></i> & تخمک </div>
            <div><i style=color:#6CC4D9 class="fas fa-heart"></i> & بارداری </div>
            <!-- <svg class="line">
                    <line x1="0" x2="100%"/>
                </svg> -->
        </section>
        <section class="spacer">
          <h6 v-for="ev of event$" :key="ev.type+ev.id" class="text-center">{{ev.title}}</h6>
        </section>
        <section class="phn-grid">
          <q-btn rounded outline color="secondary" label="خونریزی" icon="card_giftcard" @click="bleed"/>
          <q-btn rounded outline color="secondary" label="مود" icon="mood" />
          <div class="phn-row-span">
            <q-card inline class="q-ma-sm">
              <q-card-main>

              </q-card-main>
            </q-card>
          </div>
          <q-btn rounded outline color="secondary" label="نزدیکی" icon="card_giftcard" />
          <q-btn rounded outline color="secondary" label="درد" icon="face" />
          <q-btn rounded outline color="secondary" label="یادداشت" icon="event_note" class="phn-row-span" />
        </section>
        <phn-modal :phn-modal-state="phnModalState" @close="phnModalState = false" />

        <!-- <footer>
                <a href="http://"><i class="fas fa-bell"></i></a>
                <a href="http://"><i class="fas fa-home"></i></a>
                <a href="http://" class="plus"><i class="fas fa-plus-circle"></i></a>
                <a href="http://"><i class="fas fa-chart-line"></i></i></a>
                <a href="http://"><i class="fas fa-user"></i></a>
            </footer> -->
      <!-- <q-scroll-observable @scroll="userHasScrolled" /> -->
    </div>
    <!-- jhjhkj -->

</template>

<script>
import {
  getDaysInMonth,
  dispatch,
  getSelectedDay,
  getSelectedEvent,
  getPHNState,
  getBadTimeState,
  selectDone
} from '../state/index'
import {
  map,
  tap,
  pairwise,
  startWith,
  pluck,
  switchMapTo,
  distinctUntilKeyChanged,
  bufferCount,
  share,
  // observeOn,
  distinctUntilChanged
} from 'rxjs/operators'
// import { asyncScheduler } from 'rxjs'
import PhnModal from '../components/phn-modal.vue'

export default {
  components: {
    PhnModal
  },
  domStreams: ['select$'],

  data () {
    return {
      phnState: Array.from({length: 42}, (v) => false),
      badTimeState: Array.from({length: 42}, (v) => false),
      phnModalState: false
    }
  },

  beforeCreate () {
    const payload = { start: '1397/06/31', cycleLength: 30, periodLength: 4 }
    dispatch('init', payload)
    this.$subscribeTo(getPHNState.pipe(
      bufferCount(42)
    // eslint-disable-next-line no-return-assign
    ), x => this.$data.phnState = x)

    this.$subscribeTo(getBadTimeState.pipe(
      bufferCount(42)
    // eslint-disable-next-line no-return-assign
    ), x => this.$data.badTimeState = x)
  },

  mounted () {
    this.$subscribeTo(selectDone.pipe(
      distinctUntilChanged(),
      tap(() => console.log('hi')),
      // observeOn(asyncScheduler),
      startWith([this.$el.querySelector('.select')]),
      map((d) => this.$refs['' + d]),
      pairwise()
    ),
    (el) => {
      console.log(el)
      if (el[0] && el[0].length) {
        el[0][0].classList.remove('select')
      }
      if (el[1]) {
        el[1][0].classList.add('select')
      }
    }
    )
    // setTimeout(() => this.$el.querySelector('.today').classList.add('select'), 0)
  },

  created () {
  },

  updated () {},

  methods: {
    goToNextMonth () {
      dispatch('goToNextMonth')
    },
    goToPrevMonth () {
      dispatch('goToPrevMonth')
    },
    bleed () {
      this.$data.phnModalState = true
    }
    // userHasScrolled (scroll) {
    //   if (scroll.position > this.$el.querySelector('.today').offsetTop - 70) {
    //     this.$el.querySelector('.today').parentNode.classList.add('fix')
    //     console.log(scroll)
    //   } else {
    //     this.$el.querySelector('.today').parentNode.classList.remove('fix')
    //   }
    //   // {
    //   //   position: 56, // pixels from top
    //   //   direction: 'down', // 'down' or 'up'
    //   //   directionChanged: false, // has direction changed since this handler was called?
    //   //   inflexionPosition: 56 // last scroll position where user changed scroll direction
    //   // }
    // }
  },

  subscriptions () {
    const month$ = getDaysInMonth.pipe(
      bufferCount(7),
      bufferCount(6)
    )

    const selectedDay$ = this.select$.pipe(
      distinctUntilKeyChanged('data'),
      tap(e => e.event.srcElement.classList.add('select')),
      tap(e => dispatch('selectDay', e.data)),
      share()
    )

    const event$ = selectedDay$.pipe(
      startWith(true),
      switchMapTo(getSelectedEvent)
    )

    const date$ = selectedDay$.pipe(
      startWith(true),
      switchMapTo(getSelectedDay),
      share()
    )

    const day$ = date$.pipe(pluck('day'))
    const monthName$ = date$.pipe(pluck('month'))
    const year$ = date$.pipe(pluck('year'))

    return {
      month$,
      selectedDay$,
      day$,
      monthName$,
      year$,
      event$
    }
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

// .calendar {
//     display: grid;
//     grid: repeat(6, 1fr) / repeat(7, 2fr);
//     grid-row-gap: 10px;
//     grid-column-gap: 0;
//     justify-items: center;
//     width: var(--calendar-width);
//     height: calc(var(--calendar-height) + 5 * var(--calendar-gap));
// }
.week {
  display: grid;
  grid: 1fr / repeat(7, 2fr);
  grid-column-gap: 0;
  justify-items: center;
  width: var(--calendar-width);
  height: var(--calendar-height) + 5 * 10px;
  margin-top: 10px;
  transition: all 0.2s;
}

.fix {
  position: fixed;
  top: 58px;
  z-index: 100;
  height: 45px;
}

.week > div > span {
  pointer-events: none;
}

.calendarday {
  display: grid;
  grid: 1fr / repeat(7, 1fr);
  font-size: 12px;
  width: var(--calendar-width);
  height: var(--calendar-height) + 5 * 10px;
  grid-column-gap: 0;
  justify-items: center;
}

.month {
  display: grid;
  grid: repeat(2, 0.5fr) / repeat(5, 1fr);
  height: 60px;
  align-items: center;
  padding: 0 16px;
  grid-auto-flow: column;
  justify-items: center;
  margin: 5% 0;
  background-color: rgba(255, 255, 255, 0.8);
  opacity: 70%;
  color: #eb4986;
}

.calendar > section > div {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: var(--cell-height);
}

.todaycal {
  grid-row: 1/3;
  grid-column: 1;
}

.left {
  grid-row: 1/3;
  grid-column: 2;
  color: #eb4986;
}

.right {
  grid-row: 1/3;
  grid-column: 4;
  color: #eb4986;
}

.monthname {
  // font-family: awsome;
  align-self: flex-end;
  margin: 0;
}

.yearname {
  align-self: flex-start;
  margin: 0;
}

.chart {
  grid-row: 1/3;
  grid-column: 5;
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

.plus {
  font-size: 220%;
}

.today > span {
  display: block;
  box-sizing: border-box;
  width: var(--cell-height);
  height: var(--cell-height);
  border-radius: 50%;
  border: 1px solid #b30d34;
  color: #b30d34;
  margin: auto;
}

.select > span {
  display: block;
  width: var(--cell-height);
  height: var(--cell-height);
  border-radius: 50%;
  background-color: #eb4986;
  color: white;
  margin: auto;
}

.period {
  background-color: #6cc4d9;
  color: white;
}

// .period:first-of-type {
//   background-color: #6cc4d9;
//   border-radius: 0 var(--cell-height) var(--cell-height) 0;
//   color: white;
// }

.period :nth-last-of-type(1) {
  background-color: #6cc4d9;
  color: white;
  border-radius: var(--cell-height) 0 0 var(--cell-height);
}

.calnav {
  display: flex;
  flex-flow: row nowrap;
  flex-direction: row;
  justify-content: space-around;
  font-size: 10px;
  border-top: solid darkgray 1px;
  border-bottom: solid darkgray 1px;
  padding: 1px 0;
}

.sticky {
  top: 0;
  position: fixed;
  background-color: white;
  margin-top: 0;
  animation: all 0.2;
}

.has-note {
  position: relative;
}

.has-note::before {
  content: "\f004";
  font-family: "FontAwesome";
  font-style: normal;
  font-weight: normal;
  text-decoration: inherit;
  font-size: 10px;
  display: block;
  position: absolute;
  top: -10%;
  right: 70%;
  bottom: 0;
  width: 10px;
  height: 10px;
  color: #6cc4d9;
  /* background-color: #865FC1;
    border-radius: 50%; */
}
.has-note::after {
  content: "";
  display: block;
  position: absolute;
  top: 70%;
  right: calc(50% - 5px);
  bottom: 0;
  width: 10px;
  height: 10px;
  background-color: #865fc1;
  border-radius: 50%;
}

.phn-grid {
  width: 95%;
  margin: 10px auto;
  display: grid;
  grid: 1fr / 1fr 1fr;
  grid-gap: 10px;
}

.phn-row-span {
  grid-column: 1 / 3;
}
</style>
