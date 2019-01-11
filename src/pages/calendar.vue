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
      <swiper dir="rtl" ref="mySw" :options="swiperOpt" @slideChangeTransitionEnd="monthChange" >
        <swiper-slide v-for="(month, index) of monthList" :key="month">
          <Calendar :current="month" v-if="(index - slide) < 2 && (index - slide) > -2"/>
        </swiper-slide>
      </swiper>
        <section class="calnav">
            <div><i style=color:#EB4986 class="fas fa-circle"></i> & پریود</div>
            <div><i style=color:#6CC4D9 class="fas fa-circle"></i> & تخمک </div>
            <div><i style=color:#6CC4D9 class="fas fa-heart"></i> & بارداری </div>
        </section>
        <section>
          <q-list>
              <q-item>
                <q-item-main>
                    <q-item-tile label>شروع پریود</q-item-tile>
                </q-item-main>
                <q-item-side right>
                  <q-toggle
                    v-model="check4"
                    checked-icon="sentiment very dissatisfied"
                    unchecked-icon="sentiment very satisfied"
                  />
                </q-item-side>
            </q-item>
            <q-item>
                <q-item-main>
                    <q-item-tile label>پایان پریود</q-item-tile>
                </q-item-main>
                <q-item-side right>
                  <q-toggle
                    v-model="check4"
                    checked-icon="sentiment very satisfied"
                    unchecked-icon="sentiment very dissatisfied"
                  />
                </q-item-side>
            </q-item>
          </q-list>
        </section>
        <section>
          <dl class="q-my-md">
            <dd v-for="ev of event$" :key="ev.type+ev.id" class="text-center"><span class="q-body-2">{{ev.title}}</span></dd>
          </dl>
        </section>
        <section class="column items-center gutter-sm">
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
          <div class="row no-wrap gutter-xs justify-center" key="phn-list">
              <div v-for="phn of phnValues$" :key="phn">
                <img :src="'../assets/icons/ic_' + phn + '.png'" width="30px" height="30px">
              </div>
          </div>
            </transition>
          <div>
            <q-page-sticky position="bottom-right" :offset="[18, 18]">
              <q-btn round icon="add" color="primary" size="lg" @click="bleed"/>
            </q-page-sticky>
          </div>
          <div >
          </div>
        </section>
        <phn-modal :phn-modal-state="phnModalState" @close="phnModalState = false" :phn="phn$" :id="'PHN-'+getSelectedDay$"/>
    </div>

</template>

<script>
import {
  dispatch,
  getSelectedDayObj,
  getSelectedEvent,
  getPHNState,
  getBadTimeState,
  getSelectedDay,
  getMonth,
  getSelectedPHN,
  getPHNValues,
  getPeriodDays,
  getMonthList
} from '../state/index'
import {
  tap,
  pluck,
  bufferCount,
  buffer,
  share
} from 'rxjs/operators'
// import { asyncScheduler } from 'rxjs'
import PhnModal from '../components/phn-modal.vue'
// import posed from 'vue-pose'
import { tween, styler } from 'popmotion'
import Calendar from '../components/calendar-comp.vue'

export default {
  components: {
    PhnModal,
    Calendar
  },
  domStreams: ['select$'],

  data () {
    return {
      phnState: Array.from({length: 42}, (v) => false),
      badTimeState: Array.from({length: 42}, (v) => false),
      phnModalState: false,
      isVisible: 'show',
      check4: false,
      slide: 20,
      monthList: [],
      swiperOpt: {
        initialSlide: 20
      }
    }
  },

  beforeCreate () {
    const payload = { start: '1397/06/31', cycleLength: 30, periodLength: 4 }
    dispatch('init', payload)
    this.$subscribeTo(getPHNState.pipe(
      bufferCount(42)
    ), x => { this.$data.phnState = x })
    
    this.$subscribeTo(getBadTimeState.pipe(
      bufferCount(42)
    ), x => { this.$data.badTimeState = x })
  },

  mounted () {
  },

  created () {
    getMonthList.subscribe(l => { this.monthList = l })
  },

  updated () {},

  methods: {
    goToNextMonth () {
      const calStyler = styler(this.$el.querySelector('.calendar'), {enableHardwareAcceleration: true})
      tween({
        from: 0,
        to: {x: '100%'}
      }).start({
        update: v => calStyler.set(v),
        complete: () => {
          dispatch('goToNextMonth')
          tween({
            from: {x: '-100%'},
            to: {x: 0}
          }).start(calStyler.set)
        }
      })
    },
    goToPrevMonth () {
      const calStyler = styler(this.$el.querySelector('.calendar'), {enableHardwareAcceleration: true})
      tween({
        from: 0,
        to: {x: '-100%'}
      }).start({
        update: v => calStyler.set(v),
        complete: () => {
          dispatch('goToPrevMonth')
          tween({
            from: {x: '100%'},
            to: {x: 0}
          }).start(calStyler.set)
        }
      })
    },
    bleed () {
      this.$data.phnModalState = true
    },
    gotPeriod () {
      dispatch('gotPeriod')
    },
    animHandler () {
      console.log('anim')
    }
  },

  subscriptions () {
    const selectClick$ = this.select$.pipe(
      // distinctUntilKeyChanged('data'),
      // tap(e => e.event.srcElement.classList.add('select')),
      tap(e => dispatch('selectDay', e.data)),
      share()
    )

    const date$ = getSelectedDayObj

    return {
      selectClick$,
      getSelectedDay$: getSelectedDay,
      // eslint-disable-next-line no-return-assign
      month$: getMonth,
      day$: date$.pipe(pluck('day')),
      monthName$: date$.pipe(pluck('month')),
      year$: date$.pipe(pluck('year')),
      event$: getSelectedEvent,
      phn$: getSelectedPHN,
      phnValues$: getPHNValues,
      periodDays$: getPeriodDays.pipe(buffer(getMonth))
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
  // display: grid;
  // grid: 1fr / repeat(7, 2fr);
  // grid-column-gap: 0;
  // justify-items: center;
  width: var(--calendar-width);
  height: calc(var(--cell-height) + 2.5px);
  margin-top: 2px;
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
  width: (100% / 7);
  height: 100%;
  float: left;
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

.events :first-child {
  text-decoration: none;
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
 border-top: 2.5px solid #6cc4d9;
 border-bottom: 2.5px solid #6cc4d9;
  // color: white;
}

.period-start {
  @extend .period;
 border-left: 2.5px solid #6cc4d9;
  border-radius: var(--cell-height) 0 0 var(--cell-height);
}

.period-end {
  @extend .period;
 border-right: 2.5px solid #6cc4d9;
  border-radius: 0 var(--cell-height) var(--cell-height) 0;
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
